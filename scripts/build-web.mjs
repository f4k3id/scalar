// Builds web/Scalar.html: one self-contained file (JS + CSS inlined) that runs from file:// or any web host.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
let html = readFileSync(join(dist, 'index.html'), 'utf8');

html = html.replace(/<link rel="stylesheet"[^>]*href="\.\/([^"]+)"[^>]*>/g, (_, href) =>
  `<style>${readFileSync(join(dist, href), 'utf8')}</style>`);

const scripts = [];
html = html.replace(/<script type="module"[^>]*src="\.\/([^"]+)"[^>]*><\/script>/g, (_, src) => {
  scripts.push(readFileSync(join(dist, src), 'utf8').replace(/<\/script/gi, '<\\/script'));
  return '';
});
// Run the app after #root exists.
// Function replacer so `$&`-style sequences inside the bundle are not treated as patterns.
html = html.replace('</body>', () => scripts.map((js) => `<script type="module">${js}</script>`).join('') + '</body>');

if (/(src|href)="\.\/assets\//.test(html)) throw new Error('Unresolved asset reference left in HTML');
mkdirSync('web', { recursive: true });
writeFileSync('web/Scalar.html', html);
console.log(`web/Scalar.html ${(html.length / 1024).toFixed(0)} KB`);
