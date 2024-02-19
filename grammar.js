/**
 * @file Svelte grammar for tree-sitter
 * @author Amaan Qureshi <amaanq12@gmail.com>
 * @license MIT
 * @see {@link https://svelte.dev/|Official website}
 */

// eslint-disable-next-line spaced-comment
/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const HTML = require('tree-sitter-html/grammar');

module.exports = grammar(HTML, {
  name: 'svelte',

  conflicts: $ => [
    [$.else_if_block],
    [$.else_block],
  ],

  externals: $ => [
    $._start_tag_name,
    $._script_start_tag_name,
    $._style_start_tag_name,
    $._end_tag_name,
    $.erroneous_end_tag_name,
    '/>',
    $._implicit_end_tag,
    $.raw_text,
    $.comment,
    $.raw_text_svelte,
    $.raw_text_svelte_each,
    '@',
    '#',
    '/',
    ':',
  ],

  extras: $ => [
    $.comment,
    /\s+/,
  ],

  inline: $ => [
    $._raw_text_svelte,
  ],

  supertypes: $ => [
    $._node,
  ],

  rules: {
    _node: ($, original) => choice(
      original,

      $.if_statement,
      $.each_statement,
      $.await_statement,
      $.key_statement,
      $.snippet_statement,

      $.expression,
      $.html_tag,
      $.const_tag,
      $.debug_tag,
      $.render_tag,
    ),

    attribute: $ => seq(
      choice(
        seq(
          $.attribute_name,
          optional(seq(
            '=',
            choice(
              $.attribute_value,
              $.quoted_attribute_value,
              $.expression,
            ),
          )),
        ),
        alias($.expression, $.attribute_name),
      ),
    ),

    if_statement: $ => seq(
      $.if_start,
      repeat($._node),
      repeat($.else_if_block),
      optional($.else_block),
      $.if_end,
    ),

    if_start: $ => seq('{', '#', token.immediate('if'), $._raw_text_svelte, '}'),

    else_if_block: $ => seq(
      '{',
      ':',
      token.immediate('else'),
      'if',
      $._raw_text_svelte,
      '}',
      repeat($._node),
    ),

    else_block: $ => seq(
      '{',
      ':',
      token.immediate('else'),
      '}',
      repeat($._node),
    ),

    if_end: _ => seq('{', '/', token.immediate('if'), '}'),

    each_statement: $ => seq(
      $.each_start,
      repeat($._node),
      optional(seq($.else_block, repeat($._node))),
      $.each_end,
    ),

    each_start: $ => seq(
      '{',
      '#',
      token.immediate('each'),
      choice(
        $._raw_text_svelte,
        seq($._raw_text_svelte_each, 'as', $._raw_text_svelte),
      ),
      '}',
    ),

    each_end: _ => seq('{', '/', token.immediate('each'), '}'),

    await_statement: $ => seq(
      $.await_start,
      repeat($._node),
      optional(seq($.then_block, repeat($._node))),
      optional(seq($.catch_block, repeat($._node))),
      $.await_end,
    ),

    await_start: $ => seq('{', '#', token.immediate('await'), $._raw_text_svelte, '}'),

    then_block: $ => seq('{', ':', token.immediate('then'), optional($._raw_text_svelte), '}'),

    catch_block: $ => seq('{', ':', 'catch', optional($._raw_text_svelte), '}'),

    await_end: _ => seq('{', '/', token.immediate('await'), '}'),

    key_statement: $ => seq(
      $.key_start,
      repeat($._node),
      $.key_end,
    ),

    key_start: $ => seq(
      '{',
      '#',
      token.immediate('key'),
      $._raw_text_svelte,
      '}',
    ),

    key_end: _ => seq('{', '/', token.immediate('key'), '}'),

    snippet_statement: $ => seq(
      $.snippet_start,
      repeat($._node),
      $.snippet_end,
    ),

    snippet_start: $ => seq(
      '{',
      '#',
      token.immediate('snippet'),
      $._raw_text_svelte,
      '}',
    ),

    snippet_end: _ => seq('{', '/', token.immediate('snippet'), '}'),

    expression: $ => seq('{', $._raw_text_svelte, '}'),

    html_tag: $ => seq(
      '{',
      '@',
      token.immediate('html'),
      $._raw_text_svelte,
      '}',
    ),

    const_tag: $ => seq(
      '{',
      '@',
      token.immediate('const'),
      $._raw_text_svelte,
      '}',
    ),

    debug_tag: $ => seq(
      '{',
      '@',
      token.immediate('debug'),
      $._raw_text_svelte,
      '}',
    ),

    render_tag: $ => seq(
      '{',
      '@',
      token.immediate('render'),
      $._raw_text_svelte,
      '}',
    ),

    attribute_name: _ => /[^<>{}"'/=\s]+/,

    attribute_value: _ => /[^<>{}"'=\s]+/,

    text: _ => /[^<>{}&\s]([^<>{}&]*[^<>{}&\s])?/,

    _raw_text_svelte: $ => alias($.raw_text_svelte, $.raw_text),

    _raw_text_svelte_each: $ => alias($.raw_text_svelte_each, $.raw_text),
  },
});
