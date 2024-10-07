export function initMobileMenu(): void {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
  
    if (!mobileMenuToggle || !mobileMenu) {
      console.error('Mobile menu elements not found');
      return;
    }
  
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }