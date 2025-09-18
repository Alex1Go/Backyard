class HorizontalSlider {
  constructor() {
    this.currentSlide = 0;
    this.totalSlides = 3;
    this.sliderTrack = document.getElementById('sliderTrack');
    this.dots = document.querySelectorAll('.dot');

    if (!this.sliderTrack || this.dots.length === 0) {
      console.error('Slider elements not found');
      return;
    }

    this.init();
  }

  init() {
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    this.addTouchSupport();
  }

  updateSlider() {
    const translateX = -this.currentSlide * (100 / this.totalSlides);
    this.sliderTrack.style.transform = `translateX(${translateX}%)`;

    this.dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentSlide);
    });
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateSlider();
  }

  prevSlide() {
    this.currentSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
    this.updateSlider();
  }

  goToSlide(slideIndex) {
    this.currentSlide = slideIndex;
    this.updateSlider();
  }

  addTouchSupport() {
    let startX = 0;
    let endX = 0;
    let startY = 0;
    let endY = 0;
    let isDragging = false;

    this.sliderTrack.addEventListener(
      'touchstart',
      e => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
      },
      { passive: true }
    );

    this.sliderTrack.addEventListener(
      'touchmove',
      e => {
        if (!isDragging) return;

        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const deltaX = Math.abs(currentX - startX);
        const deltaY = Math.abs(currentY - startY);

        if (deltaX > deltaY) {
          e.preventDefault();
        }
      },
      { passive: false }
    );

    this.sliderTrack.addEventListener(
      'touchend',
      e => {
        if (!isDragging) return;

        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        isDragging = false;
        this.handleSwipe();
      },
      { passive: true }
    );

    this.sliderTrack.addEventListener('mousedown', e => {
      startX = e.clientX;
      startY = e.clientY;
      isDragging = true;

      const handleMouseMove = e => {
        if (!isDragging) return;
        e.preventDefault();
      };

      const handleMouseUp = e => {
        if (!isDragging) return;

        endX = e.clientX;
        endY = e.clientY;
        isDragging = false;
        this.handleSwipe();

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
  }

  handleSwipe() {
    const threshold = 50;
    const diffX = startX - endX;
    const diffY = Math.abs(startY - endY);

    if (Math.abs(diffX) > threshold && Math.abs(diffX) > diffY) {
      if (diffX > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }
  }

  startAutoplay(interval = 5000) {
    setInterval(() => {
      this.nextSlide();
    }, interval);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new HorizontalSlider();
});
