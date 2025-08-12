/* js/script.js */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  /* ================================
   * 1) グローバル：ナビゲーション開閉
   * ================================ */
  const btn  = document.querySelector('.hamburger');
  const menu = document.querySelector('.nav-menu');

  if (btn && menu) {
    // a11y: aria-controls を確実に付与（idが無ければ付与）
    if (!menu.id) menu.id = 'mainmenu';
    btn.setAttribute('aria-controls', menu.id);
    btn.setAttribute('aria-expanded', 'false');

    const toggleMenu = () => {
      const isOpen = menu.classList.toggle('show');
      btn.classList.toggle('is-open', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
    };

    const closeMenu = () => {
      menu.classList.remove('show');
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    };

    // クリックで開閉
    btn.addEventListener('click', toggleMenu);

    // メニュー内リンクを押したら閉じる
    menu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', closeMenu);
    });

    // 外側クリックで閉じる
    document.addEventListener('click', (e) => {
      if (!menu.classList.contains('show')) return;
      const clickInside =
        menu.contains(e.target) || btn.contains(e.target);
      if (!clickInside) closeMenu();
    });

    // Escキーで閉じる（a11y）
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('show')) closeMenu();
    });

    // 画面幅が広がったら状態リセット（CSSのブレークポイントと合わせる）
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  /* =========================================
   * 2) Members用：LINE登録者数のカウントアップ
   * ========================================= */
  const countEl = document.getElementById('line-member-count');
  if (countEl) {
    // 目標値は data-target 優先、なければ現在のテキストを整数として取得、最終手段で 0
    const parseIntSafe = (v) => {
      const n = parseInt(String(v).replace(/[^\d-]/g, ''), 10);
      return Number.isFinite(n) ? n : 0;
    };
    const target =
      parseIntSafe(countEl.dataset.target) ||
      parseIntSafe(countEl.textContent) ||
      0;

    // reduced motion のユーザーにはアニメ無しで最終値を表示
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      countEl.textContent = String(target);
      return;
    }

    // 開始値（要素の中身が数字ならそこから）
    const start = parseIntSafe(countEl.textContent);
    const duration = 1500; // ms

    // requestAnimationFrame ベースの時間駆動アニメ（フレーム落ちに強い）
    let startTime = null;

    const tick = (ts) => {
      if (startTime === null) startTime = ts;
      const elapsed = ts - startTime;
      const t = Math.min(elapsed / duration, 1); // 0..1

      // イージング（任意）：easeOutQuad
      const eased = 1 - (1 - t) * (1 - t);

      const value = Math.round(start + (target - start) * eased);
      countEl.textContent = String(value);

      if (t < 1) requestAnimationFrame(tick);
    };

    // 0 → target にしたい場合は start を 0 にしたければ、上の start を 0 に変えるか
    // HTML側で <span data-target="172">0</span> のようにセットしてください。
    requestAnimationFrame(tick);
  }
});
