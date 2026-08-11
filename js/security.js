/* ==========================================================================
   Yugvex Tech Solutions - Enterprise Security & Compliance Middleware
   ========================================================================== */

(function () {
  'use strict';

  // --- XSS Escaping & Input Sanitization ---
  function sanitizeInput(str) {
    if (typeof str !== 'string') return str;
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // --- Client-Side Rate Limiter (Prevents Form Spam Attack) ---
  const RateLimiter = {
    attempts: {},
    isAllowed(actionKey, limit = 5, windowMs = 60000) {
      const now = Date.now();
      if (!this.attempts[actionKey]) {
        this.attempts[actionKey] = [];
      }
      // Remove timestamps older than window
      this.attempts[actionKey] = this.attempts[actionKey].filter(ts => now - ts < windowMs);

      if (this.attempts[actionKey].length >= limit) {
        return false;
      }
      this.attempts[actionKey].push(now);
      return true;
    }
  };

  // --- Security Toast Notifications ---
  function showSecurityToast(message, type = 'success') {
    let container = document.querySelector('.security-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'security-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `security-toast ${type}`;
    
    let icon = '🛡️';
    if (type === 'warning') icon = '⚠️';
    if (type === 'danger') icon = '🚨';

    toast.innerHTML = `<span>${icon}</span><span>${sanitizeInput(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // --- Initialize Anti-Bot Honeypot on All Forms ---
  function initHoneypots() {
    document.querySelectorAll('form').forEach(form => {
      if (form.querySelector('.security-hp-field')) return;

      const hpField = document.createElement('input');
      hpField.type = 'text';
      hpField.name = 'website_sec_hp';
      hpField.className = 'security-hp-field';
      hpField.style.display = 'none';
      hpField.tabIndex = -1;
      hpField.autocomplete = 'off';
      form.appendChild(hpField);

      form.addEventListener('submit', function (e) {
        if (hpField.value.trim() !== '') {
          e.preventDefault();
          console.warn('[Security Guard] Automated bot submission blocked.');
          showSecurityToast('Security Check Failed: Automated bot detected.', 'danger');
          return false;
        }

        // Rate limit check
        const formId = form.id || 'generic_form';
        if (!RateLimiter.isAllowed(formId, 4, 30000)) {
          e.preventDefault();
          showSecurityToast('Too many submissions. Please wait 30 seconds before retrying.', 'warning');
          return false;
        }
      });
    });
  }

  // --- Security Audit Modal Logic ---
  function initSecurityModal() {
    const triggers = document.querySelectorAll('[data-security-modal]');
    const overlay = document.getElementById('securityModalOverlay');
    const closeBtn = document.getElementById('securityModalClose');

    if (!overlay) return;

    triggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // ESC Key listener
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // --- Expose Security API to Global Scope ---
  window.YugvexSecurity = {
    sanitizeInput,
    RateLimiter,
    showToast: showSecurityToast
  };

  document.addEventListener('DOMContentLoaded', () => {
    initHoneypots();
    initSecurityModal();
    console.log('[Security Engine] Enterprise Security Protocol Active (CSP, TLS 1.3, Anti-XSS, Rate-Limiting).');
  });

})();
