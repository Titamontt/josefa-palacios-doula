/* =========================================================
   Josefa Palacios, doula de fin de vida — interacciones
   ========================================================= */
(function () {
  'use strict';

  /* ---- Header: fondo sólido al hacer scroll ---- */
  var header = document.getElementById('header');
  var onScroll = function () {
    header.classList.toggle('is-stuck', window.scrollY > 20);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Menú móvil ---- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.tagName !== 'A') return;
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menú');
  });

  /* ---- Enlace activo según la sección visible ---- */
  var links = Array.prototype.slice.call(nav.querySelectorAll('a'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { navObserver.observe(s); });

    /* ---- Entrada suave de los bloques ---- */
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 90 + 'ms';
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---- Luz que sigue al cursor ----
     El punto persigue al mouse con retardo: en cada cuadro avanza una
     fracción de la distancia que le falta, y eso produce el arrastre. */
  var luz = document.getElementById('cursor-luz');
  var sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sinMouse = window.matchMedia('(hover: none)').matches;

  if (luz && !sinMovimiento && !sinMouse) {
    var x = window.innerWidth / 2;
    var y = window.innerHeight / 2;
    var destinoX = x;
    var destinoY = y;
    var encendida = false;

    window.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      destinoX = e.clientX;
      destinoY = e.clientY;
      if (!encendida) {
        encendida = true;
        x = destinoX;
        y = destinoY;
        luz.classList.add('is-visible');
      }
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      luz.classList.remove('is-visible');
      encendida = false;
    });

    (function cuadro() {
      x += (destinoX - x) * 0.075;
      y += (destinoY - y) * 0.075;
      luz.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
      requestAnimationFrame(cuadro);
    })();
  }

  /* ---- FAQ: solo una respuesta abierta a la vez ---- */
  var items = Array.prototype.slice.call(document.querySelectorAll('.faq__item'));
  items.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      items.forEach(function (other) { if (other !== item) other.open = false; });
    });
  });

  /* ---- Formulario ----
     Envío vía Formspree (AJAX): el mensaje se envía directo al correo
     de la doula sin salir de la página ni abrir el cliente de mail. */
  var FORMSPREE_ENDPOINT = 'https://formspree.io/f/xjybzvwk';

  var form = document.getElementById('form');
  var note = document.getElementById('form-note');
  var boton = form.querySelector('button[type="submit"]');
  var textoBotonOriginal = boton.textContent;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    form.querySelectorAll('input, textarea').forEach(function (f) {
      f.classList.add('is-touched');
    });

    if (!form.checkValidity()) {
      note.textContent = 'Revisa los campos marcados, por favor.';
      var firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    var data = new FormData(form);

    boton.disabled = true;
    boton.textContent = 'Enviando…';
    note.textContent = '';

    fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          note.textContent = 'Gracias por tu mensaje, te responderé pronto.';
          form.reset();
          form.querySelectorAll('input, textarea').forEach(function (f) {
            f.classList.remove('is-touched');
          });
        } else {
          return response.json().then(function (payload) {
            var mensaje = (payload && payload.errors)
              ? payload.errors.map(function (err) { return err.message; }).join(', ')
              : 'Ocurrió un error al enviar. Intenta de nuevo o escríbeme por WhatsApp.';
            note.textContent = mensaje;
          });
        }
      })
      .catch(function () {
        note.textContent = 'Ocurrió un error al enviar. Intenta de nuevo o escríbeme por WhatsApp.';
      })
      .finally(function () {
        boton.disabled = false;
        boton.textContent = textoBotonOriginal;
      });
  });
})();
