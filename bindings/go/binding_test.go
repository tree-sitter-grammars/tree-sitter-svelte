package tree_sitter_svelte_test

import (
	"testing"

	tree_sitter_svelte "github.com/tree-sitter-grammars/tree-sitter-svelte/bindings/go"
	tree_sitter "github.com/tree-sitter/go-tree-sitter"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_svelte.Language())
	if language == nil {
		t.Errorf("Error loading Svelte grammar")
	}
}
