export function initNewsletter(): void {
    const form = document.getElementById('newsletter-form') as HTMLFormElement;
    const response = document.getElementById('form-response');
  
    if (!form || !response) {
      console.error('Newsletter form elements not found');
      return;
    }
  
    form.addEventListener('htmx:afterSwap', () => {
      response.scrollIntoView({ behavior: 'smooth' });
    });
  }