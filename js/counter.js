/* ==========================================================================
   NexVora Tech Solutions - Stats Counter & Skill Bar Animation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCounters();
  initProgressBars();
});

function initCounters() {
  const counterEls = document.querySelectorAll('.counter-val');
  if (counterEls.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-target') || '0');
  const duration = 2000; // ms
  const frameRate = 1000 / 60;
  const totalFrames = Math.round(duration / frameRate);
  let frame = 0;
  const suffix = el.getAttribute('data-suffix') || '';

  const timer = setInterval(() => {
    frame++;
    const progress = frame / totalFrames;
    // Ease out quad
    const currentVal = Math.round(target * (1 - Math.pow(1 - progress, 2)));

    el.textContent = currentVal + suffix;

    if (frame === totalFrames) {
      clearInterval(timer);
      el.textContent = target + suffix;
    }
  }, frameRate);
}

function initProgressBars() {
  const progressBars = document.querySelectorAll('.progress-fill');
  if (progressBars.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.getAttribute('data-progress') || '0%';
        fill.style.width = width;
        obs.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  progressBars.forEach(bar => observer.observe(bar));
}
