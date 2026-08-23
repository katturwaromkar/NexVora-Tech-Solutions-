/**
 * Yugvex Tech Solutions - Staff & Admin Financial Operations Engine
 * Features: Dual-Role Auth (Admin/Sales), Client Request Verification, Financial Breakdown,
 * PhonePe/UPI Payment QR, PDF Receipt Generation & WhatsApp Dispatch.
 */

(function () {
  'use strict';

  // --- Default Payment Receiver Credentials ---
  const DEFAULT_PAYMENT_CONFIG = {
    upiId: '8484080732@ybl',
    payeeName: 'Yugvex Tech Solutions, Pune',
    bankName: 'PhonePe / YBL UPI',
    companyName: 'Yugvex Tech Solutions'
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
      salesPerson: 'Admin User',
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
      salesPerson: 'Admin User',
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
      salesPerson: 'Admin User',
      createdAt: '2026-08-07T11:00:00Z',
      dueDate: '2026-08-25'
    }
  ];

  // --- State Management ---
  let currentUser = JSON.parse(sessionStorage.getItem('yugvex_portal_user')) || null;
  let transactions = JSON.parse(localStorage.getItem('yugvex_transactions')) || null;

  if (!transactions || transactions.length === 0) {
    transactions = SEED_TRANSACTIONS;
    localStorage.setItem('yugvex_transactions', JSON.stringify(transactions));
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

  let activeReceiptTransaction = null;

  // --- Initialization ---
  function initPortal() {
    checkAuth();
    setupEventListeners();
    updateDashboard();
    window.renderClientRequestsTable();
  }

  // --- Authentication Handlers ---
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
      currentUser = { role: 'admin', name: 'Admin (Omkar Katturwar)', email: 'admin@yugvex.com' };
    } else if (role === 'sales' && (password === 'sales123' || password === '1234')) {
      currentUser = { role: 'sales', name: 'Rohan Gupta (Sales)', email: 'sales@yugvex.com' };
    } else {
      if (authErrorMsg) authErrorMsg.textContent = 'Invalid credentials! (Admin: admin123 / PIN 9999, Sales: sales123 / PIN 1234)';
      return false;
    }

    sessionStorage.setItem('yugvex_portal_user', JSON.stringify(currentUser));
    if (authErrorMsg) authErrorMsg.textContent = '';
    checkAuth();
    updateDashboard();
    window.renderClientRequestsTable();
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

  // --- Financial Calculation Logic ---
  function calcPending() {
    const total = parseFloat(totalAmountInput.value) || 0;
    const token = parseFloat(tokenPaidInput.value) || 0;
    const pending = Math.max(0, total - token);
    pendingAmountInput.value = pending;
  }

  if (totalAmountInput && tokenPaidInput) {
    totalAmountInput.addEventListener('input', calcPending);
    tokenPaidInput.addEventListener('input', calcPending);
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
            <div class="table-actions">
              <button class="btn-icon-table btn-whatsapp-action" onclick="window.sendWhatsappReceipt('${t.id}')" title="Send Receipt on WhatsApp">
                💬 WhatsApp
              </button>
              <button class="btn-icon-table" onclick="window.downloadPdfReceipt('${t.id}')" title="Download Official PDF Receipt">
                📄 PDF Receipt
              </button>
              ${t.pendingAmount > 0 ? `
                <button class="btn-icon-table" style="border-color:rgba(16,185,129,0.4);color:#34D399;" onclick="window.recordBalancePayment('${t.id}')" title="Record Remaining Balance">
                  💵 Clear Bal
                </button>` : ''}
              ${currentUser && currentUser.role === 'admin' ? `
                <button class="btn-icon-table" style="color:#EF4444;border-color:rgba(239,68,68,0.3);" onclick="window.deleteTransaction('${t.id}')" title="Delete Record">
                  🗑️
                </button>` : ''}
            </div>
          </td>
        </tr>`;
    }).join('');
  }

  // --- ONLINE CLIENT REQUESTS TABLE & VERIFICATION ---
  window.renderClientRequestsTable = function () {
    const tableBody = document.getElementById('clientRequestsTableBody');
    const countEl = document.getElementById('kpiPendingRequestsCount');
    if (!tableBody) return;

    const requests = JSON.parse(localStorage.getItem('yugvex_project_requests') || '[]');

    let pendingCount = 0;
    requests.forEach(r => {
      if (r.status === 'Pending Verification') pendingCount++;
    });
    if (countEl) countEl.textContent = pendingCount;

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
      const isApproved = req.status === 'Payment Verified & Confirmed';
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
            <div style="font-weight:600;color:#fff;">${escapeHtml(req.name)}</div>
            <div style="font-size:0.8rem;color:var(--primary);">+${req.phone} • ${escapeHtml(req.email)}</div>
            ${req.business ? `<div style="font-size:0.75rem;color:var(--text-muted);">${escapeHtml(req.business)}</div>` : ''}
          </td>
          <td>
            <div style="font-weight:600;color:#fff;">${escapeHtml(req.plan)}</div>
            <div style="font-size:0.78rem;color:var(--text-muted);">${escapeHtml(req.category)}</div>
          </td>
          <td>
            <div style="font-weight:700;color:#34D399;">Token: ₹${tokenAmt.toLocaleString('en-IN')}</div>
            <div style="font-size:0.75rem;color:var(--text-muted);">Total: ₹${totalAmt.toLocaleString('en-IN')} | Pending: ₹${pendingAmt.toLocaleString('en-IN')}</div>
          </td>
          <td>
            <div style="font-family:monospace;font-weight:700;color:#fff;">${escapeHtml(req.txnRef)}</div>
            <div style="font-size:0.75rem;color:var(--text-muted);">${req.payMethod}</div>
          </td>
          <td style="font-size:0.85rem;color:var(--text-muted);">${req.payDate}</td>
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
      salesPerson: 'Admin Approval (Omkar Katturwar)',
      createdAt: new Date().toISOString(),
      dueDate: req.payDate
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

    // Auto download Official Verified PDF receipt for Admin
    window.downloadClientRequestPDF(req.id);

    if (confirm(`Payment for Request ${req.id} (UTR: ${req.txnRef}) verified & approved!\n\nOfficial Final PDF receipt generated. Would you like to share the verified receipt with ${req.name} on WhatsApp now?`)) {
      window.shareClientRequestWhatsapp(req.id);
    }
  };

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
      `Director: Omkar Katturwar | Yugvex Tech Solutions%0A` +
      `Website: www.yugvex.com`;

    window.open(`https://wa.me/${targetPhone}?text=${msg}`, '_blank');
  };

  // --- Add New Lead ---
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
        salesPerson: currentUser ? currentUser.name : 'Sales Team',
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

  // --- Delete Record (Admin Only) ---
  window.deleteTransaction = function (txnId) {
    if (!currentUser || currentUser.role !== 'admin') {
      alert('Only Admin can delete transaction records.');
      return;
    }
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
        <div>Client Name: <strong style="color:#fff;">${escapeHtml(clientName)}</strong></div>
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

    activeReceiptTransaction = txn;
    const dateStr = new Date(txn.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    receiptContainer.innerHTML = `
      <div id="printableReceiptArea" style="background:#0f172a;color:#fff;padding:1.5rem;border-radius:8px;border:1px solid var(--border-light);font-family:var(--font-body);">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid var(--primary);padding-bottom:1rem;margin-bottom:1.25rem;">
          <div>
            <div style="font-family:var(--font-heading);font-size:1.5rem;font-weight:800;color:var(--primary);">YUGVEX TECH SOLUTIONS</div>
            <div style="font-size:0.78rem;color:var(--text-muted);">Enterprise Web Engineering & AI Solutions</div>
            <div style="font-size:0.75rem;color:var(--text-muted);">Director: Omkar Katturwar | Nanded, Maharashtra</div>
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
            <div style="font-weight:700;color:#fff;font-size:0.95rem;">${DEFAULT_PAYMENT_CONFIG.payeeName}</div>
            <div style="font-size:0.8rem;color:var(--text-muted);">UPI ID: ${DEFAULT_PAYMENT_CONFIG.upiId}</div>
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

  // --- Download PDF Receipt ---
  window.downloadPdfReceipt = function (txnId) {
    if (typeof window.downloadClientRequestPDF === 'function') {
      window.downloadClientRequestPDF(txnId);
    }
  };

  // --- Send Receipt via WhatsApp ---
  window.sendWhatsappReceipt = function (txnId) {
    if (typeof window.shareClientRequestWhatsapp === 'function') {
      window.shareClientRequestWhatsapp(txnId);
    }
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

  // --- Event Listeners & Search Filters ---
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
