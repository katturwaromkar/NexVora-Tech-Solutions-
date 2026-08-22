/* ==========================================================================
   Yugvex Tech Solutions - Advanced Next-Gen AI Conversational Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initYugvexAIChatbot();
});

function initYugvexAIChatbot() {
  // Inject Chatbot HTML Markup dynamically if not already present
  if (!document.getElementById('aiChatWindow')) {
    injectChatbotDOM();
  }

  const trigger = document.getElementById('aiChatTrigger');
  const windowEl = document.getElementById('aiChatWindow');
  const closeBtn = document.getElementById('aiChatClose');
  const minimizeBtn = document.getElementById('aiChatMinimize');
  const teaser = document.getElementById('aiChatTeaser');
  const teaserClose = document.getElementById('teaserClose');
  const inputEl = document.getElementById('aiChatInput');
  const sendBtn = document.getElementById('aiChatSend');
  const bodyEl = document.getElementById('aiChatBody');
  const badge = document.getElementById('aiChatBadge');

  if (!trigger || !windowEl) return;

  let isOpen = false;
  let hasInteracted = false;

  // Show Teaser popup after 3.5 seconds
  setTimeout(() => {
    if (!hasInteracted && teaser) {
      teaser.style.display = 'flex';
    }
  }, 3500);

  function toggleChat() {
    isOpen = !isOpen;
    hasInteracted = true;

    if (isOpen) {
      windowEl.classList.add('active');
      document.body.classList.add('ai-chat-open');
      if (teaser) teaser.style.display = 'none';
      if (badge) badge.style.display = 'none';
      setTimeout(() => inputEl.focus(), 100);
    } else {
      windowEl.classList.remove('active');
      document.body.classList.remove('ai-chat-open');
    }
  }

  trigger.addEventListener('click', toggleChat);
  if (closeBtn) closeBtn.addEventListener('click', () => { isOpen = false; windowEl.classList.remove('active'); document.body.classList.remove('ai-chat-open'); });
  if (minimizeBtn) minimizeBtn.addEventListener('click', () => { isOpen = false; windowEl.classList.remove('active'); document.body.classList.remove('ai-chat-open'); });
  
  if (teaser) {
    teaser.addEventListener('click', (e) => {
      if (e.target !== teaserClose) {
        toggleChat();
      }
    });
  }

  if (teaserClose) {
    teaserClose.addEventListener('click', (e) => {
      e.stopPropagation();
      teaser.style.display = 'none';
    });
  }

  // Handle Form Submit & Enter Key
  function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;

    // Append User Message
    appendMessage(text, 'user');
    inputEl.value = '';

    // Show Typing Indicator
    showTypingIndicator();

    // Generate AI Response with slight delay for realistic conversation
    setTimeout(() => {
      removeTypingIndicator();
      const replyObj = generateAIResponse(text);
      appendMessage(replyObj.text, 'bot', replyObj.chips);
    }, 700);
  }

  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  });

  // Global Chip Click Handler
  bodyEl.addEventListener('click', (e) => {
    const chip = e.target.closest('.chat-chip');
    if (chip) {
      const chipText = chip.getAttribute('data-value') || chip.textContent.trim();
      inputEl.value = chipText;
      sendMessage();
    }
  });
}

function injectChatbotDOM() {
  const container = document.createElement('div');
  container.id = 'yugvex-chatbot-wrapper';
  container.innerHTML = `
    <!-- Floating Trigger -->
    <button class="ai-chat-trigger" id="aiChatTrigger" aria-label="Open Yugvex AI Assistant">
      <img src="assets/images/ai-assistant-avatar.png" alt="Yugvex AI Assistant" class="trigger-avatar-img">
      <span class="trigger-pulse-dot"></span>
      <span class="ai-chat-badge" id="aiChatBadge">1</span>
    </button>

    <!-- Proactive Teaser Bubble -->
    <div class="ai-chat-teaser" id="aiChatTeaser" style="display:none;">
      <div style="width:36px;height:36px;flex-shrink:0;">
        <img src="assets/images/ai-assistant-avatar.png" alt="Yugvex AI" style="width:100%;height:100%;border-radius:50%;object-fit:cover;border:1px solid var(--primary);">
      </div>
      <div>
        <strong style="font-size:0.88rem;color:var(--text-main);display:block;margin-bottom:0.15rem;">Yugvex AI Assistant</strong>
        <p style="font-size:0.8rem;color:var(--text-muted);margin:0;">Looking for Custom ERP, Web Development, or AI solutions?</p>
      </div>
      <button class="teaser-close-btn" id="teaserClose">&times;</button>
    </div>

    <!-- Chat Modal Window -->
    <div class="ai-chat-window" id="aiChatWindow">
      <div class="chat-header">
        <div class="chat-brand-info">
          <div class="chat-avatar-wrap">
            <img src="assets/images/ai-assistant-avatar.png" alt="Yugvex AI Avatar" class="chat-avatar-img">
            <div class="chat-avatar-status"></div>
          </div>
          <div class="chat-title-box">
            <h4>Yugvex AI Assistant <span style="font-size:0.75rem;padding:0.1rem 0.4rem;border-radius:4px;background:rgba(6,182,212,0.2);color:var(--primary);">v2.4</span></h4>
            <div class="chat-status-sub">⚡ Online • Engineering Support</div>
          </div>
        </div>
        <div class="chat-header-actions">
          <button class="chat-header-btn" id="aiChatMinimize" title="Minimize">—</button>
          <button class="chat-header-btn" id="aiChatClose" title="Close">&times;</button>
        </div>
      </div>

      <div class="chat-body" id="aiChatBody">
        <div class="chat-msg bot">
          <div class="chat-msg-avatar">
            <img src="assets/images/ai-assistant-avatar.png" alt="AI Avatar" class="msg-avatar-img">
          </div>
          <div>
            <div class="chat-msg-bubble">
              Welcome to <strong>Yugvex Tech Solutions</strong>! 🚀<br><br>
              I am your 24/7 AI Sales & Engineering Assistant. How can I assist your business today?
            </div>
            <div class="chat-chips-wrap">
              <span class="chat-chip" data-value="Explore SaaS Products">🚀 SaaS Products</span>
              <span class="chat-chip" data-value="Turnkey Website Templates">🎨 Turnkey Templates</span>
              <span class="chat-chip" data-value="AI Automation & Voice Agents">🤖 AI Automation</span>
              <span class="chat-chip" data-value="Book Live Enterprise Demo">📅 Book Live Demo</span>
              <span class="chat-chip" data-value="Chat on WhatsApp">💬 WhatsApp Director</span>
            </div>
            <span class="chat-msg-time">${getCurrentTimeStr()}</span>
          </div>
        </div>
      </div>

      <div class="chat-footer">
        <div class="chat-input-row">
          <input type="text" class="chat-input" id="aiChatInput" placeholder="Ask about ERPs, Templates, Pricing, AI..." autocomplete="off">
          <button class="chat-send-btn" id="aiChatSend" aria-label="Send Message">➤</button>
        </div>
        <div class="chat-footer-note">Direct response powered by Co-Founder Omkar Katturwar (+91 7219290885)</div>
      </div>
    </div>
  `;
  document.body.appendChild(container);
}

function appendMessage(text, sender = 'bot', chips = []) {
  const bodyEl = document.getElementById('aiChatBody');
  if (!bodyEl) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg ${sender}`;

  const avatarHTML = sender === 'bot' 
    ? `<img src="assets/images/ai-assistant-avatar.png" alt="AI Avatar" class="msg-avatar-img">`
    : `<span style="font-size:0.85rem;">👤</span>`;
  const timeStr = getCurrentTimeStr();

  let chipsHTML = '';
  if (chips && chips.length > 0) {
    chipsHTML = `
      <div class="chat-chips-wrap">
        ${chips.map(chip => `<span class="chat-chip" data-value="${escapeHTML(chip)}">${escapeHTML(chip)}</span>`).join('')}
      </div>
    `;
  }

  msgDiv.innerHTML = `
    <div class="chat-msg-avatar">${avatarHTML}</div>
    <div>
      <div class="chat-msg-bubble">${formatMessageText(text)}</div>
      ${chipsHTML}
      <span class="chat-msg-time">${timeStr}</span>
    </div>
  `;

  bodyEl.appendChild(msgDiv);
  bodyEl.scrollTop = bodyEl.scrollHeight;
}

function showTypingIndicator() {
  const bodyEl = document.getElementById('aiChatBody');
  if (!bodyEl) return;

  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-msg bot';
  typingDiv.id = 'aiChatTyping';
  typingDiv.innerHTML = `
    <div class="chat-msg-avatar">
      <img src="assets/images/ai-assistant-avatar.png" alt="AI Avatar" class="msg-avatar-img">
    </div>
    <div>
      <div class="chat-msg-bubble" style="padding:0.4rem 0.8rem;">
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>
  `;
  bodyEl.appendChild(typingDiv);
  bodyEl.scrollTop = bodyEl.scrollHeight;
}

function removeTypingIndicator() {
  const typingEl = document.getElementById('aiChatTyping');
  if (typingEl) typingEl.remove();
}

function generateAIResponse(userText) {
  const input = userText.toLowerCase();

  // 1. Specific Pharmacy Inquiry
  if (input.includes('pharmacy') || input.includes('medicine') || input.includes('drug') || input.includes('expiry')) {
    return {
      text: `💊 <strong>Pharmacy Store ERP & Website Suite</strong>:<br><br>
        • <strong>Features:</strong> Batch & Expiry tracking, salt composition engine, GST billing & reorder alerts.<br>
        • <strong>Template Pricing:</strong> Turnkey site starting at ₹4,999.<br>
        • <strong>Full ERP Subscription:</strong> Custom monthly/annual license.<br><br>
        Would you like to schedule a live demo or request immediate deployment?`,
      chips: ['Book Pharmacy ERP Demo', 'Preview Pharmacy Template', 'Get Custom Quote', 'Chat on WhatsApp']
    };
  }

  // 2. Specific Restaurant / POS Inquiry
  if (input.includes('restaurant') || input.includes('restro') || input.includes('menu') || input.includes('kot') || input.includes('pos')) {
    return {
      text: `🍽️ <strong>Restaurant ERP & Digital POS Suite</strong>:<br><br>
        • <strong>Live Demo Available:</strong> <a href="https://demo-restro-mangement-system.vercel.app/" target="_blank" style="color:var(--primary);font-weight:bold;">Launch Restaurant Demo ↗</a><br>
        • <strong>Key Features:</strong> Kitchen Display System (KOT), Table ordering, QR Digital Menu, Stock & recipe management.<br><br>
        Ready to digitize your restaurant or cafe?`,
      chips: ['Restaurant Live Demo ↗', 'Book Demo', 'Get Pricing Quote', 'Chat on WhatsApp']
    };
  }

  // 3. Specific Hospital / OPD Inquiry
  if (input.includes('hospital') || input.includes('opd') || input.includes('doctor') || input.includes('patient') || input.includes('clinic')) {
    return {
      text: `🏥 <strong>Hospital MIS & OPD Management Portal</strong>:<br><br>
        • <strong>Features:</strong> OPD appointment booking, doctor scheduling, bed management, electronic health records (EHR) & billing.<br>
        • <strong>Deployment Time:</strong> 3 to 5 business days.<br><br>
        Would you like to review technical specs or talk to our health-tech lead?`,
      chips: ['Book Hospital MIS Demo', 'Get Custom Quote', 'Chat on WhatsApp']
    };
  }

  // 4. Specific School / College ERP Inquiry
  if (input.includes('school') || input.includes('college') || input.includes('student') || input.includes('fee') || input.includes('attendance')) {
    return {
      text: `🎓 <strong>Smart School & College ERP Suite</strong>:<br><br>
        • <strong>Modules:</strong> Student attendance, automated fee collection, online report cards, exam manager & parent portal.<br>
        • <strong>Cloud Security:</strong> Bank-grade encryption & 99.9% uptime.<br><br>
        We can set up a sandbox demonstration for your institute.`,
      chips: ['Book School ERP Demo', 'Get Custom Quote', 'Chat on WhatsApp']
    };
  }

  // 5. Careers & Internships
  if (input.includes('intern') || input.includes('career') || input.includes('job') || input.includes('hiring') || input.includes('apply')) {
    return {
      text: `🎓 <strong>Yugvex Technology Internships</strong>:<br><br>
        We offer hands-on internships in:<br>
        • 💻 Full-Stack Web Engineering<br>
        • 🤖 AI & Machine Learning Research<br>
        • 🎨 UI/UX Design & Product Architecture<br><br>
        Applications are reviewed directly by Co-Founder Omkar Katturwar!`,
      chips: ['View Careers Page', 'Apply on WhatsApp', 'Book Consultation']
    };
  }

  // 6. Contact & Direct WhatsApp
  if (input.includes('whatsapp') || input.includes('phone') || input.includes('call') || input.includes('contact') || input.includes('omkar') || input.includes('number') || input.includes('email')) {
    const waUrl = `https://wa.me/917219290885?text=${encodeURIComponent('Hello Omkar Katturwar! I am reaching out from Yugvex AI Assistant.')}`;
    return {
      text: `You can connect directly with Director <strong>Omkar Katturwar</strong>:<br><br>
        📞 <strong>Phone:</strong> <a href="tel:7219290885" style="color:var(--primary);">+91 7219290885</a><br>
        ✉️ <strong>Email:</strong> <a href="mailto:katturwaroma313@gmail.com" style="color:var(--primary);">katturwaroma313@gmail.com</a><br>
        💬 <strong>WhatsApp:</strong> <a href="${waUrl}" target="_blank" style="color:#25D366;font-weight:bold;">Launch WhatsApp Chat ↗</a>`,
      chips: ['Book Live Demo', 'Turnkey Templates', 'Explore SaaS Products']
    };
  }

  // 7. Turnkey Templates
  if (input.includes('template') || input.includes('turnkey') || input.includes('design') || input.includes('website')) {
    return {
      text: `🎨 <strong>Turnkey Website Templates</strong>:<br>
        We offer pixel-perfect, ready-to-deploy templates tailored for:<br>
        • 💊 <strong>Pharmacy Stores</strong><br>
        • ⌚ <strong>Watch & Gift Accessories</strong><br>
        • 🏥 <strong>Hospital & OPD Portals</strong><br>
        • 🎓 <strong>School & College ERP Portals</strong><br><br>
        Deployment takes just <strong>48 to 72 hours</strong> starting at <strong>₹4,999</strong>!`,
      chips: ['Preview Pharmacy Template', 'Preview Watch Template', 'Custom Template Request', 'Chat on WhatsApp']
    };
  }

  // 8. AI Innovations
  if (input.includes('ai') || input.includes('voice') || input.includes('bot') || input.includes('resume') || input.includes('ocr')) {
    return {
      text: `🤖 <strong>Yugvex AI Innovations (Upcoming Suite)</strong>:<br><br>
        • 🎙️ <strong>AI Voice Calling Agent:</strong> Automated inbound/outbound phone calls for lead qualification.<br>
        • 📄 <strong>AI Resume Screen Assistant:</strong> Automatic parsing and candidate scoring.<br>
        • 🔍 <strong>AI Document OCR:</strong> Extract data from invoices & prescription documents instantly.`,
      chips: ['Join AI Beta Waitlist', 'Book AI Demo', 'Chat on WhatsApp']
    };
  }

  // 9. Pricing & Custom Quote Calculator
  if (input.includes('price') || input.includes('cost') || input.includes('quote') || input.includes('rate') || input.includes('fee')) {
    return {
      text: `💰 <strong>Transparent Enterprise Pricing</strong>:<br><br>
        • <strong>Turnkey Website Templates:</strong> Starting from ₹4,999 (Instant 48h launch).<br>
        • <strong>SaaS ERP Solutions:</strong> Flexible monthly / annual subscription plans.<br>
        • <strong>Custom Software Development:</strong> Sprint-based milestones tailored to project scope.<br><br>
        Submit a request for an official customized quotation!`,
      chips: ['Get Custom Quote', 'Chat on WhatsApp', 'Book Live Demo']
    };
  }

  // 10. Book Demo / Schedule
  if (input.includes('demo') || input.includes('book') || input.includes('schedule') || input.includes('consultation')) {
    return {
      text: `📅 <strong>Schedule an Enterprise Demo</strong>:<br><br>
        Click below to open our instant booking modal or chat directly with Director Omkar Katturwar.`,
      chips: ['Open Booking Form', 'Chat on WhatsApp', 'Call +91 7219290885']
    };
  }

  // Default Fallback
  return {
    text: `Thanks for asking! At <strong>Yugvex Tech Solutions</strong>, we specialize in Custom Web & Mobile Apps, Enterprise ERPs, SaaS Products, Turnkey Website Templates, and AI Automation.<br><br>
      How can Co-Founder Omkar Katturwar & our engineering team help your business today?`,
    chips: ['Explore SaaS Products', 'Turnkey Templates', 'AI Innovations', 'Chat on WhatsApp']
  };
}

function getCurrentTimeStr() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutesStr} ${ampm}`;
}

function formatMessageText(str) {
  if (!str) return '';
  return str
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
