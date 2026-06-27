// === State ===
let token = localStorage.getItem('admin_token') || '';
let currentPage = 'projects';
let projects = [];
let about = {};
let contacts = {};
let editingId = null;
let formImages = { existing: [], newFiles: [] };

// === Auth ===
async function login() {
  const pwd = qs('#login-password').value;
  const errEl = qs('#login-error');
  try {
    const res = await api('POST', '/api/login', { password: pwd });
    token = res.token;
    localStorage.setItem('admin_token', token);
    errEl.classList.remove('show');
    startApp();
  } catch {
    errEl.textContent = 'Неверный пароль';
    errEl.classList.add('show');
  }
}

async function logout() {
  try { await api('POST', '/api/logout'); } catch {}
  token = '';
  localStorage.removeItem('admin_token');
  qs('#app').classList.remove('visible');
  qs('#login-screen').style.display = 'flex';
  qs('#login-password').value = '';
}

async function checkAuth() {
  if (!token) return false;
  try { await api('GET', '/api/auth'); return true; }
  catch { token = ''; localStorage.removeItem('admin_token'); return false; }
}

// === App ===
async function startApp() {
  qs('#login-screen').style.display = 'none';
  qs('#app').classList.add('visible');
  await loadAll();
  showPage('projects');
}

async function loadAll() {
  const [p, a, c] = await Promise.all([
    api('GET', '/api/projects'),
    api('GET', '/api/about'),
    api('GET', '/api/contacts'),
  ]);
  projects = p;
  about = a;
  contacts = c;
}

// === Navigation ===
function showPage(page) {
  currentPage = page;
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.page === page));
  qs(`#page-${page}`).classList.add('active');
  if (page === 'projects') renderProjectsTable();
  if (page === 'about') renderAboutForm();
  if (page === 'contacts') renderContactsForm();
}

// === Projects ===
function renderProjectsTable() {
  const tbody = qs('#projects-tbody');
  const statusLabels = { live:'Работает', completed:'Завершён', 'in-development':'В разработке', mvp:'MVP', paused:'На паузе' };
  const statusCls   = { live:'s-live', completed:'s-completed', 'in-development':'s-in-development', mvp:'s-mvp', paused:'s-paused' };
  tbody.innerHTML = projects.map(p => `
    <tr>
      <td class="td-title">${esc(p.titleRu)}</td>
      <td><span class="s-badge ${statusCls[p.status]||''}">${statusLabels[p.status]||p.status}</span></td>
      <td>${esc(p.category)}</td>
      <td>${esc(p.durationRu||'')}</td>
      <td>${(p.images||[]).length} фото</td>
      <td>
        <div class="td-actions">
          <button class="btn btn-ghost btn-sm" onclick="openProjectModal('${p.id}')">Редактировать</button>
          <button class="btn btn-danger btn-sm" onclick="deleteProject('${p.id}')">Удалить</button>
        </div>
      </td>
    </tr>
  `).join('') || `<tr><td colspan="6" style="text-align:center;color:var(--text-d);padding:2rem">Нет проектов</td></tr>`;
}

function openProjectModal(id) {
  editingId = id || null;
  const p = id ? projects.find(x => x.id === id) : null;
  formImages = { existing: p ? [...(p.images||[])] : [], newFiles: [] };

  qs('#proj-modal-title').textContent = id ? 'Редактировать проект' : 'Новый проект';

  // Populate fields
  setVal('#pf-title-ru', p?.titleRu);
  setVal('#pf-title-en', p?.titleEn);
  setVal('#pf-link', p?.link);
  setVal('#pf-desc-ru', p?.descriptionRu);
  setVal('#pf-desc-en', p?.descriptionEn);
  setVal('#pf-fdesc-ru', p?.fullDescriptionRu);
  setVal('#pf-fdesc-en', p?.fullDescriptionEn);
  setVal('#pf-status', p?.status || 'completed');
  setVal('#pf-category', p?.category || 'bubble');
  setVal('#pf-layout', p?.layout || 'horizontal');
  setVal('#pf-dur-ru', p?.durationRu);
  setVal('#pf-dur-en', p?.duration);

  // Tags
  renderTags('#stack-tags', p?.tags || []);
  renderTags('#features-ru-tags', p?.featuresRu || []);
  renderTags('#features-en-tags', p?.features || []);
  renderTags('#integrations-tags', p?.integrations || []);

  // Images
  renderImagePreviews();

  openModal('proj-modal');
}

