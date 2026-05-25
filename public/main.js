// === State ===
let lang = localStorage.getItem('lang') || 'ru';
let category = 'bubble';
let projects = [];
let about = {};
let contacts = {};

// === i18n ===
const T = {
  ru: {
    available: 'Открыт к проектам',
    hero_title1: 'Дмитрий',
    hero_title2: 'Павлов',
    hero_desc: 'No-code разработчик, специализирующийся на Bubble. Создаю веб-приложения, MVP и SaaS-продукты быстро и качественно.',
    hero_btn1: 'Посмотреть работы',
    hero_btn2: 'Написать мне',
    hero_exp: 'лет опыта',
    hero_proj: 'проектов',
    hero_clients: 'клиентов',
    nav_about: 'Обо мне',
    nav_portfolio: 'Портфолио',
    nav_contacts: 'Контакты',
    about_title: 'Обо мне',
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
    view_more: 'Подробнее',
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
    hero_title1: 'Dmitriy',
    hero_title2: 'Pavlov',
    hero_desc: 'No-code developer specializing in Bubble. I build web apps, MVPs and SaaS products quickly and with quality.',
    hero_btn1: 'View my work',
    hero_btn2: 'Contact me',
    hero_exp: 'years of exp.',
    hero_proj: 'projects',
    hero_clients: 'clients',
    nav_about: 'About',
    nav_portfolio: 'Portfolio',
    nav_contacts: 'Contacts',
    about_title: 'About Me',
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
    view_more: 'View More',
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

// === Language ===
function setLang(l) {
  lang = l;
  localStorage.setItem('lang', l);
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === l);
  });
  renderAll();
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
  qs('#hero-name1').textContent = t('hero_title1');
  qs('#hero-name2').textContent = t('hero_title2');
  qs('#hero-desc').textContent = t('hero_desc');
  qs('#hero-btn1').textContent = t('hero_btn1');
  qs('#hero-btn2').textContent = t('hero_btn2');
  qs('#hero-exp-label').textContent = t('hero_exp');
  qs('#hero-proj-label').textContent = t('hero_proj');
  qs('#hero-clients-label').textContent = t('hero_clients');
  // Stats
  qs('#hero-exp-val').textContent = about.experienceYears || 3;
  qs('#hero-proj-val').textContent = about.projectsCount || 30;
  qs('#hero-clients-val').textContent = about.clientsCount || 20;
  // Portfolio
  qs('#portfolio-title').textContent = t('portfolio_title');
  qs('#portfolio-sub').textContent = t('portfolio_sub');
  qs('#tab-bubble').textContent = t('tab_bubble');
  qs('#tab-code').textContent = t('tab_code');
  // Footer
  qs('#footer-text').textContent = t('footer');
}

