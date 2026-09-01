/**
 * Yugvex Tech Solutions - Staff & Admin Financial & Quotation Operations Engine
 * Features:
 * 1. Dual-Role Auth (Admin & Sales)
 * 2. Full CRUD Data Editing for all Transaction Records and Client Requests
 * 3. Executive 2-Page Quotation Studio with Live Editing, Presets & PDF Generator
 * 4. PhonePe / Razorpay UPI QR Code Preview & Direct WhatsApp Dispatch
 * 5. Official Company Details Only (No founder personal names in quotations or receipts)
 */

(function () {
  'use strict';

  // --- Default Company Details ---
  const COMPANY_CONFIG = {
    name: 'Yugvex Tech Solutions',
    shortName: 'Yugvex Tech Solution',
    website: 'www.yugvex.site',
    office: 'Pune & Nanded, Maharashtra',
    payeeName: 'Yugvex Tech Solutions, Pune',
    upiId: '8484080732@ybl',
    supportPhone: '+91 8484080732',
    supportEmail: 'support@yugvex.site'
  };

  // --- Number to Words Converter (INR) ---
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

  // --- Quotation Service Presets ---
  const QUOTATION_PRESETS = {
    ecommerce: {
      title: 'IDIYAAS: E-Commerce Website Development Quotation',
      category: 'E-Commerce Website',
      moduleHeading: 'Module / Features',
      moduleQty: '1',
      moduleRate: 12000,
      bullets: [
        'Premium UI/UX Design & Responsive Website',
        'Homepage & Hero Sections',
        'Product Categories & Collection Pages',
        'Product Listing, Search, Filter & Sorting',
        'Product Details & Product Gallery',
        'Shopping Cart & Wishlist',
        'Checkout System',
        'Customer Account & Profile',
        'Admin Dashboard',
        'Product & Category Management',
        'Customer & Order Management',
        'Inventory Management',
        'Coupon & Discount Management',
        'Review Management',
        'Razorpay Payment Gateway Integration',
        'Mobile OTP Authentication',
        'Transactional Email & Order Notifications',
        'Cloudinary Image & Video Management',
        'Shipping & Order Tracking Integration',
        'SEO & Performance Optimization',
        'Production Deployment & SSL Configuration'
      ].join('\n'),
      hostingTitle: 'Hosting: Shared Server (Duration: 1 Year)',
      hostingDuration: '1 Year',
      hostingRate: 5000,
      hostingSpecs: 'Ram: Cloud-based serverless hosting with scalable compute resources.\nCloudflare R2: 10 GB Storage\nResend: 100 Mails/ day\nCustomer Capacity: Up to approximately 5,000 registered customers on the initial database setup, depending on order history, addresses, reviews and other stored data.',
      annualServices: 'Annual Service: Domain Renewal, Cloudflare Hosting, MongoDB Atlas, Cloudinary, Cloudflare R2, Resend, OTP/SMS, Razorpay, Shipping API, SSL/HTTPS.',
      annualUpgrade: 'Approx. ₹1,000–₹1,500/year.\nPaid upgrade if required: Paid upgrade based on database usage, media usage, Transaction-based, Provider-dependent, included through Cloudflare, Optional, based on support requirement.'
    },
    pharmacy: {
      title: 'PHARMACY STORE ERP SOFTWARE SPECIFICATIONS',
      category: 'Pharmacy Store ERP',
      moduleHeading: 'Pharmacy Retail & Wholesale ERP Engine',
      moduleQty: '1',
      moduleRate: 14999,
      bullets: [
        'Batch & Expiry Date Tracker with FIFO ledger',
        'GST Prescription Billing & Barcode POS',
        'Salt & Generic Medicine Search Engine',
        'Supplier Purchase Order & Credit Ledger',
        'Automated WhatsApp Low-Stock Alerts',
        'Daily Revenue & Sales Tax Reports',
        'Cloud Database Sync with Offline Billing Backup',
        'Multi-Counter Staff Permissions & Audit Trail'
      ].join('\n'),
      hostingTitle: 'Cloud High-Availability Server (Duration: 1 Year)',
      hostingDuration: '1 Year',
      hostingRate: 5000,
      hostingSpecs: 'High-speed cloud server with automated daily database snapshot backup.\nDedicated SSL encryption & multi-terminal latency under 50ms.',
      annualServices: 'Annual Service: Cloud Server Renewal, Database Backup, GST Tax Tables Sync & Bug Fix SLA.',
      annualUpgrade: 'Approx. ₹1,500–₹2,000/year for cloud infrastructure & software maintenance.'
    },
    restaurant: {
      title: 'RESTAURANT MANAGEMENT POS & QR ORDERING SYSTEM',
      category: 'Restaurant ERP & KOT',
      moduleHeading: 'Restaurant POS & Kitchen Display Engine',
      moduleQty: '1',
      moduleRate: 9999,
      bullets: [
        'Contactless Table QR Code Digital Menu',
        'Kitchen Display System (KOT Routing)',
        'POS Billing & Split-Invoice Engine',
        'Recipe & Ingredient Inventory Tracking',
        'Swiggy / Zomato Online Order Management',
        'Captain Ordering Mobile App Interface',
        'Customer Loyalty & Discount Coupons Engine'
      ].join('\n'),
      hostingTitle: 'Cloud Edge POS Server (Duration: 1 Year)',
      hostingDuration: '1 Year',
      hostingRate: 5000,
      hostingSpecs: 'Ultra-low latency edge server with instant order dispatch to kitchen screens.',
      annualServices: 'Annual Service: Cloud Hosting Renewal, Table QR Code Menu Engine & Uptime Guarantee.',
      annualUpgrade: 'Approx. ₹1,000–₹1,500/year for hosting & support.'
    },
    'ai-bot': {
      title: 'AI VOICE BOT & CONVERSATIONAL AUTOMATION AGENT',
      category: 'AI Voice & Chat Bot',
      moduleHeading: 'Enterprise AI Voice Agent Architecture',
      moduleQty: '1',
      moduleRate: 24999,
      bullets: [
        'Human-like Autonomous AI Telecalling Voice Agent',
        'Multilingual Support (Hindi, English, Marathi & Regional)',
        'Lead Qualification & Instant CRM Booking Sync',
        'Document OCR & Smart Data Extraction Pipeline',
        'Live Audio Call Recording & Sentiment Analysis',
        'WhatsApp Automated Follow-up Trigger Integration',
        'Enterprise Security & Encrypted Telephony Webhooks'
      ].join('\n'),
      hostingTitle: 'Dedicated GPU AI Inference Edge Cluster (1 Year)',
      hostingDuration: '1 Year',
      hostingRate: 5000,
      hostingSpecs: 'Dedicated low-latency speech synthesis & LLM inference compute instance.',
      annualServices: 'Annual Service: Telephony SIP trunk connector, AI Speech API Gateway & Model Tuning.',
      annualUpgrade: 'Usage based billing on active telephony minutes + annual cloud retainer.'
    },
    custom: {
      title: 'CUSTOM ENTERPRISE SOFTWARE & WEB APPLICATION',
      category: 'Custom Web / App',
      moduleHeading: 'Custom Full-Stack Web Application Scope',
      moduleQty: '1',
      moduleRate: 19999,
      bullets: [
        'Custom Architecture Design & Database Modeling',
        'Role-Based Access Control (Admin, Staff & User Dashboards)',
        'RESTful APIs & Secure Authentication Engine',
        'Payment Gateway & SMS/WhatsApp Notification Pipeline',
        'Responsive Mobile-First Frontend Engineering',
        'Cloud Server Infrastructure Deployment & SSL Binding'
      ].join('\n'),
      hostingTitle: 'Scalable Cloud Server Infrastructure (1 Year)',
      hostingDuration: '1 Year',
      hostingRate: 5000,
      hostingSpecs: 'Scalable cloud infrastructure with automated auto-scaling and monitoring.',
      annualServices: 'Annual Service: Server Renewal, Domain, SSL & Security Patch Maintenance.',
      annualUpgrade: 'Approx. ₹1,500–₹2,000/year based on resource compute.'
    }
  };

  // --- Initial Seed Data ---
  const SEED_TRANSACTIONS = [
    {
      id: 'YUG-2026-0801',
      clientName: 'Shri Hanuman Super Market',
      clientPhone: '919876543210',
      companyName: 'www.shrihanumansupermarket.shop',
      requirementCategory: 'Retail & E-Commerce Store',
      requirementDetails: 'Retail e-commerce supermarket website with online grocery product catalog, WhatsApp direct checkout, and category browsing.',
      totalAmount: 25000,
      tokenPaid: 10000,
      pendingAmount: 15000,
      paymentMethod: 'UPI (PhonePe QR)',
      txnRef: 'TXN-98472019',
      status: 'token-received',
      salesPerson: 'Staff Operations',
      createdAt: '2026-08-05T10:30:00Z',
      dueDate: '2026-08-20'
    },
    {
      id: 'YUG-2026-0802',
      clientName: 'V and B Enterprises',
      clientPhone: '919812345678',
      companyName: 'https://v-b-beta.vercel.app/',
      requirementCategory: 'Retail & E-Commerce Web App',
      requirementDetails: 'High-speed retail e-commerce web application with interactive product catalog and cart.',
      totalAmount: 18000,
      tokenPaid: 18000,
      pendingAmount: 0,
      paymentMethod: 'PhonePe QR',
      txnRef: 'TXN-47201844',
      status: 'fully-paid',
      salesPerson: 'Staff Operations',
      createdAt: '2026-08-06T14:15:00Z',
      dueDate: '2026-08-06'
    },
    {
      id: 'YUG-2026-0803',
      clientName: 'Govindraj Watch & Gift',
      clientPhone: '919922334455',
      companyName: 'Govindraj Watch Center',
      requirementCategory: 'E-Commerce Website & Catalog',
      requirementDetails: 'Luxury watch & gift catalog with WhatsApp ordering.',
      totalAmount: 45000,
      tokenPaid: 15000,
      pendingAmount: 30000,
      paymentMethod: 'Bank Transfer',
      txnRef: 'TXN-11029384',
      status: 'partial',
      salesPerson: 'Staff Operations',
      createdAt: '2026-08-07T11:00:00Z',
      dueDate: '2026-08-25'
    }
  ];

  const SEED_QUOTATIONS = [
    {
      id: 'YUG-QUOTE-2026-849201',
      clientName: 'Akash Xerox (Idiyaas)',
      clientPhone: '9307615406',
      clientLocation: 'Pune, Maharashtra',
      title: 'IDIYAAS: E-Commerce Website Development Quotation',
      issueDate: '31/08/2026',
      moduleHeading: 'Module / Features',
      moduleQty: '1',
      moduleRate: 12000,
      bullets: QUOTATION_PRESETS.ecommerce.bullets,
      hostingTitle: QUOTATION_PRESETS.ecommerce.hostingTitle,
      hostingDuration: '1 Year',
      hostingRate: 5000,
      hostingSpecs: QUOTATION_PRESETS.ecommerce.hostingSpecs,
      annualServices: QUOTATION_PRESETS.ecommerce.annualServices,
      annualUpgrade: QUOTATION_PRESETS.ecommerce.annualUpgrade,
      grandTotal: 17000,
      createdAt: '2026-08-31T10:00:00Z'
    }
  ];

  // --- State Variables ---
  let currentUser = JSON.parse(sessionStorage.getItem('yugvex_portal_user')) || null;
  let transactions = JSON.parse(localStorage.getItem('yugvex_transactions')) || null;
  let savedQuotations = JSON.parse(localStorage.getItem('yugvex_saved_quotations')) || null;

  if (!transactions || transactions.length === 0) {
    transactions = SEED_TRANSACTIONS;
    localStorage.setItem('yugvex_transactions', JSON.stringify(transactions));
  }

  if (!savedQuotations || savedQuotations.length === 0) {
    savedQuotations = SEED_QUOTATIONS;
    localStorage.setItem('yugvex_saved_quotations', JSON.stringify(savedQuotations));
  }

  // --- DOM Elements ---
  const authOverlay = document.getElementById('authOverlay');
  const authForm = document.getElementById('authForm');
  const authUserSelect = document.getElementById('authUserSelect');
  const authPasswordInput = document.getElementById('authPasswordInput');
  const authErrorMsg = document.getElementById('authErrorMsg');
  const userBadge = document.getElementById('userBadge');
  const userNameText = document.getElementById('userNameText');
  const logoutBtn = document.getElementById('logoutBtn');

  const kpiTotalRevenue = document.getElementById('kpiTotalRevenue');
  const kpiActiveLeads = document.getElementById('kpiActiveLeads');
  const kpiPendingAmount = document.getElementById('kpiPendingAmount');
  const kpiCompletedTxns = document.getElementById('kpiCompletedTxns');
  const kpiPendingRequestsCount = document.getElementById('kpiPendingRequestsCount');

  const ledgerTableBody = document.getElementById('ledgerTableBody');
  const portalSearchInput = document.getElementById('portalSearchInput');
  const portalFilterSelect = document.getElementById('portalFilterSelect');
  const exportCsvBtn = document.getElementById('exportCsvBtn');

  // Modals
  const newLeadModal = document.getElementById('newLeadModal');
  const newLeadForm = document.getElementById('newLeadForm');
  const totalAmountInput = document.getElementById('totalAmountInput');
  const tokenPaidInput = document.getElementById('tokenPaidInput');
  const pendingAmountInput = document.getElementById('pendingAmountInput');

  const receiptModal = document.getElementById('receiptModal');
  const receiptContainer = document.getElementById('receiptContainer');
  const sendWhatsappReceiptBtn = document.getElementById('sendWhatsappReceiptBtn');
  const printReceiptBtn = document.getElementById('printReceiptBtn');

  const paymentQrModal = document.getElementById('paymentQrModal');
  const paymentQrContainer = document.getElementById('paymentQrContainer');

  const quotationStudioModal = document.getElementById('quotationStudioModal');
  const quotationStudioForm = document.getElementById('quotationStudioForm');
  const openQuotationStudioBtn = document.getElementById('openQuotationStudioBtn');
  const quotePresetSelect = document.getElementById('quotePresetSelect');

  const editRecordModal = document.getElementById('editRecordModal');
  const editRecordForm = document.getElementById('editRecordForm');

  let activeEditingQuoteId = null;

  // --- Initialize Portal ---
  function initPortal() {
    checkAuth();
    setupEventListeners();
    setupTabNavigation();
    setupQuotationStudio();
    updateDashboard();
    renderClientRequestsTable();
    renderQuotationsTable();
  }

  // --- Authentication ---
  function checkAuth() {
    if (!currentUser) {
      if (authOverlay) authOverlay.style.display = 'flex';
    } else {
      if (authOverlay) authOverlay.style.display = 'none';
      if (userBadge) {
        userBadge.className = `portal-user-badge ${currentUser.role}`;
        userNameText.textContent = `${currentUser.role === 'admin' ? '👑 Admin' : '💼 Sales'}: ${currentUser.name}`;
      }
    }
  }

  function handleLogin(role, password) {
    if (role === 'admin' && (password === 'admin123' || password === '9999')) {
      currentUser = { role: 'admin', name: 'Admin (Operations)', email: 'admin@yugvex.com' };
    } else if (role === 'sales' && (password === 'sales123' || password === '1234')) {
      currentUser = { role: 'sales', name: 'Sales Executive', email: 'sales@yugvex.com' };
    } else {
      if (authErrorMsg) authErrorMsg.textContent = 'Invalid credentials! (Admin: admin123 / PIN 9999, Sales: sales123 / PIN 1234)';
      return false;
    }

    sessionStorage.setItem('yugvex_portal_user', JSON.stringify(currentUser));
    if (authErrorMsg) authErrorMsg.textContent = '';
    checkAuth();
    updateDashboard();
    renderClientRequestsTable();
    renderQuotationsTable();
    return true;
  }

  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const role = authUserSelect.value;
      const pass = authPasswordInput.value;
      handleLogin(role, pass);
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('yugvex_portal_user');
      currentUser = null;
      checkAuth();
    });
  }

  // --- Tab Navigation System ---
  function setupTabNavigation() {
    const tabBtns = document.querySelectorAll('.portal-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTabId = btn.getAttribute('data-tab');
        
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.portal-tab-pane').forEach(pane => {
          if (pane.id === targetTabId) {
            pane.style.display = 'block';
            pane.classList.add('active');
          } else {
            pane.style.display = 'none';
            pane.classList.remove('active');
          }
        });
      });
    });
  }

  // --- Financial Calculations for Lead Form ---
  function calcPending() {
    const total = parseFloat(totalAmountInput?.value) || 0;
    const token = parseFloat(tokenPaidInput?.value) || 0;
    const pending = Math.max(0, total - token);
    if (pendingAmountInput) pendingAmountInput.value = pending;
  }

  if (totalAmountInput && tokenPaidInput) {
    totalAmountInput.addEventListener('input', calcPending);
    tokenPaidInput.addEventListener('input', calcPending);
  }

  // --- Edit Record Form Calculations ---
  const editTotalAmt = document.getElementById('editTotalAmount');
  const editTokenPaidAmt = document.getElementById('editTokenPaid');
  const editPendingAmt = document.getElementById('editPendingAmount');

  function calcEditPending() {
    const total = parseFloat(editTotalAmt?.value) || 0;
    const token = parseFloat(editTokenPaidAmt?.value) || 0;
    const pending = Math.max(0, total - token);
    if (editPendingAmt) editPendingAmt.value = pending;
  }

  if (editTotalAmt && editTokenPaidAmt) {
    editTotalAmt.addEventListener('input', calcEditPending);
    editTokenPaidAmt.addEventListener('input', calcEditPending);
  }

  // --- Dashboard Data & Ledger Render ---
  function updateDashboard() {
    saveTransactions();
    calculateKpis();
    renderLedgerTable();
  }

  function saveTransactions() {
    localStorage.setItem('yugvex_transactions', JSON.stringify(transactions));
  }

  function calculateKpis() {
    let totalRev = 0;
    let pendingSum = 0;
    let completedCount = 0;

    transactions.forEach(t => {
      totalRev += (parseFloat(t.tokenPaid) || 0);
      pendingSum += (parseFloat(t.pendingAmount) || 0);
      if (t.status === 'fully-paid') completedCount++;
    });

    if (kpiTotalRevenue) kpiTotalRevenue.textContent = `₹${totalRev.toLocaleString('en-IN')}`;
    if (kpiActiveLeads) kpiActiveLeads.textContent = transactions.length;
    if (kpiPendingAmount) kpiPendingAmount.textContent = `₹${pendingSum.toLocaleString('en-IN')}`;
    if (kpiCompletedTxns) kpiCompletedTxns.textContent = completedCount;
  }

  function renderLedgerTable() {
    if (!ledgerTableBody) return;

    const searchTerm = (portalSearchInput?.value || '').toLowerCase().trim();
    const filterStatus = portalFilterSelect?.value || 'all';

    const filtered = transactions.filter(t => {
      const matchSearch =
        t.clientName.toLowerCase().includes(searchTerm) ||
        t.clientPhone.includes(searchTerm) ||
        t.id.toLowerCase().includes(searchTerm) ||
        (t.companyName && t.companyName.toLowerCase().includes(searchTerm)) ||
        t.requirementCategory.toLowerCase().includes(searchTerm);

      const matchStatus = filterStatus === 'all' || t.status === filterStatus;
      return matchSearch && matchStatus;
    });

    if (filtered.length === 0) {
      ledgerTableBody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align:center;padding:3rem;color:var(--text-muted);">
            <div style="font-size:2rem;margin-bottom:0.5rem;">🔍</div>
            No transaction records found. Click <strong>+ New Lead & Payment Request</strong> to add one.
          </td>
        </tr>`;
      return;
    }

    ledgerTableBody.innerHTML = filtered.map(t => {
      const statusLabel =
        t.status === 'fully-paid' ? 'Paid In Full' :
        t.status === 'token-received' ? 'Token Advance' :
        t.status === 'partial' ? 'Partial Payment' : 'Pending';

      const statusClass =
        t.status === 'fully-paid' ? 'fully-paid' :
        t.status === 'token-received' ? 'token-received' :
        t.status === 'partial' ? 'partial' : 'pending';

      const dateStr = new Date(t.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

      return `
        <tr>
          <td>
            <div style="font-family:var(--font-heading);font-weight:700;color:var(--primary);">${t.id}</div>
            <div style="font-size:0.75rem;color:var(--text-subtle);">${dateStr}</div>
          </td>
          <td>
            <div class="client-name-cell">${escapeHtml(t.clientName)}</div>
            <div class="client-phone-cell">+${t.clientPhone} ${t.companyName ? '• ' + escapeHtml(t.companyName) : ''}</div>
          </td>
          <td>
            <div style="font-weight:600;color:var(--text-main);">${escapeHtml(t.requirementCategory)}</div>
            <div style="font-size:0.78rem;color:var(--text-muted);max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${escapeHtml(t.requirementDetails)}">${escapeHtml(t.requirementDetails)}</div>
          </td>
          <td style="font-weight:700;color:var(--text-main);">₹${parseFloat(t.totalAmount).toLocaleString('en-IN')}</td>
          <td style="font-weight:700;color:#34D399;">₹${parseFloat(t.tokenPaid).toLocaleString('en-IN')}</td>
          <td style="font-weight:700;color:${t.pendingAmount > 0 ? '#FBBF24' : 'var(--text-subtle)'};">
            ₹${parseFloat(t.pendingAmount).toLocaleString('en-IN')}
          </td>
          <td>
            <span class="status-pill ${statusClass}">
              ● ${statusLabel}
            </span>
          </td>
          <td>
            <button class="btn-icon-table" onclick="window.showPaymentQr('${t.id}')" title="View PhonePe UPI QR">
              📱 QR Code
            </button>
          </td>
          <td>
            <div class="table-actions" style="display:flex;gap:0.35rem;flex-wrap:wrap;">
              <button class="btn-icon-table" style="color:var(--primary);border-color:rgba(6,182,212,0.3);" onclick="window.editTransaction('${t.id}')" title="Edit Record & Scope">
                ✏️ Edit
              </button>
              <button class="btn-icon-table btn-whatsapp-action" onclick="window.sendWhatsappReceipt('${t.id}')" title="Send Receipt on WhatsApp">
                💬 WhatsApp
              </button>
              <button class="btn-icon-table" onclick="window.downloadPdfReceipt('${t.id}')" title="Download Official PDF Receipt">
                📄 Receipt
              </button>
              <button class="btn-icon-table" style="border-color:rgba(59,130,246,0.4);color:#60A5FA;" onclick="window.createQuotationForClient('${t.id}')" title="Generate Quotation for Client">
                📑 Quote
              </button>
              ${t.pendingAmount > 0 ? `
                <button class="btn-icon-table" style="border-color:rgba(16,185,129,0.4);color:#34D399;" onclick="window.recordBalancePayment('${t.id}')" title="Record Remaining Balance">
                  💵 Clear Bal
                </button>` : ''}
              <button class="btn-icon-table" style="color:#EF4444;border-color:rgba(239,68,68,0.3);" onclick="window.deleteTransaction('${t.id}')" title="Delete Record">
                🗑️
              </button>
            </div>
          </td>
        </tr>`;
    }).join('');
  }

  // --- ONLINE CLIENT REQUESTS TABLE & VERIFICATION ---
  window.renderClientRequestsTable = function () {
    const tableBody = document.getElementById('clientRequestsTableBody');
    const countEl = document.getElementById('kpiPendingRequestsCount');
    const tabBadge = document.getElementById('tabPendingBadge');
    if (!tableBody) return;

    const requests = JSON.parse(localStorage.getItem('yugvex_project_requests') || '[]');

    let pendingCount = 0;
    requests.forEach(r => {
      if (r.status === 'Pending Verification') pendingCount++;
    });
    if (countEl) countEl.textContent = pendingCount;
    if (tabBadge) tabBadge.textContent = pendingCount;

    if (requests.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center;padding:2rem;color:var(--text-muted);">
            No online client project requests submitted yet.
          </td>
        </tr>`;
      return;
    }

    tableBody.innerHTML = requests.map(req => {
      const isApproved = req.status === 'Verified & Confirmed' || req.status === 'Payment Verified & Confirmed';
      const statusColor = isApproved ? '#34D399' : '#FBBF24';
      const statusBg = isApproved ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)';

      const totalAmt = parseFloat(req.totalAmount || req.amount || 0);
      const tokenAmt = parseFloat(req.amount || 0);
      const pendingAmt = parseFloat(req.pendingAmount || Math.max(0, totalAmt - tokenAmt));

      return `
        <tr>
          <td>
            <div style="font-weight:700;color:var(--primary);">${req.id}</div>
            <div style="font-size:0.75rem;color:var(--text-subtle);">${new Date(req.submittedAt).toLocaleDateString()}</div>
          </td>
          <td>
            <div style="font-weight:600;color:var(--text-main);">${escapeHtml(req.name)}</div>
            <div style="font-size:0.8rem;color:var(--primary);">+${req.phone} • ${escapeHtml(req.email)}</div>
            ${req.business ? `<div style="font-size:0.75rem;color:var(--text-muted);">${escapeHtml(req.business)}</div>` : ''}
          </td>
          <td>
            <div style="font-weight:600;color:var(--text-main);">${escapeHtml(req.plan)}</div>
            <div style="font-size:0.78rem;color:var(--text-muted);">${escapeHtml(req.category)}</div>
          </td>
          <td>
            <div style="font-weight:700;color:#34D399;">Token: ₹${tokenAmt.toLocaleString('en-IN')}</div>
            <div style="font-size:0.75rem;color:var(--text-muted);">Total: ₹${totalAmt.toLocaleString('en-IN')} | Pending: ₹${pendingAmt.toLocaleString('en-IN')}</div>
          </td>
          <td>
            <div style="font-family:monospace;font-weight:700;color:var(--text-main);">${escapeHtml(req.txnRef)}</div>
            <div style="font-size:0.75rem;color:var(--text-muted);">${req.payMethod}</div>
          </td>
          <td style="font-size:0.85rem;color:var(--text-muted);">${req.payDate || 'N/A'}</td>
          <td>
            <span style="display:inline-block;padding:0.25rem 0.6rem;border-radius:12px;font-size:0.75rem;font-weight:700;background:${statusBg};color:${statusColor};">
              ● ${req.status}
            </span>
          </td>
          <td>
            <div style="display:flex;gap:0.4rem;flex-wrap:wrap;">
              ${!isApproved ? `
                <button class="btn-icon-table" style="border-color:rgba(16,185,129,0.4);color:#34D399;" onclick="window.approveClientRequest('${req.id}')" title="Verify UTR & Approve">
                  ✅ Verify & Approve
                </button>` : ''}
              <button class="btn-icon-table" style="color:var(--primary);border-color:rgba(6,182,212,0.3);" onclick="window.editClientRequest('${req.id}')" title="Edit Request Details">
                ✏️ Edit
              </button>
              <button class="btn-icon-table" onclick="window.downloadClientRequestPDF('${req.id}')" title="Download PDF Receipt">
                📄 PDF Receipt
              </button>
              <button class="btn-icon-table btn-whatsapp-action" onclick="window.shareClientRequestWhatsapp('${req.id}')" title="Send WhatsApp Receipt">
                💬 WhatsApp
              </button>
            </div>
          </td>
        </tr>`;
    }).join('');
  };

  window.approveClientRequest = function (reqId) {
    const requests = JSON.parse(localStorage.getItem('yugvex_project_requests') || '[]');
    const reqIndex = requests.findIndex(r => r.id === reqId);
    if (reqIndex === -1) return;

    requests[reqIndex].status = 'Verified & Confirmed';
    requests[reqIndex].isTemporary = false;
    localStorage.setItem('yugvex_project_requests', JSON.stringify(requests));

    const req = requests[reqIndex];
    const totalAmt = parseFloat(req.totalAmount || req.amount || 24999);
    const tokenAmt = parseFloat(req.amount || 5000);
    const pendingAmt = parseFloat(req.pendingAmount || Math.max(0, totalAmt - tokenAmt));

    const newTxn = {
      id: req.id,
      clientName: req.name,
      clientPhone: req.phone.replace(/\D/g, ''),
      companyName: req.business || 'Client Web Request',
      requirementCategory: req.category + ' (' + req.plan + ')',
      requirementDetails: req.details || req.plan,
      totalAmount: totalAmt,
      tokenPaid: tokenAmt,
      pendingAmount: pendingAmt,
      paymentMethod: req.payMethod + ' (UTR: ' + req.txnRef + ')',
      txnRef: req.txnRef,
      status: pendingAmt === 0 ? 'fully-paid' : 'token-received',
      isTemporary: false,
      salesPerson: currentUser ? currentUser.name : 'Staff Operations',
      createdAt: new Date().toISOString(),
      dueDate: req.payDate || ''
    };

    const existingTxnIndex = transactions.findIndex(t => t.id === req.id);
    if (existingTxnIndex === -1) {
      transactions.unshift(newTxn);
    } else {
      transactions[existingTxnIndex] = newTxn;
    }
    saveTransactions();
    calculateKpis();
    renderLedgerTable();
    window.renderClientRequestsTable();

    window.downloadClientRequestPDF(req.id);

    if (confirm(`Payment for Request ${req.id} (UTR: ${req.txnRef}) verified & approved!\n\nOfficial Final PDF receipt generated. Would you like to share the verified receipt with ${req.name} on WhatsApp now?`)) {
      window.shareClientRequestWhatsapp(req.id);
    }
  };

  // --- Edit Transaction Handlers ---
  window.editTransaction = function (txnId) {
    const txn = transactions.find(t => t.id === txnId);
    if (!txn) return;

    document.getElementById('editRecordId').value = txn.id;
    document.getElementById('editClientName').value = txn.clientName || '';
    document.getElementById('editClientPhone').value = txn.clientPhone || '';
    document.getElementById('editCompanyName').value = txn.companyName || '';
    document.getElementById('editRequirementCategory').value = txn.requirementCategory || 'E-Commerce Website';
    document.getElementById('editRequirementDetails').value = txn.requirementDetails || '';
    document.getElementById('editTotalAmount').value = txn.totalAmount || 0;
    document.getElementById('editTokenPaid').value = txn.tokenPaid || 0;
    document.getElementById('editPendingAmount').value = txn.pendingAmount || 0;
    document.getElementById('editStatus').value = txn.status || 'token-received';
    document.getElementById('editTxnRef').value = txn.txnRef || '';
    document.getElementById('editDueDate').value = txn.dueDate || '';

    openModal(editRecordModal);
  };

  window.editClientRequest = function (reqId) {
    const requests = JSON.parse(localStorage.getItem('yugvex_project_requests') || '[]');
    const req = requests.find(r => r.id === reqId);
    if (!req) return;

    const totalAmt = parseFloat(req.totalAmount || req.amount || 0);
    const tokenAmt = parseFloat(req.amount || 0);
    const pendingAmt = parseFloat(req.pendingAmount || Math.max(0, totalAmt - tokenAmt));

    document.getElementById('editRecordId').value = req.id;
    document.getElementById('editClientName').value = req.name || '';
    document.getElementById('editClientPhone').value = req.phone || '';
    document.getElementById('editCompanyName').value = req.business || '';
    document.getElementById('editRequirementCategory').value = req.category || 'E-Commerce Website';
    document.getElementById('editRequirementDetails').value = req.details || req.plan || '';
    document.getElementById('editTotalAmount').value = totalAmt;
    document.getElementById('editTokenPaid').value = tokenAmt;
    document.getElementById('editPendingAmount').value = pendingAmt;
    document.getElementById('editStatus').value = req.status.includes('Verified') ? 'fully-paid' : 'token-received';
    document.getElementById('editTxnRef').value = req.txnRef || '';
    document.getElementById('editDueDate').value = req.payDate || '';

    openModal(editRecordModal);
  };

  if (editRecordForm) {
    editRecordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('editRecordId').value;
      const total = parseFloat(document.getElementById('editTotalAmount').value) || 0;
      const token = parseFloat(document.getElementById('editTokenPaid').value) || 0;
      const pending = Math.max(0, total - token);

      // Check if updating transaction in ledger
      const txnIndex = transactions.findIndex(t => t.id === id);
      if (txnIndex !== -1) {
        transactions[txnIndex].clientName = document.getElementById('editClientName').value.trim();
        transactions[txnIndex].clientPhone = document.getElementById('editClientPhone').value.replace(/\D/g, '');
        transactions[txnIndex].companyName = document.getElementById('editCompanyName').value.trim();
        transactions[txnIndex].requirementCategory = document.getElementById('editRequirementCategory').value;
        transactions[txnIndex].requirementDetails = document.getElementById('editRequirementDetails').value.trim();
        transactions[txnIndex].totalAmount = total;
        transactions[txnIndex].tokenPaid = token;
        transactions[txnIndex].pendingAmount = pending;
        transactions[txnIndex].status = document.getElementById('editStatus').value;
        transactions[txnIndex].txnRef = document.getElementById('editTxnRef').value.trim();
        transactions[txnIndex].dueDate = document.getElementById('editDueDate').value;

        saveTransactions();
        calculateKpis();
        renderLedgerTable();
      }

      // Check if updating online request
      const requests = JSON.parse(localStorage.getItem('yugvex_project_requests') || '[]');
      const reqIndex = requests.findIndex(r => r.id === id);
      if (reqIndex !== -1) {
        requests[reqIndex].name = document.getElementById('editClientName').value.trim();
        requests[reqIndex].phone = document.getElementById('editClientPhone').value.trim();
        requests[reqIndex].business = document.getElementById('editCompanyName').value.trim();
        requests[reqIndex].category = document.getElementById('editRequirementCategory').value;
        requests[reqIndex].details = document.getElementById('editRequirementDetails').value.trim();
        requests[reqIndex].totalAmount = total;
        requests[reqIndex].amount = token;
        requests[reqIndex].pendingAmount = pending;
        requests[reqIndex].txnRef = document.getElementById('editTxnRef').value.trim();
        requests[reqIndex].payDate = document.getElementById('editDueDate').value;

        localStorage.setItem('yugvex_project_requests', JSON.stringify(requests));
        renderClientRequestsTable();
      }

      closeModal(editRecordModal);
      alert(`Record ${id} updated successfully!`);
    });
  }

  // --- EXECUTIVE QUOTATION STUDIO & ENGINE ---
  function setupQuotationStudio() {
    if (openQuotationStudioBtn) {
      openQuotationStudioBtn.addEventListener('click', () => {
        window.openNewQuotationModal();
      });
    }

    if (quotePresetSelect) {
      quotePresetSelect.addEventListener('change', () => {
        const presetKey = quotePresetSelect.value;
        const preset = QUOTATION_PRESETS[presetKey];
        if (preset) loadQuotationPreset(preset);
      });
    }

    // Input listeners to update live preview totals
    const qRate1 = document.getElementById('quoteItem1Rate');
    const qRate2 = document.getElementById('quoteHostingRate');

    if (qRate1 && qRate2) {
      qRate1.addEventListener('input', updateQuotationStudioTotals);
      qRate2.addEventListener('input', updateQuotationStudioTotals);
    }

    if (quotationStudioForm) {
      quotationStudioForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const quoteData = collectQuotationStudioData();
        window.downloadOfficialQuotationPDF(quoteData);
        saveQuotationToStorage(quoteData);
      });
    }

    const saveStudioQuoteBtn = document.getElementById('saveStudioQuoteBtn');
    if (saveStudioQuoteBtn) {
      saveStudioQuoteBtn.addEventListener('click', () => {
        const quoteData = collectQuotationStudioData();
        saveQuotationToStorage(quoteData);
        alert(`Quotation ${quoteData.id} saved successfully in Portal Records!`);
      });
    }

    const shareStudioWhatsappBtn = document.getElementById('shareStudioWhatsappBtn');
    if (shareStudioWhatsappBtn) {
      shareStudioWhatsappBtn.addEventListener('click', () => {
        const quoteData = collectQuotationStudioData();
        saveQuotationToStorage(quoteData);
        window.shareQuotationWhatsApp(quoteData);
      });
    }
  }

  function loadQuotationPreset(preset) {
    document.getElementById('quoteStudioTitle').value = preset.title;
    document.getElementById('quoteItem1Heading').value = preset.moduleHeading;
    document.getElementById('quoteItem1Qty').value = preset.moduleQty;
    document.getElementById('quoteItem1Rate').value = preset.moduleRate;
    document.getElementById('quoteItem1Bullets').value = preset.bullets;
    document.getElementById('quoteHostingTitle').value = preset.hostingTitle;
    document.getElementById('quoteHostingDuration').value = preset.hostingDuration;
    document.getElementById('quoteHostingRate').value = preset.hostingRate;
    document.getElementById('quoteHostingSpecs').value = preset.hostingSpecs;
    document.getElementById('quoteAnnualServicesText').value = preset.annualServices;
    document.getElementById('quoteAnnualUpgradeText').value = preset.annualUpgrade;

    updateQuotationStudioTotals();
  }

  function updateQuotationStudioTotals() {
    const rate1 = parseFloat(document.getElementById('quoteItem1Rate')?.value) || 0;
    const rate2 = parseFloat(document.getElementById('quoteHostingRate')?.value) || 0;
    const grandTotal = rate1 + rate2;

    const subEl = document.getElementById('quoteStudioSubTotal');
    const grandEl = document.getElementById('quoteStudioGrandTotal');
    const wordsEl = document.getElementById('quoteStudioWordsPreview');

    if (subEl) subEl.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
    if (grandEl) grandEl.textContent = `Rs. ${grandTotal.toLocaleString('en-IN')}`;
    if (wordsEl) wordsEl.textContent = `${numberToWordsINR(grandTotal)} Rupees Only.`;
  }

  function collectQuotationStudioData() {
    const rate1 = parseFloat(document.getElementById('quoteItem1Rate')?.value) || 0;
    const rate2 = parseFloat(document.getElementById('quoteHostingRate')?.value) || 0;
    const grandTotal = rate1 + rate2;

    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    const todayFormatted = `${d}/${m}/${y}`;

    return {
      id: activeEditingQuoteId || `YUG-QUOTE-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      clientName: document.getElementById('quoteStudioClientName').value.trim() || 'Akash Xerox (Idiyaas)',
      clientPhone: document.getElementById('quoteStudioClientPhone').value.trim() || '9307615406',
      clientLocation: document.getElementById('quoteStudioLocation').value.trim() || 'Pune, Maharashtra',
      title: document.getElementById('quoteStudioTitle').value.trim() || 'IDIYAAS: E-Commerce Website Development Quotation',
      issueDate: document.getElementById('quoteStudioDate').value.trim() || todayFormatted,
      moduleHeading: document.getElementById('quoteItem1Heading').value.trim() || 'Module / Features',
      moduleQty: document.getElementById('quoteItem1Qty').value.trim() || '1',
      moduleRate: rate1,
      bullets: document.getElementById('quoteItem1Bullets').value.trim(),
      hostingTitle: document.getElementById('quoteHostingTitle').value.trim() || 'Hosting: Shared Server (Duration: 1 Year)',
      hostingDuration: document.getElementById('quoteHostingDuration').value.trim() || '1 Year',
      hostingRate: rate2,
      hostingSpecs: document.getElementById('quoteHostingSpecs').value.trim(),
      annualServices: document.getElementById('quoteAnnualServicesText').value.trim(),
      annualUpgrade: document.getElementById('quoteAnnualUpgradeText').value.trim(),
      grandTotal: grandTotal,
      createdAt: new Date().toISOString()
    };
  }

  window.openNewQuotationModal = function (prefill) {
    activeEditingQuoteId = null;
    loadQuotationPreset(QUOTATION_PRESETS.ecommerce);

    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    document.getElementById('quoteStudioDate').value = `${d}/${m}/${y}`;

    if (prefill) {
      if (prefill.clientName) document.getElementById('quoteStudioClientName').value = prefill.clientName;
      if (prefill.clientPhone) document.getElementById('quoteStudioClientPhone').value = prefill.clientPhone;
      if (prefill.companyName) document.getElementById('quoteStudioTitle').value = `${prefill.companyName.toUpperCase()}: Web Application Quotation`;
    }

    updateQuotationStudioTotals();
    openModal(quotationStudioModal);
  };

  window.createQuotationForClient = function (txnId) {
    const txn = transactions.find(t => t.id === txnId);
    if (!txn) return;

    window.openNewQuotationModal({
      clientName: txn.clientName,
      clientPhone: txn.clientPhone,
      companyName: txn.companyName || txn.clientName
    });
  };

  window.editSavedQuotation = function (quoteId) {
    const quote = savedQuotations.find(q => q.id === quoteId);
    if (!quote) return;

    activeEditingQuoteId = quote.id;
    document.getElementById('quoteStudioClientName').value = quote.clientName;
    document.getElementById('quoteStudioClientPhone').value = quote.clientPhone;
    document.getElementById('quoteStudioLocation').value = quote.clientLocation || 'Pune, Maharashtra';
    document.getElementById('quoteStudioTitle').value = quote.title;
    document.getElementById('quoteStudioDate').value = quote.issueDate;
    document.getElementById('quoteItem1Heading').value = quote.moduleHeading;
    document.getElementById('quoteItem1Qty').value = quote.moduleQty;
    document.getElementById('quoteItem1Rate').value = quote.moduleRate;
    document.getElementById('quoteItem1Bullets').value = quote.bullets;
    document.getElementById('quoteHostingTitle').value = quote.hostingTitle;
    document.getElementById('quoteHostingDuration').value = quote.hostingDuration;
    document.getElementById('quoteHostingRate').value = quote.hostingRate;
    document.getElementById('quoteHostingSpecs').value = quote.hostingSpecs;
    document.getElementById('quoteAnnualServicesText').value = quote.annualServices;
    document.getElementById('quoteAnnualUpgradeText').value = quote.annualUpgrade;

    updateQuotationStudioTotals();
    openModal(quotationStudioModal);
  };

  function saveQuotationToStorage(quoteData) {
    const idx = savedQuotations.findIndex(q => q.id === quoteData.id);
    if (idx === -1) {
      savedQuotations.unshift(quoteData);
    } else {
      savedQuotations[idx] = quoteData;
    }
    localStorage.setItem('yugvex_saved_quotations', JSON.stringify(savedQuotations));
    renderQuotationsTable();
  }

  function renderQuotationsTable() {
    const tableBody = document.getElementById('quotationsTableBody');
    const badge = document.getElementById('tabQuoteCountBadge');
    if (!tableBody) return;

    if (badge) badge.textContent = savedQuotations.length;

    if (savedQuotations.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center;padding:2rem;color:var(--text-muted);">
            No saved quotations yet. Click <strong>+ Create New Quotation</strong> to generate one.
          </td>
        </tr>`;
      return;
    }

    tableBody.innerHTML = savedQuotations.map(q => {
      return `
        <tr>
          <td>
            <div style="font-family:var(--font-heading);font-weight:700;color:var(--primary);">${q.id}</div>
            <div style="font-size:0.75rem;color:var(--text-subtle);">${q.issueDate}</div>
          </td>
          <td>
            <div style="font-weight:600;color:var(--text-main);">${escapeHtml(q.clientName)}</div>
            <div style="font-size:0.78rem;color:var(--text-muted);">+${q.clientPhone} • ${escapeHtml(q.clientLocation)}</div>
          </td>
          <td>
            <div style="font-size:0.85rem;color:var(--text-main);font-weight:600;max-width:280px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${escapeHtml(q.title)}">
              ${escapeHtml(q.title)}
            </div>
          </td>
          <td style="font-weight:700;color:#34D399;">₹${parseFloat(q.grandTotal).toLocaleString('en-IN')}</td>
          <td style="font-size:0.8rem;color:var(--text-muted);">15 Days</td>
          <td>
            <div style="display:flex;gap:0.4rem;flex-wrap:wrap;">
              <button class="btn-icon-table" style="color:var(--primary);border-color:rgba(6,182,212,0.3);" onclick="window.editSavedQuotation('${q.id}')" title="Edit Quotation">
                ✏️ Edit
              </button>
              <button class="btn-icon-table" onclick="window.downloadSavedQuotationPDF('${q.id}')" title="Download Official PDF">
                📥 PDF
              </button>
              <button class="btn-icon-table btn-whatsapp-action" onclick="window.shareSavedQuotationWhatsapp('${q.id}')" title="Send WhatsApp Copy">
                💬 WhatsApp
              </button>
              <button class="btn-icon-table" style="color:#EF4444;border-color:rgba(239,68,68,0.3);" onclick="window.deleteSavedQuotation('${q.id}')" title="Delete Quotation">
                🗑️
              </button>
            </div>
          </td>
        </tr>`;
    }).join('');
  }

  window.downloadSavedQuotationPDF = function (quoteId) {
    const quote = savedQuotations.find(q => q.id === quoteId);
    if (quote) window.downloadOfficialQuotationPDF(quote);
  };

  window.shareSavedQuotationWhatsapp = function (quoteId) {
    const quote = savedQuotations.find(q => q.id === quoteId);
    if (quote) window.shareQuotationWhatsApp(quote);
  };

  window.deleteSavedQuotation = function (quoteId) {
    if (confirm(`Are you sure you want to delete quotation ${quoteId}?`)) {
      savedQuotations = savedQuotations.filter(q => q.id !== quoteId);
      localStorage.setItem('yugvex_saved_quotations', JSON.stringify(savedQuotations));
      renderQuotationsTable();
    }
  };

  // --- Official 2-Page Quotation PDF Generator (Clean Company Details Only, NO Founders) ---
  window.downloadOfficialQuotationPDF = function (qData) {
    const jsPDF = window.jspdf ? window.jspdf.jsPDF : (window.jsPDF ? window.jsPDF : null);
    if (!jsPDF) {
      alert('PDF engine initializing... Please try again.');
      return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    const grandTotal = qData.grandTotal || (qData.moduleRate + qData.hostingRate);
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
    doc.text(COMPANY_CONFIG.website, 15, 12);
    doc.setTextColor(100, 116, 139);
    doc.text("P a g e  1 | 2", 195, 12, { align: 'right' });

    // Main Quotation Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13.5);
    doc.setTextColor(15, 23, 42);
    doc.text(qData.title, 15, 23);

    // Date
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`Date: ${qData.issueDate}`, 195, 23, { align: 'right' });

    // Bill To Block
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text("Bill To", 15, 33);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(`${qData.clientName},`, 15, 39);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(`+91 ${qData.clientPhone.replace(/\D/g, '')}`, 15, 45);
    doc.text(qData.clientLocation || "Pune, Maharashtra", 15, 51);

    // Table Configuration
    const tableTop = 57;
    const colX = [15, 26, 126, 146, 168, 195];
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

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text("1", 20.5, row1Top + 8, { align: 'center' });
    doc.text(qData.moduleHeading, 30, row1Top + 6);

    // Parse bullets from text
    const bulletList = (qData.bullets || '').split('\n').filter(b => b.trim().length > 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.2);
    doc.setTextColor(30, 41, 59);

    let bulletY = row1Top + 11.5;
    const maxBullets = Math.min(bulletList.length, 21);
    for (let i = 0; i < maxBullets; i++) {
      const lineText = bulletList[i].replace(/^[•\-\*]\s*/, '');
      doc.text(`•   ${lineText}`, 32, bulletY);
      bulletY += 4.8;
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(String(qData.moduleQty || '1'), 136, row1Top + 14, { align: 'center' });
    doc.text(`${qData.moduleRate.toLocaleString('en-IN')}`, 164, row1Top + 14, { align: 'right' });
    doc.setFont("helvetica", "bold");
    doc.text(`${qData.moduleRate.toLocaleString('en-IN')}`, 191, row1Top + 14, { align: 'right' });

    // Row 2: Hosting
    const row2Top = row1Top + row1Height;
    const row2Height = 35;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text("2", 20.5, row2Top + 7, { align: 'center' });
    doc.text(qData.hostingTitle, 30, row2Top + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.8);
    doc.setTextColor(71, 85, 105);

    const specLines = (qData.hostingSpecs || '').split('\n');
    let specY = row2Top + 11.5;
    specLines.forEach(sp => {
      const wrapped = doc.splitTextToSize(sp, 92);
      doc.text(wrapped, 30, specY);
      specY += (wrapped.length * 3.8);
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(qData.hostingRate > 0 ? qData.hostingDuration : "-", 136, row2Top + 14, { align: 'center' });
    doc.text(qData.hostingRate > 0 ? `${qData.hostingRate.toLocaleString('en-IN')}` : "-", 164, row2Top + 14, { align: 'right' });
    doc.setFont("helvetica", "bold");
    doc.text(qData.hostingRate > 0 ? `${qData.hostingRate.toLocaleString('en-IN')}` : "-", 191, row2Top + 14, { align: 'right' });

    // Row 3: Annual Service
    const row3Top = row2Top + row2Height;
    const row3Height = 44;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text("3", 20.5, row3Top + 7, { align: 'center' });

    const annualServiceLines = doc.splitTextToSize(qData.annualServices || 'Annual Service: Domain Renewal, Cloudflare Hosting, Database, API & SSL Maintenance.', 92);
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
    
    doc.rect(15, tableTop, tableWidth, totalTableHeight, 'S');
    doc.line(15, row1Top, 195, row1Top);
    doc.line(15, row2Top, 195, row2Top);
    doc.line(15, row3Top, 195, row3Top);

    colX.forEach(x => {
      doc.line(x, tableTop, x, tableTop + totalTableHeight);
    });

    // Page 1 Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(59, 130, 246);
    doc.text(COMPANY_CONFIG.website, 15, 285);
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
    doc.text(COMPANY_CONFIG.website, 15, 12);
    doc.setTextColor(100, 116, 139);
    doc.text("P a g e  2 | 2", 195, 12, { align: 'right' });

    // Summary Totals Box on Right
    const sumBoxX = 125;
    const sumBoxY = 18;
    
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
      { title: "Ownership & Original Development:", text: ` The website will be developed specifically for the ${qData.clientName} brand with an original UI/UX and implementation. Competitor websites may be used only for functional and market reference; proprietary code, assets, or implementation will not be copied.` },
      { title: "Acceptance & Additional Work:", text: " The quotation will be considered accepted upon receipt of a Purchase Order, written confirmation, or advance payment. Any major feature or requirement outside the agreed scope will be estimated and quoted separately." }
    ];

    let termY = 53;
    termsList.forEach((term, index) => {
      const numPrefix = `${index + 1}. `;
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      
      const prefixWidth = doc.getTextWidth(numPrefix);
      doc.text(numPrefix, 15, termY);
      doc.text(term.title, 15 + prefixWidth, termY);
      
      const titleWidth = doc.getTextWidth(term.title);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59);

      const combinedLine = term.title + term.text;
      const fullWrapped = doc.splitTextToSize(numPrefix + combinedLine, 180);
      
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
    doc.text(COMPANY_CONFIG.shortName, sigX, sigY);

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
    doc.text(COMPANY_CONFIG.website, 15, 285);
    doc.setTextColor(100, 116, 139);
    doc.text("P a g e  2 | 2", 195, 285, { align: 'right' });

    // Save generated PDF
    const filename = `${qData.clientName.replace(/\s+/g, '_')}_Quotation_${qData.id}.pdf`;
    doc.save(filename);
  };

  window.shareQuotationWhatsApp = function (qData) {
    const phone = (qData.clientPhone || '').replace(/\D/g, '');
    const targetPhone = phone.length === 10 ? '91' + phone : phone;

    const msg = `*OFFICIAL PROJECT QUOTATION - YUGVEX TECH SOLUTIONS*%0A%0A` +
      `Dear *${encodeURIComponent(qData.clientName)}*,%0A%0A` +
      `Thank you for your interest in partnering with Yugvex Tech Solutions. Below is your official project quotation summary:%0A%0A` +
      `📑 *Quotation ID:* ${qData.id}%0A` +
      `📅 *Date of Issue:* ${qData.issueDate}%0A` +
      `📦 *Project Scope:* ${encodeURIComponent(qData.title)}%0A` +
      `💰 *Total Project Valuation:* Rs. ${parseFloat(qData.grandTotal).toLocaleString('en-IN')}%0A` +
      `☁️ *Hosting Included:* ${encodeURIComponent(qData.hostingTitle)}%0A` +
      `⏳ *Quotation Validity:* 15 Days from Date of Issue%0A%0A` +
      `Corporate Payee: *Yugvex Tech Solutions, Pune*%0A` +
      `Official Website: *www.yugvex.site*%0A%0A` +
      `Our technical team is ready to begin your sprint upon kickoff approval!`;

    window.open(`https://wa.me/${targetPhone}?text=${msg}`, '_blank');
  };

  // --- Send Client Request WhatsApp Receipt ---
  window.shareClientRequestWhatsapp = function (reqId) {
    let req = null;
    const requests = JSON.parse(localStorage.getItem('yugvex_project_requests') || '[]');
    req = requests.find(r => r.id === reqId);

    if (!req) {
      const txn = transactions.find(t => t.id === reqId);
      if (txn) {
        req = {
          id: txn.id,
          name: txn.clientName,
          phone: txn.clientPhone,
          plan: txn.requirementCategory,
          totalAmount: txn.totalAmount,
          amount: txn.tokenPaid,
          pendingAmount: txn.pendingAmount,
          txnRef: txn.txnRef
        };
      }
    }

    if (!req) return;

    const phone = (req.phone || '').replace(/\D/g, '');
    const targetPhone = phone.length === 10 ? '91' + phone : phone;
    const totalValuation = parseFloat(req.totalAmount || req.amount || 0);
    const tokenPaid = parseFloat(req.amount || 0);
    const pendingBal = parseFloat(req.pendingAmount || Math.max(0, totalValuation - tokenPaid));

    const msg = `*OFFICIAL PAYMENT RECEIPT - YUGVEX TECH SOLUTIONS*%0A%0A` +
      `Dear *${encodeURIComponent(req.name)}*,%0A%0A` +
      `Your payment has been *VERIFIED & CONFIRMED*!%0A%0A` +
      `🔖 *Receipt / Request ID:* ${req.id}%0A` +
      `📦 *Plan Selected:* ${encodeURIComponent(req.plan)}%0A` +
      `💰 *Total Project Valuation:* Rs. ${totalValuation.toLocaleString('en-IN')}%0A` +
      `⚡ *Token Amount Paid:* Rs. ${tokenPaid.toLocaleString('en-IN')}%0A` +
      `⏳ *Pending Balance:* Rs. ${pendingBal.toLocaleString('en-IN')}%0A` +
      `💳 *Transaction UTR:* ${encodeURIComponent(req.txnRef)}%0A` +
      `👤 *Payee Account:* Yugvex Tech Solutions, Pune%0A` +
      `✅ *Status:* PAYMENT VERIFIED & CONFIRMED%0A%0A` +
      `Website: www.yugvex.site`;

    window.open(`https://wa.me/${targetPhone}?text=${msg}`, '_blank');
  };

  // --- Add New Lead Submission ---
  if (newLeadForm) {
    newLeadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const phoneRaw = document.getElementById('clientPhoneInput').value.replace(/\D/g, '');
      const total = parseFloat(totalAmountInput.value) || 0;
      const token = parseFloat(tokenPaidInput.value) || 0;
      const pending = Math.max(0, total - token);

      let status = 'pending';
      if (pending === 0 && total > 0) status = 'fully-paid';
      else if (token > 0 && token < total) status = 'token-received';

      const newTxn = {
        id: `YUG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        clientName: document.getElementById('clientNameInput').value.trim(),
        clientPhone: phoneRaw.length === 10 ? '91' + phoneRaw : phoneRaw,
        companyName: document.getElementById('clientCompanyInput').value.trim(),
        requirementCategory: document.getElementById('requirementCategoryInput').value,
        requirementDetails: document.getElementById('requirementDetailsInput').value.trim(),
        totalAmount: total,
        tokenPaid: token,
        pendingAmount: pending,
        paymentMethod: document.getElementById('paymentMethodInput').value,
        txnRef: document.getElementById('txnRefInput').value.trim() || `TXN-${Date.now().toString().slice(-8)}`,
        status: status,
        salesPerson: currentUser ? currentUser.name : 'Staff Operations',
        createdAt: new Date().toISOString(),
        dueDate: document.getElementById('dueDateInput').value || ''
      };

      transactions.unshift(newTxn);
      updateDashboard();
      closeModal(newLeadModal);
      newLeadForm.reset();

      if (newTxn.paymentMethod.includes('QR') || newTxn.paymentMethod.includes('PhonePe')) {
        setTimeout(() => {
          window.showPaymentQr(newTxn.id);
        }, 200);
      } else {
        if (confirm(`Lead ${newTxn.id} created successfully! Would you like to send the payment receipt to ${newTxn.clientName} on WhatsApp now?`)) {
          window.downloadPdfReceipt(newTxn.id);
          window.sendWhatsappReceipt(newTxn.id);
        }
      }
    });
  }

  // --- Clear / Record Remaining Balance ---
  window.recordBalancePayment = function (txnId) {
    const txn = transactions.find(t => t.id === txnId);
    if (!txn) return;

    const currentPending = txn.pendingAmount;
    const amountStr = prompt(`Client: ${txn.clientName}\nCurrent Pending Balance: ₹${currentPending}\n\nEnter the balance payment amount cleared by client:`, currentPending);

    if (amountStr === null) return;
    const amountPaid = parseFloat(amountStr);
    if (isNaN(amountPaid) || amountPaid <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    txn.tokenPaid += amountPaid;
    txn.pendingAmount = Math.max(0, txn.totalAmount - txn.tokenPaid);
    if (txn.pendingAmount === 0) {
      txn.status = 'fully-paid';
    } else {
      txn.status = 'partial';
    }

    updateDashboard();
    alert(`Payment of ₹${amountPaid} updated for ${txn.clientName}. Remaining Pending Balance: ₹${txn.pendingAmount}`);
  };

  // --- Delete Record (Admin & Sales) ---
  window.deleteTransaction = function (txnId) {
    if (confirm(`Are you sure you want to delete transaction ${txnId}? This action cannot be undone.`)) {
      transactions = transactions.filter(t => t.id !== txnId);
      updateDashboard();
    }
  };

  // --- Show PhonePe UPI QR Code Modal ---
  window.showPaymentQr = function (txnId) {
    const txn = transactions.find(t => t.id === txnId);
    const amount = txn ? (txn.pendingAmount > 0 ? txn.pendingAmount : txn.tokenPaid) : 0;
    const clientName = txn ? txn.clientName : 'Client';

    paymentQrContainer.innerHTML = `
      <div style="background:#fff;padding:1rem;border-radius:var(--radius-md);margin-bottom:1rem;text-align:center;">
        <img src="assets/images/payment-qr.jpg" alt="Razorpay & BHIM UPI QR Code - Yugvextechsolutions" style="width:100%;max-width:240px;display:block;margin:0 auto;border-radius:6px;">
        <div style="color:#000;font-weight:700;font-size:0.9rem;margin-top:0.5rem;">Payee: Yugvex Tech Solutions</div>
        <div style="color:#4b5563;font-size:0.8rem;">UPI App: GPay, PhonePe, Paytm, BHIM</div>
      </div>
      <div style="background:rgba(15,23,42,0.8);padding:1rem;border-radius:var(--radius-sm);text-align:left;font-size:0.85rem;">
        <div>Client Name: <strong style="color:var(--text-main);">${escapeHtml(clientName)}</strong></div>
        <div>Amount Due/Paid: <strong style="color:#34D399;">₹${amount.toLocaleString('en-IN')}</strong></div>
        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.4rem;">Scan using PhonePe, Google Pay, Paytm, or BHIM.</div>
      </div>
    `;

    openModal(paymentQrModal);
  };

  // --- View & Print Receipt Modal ---
  window.viewReceiptModal = function (txnId) {
    const txn = transactions.find(t => t.id === txnId);
    if (!txn) return;

    const dateStr = new Date(txn.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    receiptContainer.innerHTML = `
      <div id="printableReceiptArea" style="background:#0f172a;color:#fff;padding:1.5rem;border-radius:8px;border:1px solid var(--border-light);font-family:var(--font-body);">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid var(--primary);padding-bottom:1rem;margin-bottom:1.25rem;">
          <div>
            <div style="font-family:var(--font-heading);font-size:1.5rem;font-weight:800;color:var(--primary);">YUGVEX TECH SOLUTIONS</div>
            <div style="font-size:0.78rem;color:var(--text-muted);">Enterprise Web Engineering & AI Solutions</div>
            <div style="font-size:0.75rem;color:var(--text-muted);">Corporate Office: Pune & Nanded, Maharashtra | www.yugvex.site</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:1.1rem;font-weight:700;color:#fff;">OFFICIAL RECEIPT</div>
            <div style="font-size:0.85rem;color:var(--primary);font-weight:700;">${txn.id}</div>
            <div style="font-size:0.75rem;color:var(--text-subtle);">${dateStr}</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;background:rgba(255,255,255,0.03);padding:0.85rem;border-radius:6px;">
          <div>
            <div style="font-size:0.75rem;color:var(--text-muted);font-weight:600;">BILLED TO:</div>
            <div style="font-weight:700;color:#fff;font-size:0.95rem;">${escapeHtml(txn.clientName)}</div>
            ${txn.companyName ? `<div style="font-size:0.82rem;color:var(--primary);">${escapeHtml(txn.companyName)}</div>` : ''}
            <div style="font-size:0.8rem;color:var(--text-muted);">WhatsApp: +${txn.clientPhone}</div>
          </div>
          <div>
            <div style="font-size:0.75rem;color:var(--text-muted);font-weight:600;">PAYEE DETAILS:</div>
            <div style="font-weight:700;color:#fff;font-size:0.95rem;">${COMPANY_CONFIG.payeeName}</div>
            <div style="font-size:0.8rem;color:var(--text-muted);">UPI ID: ${COMPANY_CONFIG.upiId}</div>
            <div style="font-size:0.8rem;color:var(--text-muted);">Method: ${escapeHtml(txn.paymentMethod)}</div>
          </div>
        </div>

        <div style="margin-bottom:1.25rem;">
          <div style="font-size:0.8rem;font-weight:700;color:var(--primary);margin-bottom:0.4rem;">REQUIREMENT & PROJECT SCOPE:</div>
          <div style="font-size:0.88rem;color:#fff;font-weight:600;margin-bottom:0.25rem;">${escapeHtml(txn.requirementCategory)}</div>
          <div style="font-size:0.82rem;color:var(--text-muted);line-height:1.5;">${escapeHtml(txn.requirementDetails)}</div>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-bottom:1.25rem;font-size:0.85rem;">
          <thead>
            <tr style="border-bottom:1px solid var(--border-light);text-align:left;color:var(--text-muted);">
              <th style="padding:0.5rem 0;">Description</th>
              <th style="padding:0.5rem 0;text-align:right;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px dashed var(--border-light);">
              <td style="padding:0.6rem 0;">Total Agreed Project Valuation</td>
              <td style="padding:0.6rem 0;text-align:right;font-weight:700;">₹${parseFloat(txn.totalAmount).toLocaleString('en-IN')}</td>
            </tr>
            <tr style="border-bottom:1px dashed var(--border-light);">
              <td style="padding:0.6rem 0;color:#34D399;font-weight:700;">Amount Paid / Token Received (Txn Ref: ${txn.txnRef})</td>
              <td style="padding:0.6rem 0;text-align:right;font-weight:700;color:#34D399;">₹${parseFloat(txn.tokenPaid).toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td style="padding:0.6rem 0;color:#FBBF24;font-weight:700;">Remaining Balance Due ${txn.dueDate ? '(Due: ' + txn.dueDate + ')' : ''}</td>
              <td style="padding:0.6rem 0;text-align:right;font-weight:700;color:#FBBF24;">₹${parseFloat(txn.pendingAmount).toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>

        <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border-light);padding-top:1rem;margin-top:1rem;">
          <div style="font-size:0.75rem;color:var(--text-subtle);">
            Computer Generated Payment Receipt • Yugvex Tech Solutions
          </div>
          <div style="text-align:right;">
            <div style="font-size:0.85rem;font-weight:700;color:#34D399;">PAYMENT VERIFIED</div>
            <div style="font-size:0.75rem;color:var(--text-muted);">Authorized Signatory</div>
          </div>
        </div>
      </div>
    `;

    openModal(receiptModal);
  };

  // --- Download Official Client Request Receipt PDF ---
  window.downloadClientRequestPDF = function (reqId) {
    let req = null;
    const requests = JSON.parse(localStorage.getItem('yugvex_project_requests') || '[]');
    req = requests.find(r => r.id === reqId);

    if (!req) {
      const txn = transactions.find(t => t.id === reqId);
      if (txn) {
        req = {
          id: txn.id,
          name: txn.clientName,
          phone: txn.clientPhone,
          business: txn.companyName,
          plan: txn.requirementCategory,
          category: txn.requirementCategory,
          details: txn.requirementDetails,
          totalAmount: txn.totalAmount,
          amount: txn.tokenPaid,
          pendingAmount: txn.pendingAmount,
          txnRef: txn.txnRef,
          payMethod: txn.paymentMethod,
          payDate: txn.dueDate || 'Immediate',
          submittedAt: txn.createdAt
        };
      }
    }

    if (!req) return;

    const jsPDF = window.jspdf ? window.jspdf.jsPDF : (window.jsPDF ? window.jsPDF : null);
    if (!jsPDF) {
      alert("Initializing PDF engine...");
      return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    const totalAmt = parseFloat(req.totalAmount || req.amount || 24999);
    const tokenAmt = parseFloat(req.amount || 5000);
    const pendingAmt = parseFloat(req.pendingAmount || Math.max(0, totalAmt - tokenAmt));

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 36, 'F');
    doc.setFillColor(6, 182, 212);
    doc.rect(0, 36, 210, 2, 'F');

    doc.setFont("helvetica", "bold");
    doc.setTextColor(6, 182, 212);
    doc.setFontSize(18);
    doc.text("YUGVEX TECH SOLUTIONS", 14, 16);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(203, 213, 225);
    doc.setFontSize(8.5);
    doc.text("Official Verified Project Payment Receipt & Client Ledger Copy", 14, 23);
    doc.text("Corporate Office: Pune & Nanded, Maharashtra • www.yugvex.site", 14, 29);

    doc.setFillColor(30, 41, 59);
    doc.roundedRect(128, 9, 68, 18, 2, 2, 'F');
    doc.setFont("helvetica", "bold");
    doc.setTextColor(52, 211, 153);
    doc.setFontSize(9);
    doc.text("PAYMENT VERIFIED", 132, 16);
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text("RECEIPT: " + req.id, 132, 22);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text("CLIENT & TRANSACTION INFORMATION", 14, 48);

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 52, 182, 38, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, 52, 182, 38, 2, 2, 'D');

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text("Client Name:", 18, 60);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(String(req.name), 46, 60);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text("Phone / WhatsApp:", 18, 68);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("+" + req.phone, 46, 68);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text("Business Name:", 18, 76);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(String(req.business || req.name), 46, 76);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text("Transaction UTR:", 112, 60);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(6, 182, 212);
    doc.text(String(req.txnRef), 142, 60);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text("Payment Method:", 112, 68);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(String(req.payMethod || 'PhonePe / UPI QR'), 142, 68);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text("Payment Date:", 112, 76);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(String(req.payDate || 'Immediate Clearance'), 142, 76);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text("FINANCIAL BREAKDOWN & LEDGER STATEMENT", 14, 98);

    doc.setFillColor(15, 23, 42);
    doc.rect(14, 102, 182, 8, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text("DESCRIPTION / SERVICE ITEM", 18, 107.5);
    doc.text("AMOUNT (₹)", 160, 107.5);

    let y = 110;
    doc.setFillColor(255, 255, 255);
    doc.rect(14, y, 182, 10, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, y, 182, 10, 'D');
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`Total Agreed Project Scope: ${req.plan || req.category}`, 18, y + 6.5);
    doc.text(`Rs. ${totalAmt.toLocaleString('en-IN')}`, 160, y + 6.5);

    y += 10;
    doc.setFillColor(255, 255, 255);
    doc.rect(14, y, 182, 10, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, y, 182, 10, 'D');
    doc.setFont("helvetica", "bold");
    doc.setTextColor(5, 150, 105);
    doc.text(`Token / Advance Payment Received (Verified via UTR: ${req.txnRef})`, 18, y + 6.5);
    doc.text(`Rs. ${tokenAmt.toLocaleString('en-IN')}`, 160, y + 6.5);

    y += 10;
    doc.setFillColor(248, 250, 252);
    doc.rect(14, y, 182, 10, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, y, 182, 10, 'D');
    doc.setFont("helvetica", "bold");
    doc.setTextColor(pendingAmt > 0 ? 217 : 71, pendingAmt > 0 ? 119 : 85, pendingAmt > 0 ? 6 : 105);
    doc.text(`Remaining Balance Due on Project Delivery`, 18, y + 6.5);
    doc.text(`Rs. ${pendingAmt.toLocaleString('en-IN')}`, 160, y + 6.5);

    // Authority Seal (Company Only)
    y += 20;
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, y, 182, 34, 2, 2, 'F');
    doc.setDrawColor(6, 182, 212);
    doc.roundedRect(14, y, 182, 34, 2, 2, 'D');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(6, 182, 212);
    doc.text("OFFICIAL CORPORATE PAYMENT CLEARANCE", 18, y + 8);
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text("Payee Account: Yugvex Tech Solutions, Pune (UPI: 8484080732@ybl)", 18, y + 15);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text("Support & Verification Desk: +91 8484080732 | Email: support@yugvex.site", 18, y + 21);
    doc.text("Official Website: www.yugvex.site • Status: PAYMENT VERIFIED & ACTIVE", 18, y + 27);

    // Footer
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 280, 196, 280);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text("Yugvex Tech Solutions • Corporate Operations • Pune & Nanded, Maharashtra • www.yugvex.site", 14, 286);

    doc.save(`Yugvex_Verified_Receipt_${req.id}.pdf`);
  };

  // --- Download & WhatsApp Helpers ---
  window.downloadPdfReceipt = function (txnId) {
    window.downloadClientRequestPDF(txnId);
  };

  window.sendWhatsappReceipt = function (txnId) {
    window.shareClientRequestWhatsapp(txnId);
  };

  // --- Export Ledger to CSV ---
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      if (!transactions || transactions.length === 0) {
        alert('No transactions available to export.');
        return;
      }

      const headers = ['Receipt ID', 'Client Name', 'Phone', 'Company', 'Requirement', 'Total Amount', 'Token Paid', 'Pending Amount', 'Payment Method', 'Status', 'Txn Ref', 'Created At'];
      const rows = transactions.map(t => [
        t.id,
        `"${t.clientName.replace(/"/g, '""')}"`,
        t.clientPhone,
        `"${(t.companyName || '').replace(/"/g, '""')}"`,
        `"${t.requirementCategory} - ${(t.requirementDetails || '').replace(/"/g, '""')}"`,
        t.totalAmount,
        t.tokenPaid,
        t.pendingAmount,
        t.paymentMethod,
        t.status,
        t.txnRef,
        t.createdAt
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `yugvex_sales_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // --- Event Listeners & Modals Helpers ---
  function setupEventListeners() {
    if (portalSearchInput) portalSearchInput.addEventListener('input', renderLedgerTable);
    if (portalFilterSelect) portalFilterSelect.addEventListener('change', renderLedgerTable);

    document.querySelectorAll('[data-modal-open]').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-modal-open');
        const modal = document.getElementById(targetId);
        if (modal) openModal(modal);
      });
    });

    document.querySelectorAll('[data-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.portal-auth-overlay, .modal');
        if (modal) closeModal(modal);
      });
    });
  }

  function openModal(modal) {
    if (!modal) return;
    modal.style.display = 'flex';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.style.display = 'none';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortal);
  } else {
    initPortal();
  }

})();
