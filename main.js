// ================================
// THEME TOGGLE
// ================================
(function() {
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let theme = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);
  updateToggleIcon(theme);

  if (toggle) {
    toggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      updateToggleIcon(theme);
    });
  }

  function updateToggleIcon(t) {
    if (!toggle) return;
    toggle.innerHTML = t === 'dark'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    toggle.setAttribute('aria-label', 'Переключить на ' + (t === 'dark' ? 'светлую' : 'тёмную') + ' тему');
  }
})();

// ================================
// HEADER SCROLL BEHAVIOR
// ================================
(function() {
  const header = document.getElementById('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) header.classList.add('header--scrolled');
    else header.classList.remove('header--scrolled');
  }, { passive: true });
})();

// ================================
// SCROLL ANIMATIONS
// ================================
(function() {
  const targets = document.querySelectorAll('.adv-card, .cat-card, .review-card, .seg-card, .brand-card, .step, .faq-item, .leasing-inner > *, .section-header');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('visible'));
    return;
  }
  targets.forEach(el => el.classList.add('fade-in'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(el => observer.observe(el));
})();

// ================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ================================
// LEAD FORM HANDLING
// ================================
(function() {
  const form = document.getElementById('leadForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  // Phone mask
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
      let val = this.value.replace(/\D/g, '');
      if (val.startsWith('8')) val = '7' + val.slice(1);
      if (val.startsWith('7')) val = val;
      let result = '';
      if (val.length > 0) result = '+7';
      if (val.length > 1) result += ' (' + val.slice(1, 4);
      if (val.length >= 4) result += ') ' + val.slice(4, 7);
      if (val.length >= 7) result += '-' + val.slice(7, 9);
      if (val.length >= 9) result += '-' + val.slice(9, 11);
      this.value = result;
    });
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    if (!name || !phone) {
      if (!name) document.getElementById('name').focus();
      else document.getElementById('phone').focus();
      return;
    }
    // Simulate form submission
    const btn = form.querySelector('.btn-submit');
    btn.disabled = true;
    btn.textContent = 'Отправляем...';
    setTimeout(() => {
      success.classList.add('visible');
    }, 800);
  });
})();

// ================================
// STATS COUNTER ANIMATION
// ================================
(function() {
  const stats = document.querySelectorAll('.stat-num');
  if (!stats.length) return;
  const values = { '15+': 15, '500+': 500, '60': 60, '12+': 12 };
  const suffixes = { '15+': '+', '500+': '+', '60': '', '12+': '+' };

  function animateCount(el, target, suffix, duration = 1200) {
    const start = performance.now();
    const update = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const target = values[text];
        const suffix = suffixes[text];
        if (target !== undefined) {
          animateCount(el, target, suffix);
          observer.unobserve(el);
        }
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
})();
