/* Frazier & Co. — site behaviour */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mark JS as available so reveal styles only apply when they can be undone */
  if (!reduceMotion) document.documentElement.classList.add('js');

  /* Sticky nav shadow */
  var nav = document.getElementById('nav');
  var onScroll = function () {
    nav.classList.toggle('is-stuck', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile nav */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  var closeNav = function () {
    links.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeNav();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  /* Reveal on scroll */
  var revealables = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.style.transitionDelay = Math.min(i * 70, 280) + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* Count-up on the numeric stats */
  var counters = document.querySelectorAll('[data-count]');
  var runCount = function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion || isNaN(target)) { return; }
    var start = performance.now();
    var duration = 1100;
    var tick = function (now) {
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    el.textContent = '0' + suffix;
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCount(entry.target);
        co.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* Contact form
     Set FORM_ENDPOINT to your form service URL (e.g. a Formspree form:
     https://formspree.io/f/xxxxxxxx) and submissions post straight to it.
     Left empty, the form falls back to opening the visitor's mail client. */
  var FORM_ENDPOINT = '';
  var CONTACT_EMAIL = 'hello@fraziermarketingco.com';

  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');

  var setNote = function (text, state) {
    if (!note) return;
    note.textContent = text;
    note.classList.toggle('is-ok', state === 'ok');
    note.classList.toggle('is-error', state === 'error');
  };

  var mailtoFallback = function (data) {
    var body = [
      'Name: ' + (data.get('name') || ''),
      'Company: ' + (data.get('company') || ''),
      'Email: ' + (data.get('email') || ''),
      'Budget: ' + (data.get('budget') || ''),
      '',
      data.get('message') || ''
    ].join('\n');
    window.location.href = 'mailto:' + CONTACT_EMAIL
      + '?subject=' + encodeURIComponent('New enquiry — ' + (data.get('company') || data.get('name') || 'Website'))
      + '&body=' + encodeURIComponent(body);
    setNote('Opening your email client — if nothing happens, write to ' + CONTACT_EMAIL + '.', 'ok');
  };

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var data = new FormData(form);
      if (data.get('_gotcha')) return;          /* bot filled the honeypot */

      if (!FORM_ENDPOINT) {
        mailtoFallback(data);
        return;
      }

      var button = form.querySelector('button[type="submit"]');
      var label = button ? button.textContent : '';
      if (button) { button.disabled = true; button.textContent = 'Sending…'; }
      setNote('Sending…');

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (!res.ok) throw new Error('Request failed: ' + res.status);
        form.reset();
        setNote('Thanks — that\'s with us. We\'ll come back to you within one business day.', 'ok');
      }).catch(function () {
        setNote('That didn\'t send. Email us directly at ' + CONTACT_EMAIL + ' and we\'ll pick it up.', 'error');
      }).then(function () {
        if (button) { button.disabled = false; button.textContent = label; }
      });
    });
  }

  /* Footer year */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
