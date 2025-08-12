// js/script.js
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.hamburger');
  const menu = document.querySelector('.nav-menu');

  if (!btn || !menu) return;

  // 開閉
  const toggleMenu = () => {
    const isOpen = menu.classList.toggle('show');
    btn.classList.toggle('is-open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
  };

  btn.addEventListener('click', toggleMenu);

  // メニュー内リンクを押したら閉じる（単ページ遷移でも気持ちよく）
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('show');
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  // 画面を広げたら強制的に閉じて状態リセット
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      menu.classList.remove('show');
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  // アクセシビリティ
  btn.setAttribute('aria-expanded', 'false');
});
// カウントアップアニメーション
document.addEventListener("DOMContentLoaded", () => {
  const countEl = document.getElementById("line-member-count");
  const target = 172; // 表示したい人数
  let current = 0;
  const duration = 1500; // アニメーション時間(ms)
  const frameRate = 1000 / 60; // 60fps
  const totalFrames = Math.round(duration / frameRate);
  const increment = target / totalFrames;

  function updateCount() {
    current += increment;
    if (current >= target) {
      countEl.textContent = target;
    } else {
      countEl.textContent = Math.floor(current);
      requestAnimationFrame(updateCount);
    }
  }
  updateCount();
});
