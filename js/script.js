(() => {
  const SLIDE_SECONDS = 5;
  const count = BAGS.length;
  const hasBags = count > 0;
  let timer = null;
  let lightboxOpen = false;

  function bagAlt(bag) {
    return `${bag.name} ${bag.altNoun}`;
  }

  // When the last bag is sold (BAGS is emptied out in bags-data.js), the
  // site collapses to hero + manifesto + contact — no collection to link to.
  function renderNav() {
    const collectionLink = document.querySelector('#navLinks a[href="#collection"]');
    if (!collectionLink) return;
    if (!hasBags) { collectionLink.remove(); return; }
    const bagLinksHtml = BAGS.map((bag) => `<a href="#${bag.id}" class="close-menu nav-link">${bag.name}</a>`).join('');
    collectionLink.insertAdjacentHTML('afterend', bagLinksHtml);
  }

  function renderFooterLinks() {
    const wrap = document.getElementById('footerCollectionLinks');
    if (!wrap) return;
    if (!hasBags) { wrap.closest('.footer-grid > div')?.remove(); return; }
    wrap.innerHTML = BAGS.map((bag) => `<a href="#${bag.id}" class="footer-link">${bag.name}</a>`).join('');
  }

  // Once nothing is left for sale, drop the hero's "see the collection"
  // link — there's no collection section left to point it at.
  function renderHeroState() {
    if (hasBags) return;
    const sub = document.querySelector('.hero-sub');
    if (sub) sub.textContent = 'Trenutno nema dostupnih torbi.';
    const cta = document.querySelector('#hero .request-link');
    if (cta) {
      cta.setAttribute('href', '#connect');
      const label = cta.querySelector('.request-link-underline');
      if (label) label.textContent = 'Pišite nam na Instagramu';
    }
  }

  function slideHtml(bag, i, isClone) {
    const cloneAttrs = isClone ? ' aria-hidden="true" tabindex="-1"' : '';
    const loading = i === 0 && !isClone ? 'eager' : 'lazy';
    return `
      <a href="#${bag.id}" data-slide="${i}" class="slide"${cloneAttrs}>
        <img src="${bag.images[0]}" alt="${bagAlt(bag)}" width="${bag.imgW}" height="${bag.imgH}" loading="${loading}" class="slide-img${bag.variant ? ` slide-img--${bag.variant}` : ''}" />
        <span class="slide-caption">${bag.name}</span>
      </a>
    `;
  }

  function renderSlider() {
    if (!hasBags) { document.getElementById('collection')?.remove(); return; }
    const track = document.getElementById('sliderTrack');
    const first = BAGS[0];
    const last = BAGS[BAGS.length - 1];
    track.innerHTML =
      slideHtml(last, BAGS.length - 1, true) +
      BAGS.map((bag, i) => slideHtml(bag, i, false)).join('') +
      slideHtml(first, 0, true);
  }

  function renderThumbs() {
    if (!hasBags) return;
    const wrap = document.querySelector('.collection-thumbs');
    wrap.innerHTML = BAGS.map((bag, i) => `
      <button class="collection-thumb${i === 0 ? ' active' : ''}" data-thumb="${i}">
        <div class="collection-img-wrap">
          <img class="collection-img collection-item-img${bag.variant === 'rubis' ? ' collection-item-img--rubis' : ''}" src="${bag.images[0]}" alt="${bagAlt(bag)}" width="${bag.imgW}" height="${bag.imgH}" loading="lazy" />
        </div>
        <div class="collection-item-name">${bag.name}</div>
        <div class="collection-item-num">Komad Nº ${bag.num}</div>
      </button>
    `).join('');
  }

  // Each bag gets its own <section>, built entirely here rather than filled
  // into a pre-existing element in index.html — so removing a sold bag from
  // BAGS in bags-data.js is enough to drop it everywhere (nav, slider,
  // thumbnails, detail section) with no matching HTML edit required.
  function renderBagSections() {
    const container = document.getElementById('bagSections');
    if (!container) return;
    container.innerHTML = '';
    BAGS.forEach((bag) => {
      const section = document.createElement('section');
      section.id = bag.id;
      section.className = 'bag-section';
      const inner = document.createElement('div');
      inner.setAttribute('data-reveal', '1');
      inner.className = 'bag-inner';
      section.appendChild(inner);
      container.appendChild(section);

      const alt = bagAlt(bag);
      const kickerMod = bag.variant === 'rubis' ? ' bag-kicker--light' : bag.variant === 'nuage' ? ' bag-kicker--dark' : '';
      const descMod = bag.variant ? ` bag-desc--${bag.variant}` : '';
      const imgMod = bag.variant ? ` bag-image--${bag.variant}` : '';
      const specsMod = bag.variant ? ` bag-specs--${bag.variant}` : '';
      const priceMod = bag.variant === 'nuage' ? ' bag-price--dark' : '';
      const rowMod = bag.variant === 'rubis' ? ' spec-row--light' : bag.variant === 'nuage' ? ' spec-row--dark' : '';
      const labelMod = bag.variant === 'rubis' ? ' spec-label--light' : bag.variant === 'nuage' ? ' spec-label--dark' : '';
      const valMod = bag.variant === 'nuage' ? ' spec-val--dark' : '';
      const linkMod = bag.variant ? ` request-link--${bag.variant}` : '';
      const underlineMod = bag.variant ? ` request-link-underline--${bag.variant}` : '';
      const arrowMod = bag.variant === 'rubis' ? ' request-arrow--cream' : bag.variant === 'nuage' ? ' request-arrow--ink' : '';
      const dimsMod = bag.variant ? ` bag-dims--${bag.variant}` : '';

      const dimsHtml = bag.dims ? `
        <div class="bag-dims${dimsMod}">
          ${bag.dims.map(([abbr, name, val]) => `
            <div class="bag-dim">
              <span class="bag-dim-abbr">${abbr}</span>
              <span class="bag-dim-name">${name}</span>
              ${Array.isArray(val) ? `
                <div class="bag-dim-sub-list">
                  ${val.map(([subLabel, subVal]) => `
                    <div class="bag-dim-sub">
                      <span class="bag-dim-sub-label">${subLabel}</span>
                      <span class="bag-dim-sub-val">${subVal}</span>
                    </div>
                  `).join('')}
                </div>
              ` : `<span class="bag-dim-val">${val}</span>`}
            </div>
          `).join('')}
        </div>
      ` : '';

      const galleryHtml = bag.images.length > 1 ? `
        <div class="bag-gallery">
          ${bag.images.map((src, i) => `
            <button class="bag-gallery-thumb${i === 0 ? ' active' : ''}" data-img="${i}">
              <img src="${src}" alt="${bagAlt(bag)}, prikaz ${i + 1}" width="${bag.imgW}" height="${bag.imgH}" loading="lazy" />
            </button>
          `).join('')}
        </div>
      ` : '';

      // ${galleryHtml} - insert below class="lightbox-trigger
      inner.innerHTML = `
        <div class="bag-kicker${kickerMod}">Komad Nº ${bag.num}</div>
        <h2 class="bag-title">${bag.name}</h2>
        <p class="bag-desc${descMod}">${bag.desc}</p>
        <div class="lightbox-trigger bag-image-wrap" data-src="${bag.images[0]}" data-alt="${alt}">
          <img class="detail-img bag-image${imgMod}" src="${bag.images[0]}" alt="${alt}" width="${bag.imgW}" height="${bag.imgH}" loading="lazy" />
        </div>
         ${galleryHtml}
        <div class="bag-price${priceMod}">${bag.price}</div>
        ${dimsHtml}
        <div class="bag-specs${specsMod}">
          ${bag.specs.map(([label, val]) => `
            <div class="spec-row${rowMod}">
              <span class="spec-label${labelMod}">${label}</span><span class="spec-val${valMod}">${val}</span>
            </div>
          `).join('')}
        </div>
        <a href="#connect" class="request-link${linkMod}">
          <span class="request-link-underline${underlineMod}">Poručite ${bag.name}</span>
          <svg width="34" height="10" viewBox="0 0 34 10" fill="none" class="request-arrow${arrowMod}">
            <line x1="0" y1="5" x2="32" y2="5" />
            <path d="M27 1 L32 5 L27 9" />
          </svg>
        </a>
      `;

      const mainImg = inner.querySelector('.detail-img');
      const trigger = inner.querySelector('.lightbox-trigger');
      const galleryThumbs = Array.from(inner.querySelectorAll('.bag-gallery-thumb'));
      galleryThumbs.forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.img, 10) || 0;
          const src = bag.images[idx];
          mainImg.src = src;
          trigger.dataset.src = src;
          galleryThumbs.forEach((b, i) => b.classList.toggle('active', i === idx));
        });
      });
    });
  }

  renderNav();
  renderFooterLinks();
  renderHeroState();
  renderSlider();
  renderThumbs();
  renderBagSections();

  // The slider only exists once renderSlider() has confirmed there's stock
  // to show — with an empty BAGS array, #collection (and #sliderTrack with
  // it) was removed above, so none of this control logic should run.
  if (hasBags) {
    const track = document.getElementById('sliderTrack');
    const thumbs = Array.from(document.querySelectorAll('.collection-thumb'));

    // Real slides sit at pos 1..count; pos 0 and count+1 are the cloned
    // last/first slides that make the loop feel infinite.
    let pos = 1;

    const paintSlider = (withTransition) => {
      track.style.transition = withTransition ? '' : 'none';
      track.style.transform = `translateX(-${pos * 100}%)`;
      const logical = ((pos - 1) % count + count) % count;
      thumbs.forEach((t, i) => t.classList.toggle('active', i === logical));
      if (!withTransition) {
        requestAnimationFrame(() => { track.style.transition = ''; });
      }
    };

    // Matches the .slider-track transition duration in style.css, plus a
    // small margin. While an animated move is in flight, arrow/thumb clicks
    // are ignored so rapid clicking can't queue up moves faster than the
    // slider can visually keep up with.
    const ANIM_MS = 900;
    let animating = false;
    let animLockTimer = null;

    const goToPos = (n, withTransition = true) => {
      pos = n;
      paintSlider(withTransition);
      if (withTransition) {
        animating = true;
        clearTimeout(animLockTimer);
        animLockTimer = setTimeout(() => { animating = false; }, ANIM_MS);
      }
    };

    // If we're resting on a cloned slide (0 or count+1), snap instantly to
    // the matching real slide before moving further — the clone and the
    // real slide look identical, so the jump is invisible, and it means
    // `pos` never drifts past the clones no matter how fast someone clicks.
    const settleIfNeeded = () => {
      if (pos === 0) goToPos(count, false);
      else if (pos === count + 1) goToPos(1, false);
    };

    const next = () => { settleIfNeeded(); goToPos(pos + 1); };
    const prev = () => { settleIfNeeded(); goToPos(pos - 1); };
    const goToIndex = (i) => { settleIfNeeded(); goToPos(((i % count) + count) % count + 1); };

    const startAuto = () => {
      stopAuto();
      timer = setInterval(() => {
        if (lightboxOpen) return;
        next();
      }, SLIDE_SECONDS * 1000);
    };
    const stopAuto = () => { if (timer) clearInterval(timer); timer = null; };

    document.getElementById('prevBtn').addEventListener('click', () => { if (animating) return; prev(); startAuto(); });
    document.getElementById('nextBtn').addEventListener('click', () => { if (animating) return; next(); startAuto(); });
    thumbs.forEach((t) => t.addEventListener('click', () => { if (animating) return; goToIndex(parseInt(t.dataset.thumb, 10) || 0); startAuto(); }));

    paintSlider(false);
    startAuto();
  }

  // Mobile nav
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  function toggleMenu() {
    burger.classList.toggle('open');
    navLinks.classList.toggle('open');
  }
  function closeMenu() {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  }
  burger.addEventListener('click', toggleMenu);
  document.querySelectorAll('.close-menu').forEach((el) => el.addEventListener('click', closeMenu));

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  function openImage(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.hidden = false;
    lightboxOpen = true;
    document.body.style.overflow = 'hidden';
  }
  function closeImage() {
    lightbox.hidden = true;
    lightboxOpen = false;
    document.body.style.overflow = '';
  }
  document.querySelectorAll('.lightbox-trigger').forEach((el) => {
    el.addEventListener('click', () => openImage(el.dataset.src, el.dataset.alt));
  });
  lightbox.addEventListener('click', closeImage);
  lightboxClose.addEventListener('click', (e) => { e.stopPropagation(); closeImage(); });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeImage(); closeMenu(); }
  });

  // Scroll reveal
  const seen = new WeakSet();
  const io = ('IntersectionObserver' in window)
    ? new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.add('revealed');
          io.unobserve(en.target);
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' })
    : null;

  function setupReveal() {
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      if (seen.has(el)) return;
      seen.add(el);
      if (io) io.observe(el);
      else el.classList.add('revealed');
    });
  }
  setupReveal();
  setTimeout(setupReveal, 400);

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
