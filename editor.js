/**
 * Vertical Rotator Block - editor.js
 * Gutenbergエディター用ブロック登録（ビルド不要 vanilla JS版）
 */
(function () {
    const { registerBlockType } = wp.blocks;
    const { InspectorControls, useBlockProps } = wp.blockEditor;
    const { PanelBody, TextControl, ColorPicker, RadioControl } = wp.components;
    const { createElement: el, Fragment } = wp.element;

    registerBlockType("vr/rotator", {
        edit: function ({ attributes, setAttributes }) {
            const { words, color, textAlign } = attributes;

            const blockProps = useBlockProps({
                className: "wp-block-vr-rotator is-editor-preview",
                style: { color: color },
            });

            // エディター内では最初の単語だけ表示（揃え方向を反映）
            const previewWord = (words || "").split(",")[0]?.trim() || "テキスト";

            return el(
                Fragment,
                null,

                // ── サイドバー設定 ──
                el(
                    InspectorControls,
                    null,
                    el(
                        PanelBody,
                        { title: "ローテーター設定", initialOpen: true },
                        el(TextControl, {
                            label: "単語リスト（カンマ区切り）",
                            value: words,
                            onChange: (val) => setAttributes({ words: val }),
                            help: "例: 超える,創る,未来　※最長の単語が幅の基準になります",
                        }),
                        el(RadioControl, {
                            label: "テキスト揃え",
                            selected: textAlign,
                            options: [
                                { label: "左揃え（Left）", value: "left" },
                                { label: "中央揃え（Center）", value: "center" },
                                { label: "右揃え（Right）", value: "right" },
                            ],
                            onChange: (val) => setAttributes({ textAlign: val }),
                            help: "揃え方向を変えても、周囲のレイアウトは動きません",
                        })
                    ),
                    el(
                        PanelBody,
                        { title: "カラー設定", initialOpen: false },
                        el("p", { style: { marginBottom: "8px", fontSize: "12px" } }, "テキストカラー"),
                        el(ColorPicker, {
                            color: color,
                            onChange: (val) => setAttributes({ color: val }),
                            enableAlpha: false,
                        })
                    )
                ),

                // ── エディター内プレビュー ──
                el(
                    "span",
                    blockProps,
                    // sizer（幅確保）
                    el("span", { className: "vr-sizer", "aria-hidden": "true" }, previewWord),
                    // 表示テキスト
                    el("span", {
                        className: "vr-text",
                        style: { textAlign: textAlign },
                    }, previewWord),
                    // ラベル
                    el("span", {
                        style: {
                            position: "absolute",
                            top: "-18px",
                            left: "0",
                            fontSize: "10px",
                            fontWeight: "normal",
                            opacity: 0.5,
                            whiteSpace: "nowrap",
                        },
                    },
                        "▲ Rotator (" + textAlign + ")"
                    )
                )
            );
        },

        // save = null → render_callback でサーバーサイドレンダリング
        save: function () {
            return null;
        },
    });
})();
