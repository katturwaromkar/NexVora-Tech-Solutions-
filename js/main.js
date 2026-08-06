/* ==========================================================================
   NexVora Tech Solutions - Main Application JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileDrawer();
  initRippleEffect();
  initModals();
  initFormsAndToasts();
  initFAQAccordion();
  initCookieBanner();
  setCurrentYear();
  if (typeof initNexVoraAIChatbot === 'function') {
    initNexVoraAIChatbot();
  }
  if (typeof initNexVoraSocialDock === 'function') {
    initNexVoraSocialDock();
  }
});

/* --- Navbar Scroll Effect --- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* --- Mobile Drawer Menu --- */
function initMobileDrawer() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.mobile-nav-overlay');
  const closeBtn = document.querySelector('.close-drawer-btn');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburgerBtn || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* --- Button Ripple Effect --- */
function initRippleEffect() {
  const buttons = document.querySelectorAll('.btn, .ripple-trigger');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const circle = document.createElement('span');
      const diameter = Math.max(this.clientWidth, this.clientHeight);
      const radius = diameter / 2;
      const rect = this.getBoundingClientRect();

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple');

      const existingRipple = this.querySelector('.ripple');
      if (existingRipple) {
        existingRipple.remove();
      }

      this.appendChild(circle);
    });
  });
}

/* --- Dynamic Modals System --- */
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  const closeBtns = document.querySelectorAll('.modal-close-btn');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      const targetModal = document.getElementById(targetId);
      if (targetModal) {
        // Optional payload setup
        const payloadTitle = trigger.getAttribute('data-modal-title');
        if (payloadTitle) {
          const titleEl = targetModal.querySelector('.modal-dynamic-title');
          if (titleEl) titleEl.textContent = payloadTitle;
        }

        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeModal = btn.closest('.modal-overlay');
      if (activeModal) closeModal(activeModal);
    });
  });

  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalOverlays.forEach(overlay => {
        if (overlay.classList.contains('active')) closeModal(overlay);
      });
    }
  });
}

function closeModal(modalEl) {
  modalEl.classList.remove('active');
  document.body.style.overflow = '';
}

/* --- Security Utilities & Input Sanitization --- */
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

let lastFormSubmitTime = 0;

/* --- Form Validation, Anti-Spam & WhatsApp Dispatch --- */
function initFormsAndToasts() {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // 1. Rate Limiting Check (10 seconds cooldown between submissions)
      const now = Date.now();
      if (now - lastFormSubmitTime < 10000) {
        showToast('Security Alert: Please wait 10 seconds before submitting another request.', 'error');
        return;
      }

      // 2. Honeypot Anti-Bot Check
      const honeypot = form.querySelector('input[name="hp_b_fax"]');
      if (honeypot && honeypot.value.trim() !== '') {
        // Silent rejection for automated spam bots
        showToast('Request submitted.', 'success');
        form.reset();
        return;
      }

      // 3. Required Inputs Validation
      const requiredInputs = form.querySelectorAll('[required]');
      let isValid = true;

      requiredInputs.forEach(input => {
        const val = input.value.trim();
        if (!val) {
          isValid = false;
          input.style.borderColor = '#ef4444';
        } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          isValid = false;
          input.style.borderColor = '#ef4444';
          showToast('Please enter a valid email address.', 'error');
        } else if (input.type === 'tel' && !/^[0-9+\s-]{8,15}$/.test(val)) {
          isValid = false;
          input.style.borderColor = '#ef4444';
          showToast('Please enter a valid phone number.', 'error');
        } else {
          input.style.borderColor = '';
        }
      });

      if (isValid) {
        lastFormSubmitTime = Date.now();

        // Collect and sanitize form data for WhatsApp dispatch
        const inputs = Array.from(form.querySelectorAll('input, select, textarea'));
        let name = '';
        let email = '';
        let phone = '';
        let service = '';
        let message = '';

        inputs.forEach(input => {
          if (input.name === 'hp_b_fax') return; // Skip honeypot
          
          const type = (input.type || '').toLowerCase();
          const placeholder = (input.placeholder || '').toLowerCase();
          const label = (input.previousElementSibling?.textContent || '').toLowerCase();
          const val = escapeHTML(input.value.trim());

          if (placeholder.includes('name') || label.includes('name')) {
            name = val;
          } else if (type === 'email' || placeholder.includes('email') || label.includes('email')) {
            email = val;
          } else if (type === 'tel' || placeholder.includes('phone') || label.includes('phone')) {
            phone = val;
          } else if (input.tagName === 'SELECT' || label.includes('service') || label.includes('product')) {
            service = val;
          } else if (input.tagName === 'TEXTAREA' || label.includes('detail') || label.includes('message')) {
            message = val;
          }
        });

        // Format WhatsApp Message with Encoded Components
        const formattedText = `*NexVora Tech Solutions - New Inquiry Request*%0A%0A` +
          `👤 *Name:* ${encodeURIComponent(name || 'Customer')}%0A` +
          `✉️ *Email:* ${encodeURIComponent(email || 'N/A')}%0A` +
          `📞 *Phone:* ${encodeURIComponent(phone || 'N/A')}%0A` +
          (service ? `⚙️ *Requirement:* ${encodeURIComponent(service)}%0A` : '') +
          (message ? `📝 *Details:* ${encodeURIComponent(message)}%0A` : '') +
          `%0A_Sent via NexVora Verified Portal_`;

        // Store lead inquiry locally in database store
        try {
          const leads = JSON.parse(localStorage.getItem('nexvora_leads') || '[]');
          leads.push({
            name: name || 'Customer',
            email: email || 'N/A',
            phone: phone || 'N/A',
            service: service || 'General Inquiry',
            message: message || 'N/A',
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('nexvora_leads', JSON.stringify(leads));
        } catch (e) {
          console.warn('Local lead storage error:', e);
        }

        const whatsappUrl = `https://wa.me/917219290885?text=${formattedText}`;

        showToast('Inquiry logged successfully! Our team will review your request shortly.', 'success');

        const parentModal = form.closest('.modal-overlay');
        if (parentModal) closeModal(parentModal);

        form.reset();

        showSubmissionSuccessModal(name || 'Partner', whatsappUrl);
      } else if (!form.querySelector('.toast-error')) {
        showToast('Please complete all required fields correctly.', 'error');
      }
    });
  });
}

