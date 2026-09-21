const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const C = require('../admin/core.js');
const source = fs.readFileSync(path.join(__dirname, '../admin/data/query.md'), 'utf8');
const seedContext = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../admin/data/cards.js'), 'utf8'), seedContext);
const seed = JSON.parse(JSON.stringify(seedContext.window.QV_SEED.cards));

test('源 Markdown 的每道题都保留原答案与备注，初始数据一致', () => {
  const parsed = C.parseMarkdown(source);
  assert.equal(parsed.cards.length, (source.match(/^### /gm) || []).length);
  assert.ok(parsed.cards.length > 60);
  assert.deepEqual(C.validateCards(parsed.cards), seed);
  assert.ok(seed.some(c => /https:\/\//.test(c.notes)));
  assert.ok(seed.every(c => c.answer && !c.answer.includes('备考备注（不口述）')));
});
test('Markdown 换行、未编号标题、多行答案、引用备注与不完整题', () => {
  const { cards, warnings } = C.parseMarkdown('## RAG 与检索\r\n### 1. 第一题\r\n**回答：**第一段\r\n\r\n第二段\r\n> 备考备注（不口述）：链接\r\n> 更多\r\n### 空答案\r\n### 无编号题\r\n答案：内容');
  assert.equal(cards.length, 2); assert.equal(warnings.length, 1);
  assert.equal(cards[0].answer, '第一段\n\n第二段'); assert.equal(cards[0].notes, '链接\n更多');
  assert.equal(cards[0].category, 'RAG 与检索'); assert.equal(cards[1].question, '无编号题');
});
test('分类与稳定 ID 不受题目编号或章节变化影响', () => {
  const a = C.parseMarkdown('## 第一部分 A\n### 1. Memory 是什么？\n**回答：**测试').cards[0];
  const b = C.parseMarkdown('## 第二部分 B\n### 99. Memory 是什么？\n**回答：**测试').cards[0];
  assert.equal(a.id, b.id); assert.equal(a.category, '记忆与上下文');
});
test('自定义主题在 Markdown 导出与重新导入时保留', () => {
  const card = { ...seed[0], category: '我的自定义主题' };
  assert.equal(C.parseMarkdown(C.exportMarkdown([card])).cards[0].category, '我的自定义主题');
});
test('导出 Markdown 再导入，问题、答案、备注与主题均不丢失', () => {
  const parsed = C.parseMarkdown(C.exportMarkdown(seed)).cards;
  assert.equal(parsed.length, seed.length);
  for (const card of seed) {
    const actual = parsed.find(c => c.question === card.question);
    assert.equal(actual.answer, card.answer); assert.equal(actual.notes, card.notes); assert.equal(actual.category, card.category);
  }
});
test('合并默认跳过重复，显式更新保留旧 ID，输入不变', () => {
  const a = [{ ...seed[0], id: 'original' }], incoming = [{ ...seed[0], id: 'imported', answer: '更新答案' }];
  assert.equal(C.mergeCards(a, incoming).skipped, 1);
  const result = C.mergeCards(a, incoming, true);
  assert.equal(result.updated, 1); assert.equal(result.cards[0].id, 'original'); assert.equal(result.cards[0].answer, '更新答案');
  assert.notEqual(a[0].answer, '更新答案');
});
test('同一导入文件内重复问答也去重', () => {
  const result = C.mergeCards([], [seed[0], { ...seed[0], id: 'other' }]);
  assert.equal(result.added, 1); assert.equal(result.skipped, 1);
});
test('JSON 导入拒绝破损结构、空回答和未知版本', () => {
  assert.throws(() => C.parseImport('{oops', 'a.json'));
  assert.throws(() => C.parseImport('{"cards":[{"question":"x","answer":""}]}', 'a.json'));
  assert.throws(() => C.parseImport('{"version":2,"cards":[]}', 'a.json'));
  assert.throws(() => C.parseImport('# 只有标题', 'a.md'));
});
test('导入保留学习记录且清理无效状态、ID 和未知字段', () => {
  const malicious = JSON.parse('{"id":"__proto__","question":"安全测试","answer":"<script>alert(1)</script>"}');
  const cards = C.validateCards([malicious]);
  assert.notEqual(cards[0].id, '__proto__');
  const p = C.cleanProgress(cards, { [cards[0].id]: { status: 'broken', starred: 'yes', reviews: -1, note: '我的笔记' } });
  assert.equal(p[cards[0].id].status, 'new'); assert.equal(p[cards[0].id].starred, false); assert.equal(p[cards[0].id].reviews, 0);
  const restored = C.parseImport(JSON.stringify({ version: 1, cards, progress: p }), 'backup.json');
  assert.equal(restored.progress[cards[0].id].note, '我的笔记');
});
test('搜索覆盖答案、备注与标签，并组合主题、收藏和状态条件', () => {
  const cards = C.validateCards([{ question: '测试问题', answer: '这里有 LangGraph', notes: 'Checkpoint 恢复', category: '工程与性能', tags: ['API'] }]);
  const p = C.cleanProgress(cards); p[cards[0].id].starred = true; p[cards[0].id].status = 'review';
  assert.equal(C.filterCards(cards, p, { search: 'langgraph checkpoint', category: '工程与性能', scope: 'starred', status: 'review' }).length, 1);
  assert.equal(C.filterCards(cards, p, { search: 'API' }).length, 1);
  assert.equal(C.filterCards(cards, p, { status: 'mastered' }).length, 0);
});
test('学习统计按本地日期统计，重练同一道题不重复计数', () => {
  const cards = seed.slice(0, 2), p = C.cleanProgress(cards), now = new Date();
  p[cards[0].id] = { ...p[cards[0].id], status: 'mastered', starred: true, reviews: 7, reviewedAt: now.toISOString() };
  p[cards[1].id].status = 'review';
  assert.deepEqual(C.stats(cards, p, C.localDay(now)), { total: 2, mastered: 1, starred: 1, today: 1, review: 1 });
});
test('随机练习不修改源数组，不丢失或重复题目', () => {
  const before = seed.map(c => c.id), shuffled = C.shuffle(seed, () => .2);
  assert.deepEqual(seed.map(c => c.id), before);
  assert.deepEqual(shuffled.map(c => c.id).sort(), [...before].sort());
  assert.notDeepEqual(shuffled.map(c => c.id), before);
});

test('公开版题库与管理版发布数据一致，且不包含题库管理入口', () => {
  const publicContext = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../public/data/cards.js'), 'utf8'), publicContext);
  assert.deepEqual(JSON.parse(JSON.stringify(publicContext.window.QV_SEED.cards)), seed);

  const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
  const app = fs.readFileSync(path.join(__dirname, '../public/app.js'), 'utf8');
  for (const id of ['add-button', 'edit-question', 'delete-button', 'import-button', 'export-button', 'publish-button']) {
    assert.equal(html.includes(`id="${id}"`), false, `公开版不应包含 ${id}`);
  }
  assert.equal(app.includes('/api/publish'), false);
  assert.equal(app.includes('function editCard'), false);
  assert.match(app, /qv\.public\.practice\.v1/);
});
