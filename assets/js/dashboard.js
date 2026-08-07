/* ==========================================================================
   ROYAL FEAST EVENTS - CLIENT DASHBOARD INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initGuestCountSlider();
  initAiPlanner();
  initMenuBuilder();
  initLiveOrderTracking();
  initSupportChat();
  initDashboardTabs();
});

/* --------------------------------------------------------------------------
   1. GUEST COUNT SLIDER & DYNAMIC BUDGET CALCULATOR
   -------------------------------------------------------------------------- */
function initGuestCountSlider() {
  const slider = document.getElementById('guestCountSlider');
  const guestValue = document.getElementById('guestCountVal');
  const estBudget = document.getElementById('estimatedBudgetVal');
  const estStaff = document.getElementById('estimatedStaffVal');

  if (!slider || !guestValue) return;

  function calculateCosts() {
    const guests = parseInt(slider.value, 10);
    guestValue.textContent = guests;

    // Base pricing per guest $85
    const cost = guests * 85;
    const staffNeeded = Math.ceil(guests / 15);

    if (estBudget) estBudget.textContent = `$${cost.toLocaleString()}`;
    if (estStaff) estStaff.textContent = `${staffNeeded} Chefs & Servers`;
  }

  slider.addEventListener('input', calculateCosts);
  calculateCosts();
}

/* --------------------------------------------------------------------------
   2. AI EVENT PLANNER & MENU RECOMMENDATIONS
   -------------------------------------------------------------------------- */
function initAiPlanner() {
  const eventTypeSelect = document.getElementById('aiEventType');
  const aiOutputBox = document.getElementById('aiPlannerOutput');
  const generateBtn = document.getElementById('generateAiPlanBtn');

  if (!generateBtn || !aiOutputBox) return;

  const recommendations = {
    wedding: {
      title: "Royal Imperial Wedding Experience",
      courses: "5-Course Gourmet Dining with Live Caviar & Oyster Station",
      pairings: "Dom Pérignon Champagne & Cellar Vintage Red Wines",
      decor: "Velvet Gold Floral Arches & Crystal Candle Centerpieces",
      estCost: "$120 / guest"
    },
    corporate: {
      title: "Executive Gala & Networking Buffet",
      courses: "3-Course Live Interactive Executive Chef Stations",
      pairings: "Artisanal Crafted Cocktails & Organic Juice Bar",
      decor: "Minimal Luxury Glassware & Ambient LED Projection Lighting",
      estCost: "$75 / guest"
    },
    private: {
      title: "Intimate VIP Chef Table Experience",
      courses: "7-Course Seasonal Omakase / Fusion Tasting Menu",
      pairings: "Sommelier Guided Rare Wine Pairing",
      decor: "Handcrafted Ceramics, Custom Engraved Menus & Silk Napkins",
      estCost: "$180 / guest"
    },
    birthday: {
      title: "Luxury Celebration & Dessert Extravaganza",
      courses: "Live Gourmet Grill & 10-Tier Artisanal Dessert Tower",
      pairings: "Signature Sparkling Mocktails & Craft Beers",
      decor: "Festive Sparkler Lights & Custom Photo Wall Backdrop",
      estCost: "$65 / guest"
    }
  };

  generateBtn.addEventListener('click', () => {
    const type = eventTypeSelect ? eventTypeSelect.value : 'wedding';
    const rec = recommendations[type] || recommendations.wedding;

    aiOutputBox.innerHTML = `
      <div class="glass-card" style="padding:24px; border-color:var(--gold-primary); animation:fadeIn 0.5s ease;">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
          <i class="ri-sparkles-line" style="color:var(--gold-primary); font-size:1.4rem;"></i>
          <h4 class="font-serif gold-gradient-text" style="font-size:1.3rem;">${rec.title}</h4>
        </div>
        <p style="color:var(--text-secondary); margin-bottom:10px;"><strong>Suggested Dining:</strong> ${rec.courses}</p>
        <p style="color:var(--text-secondary); margin-bottom:10px;"><strong>Beverage Program:</strong> ${rec.pairings}</p>
        <p style="color:var(--text-secondary); margin-bottom:10px;"><strong>Event Ambience:</strong> ${rec.decor}</p>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px; padding-top:16px; border-top:1px solid var(--border-glass);">
          <span style="color:var(--gold-light); font-weight:600;">Estimated AI Pricing: ${rec.estCost}</span>
          <button class="btn-primary" style="padding:8px 20px; font-size:0.85rem;" onclick="alert('AI Recommendation Applied to Your Catering Order!')">Apply AI Plan</button>
        </div>
      </div>
    `;
  });
}