function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' ? '✓' : '!';
  toast.innerHTML = `
    <div style="width:24px;height:24px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:12px;">${icon}</div>
    <div>${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* --- FAQ Accordion --- */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answerEl = item.querySelector('.faq-answer');

    if (!questionBtn || !answerEl) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other accordions
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherAns = otherItem.querySelector('.faq-answer');
        if (otherAns) otherAns.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        answerEl.style.maxHeight = answerEl.scrollHeight + 'px';
      }
    });
  });
}

/* --- Cookie Banner --- */
function initCookieBanner() {
  if (localStorage.getItem('nexvora_cookie_accepted')) return;

  const banner = document.createElement('div');
  banner.className = 'glass-card';
  banner.style.cssText = `
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    max-width: 420px;
    z-index: 9999;
    padding: 1.25rem;
    box-shadow: var(--shadow-md), var(--shadow-glow);
  `;
  banner.innerHTML = `
    <h4 style="margin-bottom:0.4rem;font-size:1rem;">Cookie & Privacy Notice</h4>
    <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:1rem;">We use cookies to deliver optimal SaaS user experience and security analytics.</p>
    <div style="display:flex;gap:0.75rem;">
      <button id="accept-cookies-btn" class="btn btn-primary btn-sm">Accept All</button>
      <a href="privacy.html" class="btn btn-secondary btn-sm">Learn More</a>
    </div>
  `;

  document.body.appendChild(banner);

  document.getElementById('accept-cookies-btn').addEventListener('click', () => {
    localStorage.setItem('nexvora_cookie_accepted', 'true');
    banner.remove();
  });
}

/* --- Submission Success Modal Dialog --- */
function showSubmissionSuccessModal(name, whatsappUrl) {
  const existingModal = document.getElementById('submissionSuccessModal');
  if (existingModal) existingModal.remove();

  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay active';
  modalOverlay.id = 'submissionSuccessModal';
  modalOverlay.style.zIndex = '100005';
  modalOverlay.innerHTML = `
    <div class="modal-content glass-card card-shine" style="max-width:520px;text-align:center;padding:2.5rem 2rem;">
      <div style="width:64px;height:64px;border-radius:50%;background:var(--gradient-primary);margin:0 auto 1.25rem auto;display:flex;align-items:center;justify-content:center;font-size:2rem;box-shadow:var(--shadow-glow);">
        🎉
      </div>
      <h3 style="font-size:1.5rem;margin-bottom:0.5rem;color:var(--text-main);">Inquiry Successfully Logged!</h3>
      <p style="color:var(--text-muted);font-size:0.95rem;line-height:1.6;margin-bottom:1.5rem;">
        Thank you, <strong>${escapeHTML(name)}</strong>. Your request has been recorded in the NexVora lead database. Director Omkar Katturwar and our software engineering team will review your specifications shortly.
      </p>
      <div style="display:flex;flex-direction:column;gap:0.75rem;">
        <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-md" style="width:100%;justify-content:center;">
          💬 Continue to Direct WhatsApp Chat ↗
        </a>
        <button class="btn btn-secondary btn-md" id="closeSuccessModalBtn" style="width:100%;">
          Close Window
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  const closeBtn = modalOverlay.querySelector('#closeSuccessModalBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => modalOverlay.remove());
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) modalOverlay.remove();
  });
}

function setCurrentYear() {
  const yearEls = document.querySelectorAll('.current-year');
  const currYear = new Date().getFullYear();
  yearEls.forEach(el => el.textContent = currYear);
}
