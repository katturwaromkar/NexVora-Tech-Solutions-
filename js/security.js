/* ==========================================================================
   Yugvex Tech Solutions - Enterprise Security & Compliance Middleware
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

  // --- Anti-Inspect & DevTools Locking Engine ---
  function initAntiInspect() {
    // Disable Context Menu (Right Click)
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      showSecurityToast('Security Guard: Right-click inspection disabled.', 'warning');
      return false;
    });

    // Disable Keyboard DevTools Shortcuts
    document.addEventListener('keydown', (e) => {
      // F12 key
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        showSecurityToast('Security Guard: DevTools (F12) blocked.', 'danger');
        return false;
      }

      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Ctrl+S
      if (e.ctrlKey || e.metaKey) {
        const key = (e.key || '').toLowerCase();
        if (e.shiftKey && (key === 'i' || key === 'j' || key === 'c' || key === 'k')) {
          e.preventDefault();
          showSecurityToast('Security Guard: Developer Tools shortcut blocked.', 'danger');
          return false;
        }
        if (key === 'u' || key === 's') {
          e.preventDefault();
          showSecurityToast('Security Guard: Source viewing disabled.', 'warning');
          return false;
        }
      }
    });
  }

  // --- Total Zoom Lock Engine (Prevents Pinch & Keyboard Zooming) ---
  function initZoomLock() {
    // Disable Ctrl + Wheel Zoom
    window.addEventListener('wheel', (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    }, { passive: false });

    // Disable Key Combinations for Zooming (Ctrl +, Ctrl -, Ctrl 0)
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
        e.preventDefault();
      }
    });

    // Disable Mobile Multi-Touch Pinch Zoom
    document.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });

    document.addEventListener('gesturestart', (e) => {
      e.preventDefault();
    });

    document.addEventListener('gesturechange', (e) => {
      e.preventDefault();
    });
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
      totalSize += pair[1].length || 0;
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
          showSecurityToast('Security Check Failed: Automated bot detected.', 'danger');
          return false;
        }

        if (!validatePayloadSize(form)) {
          e.preventDefault();
          showSecurityToast('Security Block: Oversized payload rejected.', 'danger');
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
    initAntiInspect();
    initZoomLock();
    initHoneypots();
    initSecurityModal();
    console.log('[Security Engine] Enterprise Security Active (Anti-Inspect, DevTools Lock, Zoom-Lock, Anti-XSS, Anti-SQLi, Rate-Limiting).');
  });

})();
