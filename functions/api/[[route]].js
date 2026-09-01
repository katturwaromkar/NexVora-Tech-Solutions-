/**
 * Cloudflare Edge Worker API for Yugvex Tech Solutions
 * Handles Serverless Cloud Storage for Quotations, Transactions, and Client Requests.
 * Supports Cloudflare KV (env.YUGVEX_KV) and Edge In-Memory Global Store.
 */

// In-Memory Edge Fallback Cache for Zero-Config Deployment
let edgeMemoryStore = {
  transactions: null,
  quotations: null,
  requests: null
};

// Default Seeds
const DEFAULT_QUOTATIONS = [
  {
    id: "YUG-QUOTE-2026-849201",
    clientName: "Akash Xerox (Idiyaas)",
    clientPhone: "9307615406",
    clientLocation: "Pune, Maharashtra",
    title: "IDIYAAS: E-Commerce Website Development Quotation",
    issueDate: "31/08/2026",
    moduleHeading: "Module / Features",
    moduleQty: "1",
    moduleRate: 12000,
    bullets: [
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
    ].join("\n"),
    hostingTitle: "Hosting: Shared Server (Duration: 1 Year)",
    hostingDuration: "1 Year",
    hostingRate: 5000,
    hostingSpecs: "Ram: Cloud-based serverless hosting with scalable compute resources.\nCloudflare R2: 10 GB Storage\nResend: 100 Mails/ day\nCustomer Capacity: Up to approximately 5,000 registered customers on the initial database setup, depending on order history, addresses, reviews and other stored data.",
    annualServices: "Annual Service: Domain Renewal, Cloudflare Hosting, MongoDB Atlas, Cloudinary, Cloudflare R2, Resend, OTP/SMS, Razorpay, Shipping API, SSL/HTTPS.",
    annualUpgrade: "Approx. ₹1,000–₹1,500/year.\nPaid upgrade if required: Paid upgrade based on database usage, media usage, Transaction-based, Provider-dependent, included through Cloudflare, Optional, based on support requirement.",
    grandTotal: 17000,
    createdAt: "2026-08-31T10:00:00Z"
  }
];

const DEFAULT_TRANSACTIONS = [
  {
    id: "YUG-2026-0801",
    clientName: "Shri Hanuman Super Market",
    clientPhone: "919876543210",
    companyName: "www.shrihanumansupermarket.shop",
    requirementCategory: "Retail & E-Commerce Store",
    requirementDetails: "Retail e-commerce supermarket website with online grocery product catalog, WhatsApp direct checkout, and category browsing.",
    totalAmount: 25000,
    tokenPaid: 10000,
    pendingAmount: 15000,
    paymentMethod: "UPI (PhonePe QR)",
    txnRef: "TXN-98472019",
    status: "token-received",
    salesPerson: "Staff Operations",
    createdAt: "2026-08-05T10:30:00Z",
    dueDate: "2026-08-20"
  },
  {
    id: "YUG-2026-0802",
    clientName: "V and B Enterprises",
    clientPhone: "919812345678",
    companyName: "https://v-b-beta.vercel.app/",
    requirementCategory: "Retail & E-Commerce Web App",
    requirementDetails: "High-speed retail e-commerce web application with interactive product catalog and cart.",
    totalAmount: 18000,
    tokenPaid: 18000,
    pendingAmount: 0,
    paymentMethod: "PhonePe QR",
    txnRef: "TXN-47201844",
    status: "fully-paid",
    salesPerson: "Staff Operations",
    createdAt: "2026-08-06T14:15:00Z",
    dueDate: "2026-08-06"
  },
  {
    id: "YUG-2026-0803",
    clientName: "Govindraj Watch & Gift",
    clientPhone: "919922334455",
    companyName: "Govindraj Watch Center",
    requirementCategory: "E-Commerce Website & Catalog",
    requirementDetails: "Luxury watch & gift catalog with WhatsApp ordering.",
    totalAmount: 45000,
    tokenPaid: 15000,
    pendingAmount: 30000,
    paymentMethod: "Bank Transfer",
    txnRef: "TXN-11029384",
    status: "partial",
    salesPerson: "Staff Operations",
    createdAt: "2026-08-07T11:00:00Z",
    dueDate: "2026-08-25"
  }
];

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    "Content-Type": "application/json; charset=utf-8"
  };
}

async function getKV(env, key, defaultVal) {
  if (env && env.YUGVEX_KV) {
    try {
      const val = await env.YUGVEX_KV.get(key, "json");
      if (val) return val;
    } catch (e) {
      console.warn("KV read error:", e);
    }
  }
  return edgeMemoryStore[key] || defaultVal;
}

async function setKV(env, key, value) {
  edgeMemoryStore[key] = value;
  if (env && env.YUGVEX_KV) {
    try {
      await env.YUGVEX_KV.put(key, JSON.stringify(value));
    } catch (e) {
      console.warn("KV write error:", e);
    }
  }
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api\/?/, "");
  const method = request.method.toUpperCase();

  // Handle CORS Preflight
  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  // Health / Status Check
  if (path === "health" || path === "status" || path === "") {
    return new Response(
      JSON.stringify({
        status: "online",
        provider: "Cloudflare Edge",
        datacenter: request.cf ? request.cf.colo : "Edge",
        country: request.cf ? request.cf.country : "IN",
        timestamp: new Date().toISOString(),
        kvBound: !!(env && env.YUGVEX_KV)
      }),
      { status: 200, headers: corsHeaders() }
    );
  }

  // 1. QUOTATIONS API (/api/quotations)
  if (path.startsWith("quotations")) {
    const parts = path.split("/");
    const quoteId = parts[1];

    if (method === "GET") {
      const data = await getKV(env, "quotations", DEFAULT_QUOTATIONS);
      return new Response(JSON.stringify({ success: true, data }), {
        status: 200,
        headers: corsHeaders()
      });
    }

    if (method === "POST") {
      try {
        const body = await request.json();
        let list = await getKV(env, "quotations", DEFAULT_QUOTATIONS);
        const idx = list.findIndex(q => q.id === body.id);
        if (idx !== -1) {
          list[idx] = body;
        } else {
          list.unshift(body);
        }
        await setKV(env, "quotations", list);
        return new Response(JSON.stringify({ success: true, data: body }), {
          status: 200,
          headers: corsHeaders()
        });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 400,
          headers: corsHeaders()
        });
      }
    }

    if (method === "DELETE" && quoteId) {
      let list = await getKV(env, "quotations", DEFAULT_QUOTATIONS);
      list = list.filter(q => q.id !== quoteId);
      await setKV(env, "quotations", list);
      return new Response(JSON.stringify({ success: true, deletedId: quoteId }), {
        status: 200,
        headers: corsHeaders()
      });
    }
  }

  // 2. TRANSACTIONS API (/api/transactions)
  if (path.startsWith("transactions")) {
    const parts = path.split("/");
    const txnId = parts[1];

    if (method === "GET") {
      const data = await getKV(env, "transactions", DEFAULT_TRANSACTIONS);
      return new Response(JSON.stringify({ success: true, data }), {
        status: 200,
        headers: corsHeaders()
      });
    }

    if (method === "POST") {
      try {
        const body = await request.json();
        let list = await getKV(env, "transactions", DEFAULT_TRANSACTIONS);
        const idx = list.findIndex(t => t.id === body.id);
        if (idx !== -1) {
          list[idx] = body;
        } else {
          list.unshift(body);
        }
        await setKV(env, "transactions", list);
        return new Response(JSON.stringify({ success: true, data: body }), {
          status: 200,
          headers: corsHeaders()
        });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 400,
          headers: corsHeaders()
        });
      }
    }

    if (method === "DELETE" && txnId) {
      let list = await getKV(env, "transactions", DEFAULT_TRANSACTIONS);
      list = list.filter(t => t.id !== txnId);
      await setKV(env, "transactions", list);
      return new Response(JSON.stringify({ success: true, deletedId: txnId }), {
        status: 200,
        headers: corsHeaders()
      });
    }
  }

  // 3. CLIENT REQUESTS API (/api/requests)
  if (path.startsWith("requests")) {
    const parts = path.split("/");
    const reqId = parts[1];

    if (method === "GET") {
      const data = await getKV(env, "requests", []);
      return new Response(JSON.stringify({ success: true, data }), {
        status: 200,
        headers: corsHeaders()
      });
    }

    if (method === "POST") {
      try {
        const body = await request.json();
        let list = await getKV(env, "requests", []);
        const idx = list.findIndex(r => r.id === body.id);
        if (idx !== -1) {
          list[idx] = body;
        } else {
          list.unshift(body);
        }
        await setKV(env, "requests", list);
        return new Response(JSON.stringify({ success: true, data: body }), {
          status: 200,
          headers: corsHeaders()
        });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 400,
          headers: corsHeaders()
        });
      }
    }

    if (method === "DELETE" && reqId) {
      let list = await getKV(env, "requests", []);
      list = list.filter(r => r.id !== reqId);
      await setKV(env, "requests", list);
      return new Response(JSON.stringify({ success: true, deletedId: reqId }), {
        status: 200,
        headers: corsHeaders()
      });
    }
  }

  return new Response(JSON.stringify({ error: "Route Not Found", path }), {
    status: 404,
    headers: corsHeaders()
  });
}
