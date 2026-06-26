// === State ===
let lang = localStorage.getItem('lang') || 'ru';
let theme = localStorage.getItem('theme') || 'light';
let category = 'code';
let projects = [];
let about = {};
let contacts = {};

// === i18n ===
const T = {
  ru: {
    available: 'Открыт к проектам',
    hero_btn1: 'Посмотреть работы',
    hero_btn2: 'Написать мне',
    hero_exp: 'лет опыта',
    hero_proj: 'проектов',
    hero_clients: 'клиентов',
    nav_about: 'Обо мне',
    nav_portfolio: 'Портфолио',
    nav_contacts: 'Контакты',
    portfolio_title: 'Портфолио',
    portfolio_sub: 'Проекты, которые я создал',
    tab_bubble: 'Bubble',
    tab_code: 'Код',
    no_projects: 'Проекты в разработке...',
    status_live: 'Работает',
    status_completed: 'Завершён',
    status_in_development: 'В разработке',
    status_paused: 'На паузе',
    duration: 'Срок',
    integrations_label: 'Интеграции',
    visit_project: 'Открыть',
    view_more: 'Подробнее',
    read_more: 'Читать больше',
    close: 'Закрыть',
    features: 'Возможности',
    full_desc: 'Описание',
    contacts_title: 'Контакты',
    form_name: 'Ваше имя',
    form_email: 'Email',
    form_message: 'Сообщение',
    form_send: 'Отправить',
    form_success: 'Спасибо! Свяжусь с вами в ближайшее время.',
    form_error: 'Ошибка отправки. Напишите напрямую на email.',
    footer: '© 2025 Дмитрий Павлов. Все права защищены.',
    scroll_hint: 'Листайте →',
  },
  en: {
    available: 'Available for projects',
    hero_btn1: 'View my work',
    hero_btn2: 'Contact me',
    hero_exp: 'years of exp.',
    hero_proj: 'projects',
    hero_clients: 'clients',
    nav_about: 'About',
    nav_portfolio: 'Portfolio',
    nav_contacts: 'Contacts',
    portfolio_title: 'Portfolio',
    portfolio_sub: 'Projects I have built',
    tab_bubble: 'Bubble',
    tab_code: 'Code',
    no_projects: 'Projects coming soon...',
    status_live: 'Live',
    status_completed: 'Completed',
    status_in_development: 'In Development',
    status_paused: 'Paused',
    duration: 'Duration',
    integrations_label: 'Integrations',
    visit_project: 'Visit',
    view_more: 'View More',
    read_more: 'Read more',
    close: 'Close',
    features: 'Features',
    full_desc: 'Description',
    contacts_title: 'Contacts',
    form_name: 'Your name',
    form_email: 'Email',
    form_message: 'Message',
    form_send: 'Send',
    form_success: 'Thanks! I will get back to you shortly.',
    form_error: 'Send failed. Please write directly to email.',
    footer: '© 2025 Dmitriy Pavlov. All rights reserved.',
    scroll_hint: 'Swipe →',
  }
};

function t(key) { return T[lang][key] || key; }

// === Contact icons (inline SVG, stroke-style) ===
const ICONS = {
  email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"></rect><path d="m4 7.5 6.8 5.2a2 2 0 0 0 2.4 0L20 7.5"></path></svg>`,
  telegram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3 11 13"></path><path d="M21 3 14.5 21 11 13 3 9.5 21 3Z"></path></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"></rect><line x1="8" y1="11" x2="8" y2="16"></line><circle cx="8" cy="7.2" r="0.5" fill="currentColor" stroke="none"></circle><path d="M12 16v-3.2a1.8 1.8 0 0 1 3.6 0V16"></path><line x1="12" y1="11" x2="12" y2="16"></line></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21a9 9 0 1 0-7.8-4.5L3 21l4.7-1.2A9 9 0 0 0 12 21Z"></path><path d="M8.5 11c.3 2 2.5 4.2 4.5 4.5.8.1 1.4-.6 1.2-1.3l-.3-1a.7.7 0 0 0-.7-.5h-1c-.7-.5-1.6-1.4-2.1-2.1v-1a.7.7 0 0 0-.5-.7l-1-.3c-.7-.2-1.4.4-1.1 1.2Z"></path></svg>`,
  github: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2C6.477 2 2 6.484 2 12.014c0 4.42 2.865 8.166 6.839 9.49.5.093.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.455-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.833.09-.647.349-1.088.635-1.339-2.221-.253-4.555-1.114-4.555-4.954 0-1.094.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.203 2.397.1 2.65.64.7 1.028 1.594 1.028 2.688 0 3.85-2.338 4.698-4.566 4.946.359.309.678.92.678 1.855 0 1.338-.012 2.418-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.014C22 6.484 17.522 2 12 2Z"></path></svg>`,
};

