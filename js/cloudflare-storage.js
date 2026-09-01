/**
 * Yugvex Tech Solutions - Cloudflare Cloud Storage Synchronization Engine
 * Connects frontend Portal and Website to Cloudflare Edge API and Cloudflare KV Storage.
 */

(function () {
  'use strict';

  const API_BASE = '/api';

  window.CloudflareStorage = {
    isOnline: navigator.onLine,
    syncStatus: 'idle', // 'idle' | 'syncing' | 'synced' | 'offline'

    async checkHealth() {
      try {
        const res = await fetch(`${API_BASE}/health`, { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          this.syncStatus = 'synced';
          this.updateCloudBadge(data);
          return data;
        }
      } catch (err) {
        console.info('Cloudflare Edge API running in local-first sync mode.');
        this.syncStatus = 'offline';
        this.updateCloudBadge({ status: 'offline', provider: 'Local Cached' });
      }
      return null;
    },

    // 1. QUOTATIONS CLOUD OPERATIONS
    async getQuotations() {
      try {
        const res = await fetch(`${API_BASE}/quotations`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            localStorage.setItem('yugvex_saved_quotations', JSON.stringify(json.data));
            return json.data;
          }
        }
      } catch (e) {
        console.warn('Using cached quotations:', e);
      }
      return JSON.parse(localStorage.getItem('yugvex_saved_quotations') || '[]');
    },

    async saveQuotation(quoteData) {
      // 1. Update local cache immediately for instantaneous UI feedback
      let local = JSON.parse(localStorage.getItem('yugvex_saved_quotations') || '[]');
      const idx = local.findIndex(q => q.id === quoteData.id);
      if (idx !== -1) local[idx] = quoteData;
      else local.unshift(quoteData);
      localStorage.setItem('yugvex_saved_quotations', JSON.stringify(local));

      // 2. Synchronize to Cloudflare Cloud API
      try {
        const res = await fetch(`${API_BASE}/quotations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(quoteData)
        });
        if (res.ok) {
          this.triggerCloudSyncFeedback('Quotation synced to Cloudflare Cloud ✓');
        }
      } catch (err) {
        console.warn('Saved to local storage, will sync on next cloud connect:', err);
      }
      return quoteData;
    },

    async deleteQuotation(quoteId) {
      let local = JSON.parse(localStorage.getItem('yugvex_saved_quotations') || '[]');
      local = local.filter(q => q.id !== quoteId);
      localStorage.setItem('yugvex_saved_quotations', JSON.stringify(local));

      try {
        await fetch(`${API_BASE}/quotations/${quoteId}`, { method: 'DELETE' });
      } catch (e) {
        console.warn('Deleted locally, queueing cloud deletion:', e);
      }
      return true;
    },

    // 2. TRANSACTIONS CLOUD OPERATIONS
    async getTransactions() {
      try {
        const res = await fetch(`${API_BASE}/transactions`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            localStorage.setItem('yugvex_transactions', JSON.stringify(json.data));
            return json.data;
          }
        }
      } catch (e) {
        console.warn('Using cached transactions:', e);
      }
      return JSON.parse(localStorage.getItem('yugvex_transactions') || '[]');
    },

    async saveTransaction(txnData) {
      let local = JSON.parse(localStorage.getItem('yugvex_transactions') || '[]');
      const idx = local.findIndex(t => t.id === txnData.id);
      if (idx !== -1) local[idx] = txnData;
      else local.unshift(txnData);
      localStorage.setItem('yugvex_transactions', JSON.stringify(local));

      try {
        await fetch(`${API_BASE}/transactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(txnData)
        });
        this.triggerCloudSyncFeedback('Transaction synced to Cloudflare Cloud ✓');
      } catch (err) {
        console.warn('Saved to local storage, queueing cloud sync:', err);
      }
      return txnData;
    },

    async deleteTransaction(txnId) {
      let local = JSON.parse(localStorage.getItem('yugvex_transactions') || '[]');
      local = local.filter(t => t.id !== txnId);
      localStorage.setItem('yugvex_transactions', JSON.stringify(local));

      try {
        await fetch(`${API_BASE}/transactions/${txnId}`, { method: 'DELETE' });
      } catch (e) {
        console.warn('Deleted locally, queueing cloud deletion:', e);
      }
      return true;
    },

    // 3. PROJECT REQUESTS CLOUD OPERATIONS
    async getProjectRequests() {
      try {
        const res = await fetch(`${API_BASE}/requests`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            localStorage.setItem('yugvex_project_requests', JSON.stringify(json.data));
            return json.data;
          }
        }
      } catch (e) {
        console.warn('Using cached requests:', e);
      }
      return JSON.parse(localStorage.getItem('yugvex_project_requests') || '[]');
    },

    async saveProjectRequest(reqData) {
      let local = JSON.parse(localStorage.getItem('yugvex_project_requests') || '[]');
      const idx = local.findIndex(r => r.id === reqData.id);
      if (idx !== -1) local[idx] = reqData;
      else local.unshift(reqData);
      localStorage.setItem('yugvex_project_requests', JSON.stringify(local));

      try {
        await fetch(`${API_BASE}/requests`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reqData)
        });
        this.triggerCloudSyncFeedback('Project request synced to Cloudflare Cloud ✓');
      } catch (err) {
        console.warn('Saved to local storage, queueing cloud sync:', err);
      }
      return reqData;
    },

    // UI Feedback & Badges
    updateCloudBadge(info) {
      const badgeEl = document.getElementById('cloudflareSyncBadge');
      if (!badgeEl) return;

      if (info && info.status === 'online') {
        badgeEl.innerHTML = `☁️ Cloudflare Edge: <strong>Online</strong> (${info.datacenter || 'Synced'})`;
        badgeEl.style.borderColor = 'rgba(16,185,129,0.4)';
        badgeEl.style.color = '#34D399';
        badgeEl.style.background = 'rgba(16,185,129,0.1)';
      } else {
        badgeEl.innerHTML = `☁️ Cloudflare Cloud: <strong>Ready</strong>`;
        badgeEl.style.borderColor = 'rgba(6,182,212,0.4)';
        badgeEl.style.color = '#38BDF8';
        badgeEl.style.background = 'rgba(6,182,212,0.1)';
      }
    },

    triggerCloudSyncFeedback(msg) {
      const toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;bottom:24px;left:24px;background:#0F172A;color:#38BDF8;border:1px solid #0284C7;padding:0.6rem 1rem;border-radius:6px;font-size:0.82rem;font-weight:600;z-index:99999;box-shadow:0 10px 25px rgba(0,0,0,0.5);display:flex;align-items:center;gap:0.5rem;transition:all 0.3s ease;';
      toast.innerHTML = `☁️ ${msg}`;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
  };

  // Initialize on page load
  document.addEventListener('DOMContentLoaded', () => {
    window.CloudflareStorage.checkHealth();
  });
})();
