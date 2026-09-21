
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

/* ============================================================
   Astuti Ping Pro — Navegação por âncoras + Acessibilidade
   ============================================================ */
(() => {
  const STORAGE_KEY = 'astuti_ping_accessibility';

  /* ----------------------------------------------------------
     1. Corrige a posição das seções abaixo do cabeçalho sticky
     ---------------------------------------------------------- */
  const navigationStyle = document.createElement('style');
  navigationStyle.textContent = `
    #recursos,
    #relatorios,
    #preco,
    #faq,
    #conteudo {
      scroll-margin-top: 96px;
    }
  `;
  document.head.appendChild(navigationStyle);

  // Corrige também quando a página já abre com #alguma-secao na URL.
  if (window.location.hash) {
    window.setTimeout(() => {
      const target = document.querySelector(window.location.hash);
      if (target) {
        target.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
          block: 'start'
        });
      }
    }, 100);
  }

  /* ----------------------------------------------------------
     2. Estilos dos controles de acessibilidade
     ---------------------------------------------------------- */
  const accessibilityStyle = document.createElement('style');
  accessibilityStyle.textContent = `
    .astuti-a11y-trigger {
      position: fixed;
      left: 14px;
      bottom: 14px;
      z-index: 9000;
      width: 42px;
      height: 42px;
      padding: 0;
      border: 1px solid #cbdbe8;
      border-radius: 50%;
      background: #ffffff;
      color: #0879bd;
      box-shadow: 0 7px 20px rgba(24, 54, 82, .16);
      cursor: pointer;
      display: grid;
      place-items: center;
      font-size: 21px;
      line-height: 1;
    }

    .astuti-a11y-trigger:hover {
      background: #f1f8fd;
    }

    .astuti-a11y-trigger:focus-visible,
    .astuti-a11y-panel button:focus-visible {
      outline: 3px solid rgba(10, 132, 255, .55);
      outline-offset: 3px;
    }

    .astuti-a11y-panel {
      position: fixed;
      left: 14px;
      bottom: 65px;
      z-index: 9000;
      width: min(290px, calc(100vw - 28px));
      padding: 14px;
      border: 1px solid #d7e4ee;
      border-radius: 16px;
      background: #ffffff;
      color: #182b43;
      box-shadow: 0 18px 45px rgba(24, 54, 82, .18);
    }

    .astuti-a11y-panel[hidden] {
      display: none !important;
    }

    .astuti-a11y-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 11px;
    }

    .astuti-a11y-title strong {
      font-size: .95rem;
    }

    .astuti-a11y-close {
      width: 30px;
      height: 30px;
      border: 0;
      border-radius: 8px;
      background: #f0f5f9;
      cursor: pointer;
      font-size: 18px;
    }

    .astuti-a11y-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 7px;
    }

    .astuti-a11y-panel button {
      min-height: 38px;
      padding: 7px 9px;
      border: 1px solid #d5e2ec;
      border-radius: 9px;
      background: #f8fbfd;
      color: #203a55;
      font: inherit;
      font-size: .79rem;
      font-weight: 700;
      cursor: pointer;
    }

    .astuti-a11y-panel button:hover {
      background: #edf6fc;
    }

    .astuti-a11y-panel button[aria-pressed="true"] {
      background: #087fd0;
      border-color: #087fd0;
      color: #ffffff;
    }

    .astuti-a11y-reset {
      grid-column: 1 / -1;
    }

    .astuti-a11y-note {
      margin: 10px 2px 0;
      color: #687c91;
      font-size: .72rem;
      line-height: 1.4;
    }

    .astuti-sr-only {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    }

    /* Destacar links */
    html.astuti-a11y-links a {
      text-decoration: underline !important;
      text-decoration-thickness: 2px !important;
      text-underline-offset: 3px !important;
    }

    /* Alto contraste */
    html.astuti-a11y-contrast body,
    html.astuti-a11y-contrast .site-header,
    html.astuti-a11y-contrast .section,
    html.astuti-a11y-contrast .section-tinted,
    html.astuti-a11y-contrast .pricing-section,
    html.astuti-a11y-contrast .how-it-works,
    html.astuti-a11y-contrast .trust-strip,
    html.astuti-a11y-contrast .content-page,
    html.astuti-a11y-contrast .page-hero,
    html.astuti-a11y-contrast .site-footer {
      background: #000000 !important;
      color: #ffffff !important;
    }

    html.astuti-a11y-contrast h1,
    html.astuti-a11y-contrast h2,
    html.astuti-a11y-contrast h3,
    html.astuti-a11y-contrast h4,
    html.astuti-a11y-contrast p,
    html.astuti-a11y-contrast li,
    html.astuti-a11y-contrast strong,
    html.astuti-a11y-contrast span:not(.status-dot):not(.dot) {
      color: #ffffff !important;
    }

    html.astuti-a11y-contrast a {
      color: #00e5ff !important;
    }

    html.astuti-a11y-contrast .button,
    html.astuti-a11y-contrast button:not(.astuti-a11y-trigger) {
      border-color: #ffffff !important;
    }

    html.astuti-a11y-contrast .price-card,
    html.astuti-a11y-contrast .simple-card,
    html.astuti-a11y-contrast .support-card,
    html.astuti-a11y-contrast .evolution-note,
    html.astuti-a11y-contrast .callout,
    html.astuti-a11y-contrast .steps-grid article {
      background: #111111 !important;
      border-color: #ffffff !important;
      color: #ffffff !important;
    }

    /* Reduzir animações */
    html.astuti-a11y-reduce-motion *,
    html.astuti-a11y-reduce-motion *::before,
    html.astuti-a11y-reduce-motion *::after {
      scroll-behavior: auto !important;
      animation-duration: .001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: .001ms !important;
    }

    @media (max-width: 600px) {
      .astuti-a11y-trigger {
        width: 38px;
        height: 38px;
        left: 10px;
        bottom: 10px;
        font-size: 19px;
      }

      .astuti-a11y-panel {
        left: 10px;
        bottom: 57px;
        width: min(280px, calc(100vw - 20px));
      }

      #recursos,
      #relatorios,
      #preco,
      #faq,
      #conteudo {
        scroll-margin-top: 82px;
      }
    }
  `;
  document.head.appendChild(accessibilityStyle);

  /* ----------------------------------------------------------
     3. Cria o botão e o painel compacto
     ---------------------------------------------------------- */
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'astuti-a11y-trigger';
  trigger.setAttribute('aria-label', 'Abrir opções de acessibilidade');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', 'astuti-a11y-panel');
  trigger.innerHTML = '<span aria-hidden="true">♿</span>';

  const panel = document.createElement('div');
  panel.id = 'astuti-a11y-panel';
  panel.className = 'astuti-a11y-panel';
  panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Opções de acessibilidade');

  panel.innerHTML = `
    <div class="astuti-a11y-title">
      <strong>Acessibilidade</strong>
      <button
        type="button"
        class="astuti-a11y-close"
        aria-label="Fechar opções de acessibilidade"
      >×</button>
    </div>

    <div class="astuti-a11y-grid">
      <button type="button" data-a11y="font-down" aria-label="Diminuir tamanho do texto">A−</button>
      <button type="button" data-a11y="font-up" aria-label="Aumentar tamanho do texto">A+</button>

      <button type="button" data-a11y="contrast" aria-pressed="false">
        Alto contraste
      </button>

      <button type="button" data-a11y="links" aria-pressed="false">
        Destacar links
      </button>

      <button type="button" data-a11y="motion" aria-pressed="false">
        Reduzir animações
      </button>

      <button type="button" data-a11y="vlibras">
        VLibras
      </button>

      <button type="button" data-a11y="reset" class="astuti-a11y-reset">
        Restaurar padrão
      </button>
    </div>

    <p class="astuti-a11y-note">
      Suas preferências ficam salvas neste navegador.
    </p>
  `;

  const liveRegion = document.createElement('div');
  liveRegion.className = 'astuti-sr-only';
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('aria-live', 'polite');

  document.body.append(trigger, panel, liveRegion);

  /* ----------------------------------------------------------
     4. Preferências
     ---------------------------------------------------------- */
  let settings = {
    fontScale: 100,
    contrast: false,
    links: false,
    motion: false
  };

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved === 'object') {
      settings = { ...settings, ...saved };
    }
  } catch (_) {
    // O site continua funcionando mesmo se o armazenamento estiver bloqueado.
  }

  const announce = message => {
    liveRegion.textContent = '';
    window.setTimeout(() => {
      liveRegion.textContent = message;
    }, 30);
  };

  const saveSettings = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (_) {
      // Persistência é opcional.
    }
  };

  const applySettings = () => {
    document.documentElement.style.fontSize = `${settings.fontScale}%`;

    document.documentElement.classList.toggle(
      'astuti-a11y-contrast',
      settings.contrast
    );

    document.documentElement.classList.toggle(
      'astuti-a11y-links',
      settings.links
    );

    document.documentElement.classList.toggle(
      'astuti-a11y-reduce-motion',
      settings.motion
    );

    const contrastButton = panel.querySelector('[data-a11y="contrast"]');
    const linksButton = panel.querySelector('[data-a11y="links"]');
    const motionButton = panel.querySelector('[data-a11y="motion"]');

    contrastButton?.setAttribute('aria-pressed', String(settings.contrast));
    linksButton?.setAttribute('aria-pressed', String(settings.links));
    motionButton?.setAttribute('aria-pressed', String(settings.motion));
  };

  applySettings();

  /* ----------------------------------------------------------
     5. Abre/fecha painel
     ---------------------------------------------------------- */
  const openPanel = () => {
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    panel.querySelector('button')?.focus();
  };

  const closePanel = () => {
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    trigger.focus();
  };

  trigger.addEventListener('click', () => {
    if (panel.hidden) {
      openPanel();
    } else {
      closePanel();
    }
  });

  panel.querySelector('.astuti-a11y-close')
    ?.addEventListener('click', closePanel);

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) {
      closePanel();
    }
  });

  document.addEventListener('click', event => {
    if (
      !panel.hidden &&
      !panel.contains(event.target) &&
      !trigger.contains(event.target)
    ) {
      panel.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ----------------------------------------------------------
     6. VLibras oficial
     ---------------------------------------------------------- */
  const loadVLibras = () => {
    if (
      window.VLibrasWidget ||
      document.querySelector('script[src*="vlibras-plugin.js"]')
    ) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.async = true;
    script.dataset.astutiVlibras = 'true';

    script.addEventListener('error', () => {
      announce('Não foi possível carregar o VLibras neste momento.');
    });

    document.body.appendChild(script);
  };

  // Carrega o widget oficial automaticamente.
  loadVLibras();

  /* ----------------------------------------------------------
     7. Ações dos botões
     ---------------------------------------------------------- */
  panel.addEventListener('click', event => {
    const button = event.target.closest('[data-a11y]');
    if (!button) return;

    const action = button.dataset.a11y;

    switch (action) {
      case 'font-up':
        settings.fontScale = Math.min(125, settings.fontScale + 12.5);
        announce(`Tamanho do texto: ${settings.fontScale} por cento.`);
        break;

      case 'font-down':
        settings.fontScale = Math.max(87.5, settings.fontScale - 12.5);
        announce(`Tamanho do texto: ${settings.fontScale} por cento.`);
        break;

      case 'contrast':
        settings.contrast = !settings.contrast;
        announce(
          settings.contrast
            ? 'Alto contraste ativado.'
            : 'Alto contraste desativado.'
        );
        break;

      case 'links':
        settings.links = !settings.links;
        announce(
          settings.links
            ? 'Destaque de links ativado.'
            : 'Destaque de links desativado.'
        );
        break;

      case 'motion':
        settings.motion = !settings.motion;
        announce(
          settings.motion
            ? 'Redução de animações ativada.'
            : 'Redução de animações desativada.'
        );
        break;

      case 'vlibras':
        loadVLibras();

        window.setTimeout(() => {
          const vlibrasButton = window.VLibrasWidget?.initBtn;

          if (vlibrasButton) {
            vlibrasButton.click();
            announce('VLibras aberto.');
          } else {
            announce(
              'O VLibras está disponível no botão oficial no lado direito da página.'
            );
          }
        }, 900);
        return;

      case 'reset':
        settings = {
          fontScale: 100,
          contrast: false,
          links: false,
          motion: false
        };
        announce('Preferências de acessibilidade restauradas.');
        break;

      default:
        return;
    }

    saveSettings();
    applySettings();
  });
})();
