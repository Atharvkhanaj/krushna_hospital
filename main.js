// ============================================
// KRISHNA HOSPITAL – MAIN JS
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- NAVBAR SCROLL ----
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  // ---- HAMBURGER MENU ----
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });
  }

  // ---- ACTIVE NAV LINK ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });

  // ---- TABS ----
  document.querySelectorAll('.tabs').forEach(tabContainer => {
    tabContainer.querySelectorAll('.tab-btn').forEach((btn, i) => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        tabContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const panels = document.querySelectorAll('.tab-panel');
        panels.forEach(p => p.classList.remove('active'));
        const targetPanel = document.getElementById(target);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });
  });

  // ---- MODAL ----
  document.querySelectorAll('[data-modal]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const modal = document.getElementById(trigger.dataset.modal);
      if (modal) modal.classList.add('open');
    });
  });
  document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el || el.classList.contains('modal-close')) {
        el.closest('.modal-overlay')?.classList.remove('open');
      }
    });
  });
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', e => e.stopPropagation());
  });

  // ---- COUNTER ANIMATION ----
  const counters = document.querySelectorAll('.stat-num');
  const observerOptions = { threshold: 0.5 };
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.textContent.replace(/\D/g, ''));
        if (!target || el.dataset.counted) return;
        el.dataset.counted = true;
        const suffix = el.textContent.replace(/\d/g, '');
        let current = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = Math.floor(current) + suffix;
        }, 16);
      }
    });
  }, observerOptions);
  counters.forEach(c => counterObserver.observe(c));

  // ---- SCROLL REVEAL ----
  const revealEls = document.querySelectorAll('.dept-card, .testi-card, .stat-card, .wc, .why-item, .quick-card');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    revealObserver.observe(el);
  });

  // ---- FORM VALIDATION HELPER ----
  window.validateForm = function(formEl) {
    let valid = true;
    formEl.querySelectorAll('[required]').forEach(input => {
      input.style.borderColor = '';
      if (!input.value.trim()) {
        input.style.borderColor = '#ef4444';
        valid = false;
      }
    });
    return valid;
  };

  // ---- TOAST NOTIFICATION ----
  window.showToast = function(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:10px;';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    const colors = { success: '#10b981', danger: '#ef4444', warning: '#f59e0b', info: '#0a6ebd' };
    const icons = { success: 'check-circle', danger: 'times-circle', warning: 'exclamation-triangle', info: 'info-circle' };
    toast.style.cssText = `background:#fff;border-left:4px solid ${colors[type]};border-radius:10px;padding:14px 20px;box-shadow:0 8px 32px rgba(0,0,0,0.15);display:flex;align-items:center;gap:10px;min-width:280px;font-family:'DM Sans',sans-serif;font-size:14px;animation:slideIn 0.3s ease;`;
    toast.innerHTML = `<i class="fas fa-${icons[type]}" style="color:${colors[type]};font-size:18px;"></i>${message}`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  };

  // ---- SIDEBAR TOGGLE (DASHBOARD) ----
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.sidebar');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  }

  // ---- LOCAL STORAGE HELPERS ----
  window.HMS = {
    save: (key, data) => localStorage.setItem('hms_' + key, JSON.stringify(data)),
    load: (key) => { try { return JSON.parse(localStorage.getItem('hms_' + key)); } catch(e) { return null; } },
    remove: (key) => localStorage.removeItem('hms_' + key),
    isLoggedIn: (role) => !!localStorage.getItem('hms_' + role + '_logged_in'),
    login: (role, data) => { localStorage.setItem('hms_' + role + '_logged_in', '1'); HMS.save(role + '_data', data); },
    logout: (role) => { localStorage.removeItem('hms_' + role + '_logged_in'); HMS.remove(role + '_data'); }
  };
});

// ---- INJECT TOAST ANIMATIONS ----
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn { from { transform: translateX(100%); opacity:0; } to { transform: translateX(0); opacity:1; } }
  @keyframes slideOut { from { transform: translateX(0); opacity:1; } to { transform: translateX(100%); opacity:0; } }
`;
document.head.appendChild(style);
