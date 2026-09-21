
(() => {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menu');
      });
    });
  }

  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  const dialog = document.querySelector('#lightbox');
  const dialogImage = dialog?.querySelector('img');
  const dialogCaption = dialog?.querySelector('figcaption');
  const closeButton = dialog?.querySelector('.lightbox-close');

  document.querySelectorAll('[data-lightbox]').forEach(button => {
    button.addEventListener('click', () => {
      if (!dialog || !dialogImage) return;
      dialogImage.src = button.dataset.lightbox || '';
      dialogImage.alt = button.querySelector('img')?.alt || '';
      if (dialogCaption) dialogCaption.textContent = button.dataset.caption || '';
      dialog.showModal();
      closeButton?.focus();
    });
  });

  closeButton?.addEventListener('click', () => dialog?.close());

  dialog?.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });

  // Progressive enhancement only: keep the destination visible even if JS is disabled.
  document.querySelectorAll('[data-download]').forEach(link => {
    link.addEventListener('click', () => {
      try {
        sessionStorage.setItem('astuti_ping_last_download_click', new Date().toISOString());
      } catch (_) {
        // Storage is optional; download remains functional.
      }
    });
  });
})();
