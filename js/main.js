/* ==========================================================================
   Yugvex Tech Solutions - Main Application JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileDrawer();
  initRippleEffect();
  initProjectModal();
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

/* --- Dynamic Project & Payment Modal System --- */
function initProjectModal() {
  if (document.getElementById('projectModal')) return;

  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.id = 'projectModal';
  modalOverlay.style.zIndex = '100000';

  modalOverlay.innerHTML = `
    <div class="modal-card glass-card" style="max-width:740px;width:95%;max-height:90vh;overflow-y:auto;padding:2rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;border-bottom:1px solid var(--border-light);padding-bottom:1rem;">
        <div>
          <span class="badge" style="background:rgba(6,182,212,0.15);color:var(--primary);margin-bottom:0.25rem;display:inline-block;">Yugvex Client Portal</span>
          <h3 style="margin:0;font-family:var(--font-heading);font-size:1.4rem;color:#fff;">🚀 Request Project & Submit Token Payment</h3>
        </div>
        <button class="modal-close-btn" id="closeProjectModalBtn" style="font-size:1.8rem;background:transparent;border:none;color:#fff;cursor:pointer;">&times;</button>
      </div>

      <form id="projectRequestForm">
        <!-- Step 1: Project Details & Plan Selection -->
        <div style="background:rgba(15,23,42,0.6);padding:1.25rem;border-radius:var(--radius-md);border:1px solid var(--border-light);margin-bottom:1.25rem;">
          <h4 style="color:var(--primary);margin-bottom:1rem;font-size:1.05rem;">1. Select Plan & Project Details</h4>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
            <div>
              <label style="display:block;font-size:0.82rem;color:var(--text-muted);margin-bottom:0.35rem;font-weight:600;">Category *</label>
              <select id="projCategory" required style="width:100%;padding:0.7rem;background:rgba(30,41,59,0.9);border:1px solid var(--border-light);color:#fff;border-radius:var(--radius-sm);">
                <option value="Website Development">Website Development</option>
                <option value="Enterprise ERP & SaaS">Enterprise ERP & SaaS</option>
                <option value="AI Voice & Automation">AI Voice & Automation</option>
                <option value="Custom Web App / Software">Custom Web App / Software</option>
              </select>
            </div>

            <div>
              <label style="display:block;font-size:0.82rem;color:var(--text-muted);margin-bottom:0.35rem;font-weight:600;">Choose Plan / Package *</label>
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

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
            <div>
              <label style="display:block;font-size:0.82rem;color:var(--text-muted);margin-bottom:0.35rem;font-weight:600;">Client Full Name *</label>
              <input type="text" id="projClientName" required placeholder="e.g. Omkar Sharma" style="width:100%;padding:0.7rem;background:rgba(30,41,59,0.9);border:1px solid var(--border-light);color:#fff;border-radius:var(--radius-sm);">
            </div>
            <div>
              <label style="display:block;font-size:0.82rem;color:var(--text-muted);margin-bottom:0.35rem;font-weight:600;">WhatsApp Mobile Number *</label>
              <input type="tel" id="projClientPhone" required placeholder="e.g. 9876543210" style="width:100%;padding:0.7rem;background:rgba(30,41,59,0.9);border:1px solid var(--border-light);color:#fff;border-radius:var(--radius-sm);">
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
            <div>
              <label style="display:block;font-size:0.82rem;color:var(--text-muted);margin-bottom:0.35rem;font-weight:600;">Email Address *</label>
              <input type="email" id="projClientEmail" required placeholder="name@company.com" style="width:100%;padding:0.7rem;background:rgba(30,41,59,0.9);border:1px solid var(--border-light);color:#fff;border-radius:var(--radius-sm);">
            </div>
            <div>
              <label style="display:block;font-size:0.82rem;color:var(--text-muted);margin-bottom:0.35rem;font-weight:600;">Business / Store Name</label>
              <input type="text" id="projBusinessName" placeholder="e.g. Shri Hanuman Super Market" style="width:100%;padding:0.7rem;background:rgba(30,41,59,0.9);border:1px solid var(--border-light);color:#fff;border-radius:var(--radius-sm);">
            </div>
          </div>

          <div>
            <label style="display:block;font-size:0.82rem;color:var(--text-muted);margin-bottom:0.35rem;font-weight:600;">Project Scope / Requirements Summary</label>
            <textarea id="projDetails" rows="2" placeholder="Tell us about your website features, domain name, design preferences, or specific modules needed..." style="width:100%;padding:0.7rem;background:rgba(30,41,59,0.9);border:1px solid var(--border-light);color:#fff;border-radius:var(--radius-sm);resize:vertical;"></textarea>
          </div>
        </div>

        <!-- Step 2: Payment Gate (QR Code & Token Payment Breakdown) -->
        <div style="background:rgba(15,23,42,0.6);padding:1.25rem;border-radius:var(--radius-md);border:1px solid var(--border-light);margin-bottom:1.25rem;">
          <h4 style="color:#34D399;margin-bottom:1rem;font-size:1.05rem;">2. Payment QR Code & Token / Advance Payment Breakdown</h4>

          <div style="display:grid;grid-template-columns:200px 1fr;gap:1.5rem;align-items:center;">
            <div style="text-align:center;background:#fff;padding:0.75rem;border-radius:var(--radius-sm);">
              <img src="assets/images/payment-qr.jpg" alt="PhonePe QR Code" style="width:100%;max-width:180px;height:auto;display:block;margin:0 auto;border-radius:4px;">
              <div style="font-size:0.75rem;color:#000;font-weight:700;margin-top:0.4rem;">Scan & Pay via PhonePe / UPI</div>
            </div>

            <div>
              <div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);padding:0.85rem;border-radius:var(--radius-sm);margin-bottom:1rem;font-size:0.85rem;">
                <div style="color:#34D399;font-weight:700;">Official Payment Account Details:</div>
                <div style="color:#fff;margin-top:0.3rem;">Payee Name: <strong>GOVINDRAJ HANMANT AMBATWAR</strong></div>
                <div style="color:var(--text-muted);font-size:0.8rem;">UPI ID: <code>8484080732@ybl</code></div>
              </div>

              <!-- Payment Amount Options (Full vs Token) -->
              <div style="margin-bottom:0.75rem;">
                <label style="display:block;font-size:0.8rem;color:var(--text-muted);margin-bottom:0.35rem;font-weight:600;">Payment Option:</label>
                <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.5rem;">
                  <button type="button" class="btn btn-secondary btn-sm token-preset-btn" data-preset="2000">₹2,000 Token</button>
                  <button type="button" class="btn btn-secondary btn-sm token-preset-btn" data-preset="5000">₹5,000 Token</button>
                  <button type="button" class="btn btn-secondary btn-sm token-preset-btn" data-preset="10000">₹10,000 Token</button>
                  <button type="button" class="btn btn-secondary btn-sm token-preset-btn" data-preset="full">Full Amount</button>
                </div>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.75rem;margin-bottom:0.75rem;">
                <div>
                  <label style="display:block;font-size:0.78rem;color:var(--text-muted);margin-bottom:0.25rem;font-weight:600;">Total Project Cost (₹)</label>
                  <input type="number" id="projTotalCost" readonly style="width:100%;padding:0.6rem;background:rgba(30,41,59,0.8);border:1px solid var(--border-light);color:#fff;font-weight:700;border-radius:var(--radius-sm);">
                </div>

                <div>
                  <label style="display:block;font-size:0.78rem;color:#34D399;margin-bottom:0.25rem;font-weight:600;">Token Paid Now (₹) *</label>
                  <input type="number" id="projAmountPaid" required placeholder="5000" style="width:100%;padding:0.6rem;background:rgba(30,41,59,0.9);border:1px solid rgba(16,185,129,0.4);color:#34D399;font-weight:700;border-radius:var(--radius-sm);">
                </div>

                <div>
                  <label style="display:block;font-size:0.78rem;color:#FBBF24;margin-bottom:0.25rem;font-weight:600;">Pending Balance (₹)</label>
                  <input type="number" id="projPendingBalance" readonly style="width:100%;padding:0.6rem;background:rgba(30,41,59,0.8);border:1px solid var(--border-light);color:#FBBF24;font-weight:700;border-radius:var(--radius-sm);">
                </div>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
                <div>
                  <label style="display:block;font-size:0.78rem;color:var(--text-muted);margin-bottom:0.25rem;font-weight:600;">Transaction UTR / Ref No *</label>
                  <input type="text" id="projTxnRef" required placeholder="e.g. 423984029102" style="width:100%;padding:0.6rem;background:rgba(30,41,59,0.9);border:1px solid var(--border-light);color:#fff;font-weight:600;border-radius:var(--radius-sm);">
                </div>

                <div>
                  <label style="display:block;font-size:0.78rem;color:var(--text-muted);margin-bottom:0.25rem;font-weight:600;">Payment App/Method</label>
                  <select id="projPayMethod" style="width:100%;padding:0.6rem;background:rgba(30,41,59,0.9);border:1px solid var(--border-light);color:#fff;border-radius:var(--radius-sm);">
                    <option value="PhonePe QR">PhonePe QR Code</option>
                    <option value="Google Pay">Google Pay UPI</option>
                    <option value="Paytm UPI">Paytm UPI</option>
                    <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                  </select>
                </div>
              </div>
              
              <div style="margin-top:0.75rem;">
                <label style="display:block;font-size:0.78rem;color:var(--text-muted);margin-bottom:0.25rem;font-weight:600;">Payment Date</label>
                <input type="date" id="projPayDate" style="width:100%;padding:0.6rem;background:rgba(30,41,59,0.9);border:1px solid var(--border-light);color:#fff;border-radius:var(--radius-sm);">
              </div>
            </div>
          </div>
        </div>

        <div style="display:flex;justify-content:flex-end;gap:1rem;">
          <button type="button" class="btn btn-secondary" id="cancelProjectModalBtn">Cancel</button>
          <button type="submit" class="btn btn-primary btn-md">Submit Request & Get PDF Receipt →</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  // Set default payment date to today
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

  // Close handlers
  document.getElementById('closeProjectModalBtn').addEventListener('click', () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });
  document.getElementById('cancelProjectModalBtn').addEventListener('click', () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Form submission
  const reqForm = document.getElementById('projectRequestForm');
  reqForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const category = document.getElementById('projCategory').value;
    const plan = document.getElementById('projPlan').value;
    const name = document.getElementById('projClientName').value.trim();
    const phone = document.getElementById('projClientPhone').value.trim();
    const email = document.getElementById('projClientEmail').value.trim();
    const business = document.getElementById('projBusinessName').value.trim();
    const details = document.getElementById('projDetails').value.trim();
    const totalAmount = parseFloat(document.getElementById('projTotalCost').value) || 24999;
    const amountPaid = parseFloat(document.getElementById('projAmountPaid').value) || 5000;
    const pendingAmount = Math.max(0, totalAmount - amountPaid);
    const txnRef = document.getElementById('projTxnRef').value.trim();
    const payMethod = document.getElementById('projPayMethod').value;
    const payDate = document.getElementById('projPayDate').value;

    const reqId = 'YUG-REQ-' + Math.floor(100000 + Math.random() * 900000);

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
      payMethod,
      payDate,
      status: 'Pending Verification',
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

  const whatsappMsg = `*YUGVEX TECH SOLUTIONS - PROJECT REQUEST SUBMISSION*%0A%0A` +
    `🔖 *Request ID:* ${reqData.id}%0A` +
    `👤 *Client Name:* ${encodeURIComponent(reqData.name)}%0A` +
    `📞 *WhatsApp:* ${encodeURIComponent(reqData.phone)}%0A` +
    `📦 *Plan:* ${encodeURIComponent(reqData.plan)}%0A` +
    `💰 *Total Project Cost:* Rs. ${reqData.totalAmount}%0A` +
    `⚡ *Token Amount Paid:* Rs. ${reqData.amount}%0A` +
    `⏳ *Pending Balance:* Rs. ${reqData.pendingAmount}%0A` +
    `💳 *Txn UTR:* ${encodeURIComponent(reqData.txnRef)}%0A` +
    `👤 *Payee Account:* GOVINDRAJ HANMANT AMBATWAR%0A%0A` +
    `_Please verify payment UTR and send my confirmed PDF receipt copy on WhatsApp._`;

  const targetPhone = reqData.phone.replace(/\D/g, '');
  const formattedPhone = targetPhone.length === 10 ? '91' + targetPhone : targetPhone;
  const whatsappUrl = `https://wa.me/917219290885?text=${whatsappMsg}`;

  modalOverlay.innerHTML = `
    <div class="modal-content glass-card" style="max-width:560px;text-align:center;padding:2.5rem 2rem;">
      <div style="width:64px;height:64px;border-radius:50%;background:var(--gradient-primary);margin:0 auto 1.25rem auto;display:flex;align-items:center;justify-content:center;font-size:2rem;">
        ✅
      </div>
      <h3 style="font-size:1.5rem;margin-bottom:0.5rem;color:var(--text-main);">Project Request Submitted!</h3>
      <div style="background:rgba(6,182,212,0.1);border:1px solid rgba(6,182,212,0.3);padding:0.85rem;border-radius:var(--radius-sm);margin-bottom:1.25rem;font-size:0.9rem;text-align:left;">
        <div>Tracking Request ID: <strong style="color:var(--primary);">${reqData.id}</strong></div>
        <div>Total Valuation: <strong style="color:#fff;">₹${reqData.totalAmount}</strong></div>
        <div>Token Paid Now: <strong style="color:#34D399;">₹${reqData.amount}</strong></div>
        <div>Pending Balance: <strong style="color:#FBBF24;">₹${reqData.pendingAmount}</strong></div>
      </div>

      <p style="color:var(--text-muted);font-size:0.9rem;line-height:1.6;margin-bottom:1.5rem;">
        Thank you <strong>${escapeHTML(reqData.name)}</strong>. Your project details and token payment UTR (<code>${escapeHTML(reqData.txnRef)}</code>) have been logged. The official PDF receipt copy can be downloaded below.
      </p>

      <div style="display:flex;flex-direction:column;gap:0.75rem;">
        <button class="btn btn-primary btn-md" onclick="downloadClientRequestPDF('${reqData.id}')" style="width:100%;justify-content:center;">
          📄 Download Official PDF Receipt
        </button>
        <a href="${whatsappUrl}" target="_blank" class="btn btn-secondary btn-md" style="width:100%;justify-content:center;border-color:#25D366;color:#25D366;">
          💬 Share PDF Receipt on WhatsApp ↗
        </a>
        <button class="btn btn-secondary btn-md" onclick="this.closest('.modal-overlay').remove()">
          Done
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modalOverlay);
}

// Global PDF Receipt Download function
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
    const doc = new jsPDF();

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 297, 'F');

    doc.setTextColor(6, 182, 212);
    doc.setFontSize(22);
    doc.text("YUGVEX TECH SOLUTIONS", 20, 25);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text("OFFICIAL PAYMENT RECEIPT & AGREEMENT", 20, 38);

    doc.setFontSize(10);
    doc.setTextColor(180, 180, 180);
    doc.text(`Receipt / Request ID: ${req.id}`, 20, 50);
    doc.text(`Payment Date: ${req.payDate || '2026-08-10'}`, 130, 50);

    doc.setLineWidth(0.5);
    doc.setDrawColor(6, 182, 212);
    doc.line(20, 55, 190, 55);

    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text("CLIENT & BUSINESS DETAILS", 20, 68);
    doc.setFontSize(10);
    doc.setTextColor(200, 200, 200);
    doc.text(`Name: ${req.name}`, 20, 78);
    doc.text(`WhatsApp Phone: +${req.phone}`, 20, 86);
    doc.text(`Email: ${req.email || 'N/A'}`, 20, 94);
    doc.text(`Business / Store Name: ${req.business || 'N/A'}`, 20, 102);

    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text("FINANCIAL BREAKDOWN & PAYMENT SUMMARY", 20, 118);
    doc.setFontSize(10);
    doc.setTextColor(200, 200, 200);
    doc.text(`Selected Plan / Service: ${req.plan}`, 20, 128);
    doc.text(`Total Agreed Valuation: Rs. ${parseFloat(req.totalAmount || req.amount).toLocaleString('en-IN')}`, 20, 136);
    doc.text(`Token Amount Paid Now: Rs. ${parseFloat(req.amount || 0).toLocaleString('en-IN')}`, 20, 144);
    doc.text(`Remaining Balance Due: Rs. ${parseFloat(req.pendingAmount || 0).toLocaleString('en-IN')}`, 20, 152);
    doc.text(`Transaction UTR / Ref ID: ${req.txnRef}`, 20, 160);
    doc.text(`Payment Method: ${req.payMethod || 'PhonePe QR'}`, 20, 168);
    doc.text(`Payee Account Name: GOVINDRAJ HANMANT AMBATWAR`, 20, 176);

    doc.setLineWidth(0.5);
    doc.setDrawColor(6, 182, 212);
    doc.line(20, 186, 190, 186);

    doc.setFontSize(12);
    doc.setTextColor(52, 211, 153);
    doc.text("STATUS: PAYMENT VERIFIED & CONFIRMED", 20, 200);

    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("Director: Omkar Katturwar | Yugvex Tech Solutions - Nanded, Maharashtra | www.yugvex.com", 20, 260);

    doc.save(`Yugvex_Payment_Receipt_${req.id}.pdf`);
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
