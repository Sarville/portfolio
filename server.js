const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Admin password
const ADMIN_PASSWORD = 'pf_Admin2025';
const ADMIN_HASH = crypto.createHash('sha256').update(ADMIN_PASSWORD).digest('hex');

// In-memory sessions
const sessions = new Map();

// Multer setup
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = path.join(__dirname, 'public', 'uploads');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 15 * 1024 * 1024 } });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Data helpers
const DATA = {
  projects: path.join(__dirname, 'data', 'projects.json'),
  about: path.join(__dirname, 'data', 'about.json'),
  contacts: path.join(__dirname, 'data', 'contacts.json')
};

function read(key) {
  try { return JSON.parse(fs.readFileSync(DATA[key], 'utf8')); }
  catch { return key === 'projects' ? [] : {}; }
}

function write(key, data) {
  fs.writeFileSync(DATA[key], JSON.stringify(data, null, 2));
}

// Auth middleware
function auth(req, res, next) {
  const token = req.headers['x-token'];
  if (token && sessions.has(token)) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

// Clean old sessions every hour
setInterval(() => {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  for (const [token, sess] of sessions) {
    if (sess.at < cutoff) sessions.delete(token);
  }
}, 60 * 60 * 1000);

// === AUTH ===
app.post('/api/login', (req, res) => {
  const hash = crypto.createHash('sha256').update(req.body.password || '').digest('hex');
  if (hash !== ADMIN_HASH) return res.status(401).json({ error: 'Wrong password' });
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, { at: Date.now() });
  res.json({ token });
});

app.post('/api/logout', auth, (req, res) => {
  sessions.delete(req.headers['x-token']);
  res.json({ ok: true });
});

app.get('/api/auth', auth, (req, res) => res.json({ ok: true }));

// === PUBLIC ===
app.get('/api/projects', (req, res) => res.json(read('projects')));
app.get('/api/about', (req, res) => res.json(read('about')));
app.get('/api/contacts', (req, res) => res.json(read('contacts')));

// === ADMIN - Projects ===
app.post('/api/admin/projects', auth, upload.array('images', 20), (req, res) => {
  const projects = read('projects');
  const data = JSON.parse(req.body.data);
  const newImages = (req.files || []).map(f => '/uploads/' + f.filename);
  const project = {
    ...data,
    id: Date.now().toString(),
    images: [...(data.existingImages || []), ...newImages]
  };
  delete project.existingImages;
  projects.push(project);
  write('projects', projects);
  res.json(project);
});

app.put('/api/admin/projects/:id', auth, upload.array('images', 20), (req, res) => {
  const projects = read('projects');
  const idx = projects.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const data = JSON.parse(req.body.data);
  const newImages = (req.files || []).map(f => '/uploads/' + f.filename);
  projects[idx] = {
    ...data,
    id: req.params.id,
    images: [...(data.existingImages || []), ...newImages]
  };
  delete projects[idx].existingImages;
  write('projects', projects);
  res.json(projects[idx]);
});

app.delete('/api/admin/projects/:id', auth, (req, res) => {
  let projects = read('projects');
  projects = projects.filter(p => p.id !== req.params.id);
  write('projects', projects);
  res.json({ ok: true });
});

// === ADMIN - About ===
app.put('/api/admin/about', auth, upload.single('photo'), (req, res) => {
  const data = JSON.parse(req.body.data);
  if (req.file) data.photo = '/uploads/' + req.file.filename;
  write('about', data);
  res.json(data);
});

// === ADMIN - Contacts ===
app.put('/api/admin/contacts', auth, (req, res) => {
  write('contacts', req.body);
  res.json(req.body);
});

// SPA fallback for admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  Portfolio running at http://localhost:${PORT}`);
  console.log(`  Admin panel:       http://localhost:${PORT}/admin`);
  console.log(`  Admin password:    ${ADMIN_PASSWORD}\n`);
});
