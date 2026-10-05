(() => {
  const count = BAGS.length;
  const hasBags = count > 0;
  const IG_DM = 'https://ig.me/m/nite.studio_';

  // For values interpolated into HTML attributes (alt text), so a quote in
  // a bag's name can't break the markup.
  function esc(s) {
    return String(s).replace(/[&"<>]/g, (c) => ({ '&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;' })[c]);
  }

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
    rail: '(max-width: 899px) 72px, 210px',
    thumb: '(max-width: 899px) 56px, 128px',
    gallery: '(max-width: 899px) 100vw, 60vw',
  };

  function img(bag, src, sizes, alt, { loading = 'lazy', cls = '', priority = false } = {}) {
    return `<img srcset="${srcsetFor(bag, src)}" sizes="${sizes}" src="${src}" alt="${esc(alt)}" width="${bag.imgW}" height="${bag.imgH}" loading="${loading}" decoding="async"${priority ? ' fetchpriority="high"' : ''}${cls ? ` class="${cls}"` : ''} />`;
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
      document.querySelector('.order-title').textContent = 'Ostanimo u kontaktu';
      document.querySelector('.order-desc').textContent =
        'Svi komadi su pronašli vlasnike. Za pitanja nam pišite na Instagramu.';
      return;
    }

    rail.innerHTML = BAGS.map((bag) => `
      <a href="#${bag.id}" class="rail-item">
        <span class="rail-media">${img(bag, bag.images[0], SIZES.rail, '')}</span>
        <span class="rail-name">${bag.name}</span>
      </a>
    `).join('');

    renderFilter();
    renderGrid();

    document.getElementById('navBags').innerHTML = BAGS
      .map((bag) => `<a href="#${bag.id}" class="close-menu nav-link">${bag.name}</a>`)
      .join('');
    document.getElementById('footerCollectionLinks').innerHTML = BAGS
      .map((bag) => `<a href="#${bag.id}" class="footer-link">${bag.name}</a>`)
      .join('');
  }

  // ---------------------------------------------------------------------
  // Grid filter and sort. Types come from each bag's altNoun, so a new kind
  // of piece gets its own filter chip without touching this code; with a
  // single type the filter stays hidden. Both only reorder/hide grid tiles
  // — the rail, menu and "Sledeći komad" keep the BAGS order.

  const sortSelect = document.getElementById('sort');
  const filterEl = document.getElementById('filter');
  let activeType = 'all';

  // "7.900 RSD" → 7900
  function priceValue(bag) {
    return Number(String(bag.price).replace(/\D/g, '')) || 0;
  }
  const SORTS = {
    default: null,
    newest: (a, b) => Number(b.num) - Number(a.num),
    'price-asc': (a, b) => priceValue(a) - priceValue(b),
    'price-desc': (a, b) => priceValue(b) - priceValue(a),
    name: (a, b) => a.name.localeCompare(b.name, 'sr'),
  };

  function visibleBags() {
    const list = BAGS.filter((bag) => activeType === 'all' || bag.altNoun === activeType);
    const compare = SORTS[sortSelect.value];
    return compare ? list.slice().sort(compare) : list;
  }

  function renderFilter() {
    const types = [...new Set(BAGS.map((bag) => bag.altNoun))];
    filterEl.hidden = types.length < 2;
    if (filterEl.hidden) return;
    filterEl.innerHTML = [['all', 'Sve'], ...types.map((t) => [t, t])]
      .map(([value, label]) => `<button type="button" class="filter-chip" data-type="${esc(value)}" aria-pressed="${value === activeType}">${esc(label)}</button>`)
      .join('');
  }

  function renderGrid() {
    const grid = document.getElementById('grid');
    const list = visibleBags();
    const shown = list.length;
    const pieceCount = document.getElementById('pieceCount');
    pieceCount.textContent =
      (shown === 1 ? '1 komad' : `${shown} komada`) + (shown < count ? ` od ${count}` : '');
    // The longest label this catalogue can show; CSS reserves its width so
    // the filter chips beside the count don't shift as it changes.
    pieceCount.dataset.max = `${count} komada od ${count}`;

    // The first piece gets a 2×2 feature tile only when the remaining four
    // fill the rows beside it, and only in the curated (unfiltered, default)
    // view; anything else falls back to equal tiles.
    const featureFirst = shown === 5 && sortSelect.value === 'default' && activeType === 'all';
    grid.classList.toggle('grid--feature', featureFirst);
    grid.innerHTML = list.map((bag, i) => {
      const views = uniqueImages(bag);
      const feature = featureFirst && i === 0;
      const sizes = feature ? SIZES.feature : SIZES.tile;
      const second = views[1]
        ? img(bag, views[1], sizes, '', { cls: 'tile-img tile-img--alt' })
        : '';
      return `
        <a href="#${bag.id}" class="tile${feature ? ' tile--feature' : ''}${second ? ' tile--has-alt' : ''}">
          <span class="tile-media">
            ${img(bag, views[0], sizes, '', { loading: i < 3 ? 'eager' : 'lazy', cls: 'tile-img', priority: i === 0 })}
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
  }

  // Wired only when there is a catalogue; with no bags the toolbar is gone.
  if (hasBags) {
    filterEl.addEventListener('click', (e) => {
      const chip = e.target.closest('.filter-chip');
      if (!chip || chip.dataset.type === activeType) return;
      activeType = chip.dataset.type;
      filterEl.querySelectorAll('.filter-chip').forEach((c) => {
        c.setAttribute('aria-pressed', String(c === chip));
      });
      renderGrid();
    });
    sortSelect.addEventListener('change', renderGrid);
  }

  renderCatalogue();

  // ---------------------------------------------------------------------
  // Lightbox: zooms one gallery photo above the product panel. Focus moves
  // to its close button, Tab can't leave it, and focus returns to the photo.

  const product = document.getElementById('product');
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
  // `restoreFocus: false` when the panel under it is also changing (Back
  // button, hash navigation), so focus isn't sent to a photo that is gone.
  function closeImage({ restoreFocus = true } = {}) {
    if (!lightboxOpen) return;
    lightbox.hidden = true;
    lightboxOpen = false;
    product.inert = false;
    if (restoreFocus && lightboxReturnFocus) lightboxReturnFocus.focus();
    lightboxReturnFocus = null;
  }
  lightbox.addEventListener('click', () => closeImage());
  lightboxClose.addEventListener('click', (e) => { e.stopPropagation(); closeImage(); });

  // ---------------------------------------------------------------------
  // Product panel: a full-screen dialog opened by a bag's hash (its `id`,
  // e.g. #cacao), so every tile, rail item, nav and footer link is a plain
  // anchor, the back button closes it, and a shared link like /#rubis opens
  // straight onto that piece.

  const page = document.querySelector('.page');
  const productBody = document.getElementById('productBody');
  const productCrumb = document.getElementById('productCrumb');
  const productClose = document.getElementById('productClose');
  const backgroundRegions = ['.skip-link', '#site-header', '#main', '#contact'].map((s) => page.querySelector(s));
  let productOpen = false;
  let productBag = null;
  let productReturnFocus = null;
  // Every history entry this page creates carries its depth in
  // history.state: the entry the visitor landed on is 0, and each in-page
  // hash navigation adds 1. It lives on the entry itself, so it survives a
  // reload and Back/Forward. Depth > 0 means the entry before this one is
  // this page too, so closing can step back to it; depth 0 (a deep link, or
  // a hash typed onto one) must never step back, or it would leave the site.
  const depth = () => history.state?.depth ?? 0;
  if (typeof history.state?.depth !== 'number') {
    history.replaceState({ ...history.state, depth: 0 }, '');
  }
  let lastDepth = depth();
  // Set while a history.back() from closeProduct() is waiting for its hashchange.
  let closing = false;

  function productHtml(bag) {
    const views = uniqueImages(bag);
    const alt = bagAlt(bag);
    const index = BAGS.indexOf(bag);
    const next = BAGS[(index + 1) % count];
    const prev = BAGS[(index - 1 + count) % count];

    const gallery = views.map((src, i) => `
      <button type="button" class="gallery-item" data-src="${src}" data-alt="${esc(`${alt}, prikaz ${i + 1}`)}" aria-label="Uvećaj fotografiju ${i + 1} od ${views.length}">
        ${img(bag, src, SIZES.gallery, `${alt}, prikaz ${i + 1}`, { loading: i === 0 ? 'eager' : 'lazy' })}
      </button>
    `).join('');

    // Thumbnail navigator beside the gallery (a row below it on phones),
    // only when there is more than one photo to move between: step arrows,
    // the thumbnails themselves and a position counter.
    const pad = (n) => String(n).padStart(2, '0');
    const chevron = '<svg viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 5.5 7 9.5l4-4"/></svg>';
    const thumbs = views.length > 1 ? `
      <div class="gallery-nav">
        <button type="button" class="gallery-step gallery-step--prev" id="galleryPrev" aria-label="Prethodna fotografija" disabled>${chevron}</button>
        <div class="gallery-thumbs" id="galleryThumbs" role="group" aria-label="Fotografije">
          ${views.map((src, i) => `
            <button type="button" class="gallery-thumb" data-index="${i}" aria-label="Prikaži fotografiju ${i + 1} od ${views.length}"${i === 0 ? ' aria-current="true"' : ' tabindex="-1"'}>
              ${img(bag, src, SIZES.thumb, '', { loading: 'eager' })}
            </button>
          `).join('')}
        </div>
        <button type="button" class="gallery-step gallery-step--next" id="galleryNext" aria-label="Sledeća fotografija">${chevron}</button>
        <p class="gallery-pos" aria-hidden="true"><span id="galleryPos">01</span> / ${pad(views.length)}</p>
      </div>
    ` : '';

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
      <div class="product-media${thumbs ? ' product-media--thumbs' : ''}">
        ${thumbs}
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
        ${count > 1 ? `
          <nav class="product-pager" aria-label="Ostali komadi">
            ${count > 2 ? `<a href="#${prev.id}" class="product-next product-page product-page--prev">Prethodni komad: ${prev.name}</a>` : ''}
            <a href="#${next.id}" class="product-next product-page product-page--next">Sledeći komad: ${next.name}</a>
          </nav>` : ''}
      </div>
    `;
  }

  // Tracks which photo is in view to highlight its thumbnail; replaced on
  // every render so it never observes a panel that is gone.
  let galleryObserver = null;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const phoneLayout = window.matchMedia('(max-width: 899px)');

  function wireGallery() {
    const gallery = document.getElementById('productGallery');
    const index = document.getElementById('galleryIndex');
    const items = [...gallery.querySelectorAll('.gallery-item')];
    items.forEach((el) => {
      el.addEventListener('click', () => openImage(el.dataset.src, el.dataset.alt, el));
    });
    wireThumbs(items);
    // On phones the gallery is a horizontal swipe strip; keep its counter
    // in step with whichever photo is snapped into view.
    if (index) {
      gallery.addEventListener('scroll', () => {
        if (gallery.scrollWidth <= gallery.clientWidth) return;
        index.textContent = String(Math.round(gallery.scrollLeft / gallery.clientWidth) + 1);
      }, { passive: true });
    }
  }

  // Clicking a thumbnail scrolls its photo into view: down the panel on
  // desktop, along the swipe strip on phones (without moving the panel).
  // The arrows step one photo; inside the strip, arrow keys/Home/End move
  // between thumbnails (only the current one is in the Tab order).
  function wireThumbs(items) {
    galleryObserver?.disconnect();
    galleryObserver = null;
    const strip = document.getElementById('galleryThumbs');
    if (!strip) return;
    const thumbs = [...strip.querySelectorAll('.gallery-thumb')];
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    const pos = document.getElementById('galleryPos');
    const last = thumbs.length - 1;
    let active = 0;

    function setActive(i) {
      active = i;
      thumbs.forEach((t, n) => {
        if (n === i) {
          t.setAttribute('aria-current', 'true');
          t.removeAttribute('tabindex');
        } else {
          t.removeAttribute('aria-current');
          t.tabIndex = -1;
        }
      });
      prevBtn.disabled = i === 0;
      nextBtn.disabled = i === last;
      pos.textContent = String(i + 1).padStart(2, '0');
      // Keep the active thumb visible inside the strip itself (scrollIntoView
      // would also move the panel behind it).
      const t = thumbs[i];
      if (t.offsetTop < strip.scrollTop) strip.scrollTop = t.offsetTop;
      else if (t.offsetTop + t.offsetHeight > strip.scrollTop + strip.clientHeight) {
        strip.scrollTop = t.offsetTop + t.offsetHeight - strip.clientHeight;
      }
      if (t.offsetLeft < strip.scrollLeft) strip.scrollLeft = t.offsetLeft;
      else if (t.offsetLeft + t.offsetWidth > strip.scrollLeft + strip.clientWidth) {
        strip.scrollLeft = t.offsetLeft + t.offsetWidth - strip.clientWidth;
      }
    }

    function goTo(i) {
      const target = Math.max(0, Math.min(last, i));
      setActive(target);
      items[target].scrollIntoView({
        behavior: reduceMotion.matches ? 'auto' : 'smooth',
        block: phoneLayout.matches ? 'nearest' : 'start',
        inline: 'start',
      });
    }

    thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => goTo(i)));
    prevBtn.addEventListener('click', () => goTo(active - 1));
    nextBtn.addEventListener('click', () => goTo(active + 1));

    const KEYS = { ArrowUp: -1, ArrowLeft: -1, ArrowDown: 1, ArrowRight: 1 };
    strip.addEventListener('keydown', (e) => {
      let i;
      if (e.key in KEYS) i = active + KEYS[e.key];
      else if (e.key === 'Home') i = 0;
      else if (e.key === 'End') i = last;
      else return;
      e.preventDefault();
      goTo(i);
      thumbs[active].focus();
    });

    // A photo counts as current once half of it is visible.
    galleryObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(items.indexOf(entry.target));
      });
    }, { threshold: 0.5 });
    items.forEach((el) => galleryObserver.observe(el));
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
    closing = false;
    productBag = bag;
    productBody.innerHTML = productHtml(bag);
    productCrumb.textContent = bag.name;
    wireGallery();
    wireOrder(bag);
    // Paging through pieces replaces the history entry (keeping its depth),
    // so one Back (or closing) returns to where the panel was opened from
    // rather than the last piece.
    product.querySelectorAll('.product-page').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        history.replaceState(history.state, '', e.currentTarget.getAttribute('href'));
        syncFromHash();
      });
    });
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
    // Reached from another entry of this page: step back to it instead, so
    // Back afterwards doesn't land on a duplicate. Its hashchange comes
    // straight back here with clearHash: false.
    if (clearHash && depth() > 0) {
      // A second X/Escape before that hashchange lands must not step back
      // again, or it leaves the site.
      if (!closing) {
        closing = true;
        history.back();
      }
      return;
    }
    closing = false;
    product.hidden = true;
    productOpen = false;
    backgroundRegions.forEach((el) => { el.inert = false; });
    document.body.style.overflow = '';
    // Deep link: drop the bag's hash without adding a history entry or scrolling.
    if (clearHash && BAGS.some((b) => `#${b.id}` === location.hash)) {
      history.replaceState(history.state, '', location.pathname + location.search);
    }
    // The opener may now be hidden (a link in the closed mobile menu, or
    // nothing for a deep link); fall back to that piece's tile.
    const opener = productReturnFocus && productReturnFocus.offsetParent !== null
      ? productReturnFocus
      : document.querySelector(`#grid a[href="#${productBag.id}"]`);
    opener?.focus();
    productReturnFocus = null;
    productBag = null;
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
    history.replaceState(history.state, '', location.pathname + location.search);
    notice.focus({ preventScroll: true });
    document.getElementById('collection').scrollIntoView();
  }

  function syncFromHash() {
    // Back pressed while a photo is zoomed closes the photo with the panel.
    closeImage({ restoreFocus: false });
    const bag = BAGS.find((b) => `#${b.id}` === location.hash);
    if (bag) openProduct(bag);
    else {
      closeProduct({ clearHash: false });
      if (typeof SOLD_IDS !== 'undefined' && SOLD_IDS.includes(location.hash.slice(1))) showSoldNotice();
    }
  }

  window.addEventListener('hashchange', () => {
    // A brand-new entry (link click, typed hash) arrives with no state;
    // stamp it one deeper than the entry it came from. Back/Forward land on
    // entries already stamped, so their depth is simply read back.
    if (typeof history.state?.depth !== 'number') {
      history.replaceState({ ...history.state, depth: lastDepth + 1 }, '');
    }
    lastDepth = depth();
    syncFromHash();
  });
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
