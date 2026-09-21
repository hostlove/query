const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const core = require('../admin/core.js');

const root = path.resolve(__dirname, '..');
const admin = path.join(root, 'admin');
const publicDir = path.join(root, 'public');

function readSeed() {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(admin, 'data', 'cards.js'), 'utf8'), context);
  return core.validateCards(JSON.parse(JSON.stringify(context.window.QV_SEED?.cards || [])));
}

function cardsSource(cards, source = 'QV admin') {
  const payload = {
    version: 1,
    source,
    generatedAt: new Date().toISOString(),
    cards: core.validateCards(cards)
  };
  return '/* Generated read-only library. Do not edit by hand. */\nwindow.QV_SEED = ' +
    JSON.stringify(payload, null, 2).replace(/</g, '\\u003c') + ';\n';
}

function buildPublic(cards = readSeed(), options = {}) {
  if (!fs.existsSync(path.join(publicDir, 'index.html')) || !fs.existsSync(path.join(publicDir, 'app.js'))) {
    throw new Error('public/index.html 或 public/app.js 不存在，无法生成发布目录。');
  }
  fs.mkdirSync(path.join(publicDir, 'assets'), { recursive: true });
  fs.mkdirSync(path.join(publicDir, 'data'), { recursive: true });
  fs.copyFileSync(path.join(admin, 'core.js'), path.join(publicDir, 'core.js'));
  fs.copyFileSync(path.join(admin, 'styles.css'), path.join(publicDir, 'styles.css'));
  fs.copyFileSync(path.join(admin, 'assets', 'favicon.svg'), path.join(publicDir, 'assets', 'favicon.svg'));
  fs.writeFileSync(path.join(publicDir, 'data', 'cards.js'), cardsSource(cards, options.source || 'QV admin'));
  fs.writeFileSync(path.join(publicDir, '.nojekyll'), '');
  return { count: cards.length, generatedAt: new Date().toISOString() };
}

if (require.main === module) {
  const result = buildPublic();
  console.log(`只读版已生成：${result.count} 道题 -> ${publicDir}`);
}

module.exports = { buildPublic, cardsSource, readSeed };
