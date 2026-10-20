// Progressive enhancements only: all content and links work without JavaScript.
(() => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.getElementById('navigation');
  if (menu && nav) {
    document.documentElement.classList.add('js-nav');
    menu.hidden = false;
    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      menu.setAttribute('aria-expanded', String(open));
      menu.querySelector('span').textContent = open ? '−' : '＋';
    };
    menu.addEventListener('click', () => setOpen(menu.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        menu.focus();
      }
    });
    window.matchMedia('(min-width: 1121px)').addEventListener('change', () => setOpen(false));
  }
  const controls = document.querySelector('.publication-tools');
  if (controls) {
    controls.hidden = false;
    const buttons = controls.querySelectorAll('[data-filter]');
    const entries = document.querySelectorAll('.full-list .publication');
    buttons.forEach((button) => button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      let count = 0;
      entries.forEach((entry) => {
        entry.hidden = filter !== 'all' && entry.dataset.category !== filter;
        if (!entry.hidden) count += 1;
      });
      buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      document.getElementById('filter-status').textContent = `Showing ${count} ${filter === 'journal' ? 'journal articles' : filter === 'preprint' ? 'preprints' : filter === 'proceedings' ? 'conference papers' : 'publications'}`;
    }));
  }
})();
