const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { buildPublic, cardsSource } = require('./scripts/build-public.cjs');
const core = require('./admin/core.js');
const root = __dirname;
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.md': 'text/plain', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const host = String(req.headers.host || '');
  const localHosts = new Set([`127.0.0.1:${port}`, `localhost:${port}`, `[::1]:${port}`]);
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400); return res.end('Bad request'); }
  if (pathname === '/api/publish') {
    if (req.method !== 'POST') { res.writeHead(405, { Allow: 'POST' }); return res.end('Method not allowed'); }
    const origin = String(req.headers.origin || '');
    const contentType = String(req.headers['content-type'] || '').toLowerCase();
    if (!localHosts.has(host) || !origin || !localHosts.has(origin.replace(/^https?:\/\//, '')) || !contentType.startsWith('application/json')) {
      res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ ok: false, message: '仅允许本机管理版发布。' }));
    }
    let body = '', tooLarge = false;
    req.setEncoding('utf8');
    req.on('data', chunk => {
      if (tooLarge) return;
      body += chunk;
      if (body.length > 10 * 1024 * 1024) {
        tooLarge = true;
        body = '';
        res.writeHead(413, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, message: '题库数据超过 10 MB。' }));
      }
    });
    req.on('end', () => {
      if (tooLarge) return;
      try {
        const cards = core.validateCards(JSON.parse(body).cards);
        if (!cards.length) throw new Error('题库不能为空。');
        fs.writeFileSync(path.join(root, 'admin', 'data', 'cards.js'), cardsSource(cards, 'QV admin publish'));
        const result = buildPublic(cards, { source: 'QV admin publish' });
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
        res.end(JSON.stringify({ ok: true, ...result }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, message: error.message }));
      }
    });
    req.on('error', () => { if (!res.writableEnded) { res.writeHead(400); res.end(); } });
    return;
  }
  if (pathname === '/') { res.writeHead(302, { Location: '/admin/' }); return res.end(); }
  if (pathname === '/admin') { res.writeHead(302, { Location: '/admin/' }); return res.end(); }
  if (pathname === '/public') { res.writeHead(302, { Location: '/public/' }); return res.end(); }
  const file = path.resolve(root, '.' + pathname + (pathname.endsWith('/') ? 'index.html' : ''));
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); return res.end('Forbidden'); }
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); return res.end('Method not allowed'); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': (types[path.extname(file)] || 'application/octet-stream') + '; charset=utf-8', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : data);
  });
});
server.on('error', err => { console.error(err.code === 'EADDRINUSE' ? `端口 ${port} 已占用，请设置 PORT 后重试。` : err.message); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => {
  console.log(`QV 管理版：http://127.0.0.1:${port}/admin/`);
  console.log(`QV 只读预览：http://127.0.0.1:${port}/public/  （Ctrl+C 停止）`);
});
