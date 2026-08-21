'use strict';

(function () {
  var luz = document.querySelector('.hero__luz');
  if (luz) {
    window.addEventListener('mousemove', function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 30;
      var y = (e.clientY / window.innerHeight - 0.5) * 30;
      luz.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
    });
  }

  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav__toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
      });
    });
  }

  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  var items = document.querySelectorAll('.faq details');
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
      var
