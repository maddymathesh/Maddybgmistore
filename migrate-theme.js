const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'apps/admin/app/transactions/components');

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
    .replace(/var\(--text\)/g, '#eaeaea');
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const newContent = replaceVariables(content);
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Updated: ${file}`);
      }
    }
  }
}

processDirectory(componentsDir);
console.log('Migration complete.');
