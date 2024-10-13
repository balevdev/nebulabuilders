// assets/js/mermaid-init.js
document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('.mermaid').forEach((element) => {
      mermaid.init(undefined, element);
    });
  });