/* MalawiPastPapers — Main JavaScript */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initSearch();
  initCountryTabs();
  initPaperFilters();
});

function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.nav-mobile');
  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', mobileNav.classList.contains('open'));
  });

  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function initSearch() {
  const searchForms = document.querySelectorAll('[data-search-form]');
  searchForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="search"], input[name="q"]');
      const query = input?.value.trim();
      if (query) {
        window.location.href = `papers/index.html?q=${encodeURIComponent(query)}`;
      }
    });
  });

  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (q) {
    const searchInput = document.querySelector('[data-search-input]');
    if (searchInput) searchInput.value = q;
    filterPapers(q);
  }
}

function initCountryTabs() {
  const tabs = document.querySelectorAll('.country-tab');
  const panels = document.querySelectorAll('[data-country-panel]');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const country = tab.dataset.country;
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      panels.forEach(p => {
        p.hidden = p.dataset.countryPanel !== country;
      });
    });
  });
}

function initPaperFilters() {
  const filters = document.querySelectorAll('[data-filter]');
  if (!filters.length) return;

  filters.forEach(filter => {
    filter.addEventListener('change', applyFilters);
  });
}

function applyFilters() {
  const university = document.querySelector('[data-filter="university"]')?.value || '';
  const subject = document.querySelector('[data-filter="subject"]')?.value || '';
  const year = document.querySelector('[data-filter="year"]')?.value || '';
  const items = document.querySelectorAll('[data-paper]');

  items.forEach(item => {
    const matchUni = !university || item.dataset.university === university;
    const matchSub = !subject || item.dataset.subject === subject;
    const matchYear = !year || item.dataset.year === year;
    item.style.display = matchUni && matchSub && matchYear ? '' : 'none';
  });

  const visible = document.querySelectorAll('[data-paper]:not([style*="none"])');
  const noResults = document.querySelector('[data-no-results]');
  if (noResults) {
    noResults.hidden = visible.length > 0;
  }
}

function filterPapers(query) {
  const lower = query.toLowerCase();
  const items = document.querySelectorAll('[data-paper]');
  let count = 0;

  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    const match = text.includes(lower);
    item.style.display = match ? '' : 'none';
    if (match) count++;
  });

  const noResults = document.querySelector('[data-no-results]');
  const resultsCount = document.querySelector('[data-results-count]');
  if (noResults) noResults.hidden = count > 0;
  if (resultsCount) resultsCount.textContent = `${count} result${count !== 1 ? 's' : ''} found`;
}
