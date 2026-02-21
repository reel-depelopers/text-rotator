<?php
/**
 * Plugin Name: Vertical Rotator Block
 * Plugin URI:  https://example.com
 * Description: テキストを縦方向にアニメーションで切り替えるGutenbergブロック（モダン構成）
 * Version:     1.1.0
 * Author:      Real dev group (motchii)
 * License:     MIT
 * Text Domain: vertical-rotator
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function vr_register_block() {
	register_block_type(
		__DIR__,
		[
			'render_callback' => 'vr_render_block',
		]
	);
}
add_action( 'init', 'vr_register_block' );

/**
 * サーバーサイドレンダリング
 * data-words, data-align を出力
 * 最長単語を <span class="vr-sizer"> で場所取り → レイアウトが崩れない
 */
function vr_render_block( $attributes, $content ) {
	$words_raw  = isset( $attributes['words'] ) ? $attributes['words'] : '超える,創る,未来';

	// textAlign はホワイトリストで検証（許可値以外は left にフォールバック）
	$allowed_aligns = [ 'left', 'center', 'right' ];
	$text_align_raw = isset( $attributes['textAlign'] ) ? $attributes['textAlign'] : 'left';
	$text_align     = in_array( $text_align_raw, $allowed_aligns, true ) ? $text_align_raw : 'left';

	// 最長単語を求める（sizer用）
	$words_arr    = array_map( 'trim', explode( ',', $words_raw ) );
	$longest_word = '';
	foreach ( $words_arr as $w ) {
		if ( mb_strlen( $w ) > mb_strlen( $longest_word ) ) {
			$longest_word = $w;
		}
	}

	$words_attr   = esc_attr( $words_raw );
	$longest_attr = esc_html( $longest_word );

	/*
	 * get_block_wrapper_attributes() が
	 * ・fontSize（フォントサイズ）
	 * ・fontWeight（フォントウェイト）
	 * ・color（テキストカラー）
	 * など、エディターで設定した typography/color スタイルを
	 * class・style 属性として自動で出力してくれる。
	 */
	$wrapper_attrs = get_block_wrapper_attributes( [
		'data-words' => $words_attr,
		'data-align' => $text_align,
	] );

	return sprintf(
		'<span %s>
			<span class="vr-sizer" aria-hidden="true">%s</span>
			<span class="vr-text" aria-live="polite"></span>
		</span>',
		$wrapper_attrs,
		$longest_attr
	);
}
