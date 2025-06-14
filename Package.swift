// swift-tools-version:5.3

import Foundation
import PackageDescription

var sources = ["src/parser.c"]
if FileManager.default.fileExists(atPath: "src/scanner.c") {
    sources.append("src/scanner.c")
}

let package = Package(
    name: "TreeSitterSvelte",
    products: [
        .library(name: "TreeSitterSvelte", targets: ["TreeSitterSvelte"]),
    ],
    dependencies: [
        .package(name: "SwiftTreeSitter", url: "https://github.com/tree-sitter/swift-tree-sitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterSvelte",
            dependencies: [],
            path: ".",
            sources: sources,
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterSvelteTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterSvelte",
            ],
            path: "bindings/swift/TreeSitterSvelteTests"
        )
    ],
    cLanguageStandard: .c11
)
