import Fuse, { FuseResult } from 'fuse.js';

interface Post {
  title: string;
  permalink: string;
  summary: string;
}

export function initSearch(): void {
  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  const searchResults = document.getElementById('search-results');

  if (!searchInput || !searchResults) {
    console.error('Search elements not found');
    return;
  }

  fetch('/index.json')
    .then(response => response.json())
    .then(data => {
      const fuse = new Fuse(data, {
        keys: ['title', 'summary'],
        threshold: 0.3,
      });

      searchInput.addEventListener('input', () => {
        const results = fuse.search(searchInput.value);
        displayResults(results);
      });
    });

  function displayResults(results: FuseResult<Post>[]): void {
    searchResults.innerHTML = '';
    results.forEach(result => {
      const post = result.item;
      const li = document.createElement('li');
      li.innerHTML = `
        <a href="${post.permalink}" class="block p-2 hover:bg-gray-100">
          <h3 class="font-semibold">${post.title}</h3>
          <p class="text-sm text-gray-600">${post.summary}</p>
        </a>
      `;
      searchResults.appendChild(li);
    });
  }
}