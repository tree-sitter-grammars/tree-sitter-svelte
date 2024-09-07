import XCTest
import SwiftTreeSitter
import TreeSitterSvelte

final class TreeSitterSvelteTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_svelte())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Svelte grammar")
    }
}
