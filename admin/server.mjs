// ─────────────────────────────────────────────────────────────
//  Administrador de equipos de Olivar Clima
//  Servidor local (solo accesible desde este computador).
//  Se inicia con "Administrar Olivar Clima.bat".
// ─────────────────────────────────────────────────────────────
import http from 'node:http';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const PORT = 4477;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, 'src', 'data', 'products.json');
const PUBLIC = path.join(ROOT, 'public');
const UPLOADS = path.join(PUBLIC, 'img', 'equipos');
const ADMIN_HTML = path.join(ROOT, 'admin', 'index.html');

const GIT = [path.join(process.env.ProgramFiles ?? '', 'Git', 'cmd', 'git.exe')].find((p) => existsSync(p)) ?? 'git';
const NODE = process.execPath;
const ASTRO = path.join(ROOT, 'node_modules', 'astro', 'bin', 'astro.mjs');

// Entorno limpio para que git pueda usar las credenciales guardadas
const env = { ...process.env };
for (const k of ['GIT_TERMINAL_PROMPT', 'GCM_INTERACTIVE', 'GIT_ASKPASS', 'GIT_EDITOR']) delete env[k];

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
};

function run(cmd, args) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { cwd: ROOT, env, windowsHide: true });
    let out = '';
    p.stdout.on('data', (d) => (out += d));
    p.stderr.on('data', (d) => (out += d));
    p.on('close', (code) => resolve({ code, out: out.trim() }));
    p.on('error', (e) => resolve({ code: 1, out: String(e) }));
  });
}

const send = (res, status, body, type = 'application/json; charset=utf-8') => {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
};

async function readBody(req, limit = 25 * 1024 * 1024) {
  const chunks = [];
  let size = 0;
  for await (const c of req) {
    size += c.length;
    if (size > limit) throw new Error('El archivo es demasiado grande');
    chunks.push(c);
  }
  return Buffer.concat(chunks).toString('utf8');
}

function validate(list) {
  if (!Array.isArray(list)) throw new Error('Formato inválido');
  const ids = new Set();
  return list.map((p, i) => {
    const n = `Equipo ${i + 1}`;
    if (!p || typeof p !== 'object') throw new Error(`${n}: datos inválidos`);
    if (!p.id || typeof p.id !== 'string' || ids.has(p.id)) throw new Error(`${n}: identificador inválido o repetido`);
    ids.add(p.id);
    if (!String(p.name ?? '').trim()) throw new Error(`${n}: falta el nombre`);
    if (!String(p.brand ?? '').trim()) throw new Error(`${p.name}: falta la marca`);
    const price = Number(p.price);
    if (!Number.isFinite(price) || price < 0) throw new Error(`${p.name}: el precio no es válido`);
    const images = (p.images ?? []).filter((s) => typeof s === 'string' && s.startsWith('/img/'));
    const out = {
      id: p.id,
      brand: String(p.brand).trim(),
      name: String(p.name).trim(),
      ...(p.btu ? { btu: Math.round(Number(p.btu)) } : {}),
      inverter: !!p.inverter,
      wifi: !!p.wifi,
      price: Math.round(price),
      withInstall: !!p.withInstall,
      summary: String(p.summary ?? '').trim(),
      ...(String(p.includes ?? '').trim() ? { includes: String(p.includes).trim() } : {}),
      images,
      category: p.category === 'accesorio' ? 'accesorio' : 'equipo',
      visible: p.visible !== false,
    };
    return out;
  });
}

// Borra fotos subidas que ya no usa ningún equipo
async function cleanUploads(list) {
  if (!existsSync(UPLOADS)) return;
  const used = new Set(list.flatMap((p) => p.images));
  for (const f of await fs.readdir(UPLOADS)) {
    if (!used.has(`/img/equipos/${f}`)) await fs.rm(path.join(UPLOADS, f), { force: true });
  }
}

async function pendingChanges() {
  const r = await run(GIT, ['status', '--porcelain', '--', 'src/data/products.json', 'public/img']);
  return r.code === 0 ? r.out.split('\n').filter(Boolean).length : 0;
}

