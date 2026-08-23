/* ==========================================================================
   Yugvex Tech Solutions - Main Application JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initThemeToggle();
  initMobileDrawer();
  initRippleEffect();
  initProjectModal();
  initMobileQuickDock();
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

/* --- Theme Toggle Engine (Light / Dark Mode) --- */
function initThemeToggle() {
  const savedTheme = localStorage.getItem('yugvex_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);

  document.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('.theme-toggle-btn');
    if (!toggleBtn) return;

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('yugvex_theme', nextTheme);
    updateThemeIcons(nextTheme);
  });
}

function updateThemeIcons(theme) {
  const themeBtns = document.querySelectorAll('.theme-toggle-btn');
  themeBtns.forEach(btn => {
    btn.innerHTML = theme === 'light' ? '🌙' : '☀️';
    btn.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`);
  });
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
        <span class="mobile-dock-icon">📞</span>
        <span>Call</span>
      </a>
      <a href="https://wa.me/917219290885" target="_blank" rel="noopener" class="mobile-dock-btn whatsapp-btn" aria-label="Chat on WhatsApp">
        <span class="mobile-dock-icon">💬</span>
        <span>WhatsApp</span>
      </a>
      <button type="button" class="mobile-dock-btn quote-btn" data-modal-target="projectModal" aria-label="Get Project Quote">
        <span class="mobile-dock-icon">⚡</span>
        <span>Get Quote</span>
      </button>
    </div>
  `;
  document.body.appendChild(dock);
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
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
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
                <option value="Starter Website Plan (Rs. 9,999)" data-price="9999">Starter Website Plan — ₹9,999</option>
                <option value="Business Website Plan (Rs. 24,999)" data-price="24999" selected>Business Website Plan — ₹24,999</option>
                <option value="Custom E-Commerce & App (Rs. 49,999)" data-price="49999">Custom E-Commerce & App — ₹49,999</option>
                <option value="Pharmacy Store ERP (Rs. 19,999)" data-price="19999">Pharmacy Store ERP — ₹19,999</option>
                <option value="Restaurant Management POS (Rs. 14,999)" data-price="14999">Restaurant Management POS — ₹14,999</option>
                <option value="Custom AI Solution Deposit (Rs. 10,000)" data-price="10000">Custom AI Solution Advance — ₹10,000</option>
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
                <div style="color:#fff;">Payee Name: <strong>GOVINDRAJ HANMANT AMBATWAR</strong></div>
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
    const totalCost = parseFloat(selectedOpt.getAttribute('data-price')) || 24999;
    totalCostInput.value = totalCost;

    let tokenPaid = parseFloat(amountPaidInput.value);
    if (isNaN(tokenPaid)) {
      tokenPaid = Math.min(5000, totalCost);
      amountPaidInput.value = tokenPaid;
    }
    const pending = Math.max(0, totalCost - tokenPaid);
    pendingBalInput.value = pending;
  }

  if (planSelect && totalCostInput && amountPaidInput && pendingBalInput) {
    planSelect.addEventListener('change', updateFinancials);
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
      const existingReqs = JSON.parse(localStorage.getItem('yugvex_project_requests') || '[]');
      existingReqs.unshift(newRequest);
      localStorage.setItem('yugvex_project_requests', JSON.stringify(existingReqs));
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
    `👤 *Payee Account:* GOVINDRAJ HANMANT AMBATWAR%0A%0A` +
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
          ? `Thank you <strong>${escapeHTML(reqData.name)}</strong>. Your payment UTR (<code>${escapeHTML(reqData.txnRef)}</code>) has been logged. A <strong>Temporary Provisional Receipt</strong> has been generated. Once Director Omkar Katturwar or CEO Govindraj Ambatwar verifies your payment, your Official Verified Receipt will be issued.`
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

/* --- Theme Switcher (Dark Mode / Bright White Light Mode) --- */
function initThemeToggle() {
  const toggleBtns = document.querySelectorAll('#themeToggleBtn, .theme-toggle-btn');
  const savedTheme = localStorage.getItem('yugvex_theme') || 'dark';

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      document.querySelectorAll('.theme-icon-dark').forEach(el => el.style.display = 'none');
      document.querySelectorAll('.theme-icon-light').forEach(el => el.style.display = 'inline');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.querySelectorAll('.theme-icon-dark').forEach(el => el.style.display = 'inline');
      document.querySelectorAll('.theme-icon-light').forEach(el => el.style.display = 'none');
    }
  }

  applyTheme(savedTheme);

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem('yugvex_theme', next);
      applyTheme(next);
    });
  });
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
    doc.text("Director: Omkar Katturwar", 18, 86);
    doc.text("Co-Founder & CEO: Govindraj Ambatwar", 18, 92);
    doc.text("Co-Founder: Nikhil Raghuwanshi", 18, 98);
    doc.text("Location: Nanded, Maharashtra - 431602", 18, 104);
    doc.text("Phone: +91 8484080732 | www.yugvex.com", 18, 110);

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
    doc.text("Payee: GOVINDRAJ HANMANT AMBATWAR", 112, 110);

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
    doc.text("4. Payee Account: GOVINDRAJ HANMANT AMBATWAR (Co-Founder & CEO).", 14, 181);
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
    doc.text("Yugvex Tech Solutions - Financial Operations Dept.", 18, 216);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text("Verified Signatories: Omkar Katturwar (Director) & Govindraj Ambatwar (CEO)", 18, 222);
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
  } else {
    window.print();
  }
};

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
  const forms = document.querySelectorAll('form:not(#projectRequestForm)');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const now = Date.now();
      if (now - lastFormSubmitTime < 10000) {
        showToast('Security Alert: Please wait 10 seconds before submitting another request.', 'error');
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

      if (isValid) {
        lastFormSubmitTime = Date.now();
        showToast('Request submitted successfully!', 'success');
        const parentModal = form.closest('.modal-overlay');
        if (parentModal) closeModal(parentModal);
        form.reset();
      } else {
        showToast('Please complete all required fields.', 'error');
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
    localStorage.setItem('yugvex_cookie_accepted', 'true');
    banner.remove();
  });
}

function setCurrentYear() {
  const yearEls = document.querySelectorAll('.current-year');
  const currYear = new Date().getFullYear();
  yearEls.forEach(el => el.textContent = currYear);
}
