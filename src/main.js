import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

/* ------------------------------------------------------------------
   Ingredient layers. Each is its own transparent SVG in /public/layers.
   `h` is the artwork height in a 600-wide viewBox, `ov` how far the layer
   tucks under the one above it when the burger is assembled.
------------------------------------------------------------------- */
const L = {
  bun:     { file: '1-top-bun',       h: 200, ov: 0,  label: "Martin's potato bun" },
  sauce:   { file: '2-wham-sauce',    h: 80,  ov: 25, label: 'Wham Sauce' },
  tomato:  { file: '3-tomato',        h: 76,  ov: 40, label: 'Tomato' },
  lettuce: { file: '4-lettuce',       h: 100, ov: 51, label: 'Leafy lettuce' },
  cheese:  { file: '5-cheese',        h: 96,  ov: 55, label: 'American cheese' },
  patty:   { file: '6-patty',         h: 120, ov: 61, label: '3 oz smash patty' },
  pickles: { file: '7-pickles-onion', h: 70,  ov: 45, label: 'Dill pickles & onion' },
  bottom:  { file: '8-bottom-bun',    h: 110, ov: 31, label: 'Bottom bun' },
  chicken: { file: 'chicken',         h: 120, ov: 61, label: 'Fried chicken' },
  bean:    { file: 'bean',            h: 120, ov: 61, label: 'Bean patty' },
};
const RECIPES = {
  hero:   ['bun', 'sauce', 'tomato', 'lettuce', 'cheese', 'patty', 'pickles', 'bottom'],
  wham:   ['bun', 'sauce', 'tomato', 'lettuce', 'cheese', 'patty', 'pickles', 'bottom'],
  double: ['bun', 'sauce', 'tomato', 'lettuce', 'cheese', 'patty', 'cheese', 'patty', 'pickles', 'bottom'],
  chicken: ['bun', 'lettuce', 'chicken', 'pickles', 'bottom'],
  hot:    ['bun', 'chicken', 'pickles', 'bottom'],
  bean:   ['bun', 'sauce', 'tomato', 'lettuce', 'bean', 'pickles', 'bottom'],
};
const VB = 600;

function stack(names) {
  const items = [];
  names.forEach((n, i) => {
    const d = L[n];
    const prev = items[i - 1];
    items.push({ ...d, top: prev ? prev.top + prev.h - d.ov : 0 });
  });
  const last = items[items.length - 1];
  return { items, total: last.top + last.h };
}

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
}

function makeLayer(it, i, withLabel) {
  const layer = el('div', 'layer');
  const img = new Image();
  img.src = `/layers/${it.file}.svg`;
  img.alt = '';
  img.decoding = 'async';
  img.draggable = false;
  layer.append(img);
  layer.style.zIndex = String(i + 1);
  let label = null;
  if (withLabel) {
    label = el('span', `label ${i % 2 ? 'label--l' : 'label--r'}`, `<b>${String(i + 1).padStart(2, '0')}</b>${it.label}`);
    layer.append(label);
  }
  return { layer, label };
}

/* Small static, assembled burgers for the menu cards */
function buildMinis() {
  $$('[data-art]').forEach((art) => {
    const recipe = RECIPES[art.dataset.art];
    if (!recipe) return;
    const { items, total } = stack(recipe);
    const w = art.closest('.card--feature') ? 250 : 190;
    const k = w / VB;
    const mini = el('div', 'mini');
    mini.style.width = `${w}px`;
    mini.style.height = `${total * k}px`;
    mini.setAttribute('role', 'img');
    mini.setAttribute('aria-label', `Illustration of ${art.closest('.card').querySelector('h3').textContent}`);
    items.forEach((it, i) => {
      const { layer } = makeLayer(it, i, false);
      layer.style.top = `${it.top * k}px`;
      layer.style.height = `${it.h * k}px`;
      const img = layer.querySelector('img');
      img.loading = 'lazy';
      mini.append(layer);
    });
    art.append(mini);
  });
}

/* ------------------------------------------------------------------
   Hero: pinned, scroll-scrubbed burger (desktop) or simple version
------------------------------------------------------------------- */
const root = document.documentElement;
const stageEl = $('#stage');
const heroEl = $('#top');
const simpleQuery = window.matchMedia('(max-width: 768px), (max-height: 480px), (prefers-reduced-motion: reduce)');
const headerH = () => $('#site-header').offsetHeight;

let ctx = null;
let built = { w: 0, h: 0, simple: null };

function teardown() {
  if (ctx) { ctx.revert(); ctx = null; }
  stageEl.replaceChildren();
  $('#stack-list').replaceChildren();
}

