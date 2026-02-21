/**
 * Vertical Rotator Block - view.js
 * フロントエンド専用スクリプト
 * vr-sizer が常時存在し幅を確保 → vr-text が absolute で上に重なる
 * ホバー中はローテーションを一時停止する
 */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".wp-block-vr-rotator").forEach((container) => {
    const rawWords = container.dataset.words || "超える,創る,未来";
    const align = container.dataset.align || "left";
    const words = rawWords.split(",").map((w) => w.trim()).filter(Boolean);

    if (words.length === 0) return;

    const textEl = container.querySelector(".vr-text");
    if (!textEl) return;

    // 揃え方向を適用（left / center / right）
    textEl.style.textAlign = align;

    // 最初の単語を表示
    textEl.textContent = words[0];

    if (words.length === 1) return;

    let index = 0;
    let paused = false;  // ホバー中フラグ
    let timerId = null;

    const rotate = () => {
      if (paused) return;  // ← ホバー中は何もしない

      // ─ フェードアウト ＆ 上へ退場
      textEl.classList.add("vr-exit");

      setTimeout(() => {
        index = (index + 1) % words.length;
        textEl.textContent = words[index];

        // ─ 下から登場の初期位置をセット（transitionなし）
        textEl.classList.remove("vr-exit");
        textEl.classList.add("vr-enter");

        // ─ 1フレーム後にクラスを外してtransitionで滑り込む
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            textEl.classList.remove("vr-enter");
          });
        });
      }, 350);
    };

    // ─── ホバー制御 ───────────────────────────────
    container.addEventListener("mouseenter", () => {
      paused = true;
      container.classList.add("vr-paused");  // CSSでカーソル変更に使える
    });

    container.addEventListener("mouseleave", () => {
      paused = false;
      container.classList.remove("vr-paused");
    });

    // ── インターバル開始（2200ms ごとに rotate を実行）──
    timerId = setInterval(rotate, 2200);
  });
});
