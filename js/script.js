(() => {
  const SLIDE_SECONDS = 5;
  const count = 5;
  let slide = 0;
  let timer = null;
  let lightboxOpen = false;

  const track = document.getElementById('sliderTrack');
  const dotsWrap = document.getElementById('sliderDots');
  const dots = Array.from(dotsWrap.children);

  function paintSlider() {
    track.style.transform = `translateX(-${slide * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === slide));
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
  dots.forEach((d) => d.addEventListener('click', () => { goTo(parseInt(d.dataset.dot, 10) || 0); startAuto(); }));

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
