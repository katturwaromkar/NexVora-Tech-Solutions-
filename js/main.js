/* ==========================================================================
   Yugvex Tech Solutions - Main Application JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initThemeToggle();
  initMobileDrawer();
  initRippleEffect();
  initProjectModal();
  initQuotationModal();
  initMobileQuickDock();
  initFloatingWhatsapp();
  initModals();
  initFormsAndToasts();
  initFAQAccordion();
  initCookieBanner();
  setCurrentYear();
  if (typeof initYugvexAIChatbot === 'function') {
    initYugvexAIChatbot();
  }
  if (typeof initNexVoraAIChatbot === 'function') {
    initNexVoraAIChatbot();
  }
  if (typeof initNexVoraSocialDock === 'function') {
    initNexVoraSocialDock();
  }
});

/* --- Theme Toggle Engine (Syncrio Bright Light / Dark Mode) --- */
function initThemeToggle() {
  const savedTheme = localStorage.getItem('yugvex_theme') || 'dark';
  applyTheme(savedTheme);

  document.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('#themeToggleBtn, .theme-toggle-btn');
    if (!toggleBtn) return;

    const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    localStorage.setItem('yugvex_theme', nextTheme);
    applyTheme(nextTheme);
  });
}

function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    document.querySelectorAll('.theme-icon-dark').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.theme-icon-light').forEach(el => el.style.display = 'inline');
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      if (!btn.querySelector('.theme-icon-light')) {
        btn.innerHTML = '🌙';
      }
      btn.setAttribute('aria-label', 'Switch to Dark Mode');
      btn.setAttribute('title', 'Switch to Dark Mode');
    });
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.querySelectorAll('.theme-icon-dark').forEach(el => el.style.display = 'inline');
    document.querySelectorAll('.theme-icon-light').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      if (!btn.querySelector('.theme-icon-dark')) {
        btn.innerHTML = '☀️';
      }
      btn.setAttribute('aria-label', 'Switch to Light Mode');
      btn.setAttribute('title', 'Switch to Light Mode');
    });
  }
}

/* --- Mobile Sticky Quick Action Dock --- */
function initMobileQuickDock() {
  if (document.getElementById('mobileQuickDock')) return;
  const dock = document.createElement('div');
  dock.className = 'mobile-quick-dock';
  dock.id = 'mobileQuickDock';
  dock.setAttribute('aria-label', 'Mobile Quick Action Navigation');
  dock.innerHTML = `
    <div class="mobile-quick-dock-container">
      <a href="tel:+917219290885" class="mobile-dock-btn call-btn" aria-label="Call Yugvex Support">
        <span class="mobile-dock-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        </span>
        <span>Call</span>
      </a>
      <a href="https://wa.me/917219290885" target="_blank" rel="noopener" class="mobile-dock-btn whatsapp-btn" aria-label="Chat on WhatsApp">
        <span class="mobile-dock-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 0C5.384 0 0 5.383 0 12.031c0 2.124.553 4.197 1.604 6.02L.062 24l6.096-1.599a11.956 11.956 0 005.873 1.536h.005c6.645 0 12.028-5.384 12.028-12.031C24.064 5.383 18.678 0 12.031 0zm.005 22.012h-.004a9.98 9.98 0 01-5.087-1.396l-.365-.217-3.781.991 1.009-3.687-.238-.379a9.957 9.957 0 01-1.53-5.301c0-5.513 4.486-9.999 10.001-9.999 5.514 0 10.001 4.486 10.001 9.999 0 5.514-4.487 10.001-10.002 10.001zm5.485-7.495c-.301-.15-1.782-.879-2.057-.979-.275-.101-.476-.15-.677.15-.201.301-.777.979-.953 1.18-.175.201-.351.226-.652.076-.301-.15-1.272-.469-2.424-1.498-.897-.801-1.502-1.79-1.677-2.091-.175-.301-.019-.464.131-.614.135-.134.301-.351.451-.526.15-.175.201-.301.301-.501.101-.201.05-.376-.025-.526-.075-.15-.677-1.632-.927-2.233-.243-.585-.49-.506-.677-.516l-.577-.01c-.201 0-.526.075-.802.376s-1.053 1.03-1.053 2.513c0 1.483 1.078 2.91 1.228 3.111.15.201 2.122 3.24 5.141 4.545.718.31 1.279.495 1.716.634.721.229 1.377.197 1.896.12.578-.086 1.782-.728 2.033-1.431.25-.702.25-1.304.175-1.43-.075-.126-.275-.201-.576-.351z"/></svg>
        </span>
        <span>WhatsApp</span>
      </a>
      <button type="button" class="mobile-dock-btn quote-btn" data-modal-target="projectModal" aria-label="Get Project Quote">
        <span class="mobile-dock-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-3.05 11a22.35 22.35 0 0 1-3.95 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
        </span>
        <span>Get Quote</span>
      </button>
    </div>
  `;
  document.body.appendChild(dock);
}

/* --- Modernized Floating WhatsApp Action Widget --- */
function initFloatingWhatsapp() {
  if (document.querySelector('.floating-whatsapp')) return;

  const btn = document.createElement('a');
  btn.href = 'https://wa.me/917219290885?text=Hello%20Yugvex%20Tech%20Solutions!';
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.className = 'floating-whatsapp';
  btn.setAttribute('aria-label', 'Chat on WhatsApp');
  btn.setAttribute('title', 'Chat directly with Yugvex Tech Solutions on WhatsApp');
  btn.innerHTML = `
    <svg viewBox="0 0 24 24"><path d="M12.031 0C5.384 0 0 5.383 0 12.031c0 2.124.553 4.197 1.604 6.02L.062 24l6.096-1.599a11.956 11.956 0 005.873 1.536h.005c6.645 0 12.028-5.384 12.028-12.031C24.064 5.383 18.678 0 12.031 0zm.005 22.012h-.004a9.98 9.98 0 01-5.087-1.396l-.365-.217-3.781.991 1.009-3.687-.238-.379a9.957 9.957 0 01-1.53-5.301c0-5.513 4.486-9.999 10.001-9.999 5.514 0 10.001 4.486 10.001 9.999 0 5.514-4.487 10.001-10.002 10.001zm5.485-7.495c-.301-.15-1.782-.879-2.057-.979-.275-.101-.476-.15-.677.15-.201.301-.777.979-.953 1.18-.175.201-.351.226-.652.076-.301-.15-1.272-.469-2.424-1.498-.897-.801-1.502-1.79-1.677-2.091-.175-.301-.019-.464.131-.614.135-.134.301-.351.451-.526.15-.175.201-.301.301-.501.101-.201.05-.376-.025-.526-.075-.15-.677-1.632-.927-2.233-.243-.585-.49-.506-.677-.516l-.577-.01c-.201 0-.526.075-.802.376s-1.053 1.03-1.053 2.513c0 1.483 1.078 2.91 1.228 3.111.15.201 2.122 3.24 5.141 4.545.718.31 1.279.495 1.716.634.721.229 1.377.197 1.896.12.578-.086 1.782-.728 2.033-1.431.25-.702.25-1.304.175-1.43-.075-.126-.275-.201-.576-.351z"/></svg>
  `;
  document.body.appendChild(btn);
}

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

