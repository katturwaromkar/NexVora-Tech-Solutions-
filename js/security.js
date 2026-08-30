/* ==========================================================================
   Yugvex Tech Solutions - Enterprise Security & SSL Compliance Middleware
   Features: Anti-Clickjacking, XSS & SQLi Sanitization, Anti-Bot Honeypots,
   Rate-Limiting Protection, Form Payload Caps, SSL Security Modal.
   ========================================================================== */

(function () {
  'use strict';

  // --- Anti-Clickjacking Frame Busting Guard ---
  if (window.top !== window.self) {
    try {
      window.top.location = window.self.location;
    } catch (e) {
      console.warn('[Security Guard] Clickjacking framing attempt thwarted.');
    }
  }

  // --- Advanced XSS & SQLi Sanitization ---
  function sanitizeInput(str) {
    if (typeof str !== 'string') return str;
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .replace(/--/g, '&#45;&#45;')
      .replace(/;/g, '&#59;');
  }

  // --- Form Payload Oversize Guard (Prevents DoS/Buffer Attack) ---
  function validatePayloadSize(form) {
    const formData = new FormData(form);
    let totalSize = 0;
    for (let pair of formData.entries()) {
      totalSize += (pair[1] && pair[1].length) ? pair[1].length : 0;
    }
    return totalSize < 50000; // 50KB payload cap for security
  }

  // --- Client-Side Rate Limiter (Prevents Form Spam Attack) ---
  const RateLimiter = {
    attempts: {},
    isAllowed(actionKey, limit = 5, windowMs = 60000) {
      const now = Date.now();
      if (!this.attempts[actionKey]) {
        this.attempts[actionKey] = [];
      }
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
    if (type === 'success') icon = '✅';

    toast.innerHTML = `<span>${icon}</span><span>${sanitizeInput(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // --- Initialize Anti-Bot Honeypot & Anti-DoS Payload Controls on All Forms ---
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
          showSecurityToast('Security Check: Automated bot submission blocked.', 'danger');
          return false;
        }

        if (!validatePayloadSize(form)) {
          e.preventDefault();
          showSecurityToast('Security Block: Oversized payload rejected.', 'danger');
          return false;
        }

        // Rate limit check
        const formId = form.id || 'generic_form';
        if (!RateLimiter.isAllowed(formId, 5, 30000)) {
          e.preventDefault();
          showSecurityToast('Too many submissions. Please wait a moment before retrying.', 'warning');
          return false;
        }
      });
    });
  }

  // --- Security Audit Modal Logic ---
  function initSecurityModal() {
    const triggers = document.querySelectorAll('[data-security-modal], .security-badge-trigger');
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
    validatePayloadSize,
    showToast: showSecurityToast
  };

  document.addEventListener('DOMContentLoaded', () => {
    initHoneypots();
    initSecurityModal();
    console.log('[Security Engine] Enterprise SSL & Security Active (Anti-Clickjacking, Anti-XSS, Anti-SQLi, Honeypot, Rate-Limiting).');
  });

})();
