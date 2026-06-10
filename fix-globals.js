const fs = require('fs');

function replaceVariables(content) {
  return content
    .replace(/var\(--gold\)/g, 'var(--color-gold)')
    .replace(/var\(--gold-dim\)/g, 'var(--color-gold-dim)')
    .replace(/var\(--red\)/g, 'var(--color-red)')
    .replace(/var\(--orange\)/g, 'var(--color-orange)')
    .replace(/var\(--green\)/g, 'var(--color-green)')
    .replace(/var\(--blue\)/g, 'var(--color-blue)')
    .replace(/var\(--bg\)/g, 'var(--color-bg)')
    .replace(/var\(--bg2\)/g, 'var(--color-bg2)')
    .replace(/var\(--border\)/g, 'var(--color-border)')
    .replace(/var\(--border-gold\)/g, 'var(--color-border-gold)')
    .replace(/var\(--muted\)/g, 'var(--color-muted)')
    .replace(/var\(--text\)/g, 'var(--foreground)');
}

const file = 'apps/admin/app/globals.css';
let content = fs.readFileSync(file, 'utf8');
content = replaceVariables(content);
fs.writeFileSync(file, content);
console.log('Fixed globals.css');
