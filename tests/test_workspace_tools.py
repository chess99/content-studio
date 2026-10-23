import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'tools'))
import sync_vendor_skills as vendor
from workspace_doctor import check_link
from media_review import assess, sample_times


class VendorTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name).resolve()
        self.root_patch = patch.object(vendor, 'ROOT', self.root)
        self.root_patch.start()
        self.addCleanup(self.root_patch.stop)

    def test_destinations_cannot_replace_repository_or_escape_vendor(self):
        for destination in ('.', 'vendor', 'tools', '../escape'):
            with self.assertRaises(ValueError):
                vendor.repo_path(destination)
        self.assertEqual(vendor.repo_path('vendor/owner/skill'), self.root / 'vendor/owner/skill')

    def test_copy_excludes_git_preserves_license_and_rejects_links(self):
        checkout = self.root / 'checkout'
        checkout.mkdir()
        (checkout / 'SKILL.md').write_text('---\nname: test\n---\n')
        (checkout / '.git').mkdir()
        (checkout / '.git/config').write_text('not for distribution')
        staged = self.root / 'staged'
        vendor.copy_source(checkout, checkout, staged, {})
        self.assertFalse((staged / '.git').exists())
        (checkout / 'secret-link').symlink_to('/etc/passwd')
        with self.assertRaises(ValueError):
            vendor.copy_source(checkout, checkout, self.root / 'unsafe', {})
        self.assertFalse((self.root / 'unsafe').exists())

    def test_integrity_detects_edit_and_ignores_generated_bytecode(self):
        target = self.root / 'vendor/test'
        target.mkdir(parents=True)
        (target / 'SKILL.md').write_text('content')
        config = {'destination': 'vendor/test', 'commit': 'a' * 40, 'license': 'MIT', 'sha256': vendor.tree_digest(target)}
        (target / '__pycache__').mkdir()
        (target / '__pycache__/x.pyc').write_bytes(b'generated')
        vendor.verify('test', config)
        (target / 'SKILL.md').write_text('local edit')
        with self.assertRaises(ValueError):
            vendor.verify('test', config)

    def test_locked_restore_and_tracking_update_use_real_git(self):
        upstream = self.root / 'upstream'
        upstream.mkdir()
        def git(*args):
            return vendor.run('git', '-C', str(upstream), *args)
        git('init', '-q', '-b', 'main')
        git('config', 'user.email', 'test@example.invalid')
        git('config', 'user.name', 'Fixture')
        (upstream / 'SKILL.md').write_text('first')
        (upstream / 'LICENSE').write_text('test license')
        git('add', '.')
        git('commit', '-qm', 'first')
        first = git('rev-parse', 'HEAD')
        (upstream / 'SKILL.md').write_text('second')
        git('add', '.')
        git('commit', '-qm', 'second')
        manifest = self.root / 'vendor/skills.json'
        manifest.parent.mkdir()
        config = {'repository': str(upstream), 'destination': 'vendor/test', 'ref': 'main', 'commit': first,
                  'subdirectory': '.', 'license': 'MIT'}
        manifest.write_text(json.dumps({'version': 1, 'skills': {'test': config}}))
        with patch.object(vendor, 'MANIFEST', manifest):
            vendor.sync(['test'], None, locked=True)
            self.assertEqual((self.root / 'vendor/test/SKILL.md').read_text(), 'first')
            self.assertFalse((self.root / 'vendor/test/.git').exists())
            before_manifest = manifest.read_bytes()
            original_replace = Path.replace
            def fail_manifest_replace(source, destination):
                if Path(destination) == manifest:
                    raise OSError('simulated manifest write failure')
                return original_replace(source, destination)
            with patch.object(Path, 'replace', fail_manifest_replace):
                with self.assertRaises(OSError):
                    vendor.sync(['test'], None)
            self.assertEqual((self.root / 'vendor/test/SKILL.md').read_text(), 'first')
            self.assertEqual(manifest.read_bytes(), before_manifest)
            self.assertEqual(list(manifest.parent.glob('.*.backup-*')), [])
            vendor.sync(['test'], None)
            self.assertEqual((self.root / 'vendor/test/SKILL.md').read_text(), 'second')
            saved = json.loads(manifest.read_text())
            saved['skills']['test']['localPatches'] = [{'reason': 'keep local adaptation'}]
            manifest.write_text(json.dumps(saved))
            with self.assertRaises(RuntimeError):
                vendor.sync(['test'], None)
            self.assertEqual((self.root / 'vendor/test/SKILL.md').read_text(), 'second')

    def test_extra_license_is_copied_from_repository_root(self):
        checkout = self.root / 'checkout'
        source = checkout / 'skill'
        source.mkdir(parents=True)
        (source / 'SKILL.md').write_text('content')
        (checkout / 'LICENSE').write_text('license')
        vendor.copy_source(checkout, source, self.root / 'copied', {'extraFiles': {'LICENSE': 'UPSTREAM-LICENSE'}})
        self.assertEqual((self.root / 'copied/UPSTREAM-LICENSE').read_text(), 'license')


class DiscoveryTests(unittest.TestCase):
    def test_repairs_newline_target_without_replacing_real_directory(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            target = root / 'target'
            target.mkdir()
            link = root / 'skill'
            link.symlink_to('target\n')
            self.assertIsNotNone(check_link(link, target, False))
            self.assertIsNone(check_link(link, target, True))
            self.assertEqual(link.resolve(), target.resolve())
            existing = root / 'existing'
            existing.mkdir()
            self.assertIsNotNone(check_link(existing, target, True))
            self.assertTrue(existing.is_dir())


class MediaTests(unittest.TestCase):
    def test_actual_stream_properties_are_checked(self):
        metadata = {'streams': [{'codec_type': 'video', 'width': 1920, 'height': 1080,
                    'pix_fmt': 'yuv420p', 'codec_name': 'h264', 'duration': '6'}], 'format': {'duration': '6.02'}}
        self.assertTrue(assess(metadata, 6, (1920, 1080))['ok'])
        report = assess(metadata, 30, (1080, 1920), True)
        self.assertFalse(report['ok'])
        self.assertEqual(len(report['errors']), 3)
        self.assertEqual(report['visualReview'], 'pending')
        self.assertFalse(assess({'streams': []})['ok'])

    def test_sampling_includes_opening_and_excludes_missing_endpoint(self):
        times = sample_times(6, 12)
        self.assertEqual(times[0], 0)
        self.assertLess(times[-1], 6)
        self.assertEqual(len(set(times)), 12)


if __name__ == '__main__':
    unittest.main()
