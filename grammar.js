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
    $.svelte_raw_text,
    $.svelte_raw_text_each,
    '@',
    '#',
    '/',
    ':',
  ],

  extras: $ => [
    $.comment,
    /\s+/,
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

    if_start: $ => seq('{', '#', token.immediate('if'), $.svelte_raw_text, '}'),

    else_if_block: $ => seq(
      '{',
      ':',
      token.immediate('else'),
      'if',
      $.svelte_raw_text,
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
        $.svelte_raw_text,
        seq(alias($.svelte_raw_text_each, $.svelte_raw_text), 'as', $.svelte_raw_text),
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

    await_start: $ => seq('{', '#', token.immediate('await'), $.svelte_raw_text, '}'),

    then_block: $ => seq('{', ':', token.immediate('then'), optional($.svelte_raw_text), '}'),

    catch_block: $ => seq('{', ':', 'catch', optional($.svelte_raw_text), '}'),

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
      $.svelte_raw_text,
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
      $.svelte_raw_text,
      '}',
    ),

    snippet_end: _ => seq('{', '/', token.immediate('snippet'), '}'),

    expression: $ => seq('{', $.svelte_raw_text, '}'),

    html_tag: $ => seq(
      '{',
      '@',
      token.immediate('html'),
      $.svelte_raw_text,
      '}',
    ),

    const_tag: $ => seq(
      '{',
      '@',
      token.immediate('const'),
      $.svelte_raw_text,
      '}',
    ),

    debug_tag: $ => seq(
      '{',
      '@',
      token.immediate('debug'),
      $.svelte_raw_text,
      '}',
    ),

    render_tag: $ => seq(
      '{',
      '@',
      token.immediate('render'),
      $.svelte_raw_text,
      '}',
    ),

    attribute_name: _ => /[^<>{}"'/=\s]+/,

    attribute_value: _ => /[^<>{}"'=\s]+/,

    text: _ => /[^<>{}&\s]([^<>{}&]*[^<>{}&\s])?/,
  },
});