let publishing = false;

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const p = decodeURIComponent(url.pathname);

    if (req.method === 'GET' && (p === '/' || p === '/index.html')) {
      return send(res, 200, await fs.readFile(ADMIN_HTML), MIME['.html']);
    }

    if (p === '/api/products' && req.method === 'GET') {
      return send(res, 200, await fs.readFile(DATA, 'utf8'));
    }

    if (p === '/api/products' && req.method === 'PUT') {
      const list = validate(JSON.parse(await readBody(req)));
      await fs.writeFile(DATA, JSON.stringify(list, null, 2) + '\n', 'utf8');
      await cleanUploads(list);
      return send(res, 200, { ok: true, pending: await pendingChanges() });
    }

    if (p === '/api/upload' && req.method === 'POST') {
      const { name = 'foto', data } = JSON.parse(await readBody(req));
      const m = /^data:image\/(jpeg|png|webp);base64,(.+)$/.exec(data ?? '');
      if (!m) throw new Error('Formato de imagen no soportado');
      const ext = m[1] === 'jpeg' ? 'jpg' : m[1];
      const slug = String(name).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'foto';
      const file = `${slug}-${crypto.randomBytes(3).toString('hex')}.${ext}`;
      await fs.mkdir(UPLOADS, { recursive: true });
      await fs.writeFile(path.join(UPLOADS, file), Buffer.from(m[2], 'base64'));
      return send(res, 200, { path: `/img/equipos/${file}` });
    }

    if (p === '/api/status' && req.method === 'GET') {
      return send(res, 200, { pending: await pendingChanges(), publishing });
    }

    if (p === '/api/publish' && req.method === 'POST') {
      if (publishing) throw new Error('Ya se está publicando, espera un momento');
      publishing = true;
      try {
        const build = await run(NODE, [ASTRO, 'build']);
        if (build.code !== 0) throw new Error('La revisión de la web falló, no se publicó nada.\n\n' + build.out.slice(-1500));
        await run(GIT, ['add', '--', 'src/data/products.json', 'public/img']);
        const fecha = new Date().toLocaleString('es-CL');
        const commit = await run(GIT, ['commit', '-m', `Catálogo actualizado desde el administrador (${fecha})`]);
        if (commit.code !== 0 && !/nothing to commit|nada para hacer commit/i.test(commit.out)) throw new Error(commit.out);
        let push = await run(GIT, ['push', 'origin', 'main']);
        if (push.code !== 0) {
          await run(GIT, ['pull', '--rebase', '--autostash', 'origin', 'main']);
          push = await run(GIT, ['push', 'origin', 'main']);
        }
        if (push.code !== 0) throw new Error('No se pudo subir a GitHub. Revisa la conexión a internet.\n\n' + push.out);
        return send(res, 200, { ok: true });
      } finally {
        publishing = false;
      }
    }

    // Imágenes para la vista previa
    if (req.method === 'GET' && (p.startsWith('/img/') || p === '/favicon.svg')) {
      const file = path.normalize(path.join(PUBLIC, p));
      if (!file.startsWith(PUBLIC + path.sep) || !existsSync(file)) return send(res, 404, 'No encontrado', 'text/plain');
      return send(res, 200, await fs.readFile(file), MIME[path.extname(file).toLowerCase()] ?? 'application/octet-stream');
    }

    send(res, 404, { error: 'No encontrado' });
  } catch (e) {
    send(res, 400, { error: e instanceof Error ? e.message : String(e) });
  }
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log('El administrador ya estaba abierto. Abriendo el navegador...');
    openBrowser();
    setTimeout(() => process.exit(0), 1500);
  } else throw e;
});

function openBrowser() {
  spawn('cmd', ['/c', 'start', '', `http://localhost:${PORT}`], { detached: true, stdio: 'ignore', windowsHide: true }).unref();
}

server.listen(PORT, '127.0.0.1', async () => {
  console.log('');
  console.log('  ===============================================');
  console.log('     ADMINISTRADOR OLIVAR CLIMA - abierto');
  console.log(`     http://localhost:${PORT}`);
  console.log('');
  console.log('     Deja esta ventana abierta mientras trabajas.');
  console.log('     Para salir, simplemente cierrala.');
  console.log('  ===============================================');
  // Trae la última versión antes de empezar (por si se editó desde otro lado)
  await run(GIT, ['pull', '--rebase', '--autostash', 'origin', 'main']);
  openBrowser();
});
