/**
 * Yugvex Tech Solutions - Razorpay Payment Gateway Integration
 * Razorpay Live Key ID: rzp_live_TWiamQ0vr9Bbk0
 */

window.YUGVEX_RAZORPAY_KEY = 'rzp_live_TWiamQ0vr9Bbk0';

let rzpSdkPromise = null;

/**
 * Preloads and ensures Razorpay SDK is available.
 * @returns {Promise<boolean>}
 */
function loadRazorpaySdk() {
  if (window.Razorpay) {
    return Promise.resolve(true);
  }
  if (rzpSdkPromise) {
    return rzpSdkPromise;
  }

  rzpSdkPromise = new Promise((resolve) => {
    // Check if script element already exists
    let script = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.head.appendChild(script);
    }

    script.onload = () => {
      console.log('Razorpay SDK loaded successfully.');
      resolve(true);
    };

    script.onerror = () => {
      console.error('Failed to load Razorpay SDK from checkout.razorpay.com');
      rzpSdkPromise = null; // reset for retry
      resolve(false);
    };

    // Timeout fallback after 10 seconds
    setTimeout(() => {
      if (window.Razorpay) {
        resolve(true);
      }
    }, 10000);
  });

  return rzpSdkPromise;
}

// Automatically preload SDK on script load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadRazorpaySdk);
} else {
  loadRazorpaySdk();
}

/**
 * Launches Razorpay Checkout Modal
 * @param {Object} options 
 * @param {number} options.amount Amount in INR (e.g. 5000)
 * @param {string} [options.name] Customer Name
 * @param {string} [options.email] Customer Email
 * @param {string} [options.phone] Customer Phone
 * @param {string} [options.description] Payment Description
 * @param {function} options.onSuccess Callback on successful payment: (response) => {}
 * @param {function} [options.onFailure] Callback on payment failure or close: (error) => {}
 */
async function initiateRazorpayPayment(options = {}) {
  const loaded = await loadRazorpaySdk();
  if (!loaded && !window.Razorpay) {
    const useQr = confirm(
      '⚠️ Razorpay Gateway SDK could not be loaded directly.\n\n' +
      'Would you like to pay using our official PhonePe UPI QR code / Bank Transfer details instead?'
    );
    if (useQr) {
      const qrEl = document.querySelector('.token-preset-btn') || document.getElementById('projPayMethod');
      if (qrEl) qrEl.scrollIntoView({ behavior: 'smooth' });
    }
    if (options.onFailure) options.onFailure({ message: 'SDK load failed' });
    return;
  }

  const amountInPaise = Math.round((parseFloat(options.amount) || 5000) * 100);

  const razorpayOptions = {
    key: window.YUGVEX_RAZORPAY_KEY,
    amount: amountInPaise,
    currency: 'INR',
    name: 'Yugvex Tech Solutions',
    description: options.description || 'Project Booking & Software Development',
    image: 'assets/images/logo.png',
    prefill: {
      name: options.name || '',
      email: options.email || '',
      contact: options.phone || ''
    },
    notes: {
      company: 'Yugvex Tech Solutions',
      purpose: options.description || 'Project Payment'
    },
    theme: {
      color: '#06B6D4'
    },
    handler: function (response) {
      console.log('Razorpay Payment Successful:', response);
      if (typeof options.onSuccess === 'function') {
        options.onSuccess(response);
      }
    },
    modal: {
      ondismiss: function () {
        console.log('Razorpay modal dismissed by user');
        if (typeof options.onFailure === 'function') {
          options.onFailure({ message: 'Payment cancelled by user' });
        }
      }
    }
  };

  try {
    const rzp = new window.Razorpay(razorpayOptions);
    rzp.on('payment.failed', function (response) {
      console.error('Razorpay payment failed:', response.error);
      if (typeof options.onFailure === 'function') {
        options.onFailure(response.error);
      }
    });
    rzp.open();
  } catch (err) {
    console.error('Razorpay initialization error:', err);
    alert('Payment Gateway Error: ' + err.message);
  }
}

// Export to global scope
window.initiateRazorpayPayment = initiateRazorpayPayment;
window.loadRazorpaySdk = loadRazorpaySdk;
