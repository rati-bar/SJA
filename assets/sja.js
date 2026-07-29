/* SJA wireframes — lightweight view + tab switching (no dependencies) */
(function () {
  // Sidebar section navigation
  function activateView(key) {
    document.querySelectorAll('.view').forEach(v =>
      v.classList.toggle('active', v.dataset.view === key));
    document.querySelectorAll('.nav-item').forEach(n =>
      n.classList.toggle('active', n.dataset.target === key));
    var active = document.querySelector('.nav-item[data-target="' + key + '"]');
    var crumb = document.getElementById('crumb');
    var title = document.getElementById('page-title');
    if (active && crumb) crumb.textContent = active.dataset.crumb || active.textContent.trim();
    if (active && title) title.textContent = active.dataset.title || active.textContent.trim();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (history.replaceState) history.replaceState(null, '', '#' + key);
  }

  document.addEventListener('click', function (e) {
    var nav = e.target.closest('.nav-item[data-target]');
    if (nav) { activateView(nav.dataset.target); return; }

    // Deep links to a view (e.g. dashboard quick actions)
    var jump = e.target.closest('[data-goto]');
    if (jump) { e.preventDefault(); activateView(jump.dataset.goto); return; }

    // In-page tab groups
    var tab = e.target.closest('.tab[data-tab]');
    if (tab) {
      var scope = tab.closest('[data-tabs]');
      scope.querySelectorAll('.tab[data-tab]').forEach(t => t.classList.toggle('active', t === tab));
      scope.querySelectorAll('.tab-panel').forEach(p =>
        p.classList.toggle('active', p.dataset.panel === tab.dataset.tab));
      return;
    }

    // Pill tab bars (visual only)
    var pill = e.target.closest('.pill-tabbar .p');
    if (pill) {
      pill.parentElement.querySelectorAll('.p').forEach(p => p.classList.toggle('active', p === pill));
      return;
    }

    // Open a modal: [data-modal="modalId"]
    var opener = e.target.closest('[data-modal]');
    if (opener) {
      e.preventDefault();
      var m = document.getElementById(opener.dataset.modal);
      if (m) m.classList.add('open');
      return;
    }

    // Close a modal: click on .m-close or on the overlay backdrop
    var closer = e.target.closest('.m-close');
    if (closer) {
      var ov = closer.closest('.modal-overlay');
      if (ov) ov.classList.remove('open');
      return;
    }
    if (e.target.classList && e.target.classList.contains('modal-overlay')) {
      e.target.classList.remove('open');
      return;
    }
  });

  // Esc closes any open modal
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
    }
  });

  function openFromHash() {
    var key = (location.hash || '').replace('#', '');
    if (key && document.querySelector('.view[data-view="' + key + '"]')) activateView(key);
  }
  // Open initial view from hash, and respond to hash changes (deep links)
  window.addEventListener('DOMContentLoaded', openFromHash);
  window.addEventListener('hashchange', openFromHash);
})();
