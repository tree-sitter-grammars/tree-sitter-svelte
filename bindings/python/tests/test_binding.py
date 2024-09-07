from unittest import TestCase

import tree_sitter, tree_sitter_svelte


class TestLanguage(TestCase):
    def test_can_load_grammar(self):
        try:
            tree_sitter.Language(tree_sitter_svelte.language())
        except Exception:
            self.fail("Error loading Svelte grammar")
