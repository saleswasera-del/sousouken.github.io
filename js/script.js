/* js/script.js */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  /* ===========================
   * 1) グローバル：ナビ（右上ドロップダウン）
   * =========================== */
  const btn  = document.querySelector('.hamburger');
  const menu = document.querySelector('.nav-menu');

  if (btn && menu) {
    if (!menu.id) menu.id = 'primary-menu';
    btn.setAttribute('aria-controls', menu.id);
    btn.setAttribute('aria-expanded', 'false');

    // 背景オーバーレイ（重複作成防止）
    let backdrop = document.querySelector('.nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'nav-backdrop';
      document.body.appendChild(backdrop);
    }

    const openMenu = () => {
      menu.classList.add('show');
      btn.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      backdrop.classList.add('show');
    };
    const closeMenu = () => {
      menu.classList.remove('show');
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      backdrop.classList.remove('show');
    };
    const toggleMenu = (e) => {
      e?.stopPropagation();
      menu.classList.contains('show') ? closeMenu() : openMenu();
    };

    btn.addEventListener('click', toggleMenu);
    backdrop.addEventListener('click', closeMenu);

    // メニュー内リンククリックで閉じる
    menu.addEventListener('click', (e) => {
      if (e.target.closest('a')) closeMenu();
    });

    // 外側クリック／Escで閉じる
    document.addEventListener('click', (e) => {
      if (!menu.classList.contains('show')) return;
      if (!menu.contains(e.target) && !btn.contains(e.target)) closeMenu();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('show')) closeMenu();
    });

    // 幅が広がったら状態リセット（CSSのBP 768pxと合わせる）
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  /* =========================================
   * 2) Members：LINE登録者数カウントアップ
   * ========================================= */
  const countEl = document.getElementById('line-member-count');
  if (countEl) {
    const toInt = (v) => {
      const n = parseInt(String(v).replace(/[^\d-]/g, ''), 10);
      return Number.isFinite(n) ? n : 0;
    };
    const target = toInt(countEl.dataset.target || countEl.textContent || 0);
    const start  = toInt(countEl.textContent || 0);
    const duration = 1500;

    const run = () => {
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        countEl.textContent = String(target);
        return;
      }
      let startTime = null;
      const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);

      const tick = (ts) => {
        if (startTime === null) startTime = ts;
        const t = Math.min((ts - startTime) / duration, 1);
        const val = Math.round(start + (target - start) * easeOutQuad(t));
        countEl.textContent = String(val);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    // 見えたら実行（他ページ読み込み時の無駄実行防止）
    const io = new IntersectionObserver((entries, obs) => {
      if (entries.some(e => e.isIntersecting)) {
        run();
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    io.observe(countEl);
  }

  /* =========================================
   * 3) About：統計カードのカウントアップ（任意）
   * ========================================= */
  if (document.body.dataset.page === 'about') {
    const nums = [...document.querySelectorAll('.stats-cards .num[data-target]')];
    if (nums.length) {
      const easeOut = (t) => 1 - Math.pow(1 - t, 3);
      const animate = (el, to, dur = 1200) => {
        const start = performance.now();
        const step = (now) => {
          const p = Math.min((now - start) / dur, 1);
          el.textContent = Math.round(to * easeOut(p)).toLocaleString();
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      };

      const targetSection = document.querySelector('.stats-cards') || document.body;
      const once = new IntersectionObserver((entries, obs) => {
        if (entries.some(e => e.isIntersecting)) {
          nums.forEach(el => animate(el, Number(el.dataset.target) || 0));
          obs.disconnect();
        }
      }, { threshold: 0.3 });
      once.observe(targetSection);
    }
  }
});
