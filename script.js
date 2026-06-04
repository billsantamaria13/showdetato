/* =============================================
   EL SHOW DE TATO · script.js
   Lógica principal: navbar, carrusel,
   animaciones en scroll y carrito de compra
   ============================================= */

/* ─────────────────────────────────────────────
   1. NAVBAR – Scroll y menú mobile
───────────────────────────────────────────── */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const links    = navLinks.querySelectorAll('a');

  // Añadir clase "scrolled" al hacer scroll
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveLink();
  }, { passive: true });

  // Menú hamburguesa (mobile)
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = toggle.querySelectorAll('span');
    navLinks.classList.contains('open')
      ? (spans[0].style.transform = 'rotate(45deg) translate(5px,5px)',
         spans[1].style.opacity   = '0',
         spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)')
      : (spans[0].style.transform = '',
         spans[1].style.opacity   = '',
         spans[2].style.transform = '');
  });

  // Cerrar menú al hacer clic en un enlace
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = toggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    });
  });

  // Resaltar enlace activo según sección visible
  function updateActiveLink() {
    const sections = ['bienvenida', 'quienes-somos', 'servicios', 'tienda'];
    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 100) current = id;
    });
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
})();


/* ─────────────────────────────────────────────
   2. SCROLL INDICATOR – Ocultar al bajar
───────────────────────────────────────────── */
(function initScrollIndicator() {
  const indicator = document.getElementById('scrollIndicator');
  if (!indicator) return;
  window.addEventListener('scroll', () => {
    indicator.style.opacity = window.scrollY > 80 ? '0' : '1';
  }, { passive: true });
})();


/* ─────────────────────────────────────────────
   3. CARRUSEL ESTÁTICO – 6 fotos
───────────────────────────────────────────── */
(function initCarousel() {
  const track   = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dots    = document.querySelectorAll('.carousel-dot');
  if (!track) return;

  let current = 0;
  const total = dots.length;
  let autoplayTimer;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetAutoplay(); }));

  // Soporte táctil (swipe)
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? goTo(current + 1) : goTo(current - 1); resetAutoplay(); }
  });

  // Autoplay cada 4 segundos
  function startAutoplay() {
    autoplayTimer = setInterval(() => goTo(current + 1), 4000);
  }
  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }
  startAutoplay();
})();


/* ─────────────────────────────────────────────
   4. ANIMACIONES EN SCROLL (Intersection Observer)
───────────────────────────────────────────── */
(function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
})();




/* ─────────────────────────────────────────────
   6. PARTÍCULAS en el hero (canvas sutil)
───────────────────────────────────────────── */
(function initParticles() {
  const hero = document.querySelector('.bienvenida-hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position:absolute; inset:0; width:100%; height:100%;
    pointer-events:none; z-index:1; opacity:0.35;
  `;
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  function mkParticle() {
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.1,
      a:  Math.random(),
      da: (Math.random() * 0.004 + 0.001) * (Math.random() < 0.5 ? 1 : -1),
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 80 }, mkParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.a += p.da;
      if (p.a <= 0 || p.a >= 1) p.da *= -1;
      if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
      if (p.x < -5 || p.x > W + 5) p.x = Math.random() * W;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,140,255,${p.a * 0.8})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    particles.forEach(p => {
      if (p.x > W) p.x = Math.random() * W;
      if (p.y > H) p.y = Math.random() * H;
    });
  });

  init();
  draw();
})();
