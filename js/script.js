(() => {
  const count = BAGS.length;
  const hasBags = count > 0;
  const IG_DM = 'https://ig.me/m/nite.studio_';

  function bagAlt(bag) {
    return `${bag.name} ${bag.altNoun}`;
  }

  // Galleries list placeholder repeats until final photography arrives;
  // only distinct photos are shown so no view is offered twice.
  function uniqueImages(bag) {
    return [...new Set(bag.images)];
  }

  // Every product photo has -480 and -960 WebP siblings next to it
  // (e.g. assets/foret.jpg → assets/foret-480.webp); the original is the
  // largest candidate. Adding a bag photo means exporting those two too.
  function srcsetFor(bag, src) {
    const base = src.replace(/\.(jpe?g|webp)$/, '');
    return `${base}-480.webp 480w, ${base}-960.webp 960w, ${src} ${bag.imgW}w`;
  }
  const SIZES = {
    feature: '(max-width: 1023px) 100vw, 50vw',
    tile: '(max-width: 1023px) 50vw, 25vw',
    rail: '96px',
    gallery: '(max-width: 899px) 100vw, 60vw',
  };

  function img(bag, src, sizes, alt, loading = 'lazy', cls = '') {
    return `<img srcset="${srcsetFor(bag, src)}" sizes="${sizes}" src="${src}" alt="${alt}" width="${bag.imgW}" height="${bag.imgH}" loading="${loading}"${cls ? ` class="${cls}"` : ''} />`;
  }

  // ---------------------------------------------------------------------
  // Catalogue: rail, grid, nav and footer links, all derived from BAGS.
  // When the last bag is sold (BAGS emptied in bags-data.js) the collection
  // disappears and the page keeps its story, making and ordering sections.

  function renderCatalogue() {
    const rail = document.getElementById('rail');
    const grid = document.getElementById('grid');
    const toolbar = document.querySelector('.toolbar');

    if (!hasBags) {
      rail.remove();
      grid.remove();
      toolbar.remove();
      document.getElementById('catalogueSub').innerHTML =
        'Trenutno nema dostupnih torbi. <a href="#connect" class="text-link">Pišite nam na Instagramu</a>';
      document.querySelector('#navLinks a[href="#collection"]')?.remove();
      document.getElementById('footerCollection')?.remove();
      return;
    }

    document.getElementById('pieceCount').textContent = count === 1 ? '1 komad' : `${count} komada`;

    rail.innerHTML = BAGS.map((bag) => `
      <a href="#${bag.id}" class="rail-item">
        <span class="rail-media">${img(bag, bag.images[0], SIZES.rail, '')}</span>
        <span class="rail-name">${bag.name}</span>
      </a>
    `).join('');

    // The first piece gets a 2×2 feature tile only when the remaining four
    // fill the rows beside it; any other count falls back to equal tiles.
    const featureFirst = count === 5;
    grid.classList.toggle('grid--feature', featureFirst);
    grid.innerHTML = BAGS.map((bag, i) => {
      const views = uniqueImages(bag);
      const feature = featureFirst && i === 0;
      const sizes = feature ? SIZES.feature : SIZES.tile;
      const second = views[1]
        ? img(bag, views[1], sizes, '', 'lazy', 'tile-img tile-img--alt')
        : '';
      return `
        <a href="#${bag.id}" class="tile${feature ? ' tile--feature' : ''}${second ? ' tile--has-alt' : ''}">
          <span class="tile-media">
            ${img(bag, views[0], sizes, bagAlt(bag), i < 3 ? 'eager' : 'lazy', 'tile-img')}
            ${second}
          </span>
          <span class="tile-info">
            <span class="tile-name">${bag.name}</span>
            <span class="tile-meta">Komad Nº ${bag.num} · ${bag.altNoun}</span>
            <span class="tile-price">${bag.price}</span>
          </span>
        </a>
      `;
    }).join('');

    document.getElementById('navBags').innerHTML = BAGS
      .map((bag) => `<a href="#${bag.id}" class="close-menu nav-link">${bag.name}</a>`)
      .join('');
    document.getElementById('footerCollectionLinks').innerHTML = BAGS
      .map((bag) => `<a href="#${bag.id}" class="footer-link">${bag.name}</a>`)
      .join('');
  }

  renderCatalogue();

  // ---------------------------------------------------------------------
  // Product panel: a full-screen dialog opened by a bag's hash (its `id`,
  // e.g. #cacao), so every tile, rail item, nav and footer link is a plain
  // anchor, the back button closes it, and a shared link like /#rubis opens
  // straight onto that piece.

  const page = document.querySelector('.page');
  const product = document.getElementById('product');
  const productBody = document.getElementById('productBody');
  const productCrumb = document.getElementById('productCrumb');
  const productClose = document.getElementById('productClose');
  const backgroundRegions = ['#site-header', '#main', '#contact'].map((s) => page.querySelector(s));
  let productOpen = false;
  let productReturnFocus = null;

  function productHtml(bag) {
    const views = uniqueImages(bag);
    const alt = bagAlt(bag);
    const next = BAGS[(BAGS.indexOf(bag) + 1) % count];

    const gallery = views.map((src, i) => `
      <button type="button" class="gallery-item" data-src="${src}" data-alt="${alt}, prikaz ${i + 1}" aria-label="Uvećaj fotografiju ${i + 1} od ${views.length}">
        ${img(bag, src, SIZES.gallery, `${alt}, prikaz ${i + 1}`, i === 0 ? 'eager' : 'lazy')}
      </button>
    `).join('');

    // Size is part of every buying decision, so the row is always present;
    // bags still missing measurements in BAGS say so instead of hiding it.
    const dims = `
      <details class="acc">
        <summary>Dimenzije</summary>
        ${bag.dims ? `
          <dl class="spec">
            ${bag.dims.map(([, label, val]) => (Array.isArray(val)
              ? val.map(([sub, v]) => `<div class="spec-row"><dt>${label}, ${sub}</dt><dd>${v}</dd></div>`).join('')
              : `<div class="spec-row"><dt>${label}</dt><dd>${val}</dd></div>`)).join('')}
          </dl>
        ` : '<p class="acc-text">Mere na upit, pišite nam na Instagramu.</p>'}
      </details>
    `;

    return `
      <div class="product-media">
        <div class="product-gallery" id="productGallery">
          ${gallery}
        </div>
        ${views.length > 1 ? `<p class="gallery-count" aria-hidden="true"><span id="galleryIndex">1</span> / ${views.length}</p>` : ''}
      </div>
      <div class="product-info">
        <h2 class="product-name" id="productTitle">${bag.name}</h2>
        <p class="product-meta">Komad Nº ${bag.num} · Jedinstven primerak</p>
        <p class="product-price">${bag.price}</p>
        <p class="product-desc">${bag.desc}</p>
        <div class="product-cta">
          <a href="${IG_DM}" target="_blank" rel="noopener" class="btn btn--dark" id="orderLink">Poručite putem Instagrama</a>
          <p class="product-hint" id="orderHint" aria-live="polite">U poruci navedite: <strong>${bag.name}</strong></p>
        </div>
        <p class="product-note">Posle poruke dogovaramo lično preuzimanje u Beogradu ili slanje po Srbiji.</p>
        <details class="acc" open>
          <summary>Detalji</summary>
          <dl class="spec">
            ${bag.specs.map(([label, val]) => `<div class="spec-row"><dt>${label}</dt><dd>${val}</dd></div>`).join('')}
          </dl>
        </details>
        ${dims}
        <details class="acc">
          <summary>Porudžbina i preuzimanje</summary>
          <p class="acc-text">Pišite nam na Instagramu za porudžbinu. Lično preuzimanje u Beogradu, slanje po Srbiji dogovorom.</p>
        </details>
        ${count > 1 ? `<a href="#${next.id}" class="product-next">Sledeći komad: ${next.name}</a>` : ''}
      </div>
    `;
  }

  function wireGallery() {
    const gallery = document.getElementById('productGallery');
    const index = document.getElementById('galleryIndex');
    gallery.querySelectorAll('.gallery-item').forEach((el) => {
      el.addEventListener('click', () => openImage(el.dataset.src, el.dataset.alt, el));
    });
    // On phones the gallery is a horizontal swipe strip; keep its counter
    // in step with whichever photo is snapped into view.
    if (index) {
      gallery.addEventListener('scroll', () => {
        if (gallery.scrollWidth <= gallery.clientWidth) return;
        index.textContent = String(Math.round(gallery.scrollLeft / gallery.clientWidth) + 1);
      }, { passive: true });
    }
  }

  // ig.me cannot prefill a message, so tapping the order bar copies one that
  // names the piece; Instagram still opens even if the clipboard is refused.
  function wireOrder(bag) {
    const link = document.getElementById('orderLink');
    const hint = document.getElementById('orderHint');
    const message = `Zdravo, zanima me ${bag.name} (Komad Nº ${bag.num}).`;
    link.addEventListener('click', () => {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(message).then(() => {
        hint.innerHTML = 'Poruka je kopirana. Nalepite je u Instagram: <strong></strong>';
        hint.querySelector('strong').textContent = `„${message}”`;
      }, () => {});
    });
  }

  function openProduct(bag) {
    if (!productOpen) productReturnFocus = document.activeElement;
    productBody.innerHTML = productHtml(bag);
    productCrumb.textContent = bag.name;
    wireGallery();
    wireOrder(bag);
    product.scrollTop = 0;
    if (!productOpen) {
      product.hidden = false;
      productOpen = true;
      backgroundRegions.forEach((el) => { el.inert = true; });
      document.body.style.overflow = 'hidden';
    }
    productClose.focus();
  }

  function closeProduct({ clearHash = true } = {}) {
    if (!productOpen) return;
    product.hidden = true;
    productOpen = false;
    backgroundRegions.forEach((el) => { el.inert = false; });
    document.body.style.overflow = '';
    // Drop the bag's hash without adding a history entry or scrolling.
    if (clearHash && BAGS.some((b) => `#${b.id}` === location.hash)) {
      history.replaceState(null, '', location.pathname + location.search);
    }
    if (productReturnFocus && document.contains(productReturnFocus)) productReturnFocus.focus();
    productReturnFocus = null;
  }

  // A link to a piece that has since sold lands on the catalogue with one
  // line saying so, rather than on the page with no explanation.
  function showSoldNotice() {
    let notice = document.getElementById('soldNotice');
    if (!notice) {
      notice = document.createElement('p');
      notice.id = 'soldNotice';
      notice.className = 'sold-notice';
      notice.setAttribute('role', 'status');
      notice.tabIndex = -1;
      document.getElementById('catalogueSub').after(notice);
    }
    notice.textContent = hasBags
      ? 'Ovaj komad je pronašao vlasnika. Ostali komadi su ispod.'
      : 'Ovaj komad je pronašao vlasnika.';
    history.replaceState(null, '', location.pathname + location.search);
    notice.focus({ preventScroll: true });
    document.getElementById('collection').scrollIntoView();
  }

  function syncFromHash() {
    const bag = BAGS.find((b) => `#${b.id}` === location.hash);
    if (bag) openProduct(bag);
    else {
      closeProduct({ clearHash: false });
      if (typeof SOLD_IDS !== 'undefined' && SOLD_IDS.includes(location.hash.slice(1))) showSoldNotice();
    }
  }

  window.addEventListener('hashchange', syncFromHash);
  productClose.addEventListener('click', () => closeProduct());
  syncFromHash();

  // ---------------------------------------------------------------------
  // Mobile menu

  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  function toggleMenu() {
    const open = navLinks.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  }
  function closeMenu() {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
  burger.addEventListener('click', toggleMenu);
  document.querySelectorAll('.close-menu').forEach((el) => el.addEventListener('click', closeMenu));

  // ---------------------------------------------------------------------
  // Lightbox: zooms one gallery photo above the product panel. Focus moves
  // to its close button, Tab can't leave it, and focus returns to the photo.

  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightboxClose');
  // Created here and inserted on first use, so the page never holds an
  // <img> without a src.
  const lightboxImg = document.createElement('img');
  lightboxImg.className = 'lightbox-img';
  let lightboxOpen = false;
  let lightboxReturnFocus = null;

  function openImage(src, alt, opener) {
    lightboxImg.src = src;
    if (!lightboxImg.isConnected) lightbox.prepend(lightboxImg);
    lightboxImg.alt = alt || '';
    lightbox.hidden = false;
    lightboxOpen = true;
    lightboxReturnFocus = opener || null;
    product.inert = true;
    lightboxClose.focus();
  }
  function closeImage() {
    if (!lightboxOpen) return;
    lightbox.hidden = true;
    lightboxOpen = false;
    product.inert = false;
    if (lightboxReturnFocus) lightboxReturnFocus.focus();
    lightboxReturnFocus = null;
  }
  lightbox.addEventListener('click', closeImage);
  lightboxClose.addEventListener('click', (e) => { e.stopPropagation(); closeImage(); });

  // Escape closes the topmost layer only. Tab stays inside whichever dialog
  // is on top; everything behind it is inert while it is open.
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightboxOpen) closeImage();
      else if (productOpen) closeProduct();
      else closeMenu();
      return;
    }
    if (e.key !== 'Tab') return;
    if (lightboxOpen) { e.preventDefault(); lightboxClose.focus(); return; }
    if (!productOpen) return;
    const focusables = [...product.querySelectorAll('a[href], button, summary')]
      .filter((el) => el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // ---------------------------------------------------------------------
  // Scroll reveal for the editorial sections below the grid. Content is only
  // hidden under html.js (set in <head>), so a script failure leaves it
  // visible; reduced motion keeps the fade and drops the travel (CSS).

  const io = ('IntersectionObserver' in window)
    ? new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.add('revealed');
          io.unobserve(en.target);
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' })
    : null;

  document.querySelectorAll('[data-reveal]').forEach((el) => {
    if (io) io.observe(el);
    else el.classList.add('revealed');
  });

  function sweep() {
    document.querySelectorAll('[data-reveal]:not(.revealed)').forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
        el.classList.add('revealed');
        if (io) io.unobserve(el);
      }
    });
  }
  window.addEventListener('scroll', sweep, { passive: true });
  window.addEventListener('resize', sweep);
  window.addEventListener('hashchange', sweep);
})();