// === UI icons (inline SVG, same stroke style as ICONS — used for placeholders/meta rows) ===
const UI_ICONS = {
  code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 7-5 5 5 5"></path><path d="m15 7 5 5-5 5"></path></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3.5 2"></path></svg>`,
  puzzle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h3a1 1 0 0 0 1-1V5a2 2 0 0 1 4 0v1a1 1 0 0 0 1 1h3a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h1a2 2 0 0 1 0 4h-1a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-1a2 2 0 0 0-4 0v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a2 2 0 0 0 0-4H5a1 1 0 0 1-1-1V7Z"></path></svg>`,
  externalLink: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6"></path><path d="M20 4 10 14"></path><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"></path></svg>`,
  image: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"></rect><circle cx="8.5" cy="9" r="1.5"></circle><path d="m21 15-5-5-9 9"></path></svg>`,
  rocket: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c2.5 2 4 5.5 4 9.5 0 2-.5 4-1.3 5.5L12 19l-2.7-2c-.8-1.5-1.3-3.5-1.3-5.5C8 7.5 9.5 4 12 2Z"></path><path d="M9 14c-1.5 0-3 1-3.5 3.5C7 17 8.5 16.5 9 15"></path><path d="M15 14c1.5 0 3 1 3.5 3.5C17 17 15.5 16.5 15 15"></path><circle cx="12" cy="9.5" r="1.6"></circle><path d="M10 19.5 9 22M14 19.5l1 2.5"></path></svg>`,
  sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.2"></circle><path d="M12 3v2.2M12 18.8V21M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M3 12h2.2M18.8 12H21M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"></path></svg>`,
  moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"></path></svg>`,
  zoomIn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21 16.65 16.65M11 8v6M8 11h6"/></svg>`,
  zoomOut: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21 16.65 16.65M8 11h6"/></svg>`,
  fullscreen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V3h4M17 3h4v4M21 17v4h-4M7 21H3v-4"/></svg>`,
  exitFullscreen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3v4H3M21 7h-4V3M17 21v-4h4M3 17h4v4"/></svg>`,
};

// === Language ===
function setLang(l) {
  lang = l;
  localStorage.setItem('lang', l);
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === l);
  });
  renderAll();
}

// === Theme ===
function applyTheme(th) {
  theme = th;
  document.documentElement.setAttribute('data-theme', th);
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.classList.toggle('is-dark', th === 'dark');
  });
}
function setTheme(th) {
  localStorage.setItem('theme', th);
  applyTheme(th);
}
function toggleTheme() {
  setTheme(theme === 'light' ? 'dark' : 'light');
}

// === Data fetching ===
async function loadData() {
  const [p, a, c] = await Promise.all([
    fetch('/api/projects').then(r => r.json()),
    fetch('/api/about').then(r => r.json()),
    fetch('/api/contacts').then(r => r.json()),
  ]);
  projects = p;
  about = a;
  contacts = c;
  renderAll();
}

// === Render ===
function renderAll() {
  renderStatic();
  renderAbout();
  renderPortfolio();
  renderContacts();
}

