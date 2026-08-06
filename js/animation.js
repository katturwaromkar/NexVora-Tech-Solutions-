/* ==========================================================================
   NexVora Tech Solutions - Scroll Reveal & Cursor Glow Parallax Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initMouseGlowTracking();
});

function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (revealEls.length === 0) return;

  const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -20px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealEls.forEach(el => observer.observe(el));
}

function initMouseGlowTracking() {
  const glassCards = document.querySelectorAll('.glass-card');

  glassCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}
