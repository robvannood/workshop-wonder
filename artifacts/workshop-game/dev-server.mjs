import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
const root = join(process.cwd(), 'dist');
const types = new Map([['.html','text/html'],['.js','text/javascript'],['.css','text/css'],['.svg','image/svg+xml']]);
createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname)).replace(/^\/+/, '') || 'index.html';
  const file = join(root, path);
  try { const data = await readFile(file); res.writeHead(200, {'content-type': types.get(extname(file)) ?? 'application/octet-stream'}); res.end(data); }
  catch { res.writeHead(404); res.end('Not found'); }
}).listen(5173, '0.0.0.0', () => console.log('Workshop Wonder preview listening on http://localhost:5173'));