function renderAbout() {
  qs('#about-title').textContent = t('about_title');
  qs('#about-name').textContent = lang === 'ru' ? about.nameRu : about.nameEn;
  qs('#about-role').textContent = lang === 'ru' ? about.titleRu : about.titleEn;
  qs('#about-bio').textContent = lang === 'ru' ? about.bioRu : about.bioEn;
  // Photo
  const photoWrap = qs('#about-photo');
  if (about.photo) {
    photoWrap.innerHTML = `<img src="${about.photo}" alt="${about.nameEn}">`;
  } else {
    photoWrap.innerHTML = `<div class="about-photo-placeholder">👨‍💻</div>`;
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
      <div class="no-projects-icon">🚀</div>
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
  paused: { ru: 'На паузе', en: 'Paused', cls: 'status-paused' },
};

function buildCard(p) {
  const title = lang === 'ru' ? p.titleRu : p.titleEn;
  const desc = lang === 'ru' ? p.descriptionRu : p.descriptionEn;
  const features = (lang === 'ru' ? p.featuresRu : p.features) || [];
  const duration = lang === 'ru' ? p.durationRu : p.duration;
  const statusInfo = STATUS_MAP[p.status] || STATUS_MAP.completed;
  const statusText = statusInfo[lang];

  const mediaHtml = buildCarousel(p.images, p.id, title);
  const chipsHtml = features.map(f => `<span class="chip">${esc(f)}</span>`).join('');
  const intHtml = (p.integrations || []).map(i => `<span class="int-chip">${esc(i)}</span>`).join('');

  return `<div class="card" data-id="${p.id}">
    ${mediaHtml}
    <div class="card-body">
      <div class="card-top">
        <h3 class="card-title">${esc(title)}</h3>
        <span class="status-badge ${statusInfo.cls}">${statusText}</span>
      </div>
      <p class="card-desc">${esc(desc)}</p>
      <div class="chips-row">${chipsHtml}</div>
      <div class="card-meta">
        <div class="meta-row"><span class="meta-icon">⏱</span><span>${t('duration')}: ${esc(duration)}</span></div>
        ${intHtml ? `<div class="meta-row"><span class="meta-icon">🔗</span><div class="integrations-chips">${intHtml}</div></div>` : ''}
      </div>
      <button class="btn-view" onclick="openModal('${p.id}')">${t('view_more')}</button>
    </div>
  </div>`;
}

function buildCarousel(images, id, alt) {
  if (!images || !images.length) {
    return `<div class="card-placeholder">📁</div>`;
  }
  const slides = images.map((src, i) =>
    `<img src="${src}" alt="${esc(alt)}" class="carousel-slide">`
  ).join('');
  const dots = images.length > 1
    ? `<div class="carousel-dots">${images.map((_, i) => `<div class="dot${i===0?' active':''}" onclick="cardDotClick(this,${i})"></div>`).join('')}</div>`
    : '';
  const btns = images.length > 1
    ? `<button class="carousel-btn prev" onclick="cardSlide(this,-1)">&#8249;</button>
       <button class="carousel-btn next" onclick="cardSlide(this,1)">&#8250;</button>`
    : '';
  return `<div class="card-carousel" data-idx="0" data-count="${images.length}">
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

// === Modal ===
let modalCarousel = { idx: 0, count: 0 };

function openModal(id) {
  const p = projects.find(x => x.id === id);
  if (!p) return;
  const title = lang === 'ru' ? p.titleRu : p.titleEn;
  const fullDesc = lang === 'ru' ? p.fullDescriptionRu : p.fullDescriptionEn;
  const features = (lang === 'ru' ? p.featuresRu : p.features) || [];
  const duration = lang === 'ru' ? p.durationRu : p.duration;
  const statusInfo = STATUS_MAP[p.status] || STATUS_MAP.completed;

  // Carousel
  modalCarousel = { idx: 0, count: (p.images || []).length };
  const imgHtml = p.images && p.images.length
    ? `<div class="card-carousel modal-carousel" data-idx="0" data-count="${p.images.length}" id="modal-car">
        <div class="carousel-track">
          ${p.images.map(src => `<img src="${src}" alt="${esc(title)}" class="carousel-slide">`).join('')}
        </div>
        ${p.images.length > 1 ? `
          <button class="carousel-btn prev" onclick="modalSlide(-1)">&#8249;</button>
          <button class="carousel-btn next" onclick="modalSlide(1)">&#8250;</button>
          <div class="carousel-dots">${p.images.map((_,i)=>`<div class="dot${i===0?' active':''}" onclick="modalDot(${i})"></div>`).join('')}</div>
        ` : ''}
      </div>`
    : `<div class="modal-placeholder">📁</div>`;

  const chipsHtml = features.map(f => `<span class="chip">${esc(f)}</span>`).join('');
  const intHtml = (p.integrations || []).map(i => `<span class="int-chip">${esc(i)}</span>`).join('');

  qs('#modal').innerHTML = `
    <div class="modal-overlay open" id="modal-overlay" onclick="overlayClick(event)">
      <div class="modal">
        ${imgHtml}
        <div class="modal-body">
          <div class="modal-top">
            <h2 class="modal-title">${esc(title)}</h2>
            <button class="modal-close" onclick="closeModal()">✕</button>
          </div>
          <p class="modal-desc">${esc(fullDesc || '')}</p>
          <div class="modal-grid">
            <div class="modal-section">
              <div class="modal-section-title">${t('features')}</div>
              <div class="chips-row">${chipsHtml}</div>
            </div>
            <div class="modal-section">
              <div class="modal-section-title">${t('duration')}</div>
              <div class="chip" style="width:fit-content">${esc(duration)}</div>
            </div>
            <div class="modal-section">
              <div class="modal-section-title">Status</div>
              <span class="status-badge ${statusInfo.cls}">${statusInfo[lang]}</span>
            </div>
            ${intHtml ? `<div class="modal-section">
              <div class="modal-section-title">${t('integrations_label')}</div>
              <div class="integrations-chips">${intHtml}</div>
            </div>` : ''}
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
  if (c) carouselMove(c, dir);
}
function modalDot(idx) {
  const c = qs('#modal-car');
  if (c) carouselSet(c, idx);
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

// === Contact form (cosmetic only – no backend handler) ===
function initForm() {
  const form = qs('#contact-form');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const msg = qs('#form-msg');
    // Just show success (no actual email sending without backend config)
    msg.className = 'form-msg success';
    msg.textContent = t('form_success');
    form.reset();
    setTimeout(() => { msg.className = 'form-msg'; }, 5000);
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
  if (contacts.email) items.push({ icon: '✉️', label: 'Email', value: contacts.email, href: `mailto:${contacts.email}` });
  if (contacts.telegram) items.push({ icon: '✈️', label: 'Telegram', value: contacts.telegram, href: `https://t.me/${contacts.telegram.replace('@','')}` });
  if (contacts.linkedin) items.push({ icon: '💼', label: 'LinkedIn', value: contacts.linkedin, href: `https://` + contacts.linkedin });
  if (contacts.whatsapp) items.push({ icon: '📱', label: 'WhatsApp', value: contacts.whatsapp, href: `https://wa.me/${contacts.whatsapp.replace(/\D/g,'')}` });
  if (contacts.github) items.push({ icon: '🐙', label: 'GitHub', value: contacts.github, href: `https://github.com/${contacts.github.replace('@','')}` });

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
});

// === Init ===
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  // Set initial lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  initForm();
  loadData();
});