async function saveProject() {
  const data = {
    titleRu: getVal('#pf-title-ru'),
    titleEn: getVal('#pf-title-en'),
    link: getVal('#pf-link'),
    descriptionRu: getVal('#pf-desc-ru'),
    descriptionEn: getVal('#pf-desc-en'),
    fullDescriptionRu: getVal('#pf-fdesc-ru'),
    fullDescriptionEn: getVal('#pf-fdesc-en'),
    status: getVal('#pf-status'),
    category: getVal('#pf-category'),
    layout: getVal('#pf-layout'),
    durationRu: getVal('#pf-dur-ru'),
    duration: getVal('#pf-dur-en'),
    tags: getTags('#stack-tags'),
    featuresRu: getTags('#features-ru-tags'),
    features: getTags('#features-en-tags'),
    integrations: getTags('#integrations-tags'),
    existingImages: formImages.existing,
  };

  const fd = new FormData();
  fd.append('data', JSON.stringify(data));
  formImages.newFiles.forEach(f => fd.append('images', f));

  try {
    const url = editingId ? `/api/admin/projects/${editingId}` : '/api/admin/projects';
    const method = editingId ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'x-token': token },
      body: fd
    });
    if (!res.ok) throw new Error();
    const updated = await res.json();
    if (editingId) {
      projects = projects.map(p => p.id === editingId ? updated : p);
    } else {
      projects.push(updated);
    }
    closeModal('proj-modal');
    renderProjectsTable();
    toast('Сохранено', 'ok');
  } catch {
    toast('Ошибка сохранения', 'err');
  }
}

async function deleteProject(id) {
  if (!confirm('Удалить проект?')) return;
  try {
    await api('DELETE', `/api/admin/projects/${id}`);
    projects = projects.filter(p => p.id !== id);
    renderProjectsTable();
    toast('Удалено', 'ok');
  } catch { toast('Ошибка', 'err'); }
}

// === About ===
function renderAboutForm() {
  setVal('#ab-name-ru', about.nameRu);
  setVal('#ab-name-en', about.nameEn);
  setVal('#ab-title-ru', about.titleRu);
  setVal('#ab-title-en', about.titleEn);
  setVal('#ab-bio-ru', about.bioRu);
  setVal('#ab-bio-en', about.bioEn);
  setVal('#ab-exp', about.experienceYears);
  setVal('#ab-proj', about.projectsCount);
  setVal('#ab-clients', about.clientsCount);
  renderTags('#ab-skills-tags', about.skills || []);

  const photoEl = qs('#ab-photo-preview');
  if (about.photo) {
    photoEl.innerHTML = `<div class="preview-item"><img src="${about.photo}"><button class="preview-remove" onclick="clearAboutPhoto()">✕</button></div>`;
  } else {
    photoEl.innerHTML = '';
  }
}

let newAboutPhoto = null;
function clearAboutPhoto() {
  about.photo = '';
  newAboutPhoto = null;
  qs('#ab-photo-preview').innerHTML = '';
}

async function saveAbout() {
  const data = {
    nameRu: getVal('#ab-name-ru'),
    nameEn: getVal('#ab-name-en'),
    titleRu: getVal('#ab-title-ru'),
    titleEn: getVal('#ab-title-en'),
    bioRu: getVal('#ab-bio-ru'),
    bioEn: getVal('#ab-bio-en'),
    experienceYears: +getVal('#ab-exp') || 0,
    projectsCount: +getVal('#ab-proj') || 0,
    clientsCount: +getVal('#ab-clients') || 0,
    skills: getTags('#ab-skills-tags'),
    photo: about.photo || '',
  };
  const fd = new FormData();
  fd.append('data', JSON.stringify(data));
  if (newAboutPhoto) fd.append('photo', newAboutPhoto);

  try {
    const res = await fetch('/api/admin/about', {
      method: 'PUT', headers: { 'x-token': token }, body: fd
    });
    if (!res.ok) throw new Error();
    about = await res.json();
    toast('Сохранено', 'ok');
  } catch { toast('Ошибка', 'err'); }
}

// === Contacts ===
function renderContactsForm() {
  setVal('#ct-email', contacts.email);
  setVal('#ct-telegram', contacts.telegram);
  setVal('#ct-linkedin', contacts.linkedin);
  setVal('#ct-whatsapp', contacts.whatsapp);
  setVal('#ct-github', contacts.github);
  setVal('#ct-heading-ru', contacts.headingRu);
  setVal('#ct-heading-en', contacts.headingEn);
  setVal('#ct-sub-ru', contacts.subtitleRu);
  setVal('#ct-sub-en', contacts.subtitleEn);
}

async function saveContacts() {
  const data = {
    email: getVal('#ct-email'),
    telegram: getVal('#ct-telegram'),
    linkedin: getVal('#ct-linkedin'),
    whatsapp: getVal('#ct-whatsapp'),
    github: getVal('#ct-github'),
    headingRu: getVal('#ct-heading-ru'),
    headingEn: getVal('#ct-heading-en'),
    subtitleRu: getVal('#ct-sub-ru'),
    subtitleEn: getVal('#ct-sub-en'),
  };
  try {
    contacts = await api('PUT', '/api/admin/contacts', data);
    toast('Сохранено', 'ok');
  } catch { toast('Ошибка', 'err'); }
}