function renderStatic() {
  // Navbar
  qs('#nav-about').textContent = t('nav_about');
  qs('#nav-portfolio').textContent = t('nav_portfolio');
  qs('#nav-contacts').textContent = t('nav_contacts');
  qs('#mob-about').textContent = t('nav_about');
  qs('#mob-portfolio').textContent = t('nav_portfolio');
  qs('#mob-contacts').textContent = t('nav_contacts');
  // Hero
  qs('#hero-badge').textContent = t('available');
  qs('#hero-btn1').textContent = t('hero_btn1');
  qs('#hero-btn2').textContent = t('hero_btn2');
  qs('#hero-exp-label').textContent = t('hero_exp');
  qs('#hero-proj-label').textContent = t('hero_proj');
  qs('#hero-clients-label').textContent = t('hero_clients');
  // Portfolio
  qs('#portfolio-title').textContent = t('portfolio_title');
  qs('#portfolio-sub').textContent = t('portfolio_sub');
  qs('#tab-bubble').textContent = t('tab_bubble');
  qs('#tab-code').textContent = t('tab_code');
  // Footer
  qs('#footer-text').textContent = t('footer');
}

function renderAbout() {
  const name = (lang === 'ru' ? about.nameRu : about.nameEn) || '';
  const [firstName, ...rest] = name.split(' ');
  qs('#hero-name1').textContent = firstName || '';
  qs('#hero-name2').textContent = rest.join(' ');
  qs('#about-role').textContent = lang === 'ru' ? about.titleRu : about.titleEn;
  qs('#about-bio').textContent = lang === 'ru' ? about.bioRu : about.bioEn;
  // Stats
  qs('#hero-exp-val').textContent = about.experienceYears || 0;
  qs('#hero-proj-val').textContent = about.projectsCount || 0;
  qs('#hero-clients-val').textContent = about.clientsCount || 0;
  // Photo
  const photoWrap = qs('#about-photo');
  if (about.photo) {
    photoWrap.innerHTML = `<img src="${about.photo}" alt="${about.nameEn}">`;
  } else {
    photoWrap.innerHTML = `<div class="about-photo-placeholder">${UI_ICONS.code}</div>`;
  }
  // Skills
  const skillsEl = qs('#about-skills');
  skillsEl.innerHTML = (about.skills || []).map(s => `<span class="skill-chip">${s}</span>`).join('');
}