function init() {
  teardown();
  const simple = simpleQuery.matches;
  root.classList.toggle('mode-simple', simple);
  root.classList.toggle('mode-full', !simple);
  built = { w: innerWidth, h: innerHeight, simple };

  const { items, total } = stack(RECIPES.hero);
  const n = items.length;

  const parts = items.map((it, i) => makeLayer(it, i, !simple));
  parts.forEach((p) => stageEl.append(p.layer));

  if (simple) {
    // Assembled, static burger in the dark hero + vertical ingredient list below.
    const w = Math.min(360, innerWidth * 0.84);
    const k = w / VB;
    stageEl.style.width = `${w}px`;
    stageEl.style.height = `${total * k}px`;
    parts.forEach((p, i) => {
      p.layer.style.height = `${items[i].h * k}px`;
      gsap.set(p.layer, { y: items[i].top * k });
    });
    const list = $('#stack-list');
    items.forEach((it, i) => {
      const li = el('li', '', `<img src="/layers/${it.file}.svg" alt="" width="${VB}" height="${it.h}" loading="lazy" /><span><b>${String(i + 1).padStart(2, '0')}</b>${it.label}</span>`);
      list.append(li);
    });
    observeIn($$('li', list), '0px 0px -12% 0px');
    return;
  }

  // ---- Full cinematic mode ----
  const availH = (innerHeight - headerH()) * 0.96;
  const w = Math.min(460, innerWidth * 0.8, availH * 0.68);
  const k = w / VB;
  const assembledH = total * k;
  const gap = Math.max(0, (availH - assembledH) / (n - 1));
  const shift = (availH - assembledH) / 2;

  stageEl.style.width = `${w}px`;
  stageEl.style.height = `${availH}px`;
  parts.forEach((p, i) => { p.layer.style.height = `${items[i].h * k}px`; });

  ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: heroEl,
        start: 'top top',
        end: '+=280%',
        pin: true,
        scrub: 0.7,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Background: dark -> light
    tl.to('.hero__light', { opacity: 1, duration: 0.3, ease: 'power1.inOut' }, 0.14);
    tl.to('.hero__copy', { opacity: 0, y: -90, duration: 0.2, ease: 'power1.in' }, 0.04);
    tl.to('.hero__actions', { opacity: 0, y: 50, duration: 0.14, ease: 'power1.in' }, 0.02);
    tl.to('.scroll-hint', { opacity: 0, duration: 0.05 }, 0);
    tl.fromTo(stageEl, { scale: 1.2 }, { scale: 1, duration: 0.45, ease: 'power2.out' }, 0);

    // Layers pull apart, centre-out, so the patty leads
    const mid = (n - 1) / 2;
    parts.forEach((p, i) => {
      const from = shift + items[i].top * k;
      const to = items[i].top * k + i * gap;
      const lag = (Math.abs(i - mid) / mid) * 0.08;
      tl.fromTo(p.layer, { y: from }, { y: to, duration: 0.5, ease: 'power3.inOut' }, 0.2 + lag);
    });

    // Labels + heading arrive once the stack is spread
    parts.forEach((p, i) => {
      const dir = i % 2 ? 1 : -1;
      tl.fromTo(p.label, { opacity: 0, x: dir * 24 }, { opacity: 1, x: 0, duration: 0.1, ease: 'power2.out' }, 0.62 + i * 0.03);
    });
    tl.fromTo('.stack-title', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.14, ease: 'power2.out' }, 0.6);

    // Hold the finished stack briefly before the pin releases
    tl.to({}, { duration: 0.16 });
  }, heroEl);
}

/* Reveal-on-scroll for content sections */
let revealIO;
function observeIn(nodes, rootMargin = '0px 0px -8% 0px') {
  if (!('IntersectionObserver' in window)) { nodes.forEach((n) => n.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin, threshold: 0.12 });
  nodes.forEach((n) => io.observe(n));
  return io;
}

/* Header: mobile menu */
function setupMenu() {
  const btn = $('#menu-toggle');
  const nav = $('#site-nav');
  const mq = window.matchMedia('(max-width: 1040px)');
  const set = (open) => {
    nav.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open && mq.matches ? 'hidden' : '';
  };
  // On small screens the closed menu must not be reachable by keyboard.
  const sync = () => {
    if (mq.matches) { nav.inert = !nav.classList.contains('is-open'); } else { nav.inert = false; set(false); }
  };
  btn.addEventListener('click', () => { set(!nav.classList.contains('is-open')); sync(); });
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) { set(false); sync(); } });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { set(false); sync(); btn.focus(); }
  });
  mq.addEventListener('change', sync);
  sync();
}

/* Header: highlight the section in view */
function setupActiveNav() {
  const map = { top: 'top', 'stack-simple': 'top', menu: 'menu', order: 'order', locations: 'locations', catering: 'catering', 'food-truck': 'food-truck' };
  const links = $$('.nav ul a[href^="#"]');
  const setActive = (id) => links.forEach((a) => {
    const on = a.getAttribute('href') === `#${id}`;
    a.classList.toggle('is-active', on);
    if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
  });
  const seen = new Set(['top']);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { const id = map[e.target.id]; if (e.isIntersecting) seen.add(id); else seen.delete(id); });
    const order = ['top', 'menu', 'order', 'locations', 'catering', 'food-truck'];
    const cur = [...order].reverse().find((id) => seen.has(id)) || 'top';
    setActive(cur);
  }, { rootMargin: '-40% 0px -55% 0px' });
  Object.keys(map).forEach((id) => { const n = document.getElementById(id); if (n) io.observe(n); });
}

/* Boot */
buildMinis();
observeIn($$('.reveal'));
setupMenu();
setupActiveNav();
$('#year').textContent = new Date().getFullYear();
init();

let t;
window.addEventListener('resize', () => {
  clearTimeout(t);
  t = setTimeout(() => {
    const widthChanged = innerWidth !== built.w;
    const heightChanged = Math.abs(innerHeight - built.h) > 120;
    if (simpleQuery.matches !== built.simple || widthChanged || (!built.simple && heightChanged)) init();
  }, 200);
});
simpleQuery.addEventListener('change', init);
// Fonts change header height and layout; recompute once everything has loaded.
window.addEventListener('load', () => ScrollTrigger.refresh());
