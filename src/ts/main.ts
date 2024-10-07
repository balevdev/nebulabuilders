import 'htmx.org';
import { initMobileMenu } from './modules/mobileMenu';
import { initScrollToTop } from './modules/scrollToTop';
import { initNewsletter } from './modules/newsletter';
import { initSearch } from './modules/search';

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollToTop();
  initNewsletter();
  initSearch();
});

// Initialize HTMX
(window as any).htmx = require('htmx.org');