/* --------------------------------------------------------------------------
   3. INTERACTIVE CUSTOM MENU BUILDER
   -------------------------------------------------------------------------- */
function initMenuBuilder() {
  const dishCheckboxes = document.querySelectorAll('.menu-builder-item input[type="checkbox"]');
  const selectedCountEl = document.getElementById('selectedItemsCount');
  const totalPriceEl = document.getElementById('builderTotalPrice');

  if (!dishCheckboxes.length) return;

  function updateMenuSelection() {
    let count = 0;
    let total = 0;

    dishCheckboxes.forEach(cb => {
      if (cb.checked) {
        count++;
        total += parseFloat(cb.getAttribute('data-price') || 0);
      }
    });

    if (selectedCountEl) selectedCountEl.textContent = count;
    if (totalPriceEl) totalPriceEl.textContent = `$${total.toFixed(2)}`;
  }

  dishCheckboxes.forEach(cb => cb.addEventListener('change', updateMenuSelection));
}

/* --------------------------------------------------------------------------
   4. LIVE ORDER TRACKING SIMULATION
   -------------------------------------------------------------------------- */
function initLiveOrderTracking() {
  const trackingSteps = document.querySelectorAll('.tracking-step');
  const statusBadge = document.getElementById('orderStatusBadge');
  const progressBar = document.getElementById('trackingProgressBar');

  if (!trackingSteps.length) return;

  trackingSteps.forEach((step, index) => {
    step.addEventListener('click', () => {
      trackingSteps.forEach((s, i) => {
        if (i <= index) {
          s.classList.add('completed');
          s.classList.remove('active');
        } else {
          s.classList.remove('completed', 'active');
        }
      });
      step.classList.add('active');

      const stepName = step.querySelector('.step-name')?.textContent || 'Processing';
      if (statusBadge) statusBadge.textContent = `Status: ${stepName}`;
      if (progressBar) progressBar.style.width = `${((index + 1) / trackingSteps.length) * 100}%`;
    });
  });
}

/* --------------------------------------------------------------------------
   5. LIVE SUPPORT CHAT MODAL
   -------------------------------------------------------------------------- */
function initSupportChat() {
  const chatToggleBtn = document.getElementById('openChatBtn');
  const chatModal = document.getElementById('supportChatModal');
  const closeChatBtn = document.getElementById('closeChatBtn');
  const chatInput = document.getElementById('chatInputField');
  const sendChatBtn = document.getElementById('sendChatMsgBtn');
  const chatBody = document.getElementById('chatMessagesBody');

  if (!chatToggleBtn || !chatModal) return;

  chatToggleBtn.addEventListener('click', () => chatModal.classList.add('active'));
  closeChatBtn?.addEventListener('click', () => chatModal.classList.remove('active'));

  function sendMessage() {
    const msg = chatInput?.value.trim();
    if (!msg || !chatBody) return;

    // Append User Message
    const userBubble = document.createElement('div');
    userBubble.style.cssText = 'align-self:flex-end; background:var(--gold-gradient); color:#000; padding:10px 16px; border-radius:16px 16px 0 16px; margin-bottom:10px; max-width:80%; font-size:0.9rem; margin-left:auto;';
    userBubble.textContent = msg;
    chatBody.appendChild(userBubble);
    chatInput.value = '';

    chatBody.scrollTop = chatBody.scrollHeight;

    // Simulated AI / Concierge Response
    setTimeout(() => {
      const conciergeBubble = document.createElement('div');
      conciergeBubble.style.cssText = 'align-self:flex-start; background:rgba(255,255,255,0.08); color:var(--text-primary); padding:10px 16px; border-radius:16px 16px 16px 0; margin-bottom:10px; max-width:80%; font-size:0.9rem;';
      conciergeBubble.innerHTML = `<strong>Royal Concierge:</strong> Thank you for your inquiry. Chef & Logistics team have been notified regarding "${msg}". We will confirm immediately!`;
      chatBody.appendChild(conciergeBubble);
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 1000);
  }

  sendChatBtn?.addEventListener('click', sendMessage);
  chatInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}

/* --------------------------------------------------------------------------
   6. DASHBOARD SIDEBAR NAVIGATION TABS
   -------------------------------------------------------------------------- */
function initDashboardTabs() {
  const dashNavItems = document.querySelectorAll('.dash-nav-item');
  const dashSections = document.querySelectorAll('.dash-section-pane');

  if (!dashNavItems.length || !dashSections.length) return;

  dashNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('data-target');
      if (!targetId) return;

      dashNavItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      dashSections.forEach(sec => {
        if (sec.id === targetId) {
          sec.style.display = 'block';
        } else {
          sec.style.display = 'none';
        }
      });
    });
  });
}