function renderPortfolio() {
  const filtered = projects.filter(p => p.category === category);
  const grid = qs('#cards-grid');

  // Mobile hint
  const hintEl = qs('#carousel-hint');
  if (hintEl) hintEl.style.display = filtered.length > 1 && window.innerWidth <= 768 ? 'flex' : 'none';
  if (hintEl) hintEl.querySelector('.hint-text').textContent = t('scroll_hint');

  if (!filtered.length) {
    grid.innerHTML = `<div class="no-projects">
      <div class="no-projects-icon">${UI_ICONS.rocket}</div>
      <div>${t('no_projects')}</div>
    </div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => buildCard(p)).join('');
}

const STATUS_MAP = {
  live: { ru: 'Работает', en: 'Live', cls: 'status-live' },
  completed: { ru: 'Завершён', en: 'Completed', cls: 'status-completed' },
  'in-development': { ru: 'В разработке', en: 'In Development', cls: 'status-in-development' },
  mvp: { ru: 'MVP', en: 'MVP', cls: 'status-mvp' },
  paused: { ru: 'На паузе', en: 'Paused', cls: 'status-paused' },
};

function buildCard(p) {
  const title = lang === 'ru' ? p.titleRu : p.titleEn;
  const desc = lang === 'ru' ? p.descriptionRu : p.descriptionEn;
  const fullDesc = lang === 'ru' ? p.fullDescriptionRu : p.fullDescriptionEn;
  const features = (lang === 'ru' ? p.featuresRu : p.features) || [];
  const duration = lang === 'ru' ? p.durationRu : p.duration;
  const statusInfo = STATUS_MAP[p.status] || STATUS_MAP.completed;
  const statusText = statusInfo[lang];
  const vertical = p.layout === 'vertical';
  const contain = p.imageFit === 'contain';

  const mediaHtml = buildCarousel(p.images, title, { openOnClick: p.id, vertical, contain });
  const chipsHtml = features.map(f => `<span class="chip">${esc(f)}</span>`).join('');
  const intHtml = (p.integrations || []).map(i => `<span class="int-chip">${esc(i)}</span>`).join('');
  const readMoreHtml = fullDesc ? `
      <details class="full-desc-details">
        <summary class="read-more-toggle">${t('read_more')}<span class="chevron"></span></summary>
        <p class="card-full-desc">${esc(fullDesc)}</p>
      </details>` : '';
  const linkLineHtml = p.link ? `
      <a href="${esc(p.link)}" target="_blank" rel="noopener" class="card-link-line"><span class="link-icon">${UI_ICONS.externalLink}</span>${t('visit_project')}</a>` : '';

  return `<div class="card${vertical ? ' card-vertical' : ''}" data-id="${p.id}">
    <div class="card-info">
      <div class="card-top">
        <h3 class="card-title">${esc(title)}</h3>
        <span class="status-badge ${statusInfo.cls}">${statusText}</span>
      </div>
      ${linkLineHtml}
      <p class="card-desc">${esc(desc)}</p>
      <div class="chips-row">${chipsHtml}</div>
      <div class="card-meta">
        <div class="meta-row"><span class="meta-icon">${UI_ICONS.clock}</span><span>${t('duration')}: ${esc(duration)}</span></div>
        ${intHtml ? `<div class="meta-row"><span class="meta-icon">${UI_ICONS.puzzle}</span><div class="integrations-chips">${intHtml}</div></div>` : ''}
      </div>
    </div>
    <div class="card-media-wrap">${mediaHtml}</div>
    <div class="card-readmore">${readMoreHtml}</div>
  </div>`;
}

function buildCarousel(images, alt, opts = {}) {
  if (!images || !images.length) {
    return `<div class="card-placeholder">${UI_ICONS.image}</div>`;
  }
  const slides = images.map((src) =>
    `<img src="${src}" alt="${esc(alt)}" class="carousel-slide${opts.contain ? ' contain' : ''}">`
  ).join('');
  const dots = images.length > 1
    ? `<div class="carousel-dots">${images.map((_, i) => `<div class="dot${i===0?' active':''}" onclick="event.stopPropagation();cardDotClick(this,${i})"></div>`).join('')}</div>`
    : '';
  const btns = images.length > 1
    ? `<button class="carousel-btn prev" onclick="event.stopPropagation();cardSlide(this,-1)"></button>
       <button class="carousel-btn next" onclick="event.stopPropagation();cardSlide(this,1)"></button>`
    : '';
  const clickAttr = opts.openOnClick ? ` onclick="openLightbox('${opts.openOnClick}',+this.dataset.idx)" role="button" tabindex="0"` : '';
  return `<div class="card-carousel${opts.vertical ? ' vertical' : ''}" data-idx="0" data-count="${images.length}"${clickAttr}>
    <div class="carousel-track">${slides}</div>
    ${btns}${dots}
  </div>`;
}

// === Card carousel controls ===
function cardSlide(btn, dir) {
  const c = btn.closest('.card-carousel');
  carouselMove(c, dir);
}
function cardDotClick(dot, idx) {
  const c = dot.closest('.card-carousel');
  carouselSet(c, idx);
}
function carouselMove(c, dir) {
  const count = +c.dataset.count;
  const cur = +c.dataset.idx;
  carouselSet(c, (cur + dir + count) % count);
}
function carouselSet(c, idx) {
  c.dataset.idx = idx;
  c.querySelector('.carousel-track').style.transform = `translateX(-${idx * 100}%)`;
  c.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === idx));
}

// === Lightbox (screenshots-only carousel) ===
let modalCarousel = { idx: 0, count: 0 };
let lbState = { zoom: 1 };

function openLightbox(id, startIdx = 0) {
  const p = projects.find(x => x.id === id);
  if (!p || !p.images || !p.images.length) return;
  const title = lang === 'ru' ? p.titleRu : p.titleEn;
  const vertical = p.layout === 'vertical';
  const count = p.images.length;
  startIdx = Math.max(0, Math.min(startIdx, count - 1));

  modalCarousel = { idx: startIdx, count };
  lbState.zoom = 1;

  const dotsHtml = count > 1
    ? `<div class="carousel-dots">${p.images.map((_,i)=>`<div class="dot${i===startIdx?' active':''}" onclick="modalDot(${i})"></div>`).join('')}</div>`
    : '';
  const btnsHtml = count > 1
    ? `<button class="carousel-btn prev" onclick="modalSlide(-1)"></button>
       <button class="carousel-btn next" onclick="modalSlide(1)"></button>`
    : '';

  qs('#modal').innerHTML = `
    <div class="modal-overlay open" id="modal-overlay" onclick="overlayClick(event)">
      <div class="modal lightbox-modal">
        <button class="modal-close lightbox-close" onclick="closeModal()">✕</button>
        <div class="card-carousel lightbox-carousel${vertical ? ' vertical' : ''}" data-idx="${startIdx}" data-count="${count}" id="modal-car">
          <div class="carousel-track" style="transform:translateX(-${startIdx * 100}%)">
            ${p.images.map(src => `<img src="${src}" alt="${esc(title)}" class="carousel-slide contain">`).join('')}
          </div>
          ${btnsHtml}${dotsHtml}
          <div class="lb-toolbar">
            <button class="lb-btn" onclick="event.stopPropagation();lbZoom(-0.25)" title="Уменьшить">${UI_ICONS.zoomOut}</button>
            <button class="lb-btn" onclick="event.stopPropagation();lbZoom(+0.25)" title="Увеличить">${UI_ICONS.zoomIn}</button>
            <button class="lb-btn lb-fs-btn" onclick="event.stopPropagation();lbFullscreen()" title="На весь экран">${UI_ICONS.fullscreen}</button>
          </div>
        </div>
      </div>
    </div>`;
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = qs('#modal-overlay');
  if (overlay) { overlay.classList.remove('open'); setTimeout(() => { qs('#modal').innerHTML = ''; }, 300); }
  document.body.style.overflow = '';
}

function overlayClick(e) {
  if (e.target === qs('#modal-overlay')) closeModal();
}

function modalSlide(dir) {
  const c = qs('#modal-car');
  if (!c) return;
  lbZoomReset(c);
  carouselMove(c, dir);
}
function modalDot(idx) {
  const c = qs('#modal-car');
  if (!c) return;
  lbZoomReset(c);
  carouselSet(c, idx);
}

function lbZoomReset(car) {
  lbState.zoom = 1;
  (car || qs('#modal-car')).querySelectorAll('.carousel-slide').forEach(img => {
    img.style.transform = '';
  });
}

function lbZoom(delta) {
  const car = qs('#modal-car');
  if (!car) return;
  lbState.zoom = Math.min(4, Math.max(0.5, lbState.zoom + delta));
  const idx = +car.dataset.idx;
  const slides = car.querySelectorAll('.carousel-slide');
  if (slides[idx]) {
    slides[idx].style.transform = lbState.zoom === 1 ? '' : `scale(${lbState.zoom})`;
  }
}

function lbFullscreen() {
  const overlay = qs('#modal-overlay');
  if (!overlay) return;
  if (!document.fullscreenElement) {
    overlay.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

// === Category tabs ===
function setCategory(cat) {
  category = cat;
  qs('#tab-bubble').classList.toggle('active', cat === 'bubble');
  qs('#tab-code').classList.toggle('active', cat === 'code');
  renderPortfolio();
}

// === Navbar ===
function initNavbar() {
  window.addEventListener('scroll', () => {
    qs('#navbar').classList.toggle('scrolled', window.scrollY > 20);
  });
  qs('#hamburger').addEventListener('click', () => {
    const open = qs('#mobile-nav').classList.toggle('open');
    qs('#hamburger').classList.toggle('open', open);
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#navbar') && !e.target.closest('#mobile-nav')) {
      qs('#mobile-nav').classList.remove('open');
      qs('#hamburger').classList.remove('open');
    }
  });
  // Close mobile nav on link click
  qs('#mobile-nav').querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      qs('#mobile-nav').classList.remove('open');
      qs('#hamburger').classList.remove('open');
    });
  });
}

// === Contact form ===
function initForm() {
  const form = qs('#contact-form');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const msg = qs('#form-msg');
    const submitBtn = qs('#form-submit');
    const data = Object.fromEntries(new FormData(form).entries());
    submitBtn.disabled = true;
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!r.ok) throw new Error('request failed');
      msg.className = 'form-msg success';
      msg.textContent = t('form_success');
      form.reset();
    } catch {
      msg.className = 'form-msg error';
      msg.textContent = t('form_error');
    } finally {
      submitBtn.disabled = false;
      setTimeout(() => { msg.className = 'form-msg'; }, 5000);
    }
  });
}

function renderContacts() {
  qs('#contacts-title').textContent = t('contacts_title');
  qs('#contacts-heading').textContent = contacts.headingRu
    ? (lang === 'ru' ? contacts.headingRu : contacts.headingEn)
    : t('contacts_title');
  qs('#contacts-sub').textContent = contacts.subtitleRu
    ? (lang === 'ru' ? contacts.subtitleRu : contacts.subtitleEn)
    : '';

  const list = qs('#contacts-list');
  const items = [];
  if (contacts.email) items.push({ icon: ICONS.email, label: 'Email', value: contacts.email, href: `mailto:${contacts.email}` });
  if (contacts.telegram) items.push({ icon: ICONS.telegram, label: 'Telegram', value: contacts.telegram, href: `https://t.me/${contacts.telegram.replace('@','')}` });
  if (contacts.linkedin) items.push({ icon: ICONS.linkedin, label: 'LinkedIn', value: contacts.linkedin, href: `https://` + contacts.linkedin });
  if (contacts.whatsapp) items.push({ icon: ICONS.whatsapp, label: 'WhatsApp', value: contacts.whatsapp, href: `https://wa.me/${contacts.whatsapp.replace(/\D/g,'')}` });
  if (contacts.github) items.push({ icon: ICONS.github, label: 'GitHub', value: contacts.github, href: `https://github.com/${contacts.github.replace('@','')}` });

  list.innerHTML = items.map(item => `
    <a href="${item.href}" target="_blank" rel="noopener" class="contact-item">
      <div class="contact-icon">${item.icon}</div>
      <div>
        <div class="contact-label">${item.label}</div>
        <div class="contact-value">${esc(item.value)}</div>
      </div>
    </a>
  `).join('');

  qs('#form-name-label').textContent = t('form_name');
  qs('#form-email-label').textContent = t('form_email');
  qs('#form-msg-label').textContent = t('form_message');
  qs('#form-submit').textContent = t('form_send');
}

// === Helpers ===
function qs(sel) { return document.querySelector(sel); }
function esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// === Keyboard support ===
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
  if (!qs('#modal-overlay')) return;
  if (e.key === 'ArrowLeft') modalSlide(-1);
  if (e.key === 'ArrowRight') modalSlide(1);
  if (e.key === '+' || e.key === '=') lbZoom(+0.25);
  if (e.key === '-') lbZoom(-0.25);
});

document.addEventListener('fullscreenchange', () => {
  const btn = qs('.lb-fs-btn');
  if (!btn) return;
  const inFs = !!document.fullscreenElement;
  btn.innerHTML = inFs ? UI_ICONS.exitFullscreen : UI_ICONS.fullscreen;
  btn.title = inFs ? 'Выйти из полного экрана' : 'На весь экран';
});

// === Init ===
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  // Set initial lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  applyTheme(theme);
  initForm();
  loadData();
});
