const http = require('http');
const fs = require('fs');
const path = require('path');
const port = process.argv[2] || 3001;
const dir = process.argv[3] || __dirname;

const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };

function tryPaths(candidates, res) {
  const candidate = candidates.shift();
  if (!candidate) { res.writeHead(404); res.end('Not found'); return; }
  fs.readFile(candidate, (err, data) => {
    if (err) { tryPaths(candidates, res); return; }
    res.writeHead(200, { 'Content-Type': mime[path.extname(candidate)] || 'text/plain' });
    res.end(data);
  });
}

http.createServer((req, res) => {
  const url = req.url.split('?')[0]; // strip query strings
  const base = path.join(dir, url);
  const candidates = [
    base,
    path.join(base, 'index.html'),
    base + '.html',
  ];
  if (url === '/') candidates.unshift(path.join(dir, 'index.html'));
  tryPaths(candidates, res);
}).listen(port, () => console.log(`Server running on port ${port}`));