// === Tags input ===
function initTagsInput(wrapId) {
  const wrap = qs(`#${wrapId}`);
  const input = wrap.querySelector('input');
  input.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ',') && input.value.trim()) {
      e.preventDefault();
      addTag(`#${wrapId}`, input.value.trim());
      input.value = '';
    }
    if (e.key === 'Backspace' && !input.value) {
      const tags = wrap.querySelectorAll('.tag-item');
      if (tags.length) tags[tags.length - 1].remove();
    }
  });
  wrap.addEventListener('click', () => input.focus());
}

function renderTags(selector, values) {
  const wrap = qs(selector);
  const input = wrap.querySelector('input');
  wrap.querySelectorAll('.tag-item').forEach(el => el.remove());
  values.forEach(v => {
    const tag = document.createElement('span');
    tag.className = 'tag-item';
    tag.innerHTML = `${esc(v)}<span class="tag-remove" onclick="this.parentElement.remove()">✕</span>`;
    wrap.insertBefore(tag, input);
  });
}

function addTag(selector, value) {
  const wrap = qs(selector);
  const input = wrap.querySelector('input');
  const tag = document.createElement('span');
  tag.className = 'tag-item';
  tag.innerHTML = `${esc(value)}<span class="tag-remove" onclick="this.parentElement.remove()">✕</span>`;
  wrap.insertBefore(tag, input);
}

function getTags(selector) {
  return [...qs(selector).querySelectorAll('.tag-item')].map(el =>
    el.childNodes[0].textContent.trim()
  );
}

// === Images ===
function handleImageSelect(e) {
  const files = [...e.target.files];
  formImages.newFiles.push(...files);
  renderImagePreviews();
  e.target.value = '';
}

function renderImagePreviews() {
  const container = qs('#proj-images-preview');
  const existingHtml = formImages.existing.map((src, i) => `
    <div class="preview-item">
      <img src="${src}" alt="">
      <button class="preview-remove" onclick="removeExisting(${i})">✕</button>
    </div>`).join('');
  const newHtml = formImages.newFiles.map((f, i) => {
    const url = URL.createObjectURL(f);
    return `<div class="preview-item">
      <img src="${url}" alt="">
      <button class="preview-remove" onclick="removeNew(${i})">✕</button>
    </div>`;
  }).join('');
  container.innerHTML = existingHtml + newHtml;
}

function removeExisting(i) { formImages.existing.splice(i, 1); renderImagePreviews(); }
function removeNew(i) { formImages.newFiles.splice(i, 1); renderImagePreviews(); }

// === Modal helpers ===
function openModal(id) {
  qs(`#${id}`).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  qs(`#${id}`).classList.remove('open');
  document.body.style.overflow = '';
}

// === Toast ===
function toast(msg, type) {
  const el = qs('#toast');
  el.textContent = msg;
  el.className = `toast ${type} show`;
  setTimeout(() => el.classList.remove('show'), 3000);
}

// === API helper ===
async function api(method, url, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', 'x-token': token }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

// === Utils ===
function qs(s) { return document.querySelector(s); }
function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function setVal(sel, val) { const el = qs(sel); if (el) el.value = val || ''; }
function getVal(sel) { const el = qs(sel); return el ? el.value.trim() : ''; }

// === Init ===
document.addEventListener('DOMContentLoaded', async () => {
  // Login form submit on Enter
  qs('#login-password').addEventListener('keydown', e => {
    if (e.key === 'Enter') login();
  });

  // Init tags inputs
  ['features-ru-tags','features-en-tags','integrations-tags','ab-skills-tags'].forEach(id => initTagsInput(id));

  // Image upload area
  qs('#img-upload-area').addEventListener('click', () => qs('#img-file-input').click());
  qs('#img-file-input').addEventListener('change', handleImageSelect);
  // Drag and drop
  const area = qs('#img-upload-area');
  area.addEventListener('dragover', e => { e.preventDefault(); area.style.borderColor='var(--accent)'; });
  area.addEventListener('dragleave', () => area.style.borderColor='');
  area.addEventListener('drop', e => {
    e.preventDefault(); area.style.borderColor='';
    formImages.newFiles.push(...e.dataTransfer.files);
    renderImagePreviews();
  });

  // About photo upload
  qs('#ab-photo-input').addEventListener('change', e => {
    newAboutPhoto = e.target.files[0];
    if (newAboutPhoto) {
      const url = URL.createObjectURL(newAboutPhoto);
      qs('#ab-photo-preview').innerHTML = `<div class="preview-item"><img src="${url}"><button class="preview-remove" onclick="clearAboutPhoto()">✕</button></div>`;
    }
  });
  qs('#ab-photo-area').addEventListener('click', () => qs('#ab-photo-input').click());

  // Modal overlay click to close
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
  });

  // Check auth on load
  const ok = await checkAuth();
  if (ok) {
    startApp();
  } else {
    qs('#login-screen').style.display = 'flex';
  }
});
