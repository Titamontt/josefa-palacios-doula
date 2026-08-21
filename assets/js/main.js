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
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
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