/* --- Mobile Drawer Menu (Strict Scroll Lock) --- */
function initMobileDrawer() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.mobile-nav-overlay');
  const closeBtn = document.querySelector('.close-drawer-btn');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburgerBtn || !drawer || !overlay) return;

  function preventTouch(e) {
    if (drawer.contains(e.target)) return;
    e.preventDefault();
  }

  function openDrawer() {
    drawer.classList.add('active');
    overlay.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    
    document.documentElement.classList.add('mobile-nav-open');
    document.body.classList.add('mobile-nav-open');
    document.body.style.overflow = 'hidden';
    window.addEventListener('touchmove', preventTouch, { passive: false });
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    
    document.documentElement.classList.remove('mobile-nav-open');
    document.body.classList.remove('mobile-nav-open');
    document.body.style.overflow = '';
    window.removeEventListener('touchmove', preventTouch);
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

/* --- Dynamic Project & Payment Modal System --- */
function initProjectModal() {
  if (document.getElementById('projectModal')) return;

  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.id = 'projectModal';
  modalOverlay.setAttribute('role', 'dialog');
  modalOverlay.setAttribute('aria-modal', 'true');
  modalOverlay.setAttribute('aria-labelledby', 'projectModalTitle');
  modalOverlay.style.zIndex = '100000';

  modalOverlay.innerHTML = `
    <div class="modal-card glass-card" style="max-width:760px;width:95%;max-height:90vh;overflow-y:auto;padding:2rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;border-bottom:1px solid var(--border-light);padding-bottom:1rem;">
        <div>
          <span class="badge" style="background:rgba(6,182,212,0.15);color:var(--primary);margin-bottom:0.25rem;display:inline-block;">Yugvex Client Portal</span>
          <h3 id="projectModalTitle" style="margin:0;font-family:var(--font-heading);font-size:1.4rem;color:var(--text-main);">Request Project & Book Online</h3>
        </div>
        <button class="modal-close-btn" id="closeProjectModalBtn" aria-label="Close Project Modal" style="font-size:1.8rem;background:transparent;border:none;color:#fff;cursor:pointer;">&times;</button>
      </div>

      <form id="projectRequestForm">
        <!-- Step 1: User & Business Contact Details (First Step) -->
        <div style="background:rgba(15,23,42,0.6);padding:1.25rem;border-radius:var(--radius-md);border:1px solid var(--border-light);margin-bottom:1.25rem;">
          <h4 style="color:var(--primary);margin-bottom:1rem;font-size:1.05rem;display:flex;align-items:center;gap:0.5rem;">
            <span style="background:var(--primary);color:#000;width:24px;height:24px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;">1</span>
            Your Contact & Business Details
          </h4>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
            <div>
              <label for="projClientName" style="display:block;font-size:0.82rem;color:var(--text-muted);margin-bottom:0.35rem;font-weight:600;">Client Full Name *</label>
              <input type="text" id="projClientName" required placeholder="e.g. Omkar Sharma" style="width:100%;padding:0.7rem;background:rgba(30,41,59,0.9);border:1px solid var(--border-light);color:#fff;border-radius:var(--radius-sm);">
            </div>
            <div>
              <label for="projClientPhone" style="display:block;font-size:0.82rem;color:var(--text-muted);margin-bottom:0.35rem;font-weight:600;">WhatsApp Mobile Number *</label>
              <input type="tel" id="projClientPhone" required placeholder="e.g. 9876543210" style="width:100%;padding:0.7rem;background:rgba(30,41,59,0.9);border:1px solid var(--border-light);color:#fff;border-radius:var(--radius-sm);">
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
            <div>
              <label for="projClientEmail" style="display:block;font-size:0.82rem;color:var(--text-muted);margin-bottom:0.35rem;font-weight:600;">Email Address *</label>
              <input type="email" id="projClientEmail" required placeholder="name@company.com" style="width:100%;padding:0.7rem;background:rgba(30,41,59,0.9);border:1px solid var(--border-light);color:#fff;border-radius:var(--radius-sm);">
            </div>
            <div>
              <label for="projBusinessName" style="display:block;font-size:0.82rem;color:var(--text-muted);margin-bottom:0.35rem;font-weight:600;">Business / Store Name</label>
              <input type="text" id="projBusinessName" placeholder="e.g. Shri Hanuman Super Market" style="width:100%;padding:0.7rem;background:rgba(30,41,59,0.9);border:1px solid var(--border-light);color:#fff;border-radius:var(--radius-sm);">
            </div>
          </div>
        </div>

        <!-- Step 2: Choose Service / Plan & Project Scope -->
        <div style="background:rgba(15,23,42,0.6);padding:1.25rem;border-radius:var(--radius-md);border:1px solid var(--border-light);margin-bottom:1.25rem;">
          <h4 style="color:var(--secondary);margin-bottom:1rem;font-size:1.05rem;display:flex;align-items:center;gap:0.5rem;">
            <span style="background:var(--secondary);color:#000;width:24px;height:24px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;">2</span>
            Select Service, Plan & Scope
          </h4>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
            <div>
              <label for="projCategory" style="display:block;font-size:0.82rem;color:var(--text-muted);margin-bottom:0.35rem;font-weight:600;">Category *</label>
              <select id="projCategory" required style="width:100%;padding:0.7rem;background:rgba(30,41,59,0.9);border:1px solid var(--border-light);color:#fff;border-radius:var(--radius-sm);">
                <option value="Website Development">Website Development</option>
                <option value="Enterprise ERP & SaaS">Enterprise ERP & SaaS</option>
                <option value="AI Voice & Automation">AI Voice & Automation</option>
                <option value="Custom Web App / Software">Custom Web App / Software</option>
              </select>
            </div>

            <div>
              <label for="projPlan" style="display:block;font-size:0.82rem;color:var(--text-muted);margin-bottom:0.35rem;font-weight:600;">Choose Plan / Package *</label>
              <select id="projPlan" required style="width:100%;padding:0.7rem;background:rgba(30,41,59,0.9);border:1px solid var(--border-light);color:#fff;border-radius:var(--radius-sm);">
                <optgroup label="Website & Digital Solutions (Brochure Rates)">
                  <option value="Single-Page Starter Website (Rs. 1,500)" data-price="1500">Single-Page Starter Web — ₹1,500</option>
                  <option value="Starter Business Website (Rs. 2,999)" data-price="2999">Starter Business Web — ₹2,999</option>
                  <option value="Business Dynamic Web App (Rs. 4,999)" data-price="4999" selected>Business Web App (WhatsApp Orders) — ₹4,999</option>
                  <option value="Professional E-Commerce Portal (Rs. 9,999)" data-price="9999">Professional E-Commerce Store & Admin — ₹9,999</option>
                  <option value="Custom Enterprise Web & App Suite (Rs. 24,999)" data-price="24999">Custom Enterprise Web Suite — ₹24,999</option>
                </optgroup>
                <optgroup label="Enterprise ERP & POS Systems">
                  <option value="Pharmacy Store ERP Software (Rs. 19,999)" data-price="19999">Pharmacy Store ERP Software — ₹19,999</option>
                  <option value="Restaurant Management POS (Rs. 14,999)" data-price="14999">Restaurant POS System — ₹14,999</option>
                  <option value="Full Multi-Branch Enterprise ERP (Rs. 59,999)" data-price="59999">Full Enterprise ERP Architecture — ₹59,999</option>
                </optgroup>
                <optgroup label="AI Solutions & Automation">
                  <option value="AI Voice Telecalling Agent Bot (Rs. 29,999)" data-price="29999">AI Voice Telecaller Bot — ₹29,999</option>
                  <option value="OCR Document & Invoice Parsing AI (Rs. 34,999)" data-price="34999">Document OCR & Catalog AI — ₹34,999</option>
                </optgroup>
                <optgroup label="Mobile App Engineering">
                  <option value="Android Native Mobile App (Rs. 39,999)" data-price="39999">Android Native Mobile App — ₹39,999</option>
                  <option value="Cross-Platform iOS & Android App (Rs. 69,999)" data-price="69999">Cross-Platform iOS & Android App — ₹69,999</option>
                </optgroup>
              </select>
            </div>
          </div>

          <div style="margin-bottom:1rem;">
            <label for="projDetails" style="display:block;font-size:0.82rem;color:var(--text-muted);margin-bottom:0.35rem;font-weight:600;">Project Scope / Requirements Summary</label>
            <textarea id="projDetails" rows="2" placeholder="Describe your website features, domain name, design preferences, or specific modules needed..." style="width:100%;padding:0.7rem;background:rgba(30,41,59,0.9);border:1px solid var(--border-light);color:#fff;border-radius:var(--radius-sm);resize:vertical;"></textarea>
          </div>

          <!-- Payment Token Preset Selector -->
          <div style="margin-bottom:0.75rem;">
            <label style="display:block;font-size:0.8rem;color:var(--text-muted);margin-bottom:0.35rem;font-weight:600;">Payment Token Amount:</label>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.5rem;">
              <button type="button" class="btn btn-secondary btn-sm token-preset-btn" data-preset="2000">₹2,000 Token</button>
              <button type="button" class="btn btn-secondary btn-sm token-preset-btn" data-preset="5000">₹5,000 Token</button>
              <button type="button" class="btn btn-secondary btn-sm token-preset-btn" data-preset="10000">₹10,000 Token</button>
              <button type="button" class="btn btn-secondary btn-sm token-preset-btn" data-preset="full">Full Amount</button>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.75rem;">
            <div>
              <label for="projTotalCost" style="display:block;font-size:0.78rem;color:var(--text-muted);margin-bottom:0.25rem;font-weight:600;">Total Project Cost (₹)</label>
              <input type="number" id="projTotalCost" readonly style="width:100%;padding:0.6rem;background:rgba(30,41,59,0.8);border:1px solid var(--border-light);color:#fff;font-weight:700;border-radius:var(--radius-sm);">
            </div>

            <div>
              <label for="projAmountPaid" style="display:block;font-size:0.78rem;color:#34D399;margin-bottom:0.25rem;font-weight:600;">Token Paid Now (₹) *</label>
              <input type="number" id="projAmountPaid" required placeholder="5000" style="width:100%;padding:0.6rem;background:rgba(30,41,59,0.9);border:1px solid rgba(16,185,129,0.4);color:#34D399;font-weight:700;border-radius:var(--radius-sm);">
            </div>

            <div>
              <label for="projPendingBalance" style="display:block;font-size:0.78rem;color:#FBBF24;margin-bottom:0.25rem;font-weight:600;">Pending Balance (₹)</label>
              <input type="number" id="projPendingBalance" readonly style="width:100%;padding:0.6rem;background:rgba(30,41,59,0.8);border:1px solid var(--border-light);color:#FBBF24;font-weight:700;border-radius:var(--radius-sm);">
            </div>
          </div>
        </div>

        <!-- Step 3: Choose Payment Option (Interactive Toggle) -->
        <div style="background:rgba(15,23,42,0.6);padding:1.25rem;border-radius:var(--radius-md);border:1px solid var(--border-light);margin-bottom:1.25rem;">
          <h4 style="color:#34D399;margin-bottom:1rem;font-size:1.05rem;display:flex;align-items:center;gap:0.5rem;">
            <span style="background:#34D399;color:#000;width:24px;height:24px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;">3</span>
            Choose Payment Option
          </h4>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1.25rem;">
            <label id="optRazorpayLabel" style="background:rgba(2,132,199,0.15);border:2px solid #06B6D4;padding:0.85rem;border-radius:var(--radius-sm);cursor:pointer;display:flex;align-items:center;gap:0.75rem;">
              <input type="radio" name="payOptionToggle" value="online" checked style="accent-color:#06B6D4;width:18px;height:18px;">
              <div>
                <div style="color:#fff;font-weight:700;font-size:0.9rem;">⚡ Instant Online Payment</div>
                <div style="font-size:0.75rem;color:var(--text-muted);">Razorpay UPI, Credit/Debit Card, NetBanking (Instant Verified Receipt)</div>
              </div>
            </label>

            <label id="optQrLabel" style="background:rgba(30,41,59,0.6);border:1px solid var(--border-light);padding:0.85rem;border-radius:var(--radius-sm);cursor:pointer;display:flex;align-items:center;gap:0.75rem;">
              <input type="radio" name="payOptionToggle" value="qr" style="accent-color:#34D399;width:18px;height:18px;">
              <div>
                <div style="color:#fff;font-weight:700;font-size:0.9rem;">📷 PhonePe / UPI QR Code</div>
                <div style="font-size:0.75rem;color:var(--text-muted);">Scan QR / Bank Transfer (Issues Temporary Receipt pending admin verification)</div>
              </div>
            </label>
          </div>

          <!-- Section 3A: Razorpay Online Payment View -->
          <div id="razorpayPaymentSection" style="background:rgba(2,132,199,0.1);border:1px solid rgba(6,182,212,0.3);padding:1.25rem;border-radius:var(--radius-sm);text-align:center;">
            <button type="button" id="payViaRazorpayBtn" class="btn btn-md" style="width:100%;background:linear-gradient(135deg, #0284C7 0%, #06B6D4 100%);color:#fff;font-weight:700;box-shadow:0 4px 15px rgba(6,182,212,0.3);display:flex;align-items:center;justify-content:center;gap:0.5rem;border:none;cursor:pointer;padding:0.85rem 1rem;font-size:1rem;">
              💳 Pay Instantly via Razorpay Gateway
            </button>
            <div style="font-size:0.78rem;color:var(--text-muted);margin-top:0.5rem;">
              Instant payment verification • Auto-fills transaction ID & generates Official Verified Receipt.
            </div>
          </div>

          <!-- Section 3B: PhonePe QR Code Payment View -->
          <div id="qrPaymentSection" style="display:none;grid-template-columns:180px 1fr;gap:1.25rem;align-items:center;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);padding:1.25rem;border-radius:var(--radius-sm);">
            <div style="text-align:center;background:#fff;padding:0.6rem;border-radius:var(--radius-sm);">
              <img src="assets/images/payment-qr.jpg" alt="Razorpay & BHIM UPI QR Code - Yugvextechsolutions" style="width:100%;max-width:180px;height:auto;display:block;margin:0 auto;border-radius:6px;">
              <div style="font-size:0.72rem;color:#000;font-weight:700;margin-top:0.3rem;">Scan & Pay with Any UPI App</div>
            </div>

            <div>
              <div style="background:rgba(15,23,42,0.7);padding:0.75rem;border-radius:var(--radius-sm);margin-bottom:0.75rem;font-size:0.82rem;">
                <div style="color:#34D399;font-weight:700;">Payee Account Details:</div>
                <div style="color:#fff;">Payee Name: <strong>Yugvex Tech Solutions, Pune</strong></div>
                <div style="color:var(--text-muted);">UPI ID: <code>8484080732@ybl</code></div>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
                <div>
                  <label for="projTxnRef" style="display:block;font-size:0.78rem;color:var(--text-muted);margin-bottom:0.25rem;font-weight:600;">Transaction UTR / Ref No *</label>
                  <input type="text" id="projTxnRef" placeholder="e.g. 423984029102" style="width:100%;padding:0.6rem;background:rgba(30,41,59,0.9);border:1px solid var(--border-light);color:#fff;font-weight:600;border-radius:var(--radius-sm);">
                </div>

                <div>
                  <label for="projPayDate" style="display:block;font-size:0.78rem;color:var(--text-muted);margin-bottom:0.25rem;font-weight:600;">Payment Date</label>
                  <input type="date" id="projPayDate" style="width:100%;padding:0.6rem;background:rgba(30,41,59,0.9);border:1px solid var(--border-light);color:#fff;border-radius:var(--radius-sm);">
                </div>
              </div>

              <div style="font-size:0.75rem;color:#FBBF24;margin-top:0.5rem;line-height:1.4;">
                ℹ️ Submitting QR payment generates a <strong>Temporary Receipt</strong>. Our admin will verify your payment UTR and issue your Official Final Receipt.
              </div>
            </div>
          </div>
        </div>

        <input type="hidden" id="projPayMethod" value="Razorpay Online">

        <div style="display:flex;justify-content:flex-end;gap:1rem;">
          <button type="button" class="btn btn-secondary" id="cancelProjectModalBtn">Cancel</button>
          <button type="submit" class="btn btn-primary btn-md">Submit Request & Get Receipt →</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  // Default payment date
  const payDateInput = document.getElementById('projPayDate');
  if (payDateInput) payDateInput.value = new Date().toISOString().split('T')[0];

  const planSelect = document.getElementById('projPlan');
  const totalCostInput = document.getElementById('projTotalCost');
  const amountPaidInput = document.getElementById('projAmountPaid');
  const pendingBalInput = document.getElementById('projPendingBalance');

  function updateFinancials() {
    const selectedOpt = planSelect.options[planSelect.selectedIndex];
    const defaultPrice = parseFloat(selectedOpt.getAttribute('data-price')) || 24999;
    
    let totalCost;
    if (totalCostInput.dataset.customQuote === 'true') {
      totalCost = parseFloat(totalCostInput.value) || defaultPrice;
    } else {
      totalCost = defaultPrice;
      totalCostInput.value = totalCost;
    }

    let tokenPaid = parseFloat(amountPaidInput.value);
    if (isNaN(tokenPaid)) {
      tokenPaid = Math.min(5000, totalCost);
      amountPaidInput.value = tokenPaid;
    }
    const pending = Math.max(0, totalCost - tokenPaid);
    pendingBalInput.value = pending;
  }

  if (planSelect && totalCostInput && amountPaidInput && pendingBalInput) {
    planSelect.addEventListener('change', () => {
      totalCostInput.dataset.customQuote = 'false';
      updateFinancials();
    });
    amountPaidInput.addEventListener('input', updateFinancials);
    updateFinancials();

    // Preset Buttons
    document.querySelectorAll('.token-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const preset = btn.getAttribute('data-preset');
        const total = parseFloat(totalCostInput.value) || 24999;
        if (preset === 'full') {
          amountPaidInput.value = total;
        } else {
          amountPaidInput.value = Math.min(parseFloat(preset), total);
        }
        updateFinancials();
      });
    });
  }

  // Payment Method Option Toggle Handlers
  const optionRadios = document.querySelectorAll('input[name="payOptionToggle"]');
  const razorpaySec = document.getElementById('razorpayPaymentSection');
  const qrSec = document.getElementById('qrPaymentSection');
  const payMethodInput = document.getElementById('projPayMethod');
  const optRazorpayLabel = document.getElementById('optRazorpayLabel');
  const optQrLabel = document.getElementById('optQrLabel');
  const txnRefInput = document.getElementById('projTxnRef');

  optionRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'online') {
        razorpaySec.style.display = 'block';
        qrSec.style.display = 'none';
        payMethodInput.value = 'Razorpay Online';
        optRazorpayLabel.style.borderColor = '#06B6D4';
        optRazorpayLabel.style.background = 'rgba(2,132,199,0.15)';
        optQrLabel.style.borderColor = 'var(--border-light)';
        optQrLabel.style.background = 'rgba(30,41,59,0.6)';
        if (txnRefInput) txnRefInput.removeAttribute('required');
      } else {
        razorpaySec.style.display = 'none';
        qrSec.style.display = 'grid';
        payMethodInput.value = 'PhonePe QR / Bank Transfer';
        optQrLabel.style.borderColor = '#34D399';
        optQrLabel.style.background = 'rgba(16,185,129,0.15)';
        optRazorpayLabel.style.borderColor = 'var(--border-light)';
        optRazorpayLabel.style.background = 'rgba(30,41,59,0.6)';
        if (txnRefInput) txnRefInput.setAttribute('required', 'true');
      }
    });
  });

  // Razorpay Instant Button Listener
  const payRazorpayBtn = document.getElementById('payViaRazorpayBtn');
  if (payRazorpayBtn) {
    payRazorpayBtn.addEventListener('click', () => {
      const amount = parseFloat(amountPaidInput.value) || 5000;
      const name = document.getElementById('projClientName').value.trim();
      const email = document.getElementById('projClientEmail').value.trim();
      const phone = document.getElementById('projClientPhone').value.trim();
      const plan = document.getElementById('projPlan').value;

      if (!name || !phone || !email) {
        alert('Please enter your Name, Phone Number, and Email Address in Step 1 first.');
        return;
      }

      if (typeof window.initiateRazorpayPayment === 'function') {
        window.initiateRazorpayPayment({
          amount: amount,
          name: name,
          email: email,
          phone: phone,
          description: 'Payment for ' + plan,
          onSuccess: (response) => {
            if (txnRefInput) txnRefInput.value = response.razorpay_payment_id;
            payMethodInput.value = 'Razorpay Online';
            alert('✅ Razorpay Payment Successful!\nPayment ID: ' + response.razorpay_payment_id + '\n\nClick "Submit Request & Get Receipt" below to download your Official Verified Receipt.');
          },
          onFailure: (error) => {
            if (error && error.message && error.message !== 'Payment cancelled by user') {
              alert('Razorpay Notification: ' + (error.description || error.message || 'Payment attempt completed.'));
            }
          }
        });
      } else {
        alert('Razorpay Gateway initializing... Please try again.');
      }
    });
  }

  // Close handlers
  document.getElementById('closeProjectModalBtn').addEventListener('click', () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });
  document.getElementById('cancelProjectModalBtn').addEventListener('click', () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Form submission logic
  const reqForm = document.getElementById('projectRequestForm');
  reqForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('projClientName').value.trim();
    const phone = document.getElementById('projClientPhone').value.trim();
    const email = document.getElementById('projClientEmail').value.trim();
    const business = document.getElementById('projBusinessName').value.trim();

    const category = document.getElementById('projCategory').value;
    const plan = document.getElementById('projPlan').value;
    const details = document.getElementById('projDetails').value.trim();

    const totalAmount = parseFloat(document.getElementById('projTotalCost').value) || 24999;
    const amountPaid = parseFloat(document.getElementById('projAmountPaid').value) || 5000;
    const pendingAmount = Math.max(0, totalAmount - amountPaid);
    const payMethod = document.getElementById('projPayMethod').value;
    let txnRef = (document.getElementById('projTxnRef').value || '').trim();
    const payDate = document.getElementById('projPayDate').value;

    const selectedOption = document.querySelector('input[name="payOptionToggle"]:checked').value;

    // If online option selected but Razorpay payment was not run yet
    if (selectedOption === 'online' && !txnRef) {
      alert('Please click "💳 Pay Instantly via Razorpay Gateway" to complete your online payment first, or choose PhonePe QR code.');
      return;
    }

    if (selectedOption === 'qr' && !txnRef) {
      alert('Please enter your Transaction UTR / Ref No for PhonePe QR payment verification.');
      return;
    }

    const reqId = 'YUG-REQ-' + Math.floor(100000 + Math.random() * 900000);

    const isVerifiedOnline = (selectedOption === 'online' && txnRef.startsWith('pay_'));
    const status = isVerifiedOnline ? 'Verified & Confirmed' : 'Pending Verification';
    const isTemporary = !isVerifiedOnline;

    const newRequest = {
      id: reqId,
      category,
      plan,
      name,
      phone,
      email,
      business,
      details,
      totalAmount,
      amount: amountPaid,
      pendingAmount,
      txnRef,
      payMethod: isVerifiedOnline ? 'Razorpay Online' : payMethod,
      payDate,
      status,
      isTemporary,
      submittedAt: new Date().toISOString()
    };

    try {
      if (window.CloudflareStorage && typeof window.CloudflareStorage.saveProjectRequest === 'function') {
        window.CloudflareStorage.saveProjectRequest(newRequest);
      } else {
        const existingReqs = JSON.parse(localStorage.getItem('yugvex_project_requests') || '[]');
        existingReqs.unshift(newRequest);
        localStorage.setItem('yugvex_project_requests', JSON.stringify(existingReqs));
      }
    } catch (err) {
      console.warn('Storage error:', err);
    }

    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';

    showProjectSubmissionSuccess(newRequest);
    reqForm.reset();
  });
}

function showProjectSubmissionSuccess(reqData) {
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay active';
  modalOverlay.style.zIndex = '100005';

  const isTemp = reqData.isTemporary || reqData.status === 'Pending Verification';
  const receiptTitle = isTemp ? 'Temporary Provisional Receipt' : 'Official Verified Receipt';
  const headline = isTemp ? 'Project Request Submitted! (Temporary Receipt)' : 'Project Request & Payment Verified!';

  const whatsappMsg = `*YUGVEX TECH SOLUTIONS - PROJECT REQUEST SUBMISSION*%0A%0A` +
    `🔖 *Request ID:* ${reqData.id}%0A` +
    `👤 *Client Name:* ${encodeURIComponent(reqData.name)}%0A` +
    `📞 *WhatsApp:* ${encodeURIComponent(reqData.phone)}%0A` +
    `📦 *Plan:* ${encodeURIComponent(reqData.plan)}%0A` +
    `💰 *Total Project Cost:* Rs. ${reqData.totalAmount}%0A` +
    `⚡ *Token Amount Paid:* Rs. ${reqData.amount}%0A` +
    `⏳ *Pending Balance:* Rs. ${reqData.pendingAmount}%0A` +
    `💳 *Txn UTR:* ${encodeURIComponent(reqData.txnRef)}%0A` +
    `📌 *Status:* ${encodeURIComponent(reqData.status)}%0A` +
    `👤 *Payee Account:* Yugvex Tech Solutions, Pune%0A%0A` +
    (isTemp ? `_Please verify payment UTR and send my confirmed Official PDF receipt on WhatsApp._` : `_My payment is verified. Please confirm my project onboarding schedule._`);

  const whatsappUrl = `https://wa.me/917219290885?text=${whatsappMsg}`;

  modalOverlay.innerHTML = `
    <div class="modal-content glass-card" style="max-width:580px;text-align:center;padding:2.5rem 2rem;">
      <div style="width:64px;height:64px;border-radius:50%;background:${isTemp ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'var(--gradient-primary)'};margin:0 auto 1.25rem auto;display:flex;align-items:center;justify-content:center;font-size:2rem;color:#fff;">
        ${isTemp ? '📋' : '✅'}
      </div>
      <h3 style="font-size:1.4rem;margin-bottom:0.5rem;color:var(--text-main);">${headline}</h3>
      
      <div style="background:${isTemp ? 'rgba(245,158,11,0.12)' : 'rgba(6,182,212,0.1)'};border:1px solid ${isTemp ? 'rgba(245,158,11,0.3)' : 'rgba(6,182,212,0.3)'};padding:0.85rem;border-radius:var(--radius-sm);margin-bottom:1.25rem;font-size:0.88rem;text-align:left;">
        <div>Tracking Request ID: <strong style="color:var(--primary);">${reqData.id}</strong></div>
        <div>Total Valuation: <strong style="color:#fff;">₹${reqData.totalAmount}</strong></div>
        <div>Token Paid: <strong style="color:#34D399;">₹${reqData.amount}</strong></div>
        <div>Pending Balance: <strong style="color:#FBBF24;">₹${reqData.pendingAmount}</strong></div>
        <div>Payment Status: <strong style="color:${isTemp ? '#FBBF24' : '#34D399'};">${reqData.status}</strong></div>
      </div>

      <p style="color:var(--text-muted);font-size:0.88rem;line-height:1.6;margin-bottom:1.5rem;">
        ${isTemp 
          ? `Thank you <strong>${escapeHTML(reqData.name)}</strong>. Your payment UTR (<code>${escapeHTML(reqData.txnRef)}</code>) has been logged. A <strong>Temporary Provisional Receipt</strong> has been generated. Once our operations team verifies your payment, your Official Verified Receipt will be issued.`
          : `Thank you <strong>${escapeHTML(reqData.name)}</strong>. Your online payment has been instantly verified via Razorpay. Your Official Final Receipt is ready below.`
        }
      </p>

      <div style="display:flex;flex-direction:column;gap:0.75rem;">
        <button class="btn btn-primary btn-md" onclick="downloadClientRequestPDF('${reqData.id}')" style="width:100%;justify-content:center;">
          📄 Download ${receiptTitle}
        </button>
        <a href="${whatsappUrl}" target="_blank" class="btn btn-secondary btn-md" style="width:100%;justify-content:center;border-color:#25D366;color:#25D366;">
          💬 Share Request on WhatsApp ↗
        </a>
        <button class="btn btn-secondary btn-md" onclick="this.closest('.modal-overlay').remove()">
          Done
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modalOverlay);
}



// Global PDF Receipt Download function - Enhanced Corporate Format
window.downloadClientRequestPDF = function(reqId) {
  let req = null;
  const reqs = JSON.parse(localStorage.getItem('yugvex_project_requests') || '[]');
  req = reqs.find(r => r.id === reqId);

  if (!req) {
    const txns = JSON.parse(localStorage.getItem('yugvex_transactions') || '[]');
    const txn = txns.find(t => t.id === reqId);
    if (txn) {
      req = {
        id: txn.id,
        name: txn.clientName,
        phone: txn.clientPhone,
        email: txn.email || 'client@yugvex.com',
        business: txn.companyName,
        plan: txn.requirementCategory,
        totalAmount: txn.totalAmount,
        amount: txn.tokenPaid,
        pendingAmount: txn.pendingAmount,
        txnRef: txn.txnRef,
        payMethod: txn.paymentMethod,
        payDate: txn.dueDate || new Date().toISOString().split('T')[0]
      };
    }
  }

  if (!req) {
    alert("Request or transaction record not found.");
    return;
  }

  const jsPDF = window.jspdf ? window.jspdf.jsPDF : (window.jsPDF ? window.jsPDF : null);

  if (jsPDF) {
    const doc = new jsPDF('p', 'mm', 'a4');

    // Page Background: Crisp Clean White
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F');

    // Top Header Banner (Dark Navy Blue Block)
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 36, 'F');

    // Electric Cyan Accent Line
    doc.setFillColor(6, 182, 212);
    doc.rect(0, 36, 210, 2, 'F');

    // Company Brand Name & Subtitle
    doc.setFont("helvetica", "bold");
    doc.setTextColor(6, 182, 212);
    doc.setFontSize(20);
    doc.text("YUGVEX TECH SOLUTIONS", 14, 16);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(203, 213, 225);
    doc.setFontSize(9);
    doc.text("Enterprise Software, ERP Architectures & Cloud Technologies", 14, 23);
    doc.text("GST Compliant Tax Invoice & Financial Payment Receipt", 14, 28);

    const isTempReceipt = (req.isTemporary === true || req.status === 'Pending Verification');

    // Official or Provisional Receipt Badge (Right Header)
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(128, 10, 68, 18, 3, 3, 'F');
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9.5);
    doc.text(isTempReceipt ? "PROVISIONAL RECEIPT" : "OFFICIAL RECEIPT", 133, 17);
    doc.setFontSize(7.5);
    doc.setTextColor(isTempReceipt ? 251 : 52, isTempReceipt ? 191 : 211, isTempReceipt ? 36 : 153);
    doc.text(isTempReceipt ? "STATUS: PENDING ADMIN VERIFICATION" : "STATUS: VERIFIED & CONFIRMED", 130, 23);

    if (isTempReceipt) {
      doc.setFillColor(254, 243, 199);
      doc.rect(0, 36, 210, 6, 'F');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(180, 83, 9);
      doc.text("⚠️ TEMPORARY RECEIPT — PENDING MANUAL ADMIN VERIFICATION & UTR CONFIRMATION", 26, 40.2);
    }

    // Receipt Meta Info Bar
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 46, 182, 16, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, 46, 182, 16, 2, 2, 'D');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text("Receipt ID:", 18, 56);
    doc.setTextColor(15, 23, 42);
    doc.text(String(req.id), 38, 56);

    doc.setTextColor(71, 85, 105);
    doc.text("Date:", 85, 56);
    doc.setTextColor(15, 23, 42);
    doc.text(String(req.payDate || new Date().toISOString().split('T')[0]), 95, 56);

    doc.setTextColor(71, 85, 105);
    doc.text("Payment Ref / UTR:", 135, 56);
    doc.setTextColor(15, 23, 42);
    doc.text(String(req.txnRef || 'PENDING-UTR'), 168, 56);

    // Two Column Grid Box for Issuer & Client Info
    // Box 1: Issuer Details (Left)
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, 66, 88, 48, 2, 2, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(14, 66, 88, 48, 2, 2, 'D');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(6, 182, 212);
    doc.text("ISSUER DETAILS / COMPANY", 18, 73);

    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text("Yugvex Tech Solutions", 18, 80);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text("Corporate Offices: Pune & Nanded, Maharashtra", 18, 86);
    doc.text("Payee Account: Yugvex Tech Solutions, Pune", 18, 92);
    doc.text("Support Desk: support@yugvex.site", 18, 98);
    doc.text("Official Website: www.yugvex.site", 18, 104);
    doc.text("Contact Support: +91 8484080732", 18, 110);

    // Box 2: Client Details (Right)
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(108, 66, 88, 48, 2, 2, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(108, 66, 88, 48, 2, 2, 'D');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(6, 182, 212);
    doc.text("BILLED TO / CLIENT DETAILS", 112, 73);

    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(String(req.name || 'Valued Client'), 112, 80);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(`Phone / WhatsApp: +${req.phone || 'N/A'}`, 112, 86);
    doc.text(`Email: ${req.email || 'N/A'}`, 112, 92);
    doc.text(`Business Name: ${req.business || 'Individual'}`, 112, 98);
    doc.text(`Payment Method: ${req.payMethod || 'PhonePe / UPI QR'}`, 112, 104);
    doc.text("Payee: Yugvex Tech Solutions, Pune", 112, 110);

    // Financial Table Header Box
    doc.setFillColor(15, 23, 42);
    doc.rect(14, 122, 182, 10, 'F');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text("SL", 18, 128.5);
    doc.text("SERVICE / PROJECT DESCRIPTION", 32, 128.5);
    doc.text("AGREED VALUE", 110, 128.5);
    doc.text("PAID NOW", 145, 128.5);
    doc.text("BALANCE DUE", 172, 128.5);

    // Financial Table Content Row
    doc.setFillColor(255, 255, 255);
    doc.rect(14, 132, 182, 16, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, 132, 182, 16, 'D');

    const totalVal = parseFloat(req.totalAmount || req.amount || 0);
    const tokenVal = parseFloat(req.amount || 0);
    const pendingVal = parseFloat(req.pendingAmount || (totalVal - tokenVal));

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text("01", 18, 142);
    doc.text(String(req.plan || 'Custom Enterprise Software / ERP System'), 32, 142);
    doc.text(`Rs. ${totalVal.toLocaleString('en-IN')}`, 110, 142);

    doc.setTextColor(5, 150, 105);
    doc.text(`Rs. ${tokenVal.toLocaleString('en-IN')}`, 145, 142);

    doc.setTextColor(pendingVal > 0 ? 225 : 5, pendingVal > 0 ? 29 : 150, pendingVal > 0 ? 72 : 105);
    doc.text(`Rs. ${pendingVal.toLocaleString('en-IN')}`, 172, 142);

    // Financial Summary Totals Card
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(108, 154, 88, 38, 2, 2, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(108, 154, 88, 38, 2, 2, 'D');

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text("Total Agreed Valuation:", 112, 162);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(`Rs. ${totalVal.toLocaleString('en-IN')}`, 168, 162);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text("Amount Paid / Token Received:", 112, 170);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(5, 150, 105);
    doc.text(`Rs. ${tokenVal.toLocaleString('en-IN')}`, 168, 170);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text("Remaining Outstanding Balance:", 112, 178);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(pendingVal > 0 ? 225 : 5, pendingVal > 0 ? 29 : 150, pendingVal > 0 ? 72 : 105);
    doc.text(`Rs. ${pendingVal.toLocaleString('en-IN')}`, 168, 178);

    doc.setFillColor(isTempReceipt ? 180 : 15, isTempReceipt ? 83 : 23, isTempReceipt ? 9 : 42);
    doc.rect(108, 184, 88, 8, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text(isTempReceipt ? "PAYMENT PENDING ADMIN VERIFY" : "NET PAYMENT CONFIRMED", 112, 189.5);

    // Terms & Security Notice (Left Side)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text("SECURITY & TRANSACTION GUARANTEE", 14, 160);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text("1. Temporary receipts require manual UTR verification before issuing final seal.", 14, 166);
    doc.text("2. Payments processed via Bank UPI / PhonePe Business QR / Razorpay Gateway.", 14, 171);
    doc.text("3. Protected by 256-Bit SSL encryption & zero-trust compliance standards.", 14, 176);
    doc.text("4. Payee Account: Yugvex Tech Solutions, Pune.", 14, 181);
    doc.text("5. Contact Support: +91 8484080732 | katturwaroma313@gmail.com", 14, 186);

    // Official Stamp & Authorised Signatory Seal
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, 200, 182, 34, 3, 3, 'F');
    doc.setDrawColor(isTempReceipt ? 217 : 6, isTempReceipt ? 119 : 182, isTempReceipt ? 6 : 212);
    doc.roundedRect(14, 200, 182, 34, 3, 3, 'D');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(isTempReceipt ? 180 : 6, isTempReceipt ? 83 : 182, isTempReceipt ? 9 : 212);
    doc.text(isTempReceipt ? "PROVISIONAL RECEIPT & PENDING VERIFICATION" : "AUTHORIZED DIGITAL SIGNATURE & CORPORATE SEAL", 18, 208);

    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text("Yugvex Tech Solutions - Operations & Finance", 18, 216);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text("Authorized Verification Desk • Corporate Office, Pune & Nanded", 18, 222);
    doc.text("System Verification Timestamp: " + new Date().toLocaleString(), 18, 228);

    // Decorative Digital Stamp Box
    doc.setFillColor(isTempReceipt ? 217 : 5, isTempReceipt ? 119 : 150, isTempReceipt ? 6 : 105);
    doc.roundedRect(145, 205, 45, 24, 2, 2, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(isTempReceipt ? "YUGVEX PENDING" : "YUGVEX SECURE", 147, 213);
    doc.text(isTempReceipt ? "⚡ UNVERIFIED ⚡" : "★ VERIFIED ★", 147, 219);
    doc.setFontSize(7);
    doc.text(isTempReceipt ? "ADMIN VERIFY" : "PAYMENT STAMP", 148, 224);

    // Bottom Page Footer Line
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 275, 196, 275);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text("Yugvex Tech Solutions • Enterprise Software & SaaS Solutions • Nanded, Maharashtra • www.yugvex.com", 14, 281);

    const docName = isTempReceipt ? `Yugvex_Provisional_Receipt_${req.id}.pdf` : `Yugvex_Official_Receipt_${req.id}.pdf`;
    doc.save(docName);
  } else {
    window.print();
  }
};

/* --- Dynamic Modals System --- */
function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove('active');
  document.body.style.overflow = '';
}

function initModals() {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-modal-target]');
    if (trigger) {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      const targetModal = document.getElementById(targetId);
      if (targetModal) {
        const payloadTitle = trigger.getAttribute('data-modal-title');
        if (payloadTitle) {
          const titleEl = targetModal.querySelector('.modal-dynamic-title');
          if (titleEl) titleEl.textContent = payloadTitle;
        }

        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
      return;
    }

    const closeBtn = e.target.closest('.modal-close-btn');
    if (closeBtn) {
      const activeModal = closeBtn.closest('.modal-overlay');
      if (activeModal) closeModal(activeModal);
      return;
    }

    if (e.target && e.target.classList && e.target.classList.contains('modal-overlay')) {
      closeModal(e.target);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(overlay => {
        closeModal(overlay);
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

/* --- Form Validation, Anti-Spam, Storage & WhatsApp Dispatch --- */
function initFormsAndToasts() {
  const forms = document.querySelectorAll('form:not(#projectRequestForm):not(#authForm)');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const now = Date.now();
      if (now - lastFormSubmitTime < 5000) {
        showToast('Please wait a few seconds before submitting another request.', 'error');
        return;
      }

      const requiredInputs = form.querySelectorAll('[required]');
      let isValid = true;

      requiredInputs.forEach(input => {
        const val = input.value.trim();
        if (!val) {
          isValid = false;
          input.style.borderColor = '#ef4444';
        } else {
          input.style.borderColor = '';
        }
      });

      if (!isValid) {
        showToast('Please complete all required fields.', 'error');
        return;
      }

      lastFormSubmitTime = Date.now();

      // Extract form fields
      const nameInput = form.querySelector('input[type="text"]:not([style*="display:none"])');
      const emailInput = form.querySelector('input[type="email"]');
      const phoneInput = form.querySelector('input[type="tel"]');
      const msgInput = form.querySelector('textarea');
      const modalTitleEl = form.closest('.modal-content') ? form.closest('.modal-content').querySelector('.modal-dynamic-title') : null;

      const clientName = nameInput ? nameInput.value.trim() : 'Valued Client';
      const clientEmail = emailInput ? emailInput.value.trim() : 'N/A';
      const clientPhone = phoneInput ? phoneInput.value.trim() : 'N/A';
      const requirements = msgInput ? msgInput.value.trim() : 'General Inquiry';
      const inquiryCategory = modalTitleEl ? modalTitleEl.textContent.trim() : (form.id || 'Website Inquiry');

      const inqId = 'YUG-INQ-' + Math.floor(100000 + Math.random() * 900000);

      const inqData = {
        id: inqId,
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        category: inquiryCategory,
        plan: 'Inquiry / Proposal Request',
        details: requirements,
        totalAmount: 0,
        amount: 0,
        pendingAmount: 0,
        txnRef: 'INQUIRY-ONLY',
        payMethod: 'Pending Consultation',
        payDate: new Date().toISOString().split('T')[0],
        status: 'New Lead',
        isTemporary: true,
        submittedAt: new Date().toISOString()
      };

      try {
        if (window.CloudflareStorage && typeof window.CloudflareStorage.saveProjectRequest === 'function') {
          window.CloudflareStorage.saveProjectRequest(inqData);
        } else {
          const existingReqs = JSON.parse(localStorage.getItem('yugvex_project_requests') || '[]');
          existingReqs.unshift(inqData);
          localStorage.setItem('yugvex_project_requests', JSON.stringify(existingReqs));
        }
      } catch (err) {
        console.warn('Storage sync error:', err);
      }

      showToast(`Thank you, ${clientName}! Your inquiry has been received.`, 'success');

      const parentModal = form.closest('.modal-overlay');
      if (parentModal) closeModal(parentModal);

      // Offer direct WhatsApp forward
      const msg = `*YUGVEX TECH SOLUTIONS - NEW INQUIRY*%0A%0A` +
        `👤 *Name:* ${encodeURIComponent(clientName)}%0A` +
        `📞 *Phone:* ${encodeURIComponent(clientPhone)}%0A` +
        `✉️ *Email:* ${encodeURIComponent(clientEmail)}%0A` +
        `📌 *Inquiry Category:* ${encodeURIComponent(inquiryCategory)}%0A` +
        `📝 *Requirement:* ${encodeURIComponent(requirements)}%0A%0A` +
        `_Please provide project details and estimation._`;

      const forwardWhatsapp = confirm(`✅ Inquiry recorded successfully!\n\nWould you like to send your inquiry directly to Yugvex Tech Solutions on WhatsApp for priority response?`);
      if (forwardWhatsapp) {
        window.open(`https://wa.me/918484080732?text=${msg}`, '_blank');
      }

      form.reset();
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
  if (localStorage.getItem('yugvex_cookie_accepted')) return;

  const banner = document.createElement('div');
  banner.className = 'glass-card cookie-banner-card';
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
    localStorage.setItem('yugvex_cookie_accepted', 'true');
    banner.remove();
  });
}

