(() => {
  const SLIDE_SECONDS = 5;
  const count = BAGS.length;
  let slide = 0;
  let timer = null;
  let lightboxOpen = false;

  function bagAlt(bag) {
    return `${bag.name} ${bag.altNoun}`;
  }

  function renderSlider() {
    const track = document.getElementById('sliderTrack');
    track.innerHTML = BAGS.map((bag, i) => `
      <a href="#${bag.id}" data-slide="${i}" class="slide">
        <img src="${bag.images[0]}" alt="${bagAlt(bag)}" class="slide-img${bag.variant ? ` slide-img--${bag.variant}` : ''}" />
        <span class="slide-caption">${bag.name}</span>
      </a>
    `).join('');
  }

  function renderThumbs() {
    const wrap = document.querySelector('.collection-thumbs');
    wrap.innerHTML = BAGS.map((bag, i) => `
      <button class="collection-thumb${i === 0 ? ' active' : ''}" data-thumb="${i}">
        <div class="collection-img-wrap">
          <img class="collection-img collection-item-img${bag.variant === 'rubis' ? ' collection-item-img--rubis' : ''}" src="${bag.images[0]}" alt="${bagAlt(bag)}" />
        </div>
        <div class="collection-item-name">${bag.name}</div>
        <div class="collection-item-num">Piece Nº ${bag.num}</div>
      </button>
    `).join('');
  }

  function renderBagSections() {
    BAGS.forEach((bag) => {
      const inner = document.querySelector(`#${bag.id} .bag-inner`);
      if (!inner) return;
      const alt = bagAlt(bag);
      const kickerMod = bag.variant === 'rubis' ? ' bag-kicker--light' : bag.variant === 'nuage' ? ' bag-kicker--dark' : '';
      const descMod = bag.variant ? ` bag-desc--${bag.variant}` : '';
      const imgMod = bag.variant ? ` bag-image--${bag.variant}` : '';
      const specsMod = bag.variant ? ` bag-specs--${bag.variant}` : '';
      const rowMod = bag.variant === 'rubis' ? ' spec-row--light' : bag.variant === 'nuage' ? ' spec-row--dark' : '';
      const labelMod = bag.variant === 'rubis' ? ' spec-label--light' : bag.variant === 'nuage' ? ' spec-label--dark' : '';
      const valMod = bag.variant === 'nuage' ? ' spec-val--dark' : '';
      const linkMod = bag.variant ? ` request-link--${bag.variant}` : '';
      const underlineMod = bag.variant ? ` request-link-underline--${bag.variant}` : '';
      const arrowMod = bag.variant === 'rubis' ? ' request-arrow--cream' : bag.variant === 'nuage' ? ' request-arrow--ink' : '';

      const galleryHtml = bag.images.length > 1 ? `
        <div class="bag-gallery">
          ${bag.images.map((src, i) => `
            <button class="bag-gallery-thumb${i === 0 ? ' active' : ''}" data-img="${i}">
              <img src="${src}" alt="" />
            </button>
          `).join('')}
        </div>
      ` : '';

      // ${galleryHtml} - insert below class="lightbox-trigger
      inner.innerHTML = `
        <div class="bag-kicker${kickerMod}">Piece Nº ${bag.num}</div>
        <h2 class="bag-title">${bag.name}</h2>
        <p class="bag-desc${descMod}">${bag.desc}</p>
        <div class="lightbox-trigger bag-image-wrap" data-src="${bag.images[0]}" data-alt="${alt}">
          <img class="detail-img bag-image${imgMod}" src="${bag.images[0]}" alt="${alt}" />
        </div>
        <div class="bag-specs${specsMod}">
          ${bag.specs.map(([label, val]) => `
            <div class="spec-row${rowMod}">
              <span class="spec-label${labelMod}">${label}</span><span class="spec-val${valMod}">${val}</span>
            </div>
          `).join('')}
        </div>
        <a href="#connect" class="request-link${linkMod}">
          <span class="request-link-underline${underlineMod}">Request ${bag.name}</span>
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

  renderSlider();
  renderThumbs();
  renderBagSections();

  const track = document.getElementById('sliderTrack');
  const thumbs = Array.from(document.querySelectorAll('.collection-thumb'));

  function paintSlider() {
    track.style.transform = `translateX(-${slide * 100}%)`;
    thumbs.forEach((t, i) => t.classList.toggle('active', i === slide));
  }

  function goTo(n) {
    slide = ((n % count) + count) % count;
    paintSlider();
  }

  function startAuto() {
    stopAuto();
    timer = setInterval(() => {
      if (lightboxOpen) return;
      goTo(slide + 1);
    }, SLIDE_SECONDS * 1000);
  }
  function stopAuto() { if (timer) clearInterval(timer); timer = null; }

  document.getElementById('prevBtn').addEventListener('click', () => { goTo(slide - 1); startAuto(); });
  document.getElementById('nextBtn').addEventListener('click', () => { goTo(slide + 1); startAuto(); });
  thumbs.forEach((t) => t.addEventListener('click', () => { goTo(parseInt(t.dataset.thumb, 10) || 0); startAuto(); }));

  paintSlider();
  startAuto();

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
      const already = el.getBoundingClientRect().top < window.innerHeight * 0.9;
      if (already) { el.classList.add('revealed'); return; }
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
