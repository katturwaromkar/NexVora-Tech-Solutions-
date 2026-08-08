/**
 * NexVora Tech Solutions - Sales & Transaction Portal Engine
 * Features: Dual-Role Auth (Admin/Sales), Lead Requirement Entry, Financial Breakdown,
 * PhonePe/UPI Payment QR, WhatsApp Digital Receipt Dispatch, Local Storage Ledger.
 */

(function () {
  'use me strict';

  // --- Default Payment Receiver Credentials ---
  const DEFAULT_PAYMENT_CONFIG = {
    upiId: '8484080732@ybl',
    payeeName: 'GOVINDRAJ HANMANT AMBATWAR',
    bankName: 'PhonePe / YBL UPI',
    companyName: 'NexVora Tech Solutions'
  };

  // --- Initial Seed Data ---
  const SEED_TRANSACTIONS = [
    {
      id: 'NV-2026-0801',
      clientName: 'Rahul Sharma',
      clientPhone: '919876543210',
      companyName: 'Sharma Medicals',
      requirementCategory: 'Pharmacy Store ERP',
      requirementDetails: 'Complete Pharmacy Management ERP with GST billing, batch & expiry tracker, salt composition search, and inventory reorder alerts.',
      totalAmount: 25000,
      tokenPaid: 10000,
      pendingAmount: 15000,
      paymentMethod: 'UPI (PhonePe)',
      txnRef: 'TXN-98472019',
      status: 'token-received',
      salesPerson: 'Rohan Gupta',
      createdAt: '2026-08-05T10:30:00Z',
      dueDate: '2026-08-20'
    },
    {
      id: 'NV-2026-0802',
      clientName: 'Priya Verma',
      clientPhone: '919812345678',
      companyName: 'Govindraj Watch & Gift',
      requirementCategory: 'E-Commerce Website',
      requirementDetails: 'Pixel-perfect e-commerce template for luxury watches & gifts with WhatsApp ordering, catalog filters, and payment gateway.',
      totalAmount: 18000,
      tokenPaid: 18000,
      pendingAmount: 0,
      paymentMethod: 'PhonePe QR',
      txnRef: 'TXN-47201844',
      status: 'fully-paid',
      salesPerson: 'Rohan Gupta',
      createdAt: '2026-08-06T14:15:00Z',
      dueDate: '2026-08-06'
    },
    {
      id: 'NV-2026-0803',
      clientName: 'Dr. Amit Deshmukh',
      clientPhone: '919922334455',
      companyName: 'Citycare Hospital',
      requirementCategory: 'AI Voice Calling Agent',
      requirementDetails: 'AI Assistant for automated patient appointment booking, reminder calls, and OPD queue inquiry bot.',
      totalAmount: 45000,
      tokenPaid: 15000,
      pendingAmount: 30000,
      paymentMethod: 'Bank Transfer',
      txnRef: 'TXN-11029384',
      status: 'partial',
      salesPerson: 'Alex Vora',
      createdAt: '2026-08-07T11:00:00Z',
      dueDate: '2026-08-25'
    }
  ];

  // --- State Management ---
  let currentUser = JSON.parse(sessionStorage.getItem('nexvora_portal_user')) || null;
  let transactions = JSON.parse(localStorage.getItem('nexvora_transactions')) || null;

  if (!transactions || transactions.length === 0) {
    transactions = SEED_TRANSACTIONS;
    localStorage.setItem('nexvora_transactions', JSON.stringify(transactions));
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
      currentUser = { role: 'admin', name: 'Alex Vora (Admin)', email: 'admin@nexvora.com' };
    } else if (role === 'sales' && (password === 'sales123' || password === '1234')) {
      currentUser = { role: 'sales', name: 'Rohan Gupta (Sales)', email: 'sales@nexvora.com' };
    } else {
      if (authErrorMsg) authErrorMsg.textContent = 'Invalid credentials! (Try Admin: admin123 or Sales: sales123)';
      return false;
    }

    sessionStorage.setItem('nexvora_portal_user', JSON.stringify(currentUser));
    if (authErrorMsg) authErrorMsg.textContent = '';
    checkAuth();
    updateDashboard();
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
      sessionStorage.removeItem('nexvora_portal_user');
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
    localStorage.setItem('nexvora_transactions', JSON.stringify(transactions));
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
              <button class="btn-icon-table" onclick="window.viewReceiptModal('${t.id}')" title="View & Print Receipt">
                📄 Receipt
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
        id: `NV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
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

      // Show PhonePe QR Code Modal immediately if QR payment method is selected
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

  // --- URL Role Parameter Auto-Selection ---
  const urlParams = new URLSearchParams(window.location.search);
  const paramRole = urlParams.get('role');
  if (paramRole === 'sales' || paramRole === 'admin') {
    if (authUserSelect) authUserSelect.value = paramRole;
    setTimeout(() => {
      if (authPasswordInput) authPasswordInput.focus();
    }, 200);
  }

  // --- PhonePe & UPI QR Code Generator Modal ---
  window.showPaymentQr = function (txnId) {
    const txn = transactions.find(t => t.id === txnId);
    if (!txn) return;

    const upiId = DEFAULT_PAYMENT_CONFIG.upiId;
    const payeeName = DEFAULT_PAYMENT_CONFIG.payeeName;
    const amountToRequest = txn.pendingAmount > 0 ? txn.pendingAmount : txn.totalAmount;
    const note = `Payment for ${txn.id} - ${txn.requirementCategory}`;

    // Standardized UPI Deep Link Format
    const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amountToRequest}&cu=INR&tn=${encodeURIComponent(note)}`;

    // High quality QR Code image API URL
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(upiUrl)}`;

    if (paymentQrContainer) {
      paymentQrContainer.innerHTML = `
        <div style="background:#ffffff;border-radius:18px;padding:2rem 1.5rem;color:#0f172a;max-width:400px;margin:0 auto;box-shadow:0 10px 40px rgba(0,0,0,0.5);text-align:center;">
          <!-- PhonePe Header -->
          <div style="display:flex;align-items:center;justify-content:center;gap:0.5rem;margin-bottom:0.75rem;">
            <div style="width:36px;height:36px;background:#5f259f;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:1.2rem;">पे</div>
            <span style="font-family:'Space Grotesk',sans-serif;font-size:1.4rem;font-weight:800;color:#5f259f;">PhonePe</span>
          </div>
          <div style="font-size:0.85rem;font-weight:800;letter-spacing:1px;color:#5f259f;text-transform:uppercase;margin-bottom:0.25rem;">ACCEPTED HERE</div>
          <div style="font-size:0.8rem;color:#64748b;margin-bottom:1rem;">Scan & Pay Using PhonePe, GPay, Paytm or Any UPI App</div>

          <!-- Dynamic QR Image -->
          <div style="padding:10px;background:#fff;border:2px solid #e2e8f0;border-radius:12px;display:inline-block;margin-bottom:1rem;">
            <img src="${qrImageUrl}" alt="PhonePe UPI Payment QR Code" style="width:210px;height:210px;display:block;" onerror="this.onerror=null;this.src='https://chart.googleapis.com/chart?chs=220x220&cht=qr&chl=${encodeURIComponent(upiUrl)}';">
          </div>

          <!-- Payee Info -->
          <div style="font-size:1.05rem;font-weight:800;color:#0f172a;margin-bottom:0.25rem;">${payeeName}</div>
          <div style="font-size:0.88rem;font-weight:700;color:#5f259f;background:#f3e8ff;padding:0.35rem 0.85rem;border-radius:20px;display:inline-block;margin-bottom:1rem;">
            UPI ID: ${upiId}
          </div>

          <!-- Transaction Summary inside QR -->
          <div style="background:#f8fafc;padding:0.85rem;border-radius:10px;text-align:left;font-size:0.85rem;border:1px solid #e2e8f0;margin-bottom:1.25rem;">
            <div style="display:flex;justify-content:space-between;margin-bottom:0.25rem;">
              <span style="color:#64748b;">Client Name:</span>
              <strong style="color:#0f172a;">${escapeHtml(txn.clientName)}</strong>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:0.25rem;">
              <span style="color:#64748b;">Receipt ID:</span>
              <strong style="color:#5f259f;">${txn.id}</strong>
            </div>
            <div style="display:flex;justify-content:space-between;padding-top:0.4rem;border-top:1px dashed #cbd5e1;font-size:0.95rem;">
              <span style="color:#0f172a;font-weight:700;">Amount to Pay:</span>
              <strong style="color:#16a34a;font-size:1.1rem;">₹${amountToRequest.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          <!-- Confirm Payment & Send WhatsApp PDF Receipt Button -->
          <button class="btn btn-primary btn-md" onclick="window.confirmPaymentFromQr('${txn.id}')" style="width:100%;background:#16a34a;border-color:transparent;font-weight:700;padding:0.75rem;">
            ✅ Confirm Payment Received & Send PDF Receipt →
          </button>
        </div>`;
    }

    openModal(paymentQrModal);
  };

  // --- Confirm Payment & Trigger PDF + WhatsApp Receipt ---
  window.confirmPaymentFromQr = function (txnId) {
    const txn = transactions.find(t => t.id === txnId);
    if (!txn) return;

    if (txn.status === 'pending') {
      txn.status = 'token-received';
    } else if (txn.status === 'token-received') {
      txn.status = 'fully-paid';
      txn.tokenPaid = txn.totalAmount;
      txn.pendingAmount = 0;
    }

    updateDashboard();
    closeModal(paymentQrModal);

    // Trigger PDF Generation and WhatsApp Receipt
    window.downloadPdfReceipt(txn.id);
    window.sendWhatsappReceipt(txn.id);
  };

  // --- WhatsApp Digital Receipt Dispatcher ---
  window.sendWhatsappReceipt = function (txnId) {
    const txn = transactions.find(t => t.id === txnId);
    if (!txn) return;

    const payeeName = DEFAULT_PAYMENT_CONFIG.payeeName;
    const upiId = DEFAULT_PAYMENT_CONFIG.upiId;

    const messageText = `*OFFICIAL PAYMENT RECEIPT & INVOICE*
🏢 *NexVora Tech Solutions*
----------------------------------------
*Receipt ID:* ${txn.id}
*Date:* ${new Date(txn.createdAt).toLocaleDateString('en-IN')}
*Client Name:* ${txn.clientName}
${txn.companyName ? '*Company:* ' + txn.companyName + '\n' : ''}
*Requirement / Service:*
${txn.requirementCategory} - ${txn.requirementDetails}

----------------------------------------
💰 *FINANCIAL BREAKDOWN:*
• *Total Project Cost:* ₹${parseFloat(txn.totalAmount).toLocaleString('en-IN')}
• *Token Amount Paid:* ₹${parseFloat(txn.tokenPaid).toLocaleString('en-IN')}
⏳ *Remaining Pending Balance:* ₹${parseFloat(txn.pendingAmount).toLocaleString('en-IN')}

*Payment Status:* ${txn.status === 'fully-paid' ? '✅ PAID IN FULL' : '⚡ TOKEN ADVANCE RECEIVED'}
*Payment Mode:* ${txn.paymentMethod}
*Txn Reference ID:* ${txn.txnRef}

----------------------------------------
💳 *OFFICIAL PAYMENT DETAILS FOR BALANCE CLEARANCE:*
• *UPI ID:* ${upiId}
• *Payee Name:* ${payeeName}
• *Accepted Apps:* PhonePe, GPay, Paytm, BHIM

Thank you for choosing NexVora Tech Solutions! 🚀
Need help? Contact support or visit https://nexvora.com`;

    const encodedText = encodeURIComponent(messageText);
    const cleanPhone = txn.clientPhone.replace(/\D/g, '');

    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  // --- View Printable Digital Receipt Modal ---
  window.viewReceiptModal = function (txnId) {
    const txn = transactions.find(t => t.id === txnId);
    if (!txn) return;
    activeReceiptTransaction = txn;

    const payeeName = DEFAULT_PAYMENT_CONFIG.payeeName;
    const upiId = DEFAULT_PAYMENT_CONFIG.upiId;
    const dateFormatted = new Date(txn.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

    if (receiptContainer) {
      receiptContainer.innerHTML = `
        <div class="receipt-paper" id="receiptPrintArea">
          <!-- Header -->
          <div class="receipt-header">
            <div class="receipt-brand">
              <h2>NexVora Tech Solutions</h2>
              <p>Enterprise Software, AI & Custom Web Engineering</p>
              <p style="font-size:0.78rem;color:#94a3b8;">Email: support@nexvora.com | Web: nexvora.com</p>
            </div>
            <div style="text-align:right;">
              <div class="receipt-badge-paid">${txn.pendingAmount === 0 ? '✅ FULLY PAID' : '⚡ ADVANCE TOKEN PAID'}</div>
              <div style="font-size:0.82rem;color:#64748b;margin-top:0.5rem;">Receipt #: <strong>${txn.id}</strong></div>
              <div style="font-size:0.82rem;color:#64748b;">Date: ${dateFormatted}</div>
            </div>
          </div>

          <!-- Client & Sales Details -->
          <div class="receipt-grid">
            <div>
              <div style="font-size:0.75rem;font-weight:700;color:#64748b;text-transform:uppercase;">Billed To:</div>
              <div style="font-size:1.1rem;font-weight:800;color:#0f172a;margin-top:0.2rem;">${escapeHtml(txn.clientName)}</div>
              ${txn.companyName ? `<div style="font-weight:600;color:#334155;">${escapeHtml(txn.companyName)}</div>` : ''}
              <div style="color:#64748b;">+${txn.clientPhone}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:0.75rem;font-weight:700;color:#64748b;text-transform:uppercase;">Payment Info:</div>
              <div style="font-weight:600;color:#0f172a;margin-top:0.2rem;">Mode: ${escapeHtml(txn.paymentMethod)}</div>
              <div style="color:#64748b;">Ref #: ${escapeHtml(txn.txnRef)}</div>
              <div style="color:#64748b;">Sales Rep: ${escapeHtml(txn.salesPerson)}</div>
            </div>
          </div>

          <!-- Items Table -->
          <table class="receipt-table">
            <thead>
              <tr>
                <th>Requirement / Scope Description</th>
                <th>Category</th>
                <th style="text-align:right;">Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong style="color:#0f172a;">${escapeHtml(txn.requirementCategory)}</strong>
                  <div style="font-size:0.85rem;color:#64748b;margin-top:0.25rem;">${escapeHtml(txn.requirementDetails)}</div>
                </td>
                <td><span style="font-size:0.8rem;background:#e2e8f0;padding:0.2rem 0.5rem;border-radius:4px;color:#334155;">${escapeHtml(txn.requirementCategory)}</span></td>
                <td style="text-align:right;font-weight:700;color:#0f172a;">₹${parseFloat(txn.totalAmount).toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>

          <!-- Financial Breakdown Box -->
          <div class="receipt-total-box">
            <div class="receipt-total-row">
              <span style="color:#475569;">Total Project Amount:</span>
              <strong style="color:#0f172a;">₹${parseFloat(txn.totalAmount).toLocaleString('en-IN')}</strong>
            </div>
            <div class="receipt-total-row">
              <span style="color:#16a34a;font-weight:700;">Token / Advance Paid:</span>
              <strong style="color:#16a34a;">- ₹${parseFloat(txn.tokenPaid).toLocaleString('en-IN')}</strong>
            </div>
            <div class="receipt-total-row grand-total">
              <span>Remaining Pending Balance:</span>
              <strong style="color:${txn.pendingAmount > 0 ? '#d97706' : '#16a34a'};">₹${parseFloat(txn.pendingAmount).toLocaleString('en-IN')}</strong>
            </div>
          </div>

          <!-- Official Payment Gateway Footer -->
          <div style="margin-top:2rem;padding-top:1rem;border-top:1px dashed #cbd5e1;display:flex;justify-content:space-between;align-items:center;font-size:0.82rem;color:#64748b;">
            <div>
              <strong>Official Payee UPI:</strong> ${upiId} (${payeeName})
            </div>
            <div>
              *Computer generated receipt. Valid without signature.
            </div>
          </div>
        </div>`;
    }

    openModal(receiptModal);
  };

  // --- PDF Download Function ---
  window.downloadPdfReceipt = function (txnId) {
    const txn = transactions.find(t => t.id === (txnId || activeReceiptTransaction?.id));
    if (!txn) return;

    window.viewReceiptModal(txn.id);

    setTimeout(() => {
      const element = document.getElementById('receiptPrintArea');
      if (!element) return;

      const opt = {
        margin:       0.3,
        filename:     `NexVora_Receipt_${txn.id}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      if (window.html2pdf) {
        window.html2pdf().set(opt).from(element).save();
      } else {
        window.print();
      }
    }, 250);
  };

  const downloadPdfReceiptBtn = document.getElementById('downloadPdfReceiptBtn');
  if (downloadPdfReceiptBtn) {
    downloadPdfReceiptBtn.addEventListener('click', () => {
      if (activeReceiptTransaction) {
        window.downloadPdfReceipt(activeReceiptTransaction.id);
      }
    });
  }

  // --- Print Receipt Action ---
  if (printReceiptBtn) {
    printReceiptBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (sendWhatsappReceiptBtn) {
    sendWhatsappReceiptBtn.addEventListener('click', () => {
      if (activeReceiptTransaction) {
        window.sendWhatsappReceipt(activeReceiptTransaction.id);
      }
    });
  }

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
      link.setAttribute('download', `nexvora_sales_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // --- Event Listeners & Search Filters ---
  function setupEventListeners() {
    if (portalSearchInput) portalSearchInput.addEventListener('input', renderLedgerTable);
    if (portalFilterSelect) portalFilterSelect.addEventListener('change', renderLedgerTable);

    // Modal Triggers
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

  // Helper Modal Functions
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

  // Boot Engine on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortal);
  } else {
    initPortal();
  }

})();