function setCurrentYear() {
  const yearEls = document.querySelectorAll('.current-year');
  const currYear = new Date().getFullYear();
  yearEls.forEach(el => el.textContent = currYear);
}

/* --- Instant Quotation Generator & Project Cost Calculator Engine --- */
/* --- Instant Quotation Generator & Project Cost Calculator Engine --- */
function initQuotationModal() {
  if (document.getElementById('quotationModal')) return;

  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.id = 'quotationModal';
  modalOverlay.setAttribute('role', 'dialog');
  modalOverlay.setAttribute('aria-modal', 'true');
  modalOverlay.setAttribute('aria-labelledby', 'quotationModalTitle');
  modalOverlay.style.zIndex = '100002';

  modalOverlay.innerHTML = `
    <div class="modal-content glass-card quote-modal-card" style="max-width:920px;width:95%;max-height:92vh;overflow-y:auto;padding:2rem;position:relative;border:1px solid rgba(6,182,212,0.4);box-shadow:0 10px 40px rgba(0,0,0,0.6);">
      <div class="quote-modal-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;border-bottom:1px solid var(--border-light);padding-bottom:1rem;position:relative;">
        <div class="quote-header-info">
          <span class="badge quote-badge" style="background:rgba(6,182,212,0.15);color:var(--primary);border:1px solid rgba(6,182,212,0.3);margin-bottom:0.35rem;display:inline-block;font-weight:700;padding:0.25rem 0.6rem;">Yugvex Tech Solutions • Pune & Nanded</span>
          <h3 id="quotationModalTitle" class="quote-modal-title" style="margin:0;font-family:var(--font-heading);font-size:1.5rem;color:var(--text-main);">🧮 Instant Project Quotation & Cost Calculator</h3>
          <p class="quote-modal-sub" style="font-size:0.82rem;color:var(--text-muted);margin:0.2rem 0 0 0;">Select your custom tech requirements to generate an official 2-Page corporate proposal PDF.</p>
        </div>
        <button class="modal-close-btn" id="closeQuotationModalBtn" aria-label="Close Quotation Modal" style="font-size:1.8rem;background:transparent;border:none;color:#fff;cursor:pointer;padding:0.2rem 0.6rem;">&times;</button>
      </div>

      <div class="quote-modal-body-grid" style="display:grid;grid-template-columns:1.2fr 0.8fr;gap:1.5rem;align-items:start;">
        
        <!-- Left Side: Selection Controls -->
        <div class="quote-controls-column">
          <!-- Step 1: Base Service Selection -->
          <div class="quote-step-card" style="background:rgba(15,23,42,0.7);padding:1.1rem;border-radius:var(--radius-md);border:1px solid var(--border-light);margin-bottom:1rem;">
            <h4 style="color:var(--primary);margin-bottom:0.75rem;font-size:0.95rem;font-weight:700;display:flex;align-items:center;gap:0.4rem;">
              <span>🌐 1. Select Primary Service Package *</span>
            </h4>
            <select id="quoteBasePackage" class="quote-select" style="width:100%;padding:0.75rem;background:rgba(30,41,59,0.95);border:1px solid var(--border-light);color:#fff;border-radius:var(--radius-sm);font-size:0.9rem;font-weight:600;">
              <optgroup label="Website & Digital Solutions (From Official Brochure)">
                <option value="Single-Page Starter Website" data-price="1500">Starter Landing Page — ₹1,500</option>
                <option value="Starter Business Website" data-price="2999">Business Starter Web — ₹2,999</option>
                <option value="Business Dynamic Web App" data-price="4999" selected>Business Web App (WhatsApp Orders) — ₹4,999</option>
                <option value="Professional E-Commerce Portal" data-price="9999">Professional E-Commerce Store & Admin — ₹9,999</option>
                <option value="Custom Enterprise Web & App Suite" data-price="24999">Custom Enterprise Web & Mobile Suite — ₹24,999</option>
              </optgroup>
              <optgroup label="Enterprise ERP & POS Systems">
                <option value="Pharmacy Store ERP Software" data-price="19999">Pharmacy Store ERP (Batch Expiry & GST) — ₹19,999</option>
                <option value="Restaurant Management & POS" data-price="14999">Restaurant POS (Table QR & KOT) — ₹14,999</option>
                <option value="Full Multi-Branch Enterprise ERP" data-price="59999">Multi-Branch Enterprise ERP Architecture — ₹59,999</option>
              </optgroup>
              <optgroup label="AI Innovations & Automation">
                <option value="AI Voice Telecalling Agent Bot" data-price="29999">AI Voice Telecalling Agent Bot — ₹29,999</option>
                <option value="OCR Document & Invoice Parsing AI" data-price="34999">Document OCR & Catalog AI Parser — ₹34,999</option>
                <option value="Custom Enterprise AI Model" data-price="45000">Custom Enterprise AI Neural Solution — ₹45,000</option>
              </optgroup>
              <optgroup label="Mobile App Engineering">
                <option value="Android Native Mobile App" data-price="39999">Android Native Mobile App — ₹39,999</option>
                <option value="Cross-Platform iOS & Android App" data-price="69999">Cross-Platform iOS & Android App — ₹69,999</option>
              </optgroup>
            </select>
          </div>

          <!-- Step 2: Custom Add-on Modules -->
          <div class="quote-step-card" style="background:rgba(15,23,42,0.7);padding:1.1rem;border-radius:var(--radius-md);border:1px solid var(--border-light);margin-bottom:1rem;">
            <h4 style="color:var(--secondary);margin-bottom:0.75rem;font-size:0.95rem;font-weight:700;display:flex;align-items:center;gap:0.4rem;">
              <span>🧩 2. Choose Custom Add-on Modules</span>
            </h4>
            <div class="quote-addons-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:0.65rem;font-size:0.82rem;">
              <label class="quote-addon-label" style="display:flex;align-items:center;gap:0.4rem;color:var(--text-muted);cursor:pointer;background:rgba(30,41,59,0.6);padding:0.45rem;border-radius:4px;border:1px solid rgba(255,255,255,0.05);">
                <input type="checkbox" class="quote-addon-cb" data-addon="Custom UI/UX Design System & Wireframes" data-price="4999" style="accent-color:var(--primary);">
                <span>UI/UX Design (+₹4,999)</span>
              </label>
              <label class="quote-addon-label" style="display:flex;align-items:center;gap:0.4rem;color:var(--text-muted);cursor:pointer;background:rgba(30,41,59,0.6);padding:0.45rem;border-radius:4px;border:1px solid rgba(255,255,255,0.05);">
                <input type="checkbox" class="quote-addon-cb" data-addon="Razorpay Online Payment Gateway" data-price="2999" checked style="accent-color:var(--primary);">
                <span>Razorpay Gateway (+₹2,999)</span>
              </label>
              <label class="quote-addon-label" style="display:flex;align-items:center;gap:0.4rem;color:var(--text-muted);cursor:pointer;background:rgba(30,41,59,0.6);padding:0.45rem;border-radius:4px;border:1px solid rgba(255,255,255,0.05);">
                <input type="checkbox" class="quote-addon-cb" data-addon="WhatsApp Direct Order Automation Bot" data-price="3499" checked style="accent-color:var(--primary);">
                <span>WhatsApp Bot (+₹3,499)</span>
              </label>
              <label class="quote-addon-label" style="display:flex;align-items:center;gap:0.4rem;color:var(--text-muted);cursor:pointer;background:rgba(30,41,59,0.6);padding:0.45rem;border-radius:4px;border:1px solid rgba(255,255,255,0.05);">
                <input type="checkbox" class="quote-addon-cb" data-addon="Multi-Branch & Multi-Warehouse Sync" data-price="7999" style="accent-color:var(--primary);">
                <span>Multi-Warehouse (+₹7,999)</span>
              </label>
              <label class="quote-addon-label" style="display:flex;align-items:center;gap:0.4rem;color:var(--text-muted);cursor:pointer;background:rgba(30,41,59,0.6);padding:0.45rem;border-radius:4px;border:1px solid rgba(255,255,255,0.05);">
                <input type="checkbox" class="quote-addon-cb" data-addon="SEO Optimization & Google Indexing" data-price="3999" checked style="accent-color:var(--primary);">
                <span>SEO & Indexing (+₹3,999)</span>
              </label>
              <label class="quote-addon-label" style="display:flex;align-items:center;gap:0.4rem;color:var(--text-muted);cursor:pointer;background:rgba(30,41,59,0.6);padding:0.45rem;border-radius:4px;border:1px solid rgba(255,255,255,0.05);">
                <input type="checkbox" class="quote-addon-cb" data-addon="Domain, SSL & Cloud Infrastructure Setup" data-price="2499" checked style="accent-color:var(--primary);">
                <span>Domain & Cloud (+₹2,499)</span>
              </label>
              <label class="quote-addon-label quote-addon-full" style="display:flex;align-items:center;gap:0.4rem;color:var(--text-muted);cursor:pointer;grid-column:span 2;background:rgba(30,41,59,0.6);padding:0.5rem;border-radius:4px;border:1px solid rgba(255,255,255,0.05);">
                <input type="checkbox" class="quote-addon-cb" data-addon="1-Year Priority Maintenance & SLA Support" data-price="6999" style="accent-color:var(--primary);">
                <span>1-Year Priority Maintenance & Dedicated SLA Support (+₹6,999)</span>
              </label>
            </div>
          </div>

          <!-- Step 3: Timeline & Delivery Urgency -->
          <div class="quote-step-card" style="background:rgba(15,23,42,0.7);padding:1.1rem;border-radius:var(--radius-md);border:1px solid var(--border-light);margin-bottom:1rem;">
            <h4 style="color:#34D399;margin-bottom:0.75rem;font-size:0.95rem;font-weight:700;display:flex;align-items:center;gap:0.4rem;">
              <span>⚡ 3. Delivery Timeline & Sprint Speed</span>
            </h4>
            <div class="quote-urgency-grid" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.5rem;font-size:0.8rem;">
              <label class="quote-urgency-label" style="background:rgba(30,41,59,0.8);padding:0.6rem;border-radius:4px;border:1px solid var(--border-light);cursor:pointer;text-align:center;">
                <input type="radio" name="quoteUrgency" value="1.0" checked style="accent-color:#34D399;"> Standard (14-21 Days)
              </label>
              <label class="quote-urgency-label" style="background:rgba(30,41,59,0.8);padding:0.6rem;border-radius:4px;border:1px solid var(--border-light);cursor:pointer;text-align:center;">
                <input type="radio" name="quoteUrgency" value="1.15" style="accent-color:#34D399;"> Express 7-Day (+15%)
              </label>
              <label class="quote-urgency-label" style="background:rgba(30,41,59,0.8);padding:0.6rem;border-radius:4px;border:1px solid var(--border-light);cursor:pointer;text-align:center;">
                <input type="radio" name="quoteUrgency" value="1.30" style="accent-color:#34D399;"> Rush 72-Hour (+30%)
              </label>
            </div>
          </div>

          <!-- Step 4: Client Contact Details -->
          <div class="quote-step-card" style="background:rgba(15,23,42,0.7);padding:1.1rem;border-radius:var(--radius-md);border:1px solid var(--border-light);">
            <h4 style="color:#FBBF24;margin-bottom:0.75rem;font-size:0.95rem;font-weight:700;display:flex;align-items:center;gap:0.4rem;">
              <span>👤 4. Client Information (For Corporate PDF Proposal)</span>
            </h4>
            <div class="quote-client-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:0.5rem;">
              <input type="text" id="quoteClientName" placeholder="Client Full Name *" required style="width:100%;padding:0.65rem;background:rgba(30,41,59,0.95);border:1px solid var(--border-light);color:#fff;border-radius:var(--radius-sm);font-size:0.85rem;">
              <input type="tel" id="quoteClientPhone" placeholder="WhatsApp Mobile Number *" required style="width:100%;padding:0.65rem;background:rgba(30,41,59,0.95);border:1px solid var(--border-light);color:#fff;border-radius:var(--radius-sm);font-size:0.85rem;">
            </div>
            <div class="quote-client-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
              <input type="email" id="quoteClientEmail" placeholder="Email Address *" required style="width:100%;padding:0.65rem;background:rgba(30,41,59,0.95);border:1px solid var(--border-light);color:#fff;border-radius:var(--radius-sm);font-size:0.85rem;">
              <input type="text" id="quoteBusinessName" placeholder="Company / Store Name" style="width:100%;padding:0.65rem;background:rgba(30,41,59,0.95);border:1px solid var(--border-light);color:#fff;border-radius:var(--radius-sm);font-size:0.85rem;">
            </div>
          </div>
        </div>

        <!-- Right Side: Live Calculation Box & Actions -->
        <div class="quote-summary-box" style="background:linear-gradient(145deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.98) 100%);padding:1.35rem;border-radius:var(--radius-md);border:1px solid var(--primary);position:sticky;top:0;box-shadow:0 8px 30px rgba(0,0,0,0.5);">
          <h4 style="color:#fff;margin-bottom:0.75rem;font-size:1.15rem;border-bottom:1px solid var(--border-light);padding-bottom:0.5rem;display:flex;align-items:center;justify-content:space-between;">
            <span>Live Quotation Summary</span>
            <span style="font-size:0.75rem;color:var(--primary);font-weight:600;">GST Compliant</span>
          </h4>

          <div id="quoteBreakdownList" style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1rem;max-height:220px;overflow-y:auto;padding-right:0.3rem;">
            <!-- Rendered by JS -->
          </div>

          <div class="quote-total-card" style="background:rgba(6,182,212,0.12);border:1px solid rgba(6,182,212,0.3);padding:1rem;border-radius:var(--radius-sm);margin-bottom:1.25rem;text-align:center;">
            <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:0.25rem;">Total Estimated Quotation Valuation</div>
            <div id="quoteGrandTotal" style="font-size:1.85rem;font-weight:800;color:#34D399;">₹0</div>
            <div id="quoteTokenRequiredText" style="font-size:0.75rem;color:#FBBF24;font-weight:700;margin-top:0.35rem;">Token Deposit Required: ₹2,000</div>
            <div style="font-size:0.7rem;color:var(--text-subtle);margin-top:0.2rem;">Valid 30 Days • Payee: Yugvex Tech Solutions, Pune</div>
          </div>

          <div class="quote-actions-wrap" style="display:flex;flex-direction:column;gap:0.75rem;">
            <button type="button" id="downloadQuotePdfBtn" class="btn btn-primary btn-md quote-action-btn" style="width:100%;justify-content:center;font-weight:700;">
              📄 Download Official Corporate PDF Proposal
            </button>
            <button type="button" id="shareQuoteWhatsappBtn" class="btn btn-secondary btn-md quote-action-btn" style="width:100%;justify-content:center;border-color:#25D366;color:#25D366;font-weight:700;">
              💬 Share Quotation on WhatsApp ↗
            </button>
            <button type="button" id="proceedToBookFromQuoteBtn" class="btn btn-accent btn-md quote-action-btn" style="width:100%;justify-content:center;background:linear-gradient(135deg,#0284c7,#06b6d4);color:#fff;font-weight:800;box-shadow:0 4px 15px rgba(6,182,212,0.35);padding:0.85rem;">
              🚀 Book Project with this Quotation →
            </button>
          </div>
        </div>

      </div>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  // Close handlers
  const closeBtn = document.getElementById('closeQuotationModalBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Calculator Logic
  const packageSelect = document.getElementById('quoteBasePackage');
  const addonCbs = document.querySelectorAll('.quote-addon-cb');
  const urgencyRadios = document.querySelectorAll('input[name="quoteUrgency"]');
  const breakdownList = document.getElementById('quoteBreakdownList');
  const grandTotalEl = document.getElementById('quoteGrandTotal');
  const quoteTokenRequiredText = document.getElementById('quoteTokenRequiredText');

  function calculateQuotation() {
    const selectedPkgOpt = packageSelect.options[packageSelect.selectedIndex];
    const basePkgName = selectedPkgOpt.text.split('—')[0].trim();
    const basePrice = parseFloat(selectedPkgOpt.getAttribute('data-price')) || 4999;

    let addonsTotal = 0;
    const selectedAddons = [];

    addonCbs.forEach(cb => {
      if (cb.checked) {
        const name = cb.getAttribute('data-addon');
        const price = parseFloat(cb.getAttribute('data-price')) || 0;
        addonsTotal += price;
        selectedAddons.push({ name, price });
      }
    });

    let urgencyMultiplier = 1.0;
    urgencyRadios.forEach(radio => {
      if (radio.checked) urgencyMultiplier = parseFloat(radio.value) || 1.0;
    });

    const subtotal = basePrice + addonsTotal;
    const grandTotal = Math.round(subtotal * urgencyMultiplier);
    const requiredToken = Math.min(5000, Math.max(2000, Math.round(grandTotal * 0.20)));

    // Build breakdown HTML
    let html = `<div style="display:flex;justify-content:space-between;margin-bottom:0.4rem;color:#fff;font-weight:600;">
      <span>Package: ${basePkgName}</span>
      <span>₹${basePrice.toLocaleString('en-IN')}</span>
    </div>`;

    if (selectedAddons.length > 0) {
      html += `<div style="font-weight:600;color:var(--primary);margin-top:0.5rem;margin-bottom:0.25rem;">Selected Add-ons:</div>`;
      selectedAddons.forEach(item => {
        html += `<div style="display:flex;justify-content:space-between;margin-bottom:0.25rem;padding-left:0.5rem;">
          <span>• ${item.name}</span>
          <span>+₹${item.price.toLocaleString('en-IN')}</span>
        </div>`;
      });
    }

    if (urgencyMultiplier > 1.0) {
      const extraPercent = Math.round((urgencyMultiplier - 1.0) * 100);
      html += `<div style="display:flex;justify-content:space-between;margin-top:0.5rem;color:#FBBF24;font-weight:600;">
        <span>Express Delivery (+${extraPercent}%):</span>
        <span>₹${(grandTotal - subtotal).toLocaleString('en-IN')}</span>
      </div>`;
    }

    breakdownList.innerHTML = html;
    grandTotalEl.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
    quoteTokenRequiredText.textContent = `Required Booking Deposit Token: ₹${requiredToken.toLocaleString('en-IN')}`;

    return {
      basePkgName,
      basePrice,
      selectedAddons,
      addonsTotal,
      urgencyMultiplier,
      subtotal,
      grandTotal,
      requiredToken
    };
  }

  packageSelect.addEventListener('change', calculateQuotation);
  addonCbs.forEach(cb => cb.addEventListener('change', calculateQuotation));
  urgencyRadios.forEach(r => r.addEventListener('change', calculateQuotation));

  calculateQuotation();

  // Download Corporate PDF Proposal Button
  document.getElementById('downloadQuotePdfBtn').addEventListener('click', () => {
    const calcData = calculateQuotation();
    const name = document.getElementById('quoteClientName').value.trim() || 'Valued Client';
    const phone = document.getElementById('quoteClientPhone').value.trim() || 'N/A';
    const email = document.getElementById('quoteClientEmail').value.trim() || 'client@yugvex.com';
    const business = document.getElementById('quoteBusinessName').value.trim() || 'Individual';

    downloadQuotationPDF({
      calcData,
      name,
      phone,
      email,
      business
    });
  });

  // Share WhatsApp Button
  document.getElementById('shareQuoteWhatsappBtn').addEventListener('click', () => {
    const calcData = calculateQuotation();
    const name = document.getElementById('quoteClientName').value.trim() || 'Valued Client';
    
    const msg = `*YUGVEX TECH SOLUTIONS - OFFICIAL PROJECT QUOTATION*%0A%0A` +
      `👤 *Client Name:* ${encodeURIComponent(name)}%0A` +
      `📦 *Package:* ${encodeURIComponent(calcData.basePkgName)} (Rs. ${calcData.basePrice.toLocaleString('en-IN')})%0A` +
      `➕ *Add-ons Subtotal:* Rs. ${calcData.addonsTotal.toLocaleString('en-IN')}%0A` +
      `⚡ *Grand Total Valuation:* Rs. ${calcData.grandTotal.toLocaleString('en-IN')}%0A` +
      `💳 *Booking Deposit:* Rs. ${calcData.requiredToken.toLocaleString('en-IN')}%0A` +
      `🏢 *Official Payee:* Yugvex Tech Solutions, Pune%0A%0A` +
      `_Proposal valid 30 days. Contact Yugvex Tech Solutions Support Desk at +91 8484080732 for onboarding schedule._`;

    window.open(`https://wa.me/918484080732?text=${msg}`, '_blank');
  });

  // Seamless Connection: Proceed to Book Project with this Quotation
  document.getElementById('proceedToBookFromQuoteBtn').addEventListener('click', () => {
    const calcData = calculateQuotation();
    const clientName = document.getElementById('quoteClientName').value.trim();
    const clientPhone = document.getElementById('quoteClientPhone').value.trim();
    const clientEmail = document.getElementById('quoteClientEmail').value.trim();
    const businessName = document.getElementById('quoteBusinessName').value.trim();

    if (!clientName || !clientPhone || !clientEmail) {
      alert('Please enter your Client Full Name, WhatsApp Number, and Email Address before proceeding to book.');
      document.getElementById('quoteClientName').focus();
      return;
    }

    modalOverlay.classList.remove('active');

    const projectModal = document.getElementById('projectModal');
    if (projectModal) {
      projectModal.classList.add('active');
      document.body.style.overflow = 'hidden';

      // 1. Fill Step 1 Contact & Business Details
      const projClientName = document.getElementById('projClientName');
      const projClientPhone = document.getElementById('projClientPhone');
      const projClientEmail = document.getElementById('projClientEmail');
      const projBusinessName = document.getElementById('projBusinessName');

      if (projClientName) projClientName.value = clientName;
      if (projClientPhone) projClientPhone.value = clientPhone;
      if (projClientEmail) projClientEmail.value = clientEmail;
      if (projBusinessName) projBusinessName.value = businessName;

      // 2. Fill Step 2 Category, Plan & Details Scope
      const projCategory = document.getElementById('projCategory');
      const projPlan = document.getElementById('projPlan');
      const projDetails = document.getElementById('projDetails');

      if (projCategory) {
        if (calcData.basePkgName.includes('ERP') || calcData.basePkgName.includes('POS')) {
          projCategory.value = 'Enterprise ERP & SaaS';
        } else if (calcData.basePkgName.includes('AI') || calcData.basePkgName.includes('OCR')) {
          projCategory.value = 'AI Voice & Automation';
        } else if (calcData.basePkgName.includes('App')) {
          projCategory.value = 'Custom Web App / Software';
        } else {
          projCategory.value = 'Website Development';
        }
      }

      if (projPlan) {
        let matchedOpt = Array.from(projPlan.options).find(opt => opt.value.includes(calcData.basePkgName) || opt.getAttribute('data-price') == calcData.basePrice);
        if (matchedOpt) {
          projPlan.value = matchedOpt.value;
        } else {
          projPlan.value = 'Business Website Plan (Rs. 24,999)';
        }
      }

      if (projDetails) {
        const addonsList = calcData.selectedAddons.length > 0 
          ? calcData.selectedAddons.map(a => `${a.name} (+₹${a.price.toLocaleString('en-IN')})`).join(', ')
          : 'Standard Core Platform Scope';
        projDetails.value = `OFFICIAL QUOTATION BOOKING:\n• Base Package: ${calcData.basePkgName} (₹${calcData.basePrice.toLocaleString('en-IN')})\n• Add-ons Selected: [${addonsList}]\n• Delivery Speed: ${calcData.urgencyMultiplier > 1 ? (calcData.urgencyMultiplier === 1.15 ? 'Express 7-Day Sprint (+15%)' : 'Rush 72-Hour Sprint (+30%)') : 'Standard Timeline'}\n• Total Valuation: ₹${calcData.grandTotal.toLocaleString('en-IN')}\n• Deposit Token: ₹${calcData.requiredToken.toLocaleString('en-IN')}`;
      }

      // 3. Fill Step 3 Totals & Token Deposit Amount
      const projTotalCostInput = document.getElementById('projTotalCost');
      const projAmountPaidInput = document.getElementById('projAmountPaid');

      if (projTotalCostInput) {
        projTotalCostInput.value = calcData.grandTotal;
        projTotalCostInput.dataset.customQuote = 'true';
      }
      if (projAmountPaidInput) {
        projAmountPaidInput.value = calcData.requiredToken;
        projAmountPaidInput.dispatchEvent(new Event('input'));
      }
    }
  });
}

