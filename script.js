document.addEventListener('DOMContentLoaded', () => {
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.slide');
    const slideInterval = 5000; // Show each image for exactly 5 seconds

    if (slides.length === 0) return;

    function showNextSlide() {
        // Fade out current slide
        slides[currentSlideIndex].classList.remove('active');
        
        // Calculate the index for the next slide
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        
        // Fade in next slide
        slides[currentSlideIndex].classList.add('active');
    }

    // Initialize the first slide
    slides[currentSlideIndex].classList.add('active');

    // Start the animation loop for fading in/out every 5 seconds
    setInterval(showNextSlide, slideInterval);
});
