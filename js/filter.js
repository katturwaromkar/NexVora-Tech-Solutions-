/* ==========================================================================
   Yugvex Tech Solutions - Real-Time Search & Dynamic Filter Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initFilterEngine();
});

function initFilterEngine() {
  const searchInput = document.querySelector('.search-input');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterableItems = document.querySelectorAll('[data-category]');

  if (filterableItems.length === 0) return;

  let activeCategory = 'all';
  let searchQuery = '';

  function applyFilters() {
    filterableItems.forEach(item => {
      const itemCategory = (item.getAttribute('data-category') || '').toLowerCase();
      const itemText = item.textContent.toLowerCase();

      const matchesCategory = activeCategory === 'all' || itemCategory.includes(activeCategory.toLowerCase());
      const matchesSearch = !searchQuery || itemText.includes(searchQuery.toLowerCase());

      if (matchesCategory && matchesSearch) {
        item.style.display = '';
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';
        setTimeout(() => {
          if (!matchesCategory || !matchesSearch) {
            item.style.display = 'none';
          }
        }, 200);
      }
    });

    // Check empty state
    const visibleCount = Array.from(filterableItems).filter(item => item.style.display !== 'none').length;
    let emptyNotice = document.querySelector('.no-results-notice');
    
    if (visibleCount === 0) {
      if (!emptyNotice) {
        emptyNotice = document.createElement('div');
        emptyNotice.className = 'no-results-notice glass-card';
        emptyNotice.style.cssText = 'text-align:center; padding:3rem; grid-column: 1/-1; margin-top:2rem;';
        emptyNotice.innerHTML = `
          <h3 style="margin-bottom:0.5rem;color:var(--text-main);">No Results Found</h3>
          <p style="color:var(--text-muted);">Try adjusting your search terms or selecting a different category filter.</p>
        `;
        filterableItems[0].parentElement.appendChild(emptyNotice);
      }
      emptyNotice.style.display = 'block';
    } else if (emptyNotice) {
      emptyNotice.style.display = 'none';
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      activeCategory = btn.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      applyFilters();
    });
  }
}
