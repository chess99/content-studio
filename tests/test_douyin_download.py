import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import Mock, patch

try:
    import requests
except ModuleNotFoundError:
    raise unittest.SkipTest('该独立脚本的测试需要 requests；使用 uv run --with requests python -m unittest discover -s tests -v')

SPEC = importlib.util.spec_from_file_location('douyin_download', Path(__file__).resolve().parents[1] / 'tools/douyin_download.py')
dl = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(dl)
IDENT = '7680458809420405860'
JPEG = b'\xff\xd8\xff' + b'x' * 120


class Response:
    def __init__(self, body=b'', headers=None):
        self.body = body
        self.text = body.decode('utf-8', errors='replace')
        self.headers = headers or {}

    def __enter__(self):
        return self

    def __exit__(self, *_):
        pass

    def raise_for_status(self):
        pass

    def iter_content(self, _):
        yield self.body


def image_item(count=1):
    return {'aweme_id':IDENT, 'desc':'测试图片', 'author':{'nickname':'作者'},
            'images':[{'url_list':[f'https://p3.douyinpic.com/image-{i}.jpeg?x-signature=temporary']} for i in range(count)],
            'video':{'play_addr':{'url_list':['https://aweme.snssdk.com/aweme/v1/playwm/?video_id=music']}}}


class DownloadTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)

    def test_share_text_short_link_and_modal_link(self):
        url = dl.input_url('复制打开抖音 https://v.douyin.com/abc/。 看作品')
        self.assertEqual(url, 'https://v.douyin.com/abc/')
        self.assertEqual(dl.id_from_url(f'https://www.douyin.com/user/self?modal_id={IDENT}'), IDENT)
        response = Response()
        response.url = f'https://www.douyin.com/note/{IDENT}'
        session = Mock()
        session.get.return_value = response
        self.assertEqual(dl.resolve_id(url, session), IDENT)
        for url in ('https://douyin.com.evil.invalid/video/123', 'https://user:password@www.douyin.com/video/123'):
            with self.assertRaises(dl.DownloadError):
                dl.input_url(url)

    def test_nested_router_string_and_recommendations_do_not_confuse_id(self):
        wanted = image_item()
        wanted['desc'] = '字符串内有 }; </script> 和 { 花括号'
        data = {'loaderData':{'empty':None, 'recommend':{'aweme_id':'7', 'video':{}}, 'page':wanted}}
        page = '<script>window._ROUTER_DATA = ' + json.dumps(data) + ';</script>'
        self.assertEqual(dl.find_item(dl.router_data(page), IDENT), wanted)

    def test_empty_shell_is_retried_in_same_guest_session(self):
        data = {'loaderData':{'page':image_item()}}
        session = Mock()
        session.get.side_effect = [Response(b'window._ROUTER_DATA={"loaderData":{"x":null}};'),
                                   Response(('window._ROUTER_DATA='+json.dumps(data)).encode())]
        with patch.object(dl.time, 'sleep'):
            self.assertEqual(dl.fetch_item(session, IDENT, 2)['aweme_id'], IDENT)
        self.assertEqual(session.get.call_count, 2)

    def test_empty_shell_fails_with_bounded_requests(self):
        session = Mock()
        session.get.side_effect = lambda *_args, **_kwargs: Response(b'window._ROUTER_DATA={};')
        with patch.object(dl.time, 'sleep'), self.assertRaises(dl.DownloadError):
            dl.fetch_item(session, IDENT, 2)
        self.assertEqual(session.get.call_count, 4)

    def test_album_preserves_order_and_excludes_background_music(self):
        kind, plan = dl.media_plan(image_item(2))
        self.assertEqual(kind, 'images')
        self.assertEqual([e['key'] for e in plan], ['image-001', 'image-002'])
        self.assertIn('image-1.jpeg', plan[1]['urls'][0])
        self.assertTrue(all(e['kind'] == 'image' for e in plan))
        broken = image_item(2)
        broken['images'][1]['url_list'] = []
        with self.assertRaises(dl.DownloadError):
            dl.media_plan(broken)

    def test_video_endpoint_preserves_media_id_and_requests_1080p(self):
        item = {'video':{'play_addr':{'url_list':['https://aweme.snssdk.com/aweme/v1/playwm/?video_id=abc&ratio=720p']}}}
        kind, plan = dl.media_plan(item)
        self.assertEqual(kind, 'video')
        self.assertIn('/play/?', plan[0]['urls'][0])
        self.assertIn('video_id=abc', plan[0]['urls'][0])
        self.assertIn('ratio=1080p', plan[0]['urls'][0])

    def test_html_or_truncated_download_is_not_archived(self):
        entry = {'key':'source', 'kind':'video', 'urls':['https://example.invalid/video']}
        for response in (Response(b'<html>challenge</html>'), Response(JPEG, {'Content-Length':'9999'})):
            session = Mock()
            session.get.return_value = response
            with self.assertRaises(dl.DownloadError):
                dl.download_media(session, entry, self.root)
            self.assertEqual(list(self.root.iterdir()), [])

    def test_audio_only_mp4_cannot_be_accepted_as_video(self):
        result = Mock(returncode=0, stdout=json.dumps({'streams':[{'codec_type':'audio'}], 'format':{'duration':'20'}}))
        with patch.object(dl.shutil, 'which', return_value='/mock/ffprobe'), patch.object(dl.subprocess, 'run', return_value=result):
            with self.assertRaises(dl.DownloadError):
                dl.probe(self.root / 'source.part', 'video')

    def test_detect_actual_encoding_not_url_extension(self):
        entry = {'key':'image-001', 'kind':'image', 'urls':['https://example.invalid/wrong.webp']}
        session = Mock()
        session.get.return_value = Response(JPEG)
        with patch.object(dl, 'probe', return_value={'method':'test'}):
            record = dl.download_media(session, entry, self.root)
        self.assertEqual(record['name'], 'image-001.jpg')
        self.assertTrue(dl.valid_file(self.root, record))
        path = self.root / record['name']
        path.write_bytes(b'z' * record['size_bytes'])
        self.assertFalse(dl.valid_file(self.root, record))

    def test_complete_archive_skips_network_and_corruption_is_reported(self):
        session = Mock()
        session.get.return_value = Response(JPEG)
        with patch.object(dl, 'fetch_item', return_value=image_item()), patch.object(dl, 'probe', return_value={}):
            result = dl.download_one(session, IDENT, self.root)
        self.assertEqual(result['status'], 'downloaded')
        session.get.reset_mock()
        self.assertEqual(dl.download_one(session, IDENT, self.root)['status'], 'skipped')
        session.get.assert_not_called()
        (self.root / IDENT / 'image-001.jpg').write_bytes(JPEG[:-1])
        with self.assertRaises(dl.DownloadError):
            dl.download_one(session, IDENT, self.root)

    def test_failed_album_resumes_only_missing_files_and_keeps_urls_out_of_metadata(self):
        session = Mock()
        session.get.side_effect = [Response(JPEG), Response(b'<html>challenge</html>')]
        with patch.object(dl, 'fetch_item', return_value=image_item(2)), patch.object(dl, 'probe', return_value={}):
            with self.assertRaises(dl.DownloadError):
                dl.download_one(session, IDENT, self.root)
            path = self.root / IDENT / 'metadata.json'
            self.assertFalse(json.loads(path.read_text())['complete'])
            session.get.side_effect = [Response(JPEG)]
            session.get.reset_mock()
            result = dl.download_one(session, IDENT, self.root)
        self.assertEqual(result['files'], 2)
        self.assertEqual(session.get.call_count, 1)
        self.assertTrue(json.loads(path.read_text())['complete'])
        self.assertNotIn('x-signature', path.read_text())

    def test_metadata_preview_does_not_overwrite_progress(self):
        folder = self.root / IDENT
        folder.mkdir()
        previous = {'schema_version':1, 'id':IDENT, 'complete':False, 'files':[]}
        path = folder / 'metadata.json'
        path.write_text(json.dumps(previous))
        with patch.object(dl, 'fetch_item', return_value=image_item()):
            result = dl.download_one(Mock(), IDENT, self.root, metadata_only=True)
        self.assertEqual(result['status'], 'metadata')
        self.assertEqual(json.loads(path.read_text()), previous)


if __name__ == '__main__':
    unittest.main()
