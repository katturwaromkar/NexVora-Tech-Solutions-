/**
 * Yugvex Tech Solutions - Razorpay Payment Gateway Integration
 * Razorpay Test Key ID: rzp_test_TT8v9aCoJzadD9
 */

window.YUGVEX_RAZORPAY_KEY = 'rzp_test_TT8v9aCoJzadD9';

/**
 * Ensures Razorpay SDK is loaded asynchronously.
 * @returns {Promise<boolean>}
 */
function loadRazorpaySdk() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK');
      resolve(false);
    };
    document.body.appendChild(script);
  });
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
  if (!loaded) {
    alert('Failed to initialize Razorpay Gateway. Please check your internet connection and try again.');
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
    image: 'assets/images/yugvex-logo.png', // Fallback to brand image if available
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
