(function () {
  var WA = '919769283143';

  // Loading screen: hide as early as possible. Runs before everything else on purpose,
  // so a problem further down this file can never leave the spinner on screen.
  var loader = document.getElementById('loader'), t0 = performance.now();
  function hideLoader() {
    if (!loader || loader.classList.contains('done')) return;
    loader.classList.add('done');
    document.body.classList.remove('loading');
  }
  if (document.readyState === 'complete') hideLoader();
  else {
    window.addEventListener('load', function () { setTimeout(hideLoader, Math.max(0, 700 - (performance.now() - t0))); });
    setTimeout(hideLoader, 2500);
  }


  // Nav: solid background after scroll, mobile menu
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var links = document.getElementById('links');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 24); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  burger.addEventListener('click', function () {
    links.style.top = (Math.round(nav.getBoundingClientRect().bottom) - 1) + 'px';
    var open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { links.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  });

  // Theme toggle (dark / light). Initial value is set by the inline script in <head>.
  var root = document.documentElement, themeBtn = document.getElementById('themeBtn');
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', t === 'dark' ? '#0b0c0e' : '#faf8f4');
  }
  applyTheme(root.getAttribute('data-theme') || 'dark');
  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // Scroll reveal
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Count-up for numbers marked data-count
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var end = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || '0', 10);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var started = false;
    var co = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting || started) return;
      started = true;
      var t0 = performance.now(), dur = 1400;
      (function tick(t) {
        var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
        el.textContent = (end * e).toFixed(dec);
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
    co.observe(el);
  });

  // Quote form -> WhatsApp (no backend needed)
  var form = document.getElementById('quote');
  var note = document.getElementById('formNote');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements, ok = true;
    [f.name, f.phone].forEach(function (i) { i.classList.remove('bad'); });
    if (!f.name.value.trim()) { f.name.classList.add('bad'); ok = false; }
    if (f.phone.value.replace(/\D/g, '').length < 10) { f.phone.classList.add('bad'); ok = false; }
    if (!ok) { note.textContent = 'Please add your name and a 10-digit mobile number.'; return; }
    var msg = 'Hi Sadguru Tyres, I would like a quote.\n' +
      'Name: ' + f.name.value.trim() + '\n' +
      'Mobile: ' + f.phone.value.trim() + '\n' +
      'Car / tyre size: ' + (f.car.value.trim() || 'not sure') + '\n' +
      'Need: ' + f.service.value + '\n' +
      'When: ' + f.when.value;
    note.textContent = 'Opening WhatsApp...';
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });

  // Tyre size finder -> WhatsApp
  var fW = document.getElementById('fW'), fA = document.getElementById('fA'), fR = document.getElementById('fR');
  function fill(sel, vals, def) {
    vals.forEach(function (v) { var o = new Option(v, v); if (v === def) o.selected = true; sel.add(o); });
  }
  var widths = [], ratios = [], rims = [];
  for (var w = 145; w <= 315; w += 10) widths.push(w);
  for (var a = 25; a <= 80; a += 5) ratios.push(a);
  for (var r = 12; r <= 22; r++) rims.push(r);
  fill(fW, widths, 195); fill(fA, ratios, 55); fill(fR, rims, 16);
  function syncSize() {
    document.getElementById('swW').textContent = fW.value;
    document.getElementById('swA').textContent = fA.value;
    document.getElementById('swR').textContent = fR.value;
  }
  [fW, fA, fR].forEach(function (s) { s.addEventListener('change', syncSize); });
  document.getElementById('finderForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var car = document.getElementById('fCar').value.trim();
    var msg = 'Hi Sadguru Tyres, please share price and brand options for tyre size ' +
      fW.value + '/' + fA.value + ' R' + fR.value + (car ? ' for my ' + car : '') + '.';
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });

  // Location QR code: the small qrcode library is fetched after the page has loaded.
  // If it is slow or blocked, the QR card simply stays hidden; nothing else is affected.
  function buildQR() {
    try {
      var qr = window.qrcode(0, 'M');
      qr.addData('https://maps.app.goo.gl/D91D5J6SDVK6NxUU6');
      qr.make();
      document.getElementById('qr').innerHTML = qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
      document.getElementById('qrCard').hidden = false;
    } catch (e) { /* keep the card hidden */ }
  }
  function loadQR() {
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js';
    s.async = true;
    s.onload = buildQR;
    document.head.appendChild(s);
  }
  if (document.readyState === 'complete') loadQR();
  else window.addEventListener('load', loadQR);

  // Save contact (vCard)
  document.getElementById('saveContact').addEventListener('click', function () {
    var vcf = 'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:Sadguru Tyres\r\nORG:Sadguru Tyres\r\nTITLE:Tyre shop, Dombivli East\r\n' +
      'TEL;TYPE=WORK,VOICE:+919967764999\r\n' +
      'ADR;TYPE=WORK:;;A/7\\,8 Konark Arcade\\, KDMC Sports Complex\\, Chhatrapati Shivaji Maharaj Circle;Dombivli East;Maharashtra;421203;India\r\n' +
      'URL:https://maps.app.goo.gl/D91D5J6SDVK6NxUU6\r\nEND:VCARD';
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([vcf], { type: 'text/vcard' }));
    a.download = 'Sadguru-Tyres.vcf';
    document.body.appendChild(a); a.click(); a.remove();
  });

  if (document.readyState === 'complete') hideLoader();
  else {
    window.addEventListener('load', function () { setTimeout(hideLoader, Math.max(0, 900 - (performance.now() - t0))); });
    setTimeout(hideLoader, 4000);
  }

  // Gallery lightbox
  var lb = document.getElementById('lightbox'), lbImg = document.getElementById('lbImg'), lbCap = document.getElementById('lbCap');
  var gItems = [].slice.call(document.querySelectorAll('.g-item')), gi = 0;
  function showPhoto(n) {
    gi = (n + gItems.length) % gItems.length;
    var im = gItems[gi].querySelector('img');
    lbImg.src = im.src; lbImg.alt = im.alt;
    lbCap.textContent = im.alt + '  (' + (gi + 1) + ' of ' + gItems.length + ')';
  }
  gItems.forEach(function (b, n) {
    b.addEventListener('click', function () { showPhoto(n); if (lb.showModal) lb.showModal(); else lb.setAttribute('open', ''); });
  });
  lb.querySelector('.lb-close').addEventListener('click', function () { lb.close(); });
  lb.querySelector('.lb-prev').addEventListener('click', function () { showPhoto(gi - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function () { showPhoto(gi + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') showPhoto(gi - 1);
    if (e.key === 'ArrowRight') showPhoto(gi + 1);
  });

  document.getElementById('yr').textContent = new Date().getFullYear();
})();