// Indian Currency Number to Words Converter Helper
function numberToWordsINR(num) {
  num = Math.round(Number(num) || 0);
  if (num === 0) return 'Zero';

  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertTwoDigits(n) {
    if (n < 20) return a[n];
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    return b[tens] + (ones ? ' ' + a[ones] : '');
  }

  function convertThreeDigits(n) {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    let str = '';
    if (hundred) str += a[hundred] + ' Hundred';
    if (rest) str += (str ? ' ' : '') + convertTwoDigits(rest);
    return str;
  }

  let words = '';
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const remaining = num;

  if (crore) words += convertTwoDigits(crore) + ' Crore ';
  if (lakh) words += convertTwoDigits(lakh) + ' Lakh ';
  if (thousand) words += convertTwoDigits(thousand) + ' Thousand ';
  if (remaining) words += convertThreeDigits(remaining);

  return words.trim();
}

// Global Official 2-Page Executive Technical Quotation PDF Generator
window.downloadQuotationPDF = function(quoteInfo) {
  const { calcData, name, phone, email, business } = quoteInfo;
  const quoteId = 'YUG-QUOTE-2026-' + Math.floor(100000 + Math.random() * 900000);
  
  const now = new Date();
  const d = String(now.getDate()).padStart(2, '0');
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const y = now.getFullYear();
  const todayFormatted = `${d}/${m}/${y}`;

  const jsPDF = window.jspdf ? window.jspdf.jsPDF : (window.jsPDF ? window.jsPDF : null);
  if (!jsPDF) {
    alert('PDF generator initializing... Please try again in a moment.');
    return;
  }

  const doc = new jsPDF('p', 'mm', 'a4');
  const grandTotal = calcData.grandTotal || 17000;
  const hostingRate = Math.min(5000, grandTotal >= 10000 ? 5000 : 0);
  const moduleRate = grandTotal - hostingRate;
  const clientBrandName = (business || name || 'Idiyaas').trim();
  const serviceName = (calcData.basePkgName || 'E-Commerce Website Development').trim();
  const totalWords = numberToWordsINR(grandTotal);

  // ==========================================
  // PAGE 1: ITEM & DESCRIPTION TABLE & SPECS
  // ==========================================
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, 'F');

  // Top Header Line
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(59, 130, 246);
  doc.text("www.yugvex.site", 15, 12);
  doc.setTextColor(100, 116, 139);
  doc.text("P a g e  1 | 2", 195, 12, { align: 'right' });

  // Main Quotation Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13.5);
  doc.setTextColor(15, 23, 42);
  const titleText = `${clientBrandName.toUpperCase()}: ${serviceName} Quotation`;
  doc.text(titleText, 15, 23);

  // Date
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Date: ${todayFormatted}`, 195, 23, { align: 'right' });

  // Bill To Block
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Bill To", 15, 33);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(`${name || clientBrandName}${business && business !== name ? ` (${business})` : ''},`, 15, 39);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(`+91 ${phone || '93076 15406'}`, 15, 45);
  doc.text("Pune, Maharashtra", 15, 51);

  // Table Configuration
  const tableTop = 57;
  const colX = [15, 26, 126, 146, 168, 195]; // [start, srNoEnd, descEnd, qtyEnd, rateEnd, amountEnd]
  const tableWidth = 180;

  // Table Header Fill & Text
  doc.setFillColor(37, 72, 132); // Deep Professional Navy/Royal Blue
  doc.rect(15, tableTop, tableWidth, 8, 'F');

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("Sr.", 17, tableTop + 3.8);
  doc.text("No", 17, tableTop + 6.8);
  doc.text("Item & Description", 66, tableTop + 5.5, { align: 'center' });
  doc.text("Qty", 136, tableTop + 5.5, { align: 'center' });
  doc.text("Rate", 157, tableTop + 5.5, { align: 'center' });
  doc.text("Amount (INR)", 181.5, tableTop + 5.5, { align: 'center' });

  // Row 1: Module / Features
  const row1Top = tableTop + 8;
  const row1Height = 118;

  doc.setFillColor(255, 255, 255);
  doc.rect(15, row1Top, tableWidth, row1Height, 'F');

  // Row 1 Item Text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("1", 20.5, row1Top + 8, { align: 'center' });
  doc.text("Module / Features", 30, row1Top + 6);

  // Row 1 Bullet list
  const defaultFeatures = [
    "Premium UI/UX Design & Responsive Website",
    "Homepage & Hero Sections",
    "Product Categories & Collection Pages",
    "Product Listing, Search, Filter & Sorting",
    "Product Details & Product Gallery",
    "Shopping Cart & Wishlist",
    "Checkout System",
    "Customer Account & Profile",
    "Admin Dashboard",
    "Product & Category Management",
    "Customer & Order Management",
    "Inventory Management",
    "Coupon & Discount Management",
    "Review Management",
    "Razorpay Payment Gateway Integration",
    "Mobile OTP Authentication",
    "Transactional Email & Order Notifications",
    "Cloudinary Image & Video Management",
    "Shipping & Order Tracking Integration",
    "SEO & Performance Optimization",
    "Production Deployment & SSL Configuration"
  ];

  // If user selected specific add-ons in calculator, include them in the feature list
  if (calcData.selectedAddons && calcData.selectedAddons.length > 0) {
    calcData.selectedAddons.forEach(ad => {
      if (!defaultFeatures.some(f => f.toLowerCase().includes(ad.name.toLowerCase()))) {
        defaultFeatures.push(ad.name);
      }
    });
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(30, 41, 59);

  let bulletY = row1Top + 11.5;
  const maxBullets = Math.min(defaultFeatures.length, 21);
  for (let i = 0; i < maxBullets; i++) {
    doc.text(`•   ${defaultFeatures[i]}`, 32, bulletY);
    bulletY += 4.8;
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("1", 136, row1Top + 14, { align: 'center' });
  doc.text(`${moduleRate.toLocaleString('en-IN')}`, 164, row1Top + 14, { align: 'right' });
  doc.setFont("helvetica", "bold");
  doc.text(`${moduleRate.toLocaleString('en-IN')}`, 191, row1Top + 14, { align: 'right' });

  // Row 2: Hosting
  const row2Top = row1Top + row1Height;
  const row2Height = 35;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("2", 20.5, row2Top + 7, { align: 'center' });
  doc.text("Hosting: Shared Server (Duration: 1 Year)", 30, row2Top + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(71, 85, 105);
  doc.text("Ram: Cloud-based serverless hosting with scalable compute resources.", 30, row2Top + 11.5);
  doc.text("Cloudflare R2: 10 GB Storage", 30, row2Top + 15.5);
  doc.text("Resend: 100 Mails/ day", 30, row2Top + 19.5);
  
  const capLines = doc.splitTextToSize("Customer Capacity: Up to approximately 5,000 registered customers on the initial database setup, depending on order history, addresses, reviews and other stored data.", 92);
  doc.text(capLines, 30, row2Top + 23.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(hostingRate > 0 ? "1 Year" : "-", 136, row2Top + 14, { align: 'center' });
  doc.text(hostingRate > 0 ? `${hostingRate.toLocaleString('en-IN')}` : "-", 164, row2Top + 14, { align: 'right' });
  doc.setFont("helvetica", "bold");
  doc.text(hostingRate > 0 ? `${hostingRate.toLocaleString('en-IN')}` : "-", 191, row2Top + 14, { align: 'right' });

  // Row 3: Annual Service
  const row3Top = row2Top + row2Height;
  const row3Height = 44;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("3", 20.5, row3Top + 7, { align: 'center' });

  const annualServiceLines = doc.splitTextToSize("Annual Service: Domain Renewal, Cloudflare Hosting, MongoDB Atlas, Cloudinary, Cloudflare R2, Resend, OTP/SMS, Razorpay, Shipping API, SSL/HTTPS.", 92);
  doc.text(annualServiceLines, 30, row3Top + 6);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.setTextColor(15, 23, 42);
  doc.text("Approx. ₹1,000–", 170, row3Top + 6);
  doc.text("₹1,500/year.", 170, row3Top + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text("Paid upgrade if required:", 170, row3Top + 15);
  
  const upgradeLines = doc.splitTextToSize("Paid upgrade based on database usage, media usage, Transaction-based, Provider-dependent, included through Cloudflare, Optional, based on support requirement.", 24);
  doc.text(upgradeLines, 170, row3Top + 19);

  // Table Grid Borders
  const totalTableHeight = 8 + row1Height + row2Height + row3Height;
  doc.setDrawColor(160, 175, 200);
  doc.setLineWidth(0.3);
  
  // Outer Border
  doc.rect(15, tableTop, tableWidth, totalTableHeight, 'S');

  // Horizontal Grid Lines
  doc.line(15, row1Top, 195, row1Top);
  doc.line(15, row2Top, 195, row2Top);
  doc.line(15, row3Top, 195, row3Top);

  // Vertical Column Dividers
  colX.forEach(x => {
    doc.line(x, tableTop, x, tableTop + totalTableHeight);
  });

  // Page 1 Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(59, 130, 246);
  doc.text("www.yugvex.site", 15, 285);
  doc.setTextColor(100, 116, 139);
  doc.text("P a g e  1 | 2", 195, 285, { align: 'right' });

  // ==========================================
  // PAGE 2: TOTALS, TERMS & CONDITIONS, SIGNATURE
  // ==========================================
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, 'F');

  // Page 2 Top Header Line
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(59, 130, 246);
  doc.text("www.yugvex.site", 15, 12);
  doc.setTextColor(100, 116, 139);
  doc.text("P a g e  2 | 2", 195, 12, { align: 'right' });

  // Summary Totals Box on Right
  const sumBoxX = 125;
  const sumBoxY = 18;
  const sumBoxW = 70;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Sub Total", sumBoxX, sumBoxY + 5);
  doc.setFont("helvetica", "bold");
  doc.text(`${grandTotal.toLocaleString('en-IN')}`, 195, sumBoxY + 5, { align: 'right' });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text("Total", sumBoxX, sumBoxY + 14);
  doc.text(`Rs. ${grandTotal.toLocaleString('en-IN')}`, 195, sumBoxY + 14, { align: 'right' });

  // Total In Words
  doc.setFont("helvetica", "bolditalic");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Total in words: ${totalWords} Rupees Only.`, 15, sumBoxY + 10);

  // Terms & Conditions Heading
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Terms & Conditions", 15, 46);

  // 10 Official Legal Clauses from PDF
  const termsList = [
    { title: "Quotation Validity:", text: " This quotation is valid for 15 days from the date of issue." },
    { title: "Project Scope:", text: " The pricing is based on the agreed scope mentioned in this quotation. Any additional features, modifications, or major changes will be charged separately." },
    { title: "Payment Terms:", text: " Payment will be made as per the mutually agreed payment schedule. Project development and delivery timelines will commence after receipt of the agreed advance payment and all required project information/materials." },
    { title: "Third-Party Services:", text: " Charges for domain registration/renewal, hosting, APIs, SMS/OTP, payment gateways, shipping services, and other third-party services will be charged separately unless specifically included in the quotation." },
    { title: "Usage-Based Charges:", text: " Payment gateway transaction fees and OTP/SMS charges will be payable separately based on actual usage and the applicable rates of the respective service providers." },
    { title: "Services:", text: " Suitable tier cloud services will be utilized wherever possible during the initial stage. If usage exceeds the applicable given limits, any required upgrades or additional charges will be borne by the client." },
    { title: "Annual Renewal & Maintenance:", text: " Applicable domain, hosting, cloud infrastructure, third-party service renewals, and optional technical maintenance charges will be effective from the second year or based on actual usage, as applicable." },
    { title: "Third-Party Dependencies:", text: " Third-party service pricing, availability, API limitations, and policies are controlled by the respective providers and may change. Real-time courier/GPS tracking is subject to availability and support from the selected logistics provider." },
    { title: "Ownership & Original Development:", text: ` The website will be developed specifically for the ${clientBrandName} brand with an original UI/UX and implementation. Competitor websites may be used only for functional and market reference; proprietary code, assets, or implementation will not be copied.` },
    { title: "Acceptance & Additional Work:", text: " The quotation will be considered accepted upon receipt of a Purchase Order, written confirmation, or advance payment. Any major feature or requirement outside the agreed scope will be estimated and quoted separately." }
  ];

  let termY = 53;
  termsList.forEach((term, index) => {
    const numPrefix = `${index + 1}. `;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    
    // Measure prefix & title width
    const prefixWidth = doc.getTextWidth(numPrefix);
    doc.text(numPrefix, 15, termY);
    doc.text(term.title, 15 + prefixWidth, termY);
    
    const titleWidth = doc.getTextWidth(term.title);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);

    // Split rest of the clause across remaining space
    const combinedLine = term.title + term.text;
    const fullWrapped = doc.splitTextToSize(numPrefix + combinedLine, 180);
    
    // Render first line and subsequent lines with clean alignment
    doc.text(term.text, 15 + prefixWidth + titleWidth, termY);
    
    if (fullWrapped.length > 1) {
      for (let j = 1; j < fullWrapped.length; j++) {
        termY += 3.8;
        doc.text(fullWrapped[j], 15, termY);
      }
    }
    termY += 5.2;
  });

  // Authority Signature Block (Bottom Right)
  const sigX = 145;
  const sigY = termY + 12;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Yugvex Tech Solution", sigX, sigY);

  // Stylized Vector Cursive Signature Drawing
  doc.setDrawColor(24, 43, 90);
  doc.setLineWidth(0.65);
  doc.lines([
    [3, -6], [4, 4], [6, -8], [4, 5], [10, -3], [5, 2], [7, -5], [8, 3], [12, -2]
  ], sigX + 4, sigY + 13);
  
  doc.setLineWidth(0.45);
  doc.lines([
    [8, 2], [22, -1], [16, 2], [12, -1]
  ], sigX + 2, sigY + 16);

  doc.setFont("helvetica", "bolditalic");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("Authorized Signature.", sigX, sigY + 24);

  // Page 2 Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(59, 130, 246);
  doc.text("www.yugvex.site", 15, 285);
  doc.setTextColor(100, 116, 139);
  doc.text("P a g e  2 | 2", 195, 285, { align: 'right' });

  // Save the generated official PDF
  const filename = `${clientBrandName.replace(/\s+/g, '_')}_Quotation_${quoteId}.pdf`;
  doc.save(filename);
};
