export function initScrollToTop(): void {
    const scrollToTopButton = document.getElementById('scroll-to-top');
  
    if (!scrollToTopButton) {
      console.error('Scroll to top button not found');
      return;
    }
  
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 100) {
        scrollToTopButton.classList.remove('hidden');
      } else {
        scrollToTopButton.classList.add('hidden');
      }
    });
  
    scrollToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }