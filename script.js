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
   5. CARRITO DE COMPRA
   Número WhatsApp – modifica solo esta línea:
───────────────────────────────────────────── */
const WHATSAPP_NUMBER = '573153593060'; // Numero Whatsapp

// Estado del carrito
const cart = {};

/**
 * Añadir un producto al carrito.
 * @param {string} name  - Nombre del producto
 * @param {number} price - Precio unitario en COP
 */
function addToCart(name, price) {
  if (cart[name]) {
    cart[name].qty += 1;
  } else {
    cart[name] = { price, qty: 1 };
  }
  renderCart();

  // Feedback visual en el botón
  const allBtns = document.querySelectorAll('.btn--add-cart');
  allBtns.forEach(btn => {
    if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(name.replace(/'/g, "\\'"))) {
      btn.textContent = '✔ Añadido';
      btn.style.background = 'rgba(0,229,255,0.15)';
      setTimeout(() => {
        btn.textContent = '+ Añadir al carrito';
        btn.style.background = '';
      }, 1200);
    }
  });
}

/**
 * Cambiar la cantidad de un ítem en el carrito.
 * @param {string} name  - Nombre del producto
 * @param {number} delta - +1 o -1
 */
function changeQty(name, delta) {
  if (!cart[name]) return;
  cart[name].qty += delta;
  if (cart[name].qty <= 0) delete cart[name];
  renderCart();
}

/**
 * Eliminar un ítem del carrito.
 * @param {string} name - Nombre del producto
 */
function removeItem(name) {
  delete cart[name];
  renderCart();
}

/**
 * Renderizar la lista del carrito y actualizar totales.
 */
function renderCart() {
  const lista   = document.getElementById('carritoLista');
  const total   = document.getElementById('carritoTotal');
  const count   = document.getElementById('carritoCount');
  const wrapper = document.getElementById('carritoWrapper');

  const items    = Object.entries(cart);
  const totalQty = items.reduce((acc, [, v]) => acc + v.qty, 0);
  const totalAmt = items.reduce((acc, [, v]) => acc + v.price * v.qty, 0);

  count.textContent = totalQty === 0
    ? '0 productos'
    : `${totalQty} producto${totalQty > 1 ? 's' : ''}`;

  total.textContent = `$${totalAmt.toLocaleString('es-CO')} COP`;

  if (items.length === 0) {
    lista.innerHTML = '<li class="carrito-vacio">Tu carrito está vacío. ¡Añade algunos productos!</li>';
    wrapper.style.borderColor = '';
    return;
  }

  wrapper.style.borderColor = 'rgba(0,229,255,0.3)';

  lista.innerHTML = items.map(([name, { price, qty }]) => `
    <li class="carrito-item">
      <div class="carrito-item-info">
        <div class="carrito-item-nombre">${name}</div>
        <div class="carrito-item-precio">$${price.toLocaleString('es-CO')} COP c/u</div>
      </div>
      <div class="carrito-item-qty">
        <button class="qty-btn" onclick="changeQty('${name.replace(/'/g, "\\'")}', -1)" aria-label="Disminuir">−</button>
        <span class="qty-num">${qty}</span>
        <button class="qty-btn" onclick="changeQty('${name.replace(/'/g, "\\'")}', 1)" aria-label="Aumentar">+</button>
      </div>
      <div class="carrito-item-subtotal">$${(price * qty).toLocaleString('es-CO')}</div>
      <button class="carrito-item-remove" onclick="removeItem('${name.replace(/'/g, "\\'")}');" aria-label="Eliminar ${name}">✕</button>
    </li>
  `).join('');
}

/**
 * Redirigir a WhatsApp con el resumen del carrito.
 */
function comprarPorWhatsapp() {
  const items = Object.entries(cart);
  if (items.length === 0) {
    alert('¡Tu carrito está vacío! Añade al menos un producto antes de comprar.');
    return;
  }

  const totalAmt = items.reduce((acc, [, v]) => acc + v.price * v.qty, 0);

  const listaTxt = items
    .map(([name, { price, qty }]) =>
      `• ${name} x${qty} = $${(price * qty).toLocaleString('es-CO')} COP`
    )
    .join('\n');

  const msg = encodeURIComponent(
    `¡Hola! Me gustaría hacer el siguiente pedido de la Tato Store:\n\n` +
    `${listaTxt}\n\n` +
    `*TOTAL: $${totalAmt.toLocaleString('es-CO')} COP*\n\n` +
    `Por favor indíquenme los detalles de pago y envío. ¡Gracias!`
  );

  // Abre WhatsApp con el número configurado arriba
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
}


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
