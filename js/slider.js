/* ==========================================================================
   Yugvex Tech Solutions - Slider & Carousel JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTestimonialSlider();
});

function initTestimonialSlider() {
  const track = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.slider-prev-btn');
  const nextBtn = document.querySelector('.slider-next-btn');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const slideCount = slides.length;

  function updateSliderPosition() {
    slides.forEach((slide, idx) => {
      slide.style.transform = `translateX(-${currentIndex * 100}%)`;
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slideCount;
    updateSliderPosition();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slideCount) % slideCount;
    updateSliderPosition();
  }

  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  // Auto play carousel every 6 seconds
  let autoPlay = setInterval(nextSlide, 6000);

  const container = document.querySelector('.testimonial-slider-wrap');
  if (container) {
    container.addEventListener('mouseenter', () => clearInterval(autoPlay));
    container.addEventListener('mouseleave', () => {
      autoPlay = setInterval(nextSlide, 6000);
    });
  }

  // Touch Swipe Support
  let startX = 0;
  let endX = 0;

  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  });

  track.addEventListener('touchend', e => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
  });

  function handleSwipe() {
    if (startX - endX > 40) {
      nextSlide();
    } else if (endX - startX > 40) {
      prevSlide();
    }
  }
}
