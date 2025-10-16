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

        // --- Share CTA ---
document.addEventListener('DOMContentLoaded', () => {
  const title = '早稲田大学総合研究会';
  const text  = '実践と挑戦の機会を提供するインカレ団体。';
  const pageUrl = window.location.href;

  const withUTM = (url, source) => {
    const u = new URL(url, window.location.origin);
    u.searchParams.set('utm_source', source);
    u.searchParams.set('utm_medium', 'share');
    u.searchParams.set('utm_campaign', 'site_share');
    return u.toString();
  };

  const btnLine = document.getElementById('btn-share-line');
  const btnX    = document.getElementById('btn-share-x');
  const btnCopy = document.getElementById('btn-copy');
  const btnWS   = document.getElementById('btn-webshare');
  const ok      = document.getElementById('copy-ok');

  if (btnLine) btnLine.href = 'https://social-plugins.line.me/lineit/share?url=' +
    encodeURIComponent(withUTM(pageUrl, 'line'));

  if (btnX) btnX.href = 'https://twitter.com/intent/tweet?text=' +
    encodeURIComponent(`${title} — ${text}`) +
    '&url=' + encodeURIComponent(withUTM(pageUrl, 'x'));

  if (btnCopy) btnCopy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(withUTM(pageUrl, 'copy'));
      if (ok) { ok.hidden = false; setTimeout(() => ok.hidden = true, 2000); }
      window.gtag && gtag('event', 'share', { method: 'copy', page: location.pathname });
    } catch {}
  });

  if (btnWS) btnWS.addEventListener('click', async () => {
    const shareUrl = withUTM(pageUrl, 'webshare');
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        window.gtag && gtag('event', 'share', { method: 'webshare', page: location.pathname });
      } catch {}
    } else {
      // フォールバック：Xを開く
      btnX && btnX.click();
    }
  });
});

      }, { threshold: 0.3 });
      once.observe(targetSection);
    }
  }
});

/* =========================================
 * 4) FAQ：アコーディオン（クリックで開閉）
 * ========================================= */
(() => {
  // FAQコンテナと、各質問ボタン(.faq-q)を取得
  const acc = document.getElementById('faqAccordion');
  if (!acc) return; // このページにFAQが無ければ何もしない

  const items = [...acc.querySelectorAll('.faq-item')];
  const qs    = [...acc.querySelectorAll('.faq-q')];

  // 質問ボタンがクリックされたら開閉を切り替える
  const toggle = (btn) => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    const panelId  = btn.getAttribute('aria-controls');
    const panel    = document.getElementById(panelId);

    // 1つだけ開く仕様にしたい場合：先に全部閉じる
    qs.forEach(b => b.setAttribute('aria-expanded', 'false'));
    items.forEach(it => {
      const a = it.querySelector('.faq-a');
      if (a) a.hidden = true;
    });

    // クリックしたものは反転（今が閉じているなら開く）
    btn.setAttribute('aria-expanded', String(!expanded));
    if (panel) panel.hidden = expanded; // expanded=true→閉じる、false→開く
  };

  // 初期化：全部閉じた状態にしておく
  items.forEach(it => {
    const a = it.querySelector('.faq-a');
    if (a) a.hidden = true;
  });
  qs.forEach(btn => btn.setAttribute('aria-expanded', 'false'));

  // クリック&キーボード対応（Enter/Space）
  acc.addEventListener('click', (e) => {
    const btn = e.target.closest('.faq-q');
    if (btn) {
      e.preventDefault();
      toggle(btn);
    }
  });
  acc.addEventListener('keydown', (e) => {
    const btn = e.target.closest('.faq-q');
    if (!btn) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle(btn);
    }
  });
})();

