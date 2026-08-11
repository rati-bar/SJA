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

    // Jump to a specific in-page tab from anywhere (e.g. a button)
    var tabGoto = e.target.closest('[data-tab-goto]');
    if (tabGoto) {
      var grp = tabGoto.closest('[data-tabs]');
      if (grp) {
        var key = tabGoto.dataset.tabGoto;
        grp.querySelectorAll('.tab[data-tab]').forEach(t => t.classList.toggle('active', t.dataset.tab === key));
        grp.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === key));
        return;
      }
    }

    // In-page tab groups
    var tab = e.target.closest('.tab[data-tab]');
    if (tab) {
      var scope = tab.closest('[data-tabs]');
      scope.querySelectorAll('.tab[data-tab]').forEach(t => t.classList.toggle('active', t === tab));
      scope.querySelectorAll('.tab-panel').forEach(p =>
        p.classList.toggle('active', p.dataset.panel === tab.dataset.tab));
      return;
    }

    // Pill tab bars (visual; optional data-show reveals a matching .opt-block)
    var pill = e.target.closest('.pill-tabbar .p');
    if (pill) {
      pill.parentElement.querySelectorAll('.p').forEach(p => p.classList.toggle('active', p === pill));
      if (pill.dataset.show) {
        var scope = pill.closest('.m-body') || pill.closest('[data-optswitch]') || document;
        scope.querySelectorAll('.opt-block').forEach(b => b.classList.toggle('active', b.id === pill.dataset.show));
      }
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

  // Select-driven option blocks: <select data-optselect> whose option values match .opt-block ids
  document.addEventListener('change', function (e) {
    var sel = e.target.closest('select[data-optselect]');
    if (!sel) return;
    var scope = sel.closest('.m-body') || sel.closest('[data-optswitch]') || document;
    var val = sel.value;
    scope.querySelectorAll('.opt-block').forEach(b => b.classList.toggle('active', b.id === val));
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

/* ===== Schedule builder — drag & drop lecture placement ===== */
(function () {
  var dragged = null;

  document.addEventListener('dragstart', function (e) {
    var chip = e.target.closest('.dnd-chip');
    if (!chip || chip.classList.contains('used')) return;
    dragged = chip;
    chip.classList.add('dragging');
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', chip.dataset.lesson || chip.textContent.trim());
    }
  });

  document.addEventListener('dragend', function () {
    if (dragged) dragged.classList.remove('dragging');
    dragged = null;
    document.querySelectorAll('.slot.over').forEach(s => s.classList.remove('over'));
  });

  document.addEventListener('dragover', function (e) {
    var slot = e.target.closest('.slot.empty');
    if (!slot) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    slot.classList.add('over');
  });

  document.addEventListener('dragleave', function (e) {
    var slot = e.target.closest('.slot.empty');
    if (slot && !slot.contains(e.relatedTarget)) slot.classList.remove('over');
  });

  document.addEventListener('drop', function (e) {
    var slot = e.target.closest('.slot.empty');
    if (!slot || !dragged) return;
    e.preventDefault();
    var time = slot.dataset.time || '';
    var grp = dragged.dataset.grp || '';
    var les = dragged.dataset.lesson || dragged.querySelector('.c-les') && dragged.querySelector('.c-les').textContent || '';
    slot.classList.remove('empty', 'over');
    slot.classList.add('filled', 'need-lect');
    slot.setAttribute('data-modal', 'mAssignLecturer');
    slot.innerHTML =
      '<div class="s-time">' + time + '</div>' +
      '<div class="s-grp">' + grp + '</div>' +
      '<div class="s-les">' + les + '</div>' +
      '<div class="s-lect">⚠ ლექტორი მიუთითეთ</div>';
    dragged.classList.add('used');
    // Dropping a lecture pops the lecturer-assignment field
    var m = document.getElementById('mAssignLecturer');
    if (m) m.classList.add('open');
  });
})();
