import { cp, mkdir, copyFile, writeFile } from 'node:fs/promises';
await mkdir('dist/assets', { recursive: true });
await writeFile('dist/index.html', '<!doctype html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>Workshop Wonder</title><link rel="stylesheet" href="/assets/styles.css"/></head><body><div id="root"></div><script type="module" src="/assets/main.js"></script></body></html>');
await copyFile('src/styles.css', 'dist/assets/styles.css');
await cp('src/assets', 'dist/assets/assets', { recursive: true });
