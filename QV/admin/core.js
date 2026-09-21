(function (root, factory) {
  const core = factory();
  if (typeof module === 'object' && module.exports) module.exports = core;
  else root.QVCore = core;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const CATEGORIES = ['项目与简历', 'Agent 与工具', 'RAG 与检索', '记忆与上下文', '工程与性能', '评测与安全', '模型与 Prompt'];
  const STATUS = { new: '未练习', review: '待复习', learning: '有些印象', mastered: '已掌握' };
  const normalize = s => String(s || '').normalize('NFKC').toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, '');
  function hash(s) { let h = 2166136261; for (const c of s) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); }
  function categoryFor(question) {
    if (/memory|记忆|上下文|checkpoint|压缩|摘要/i.test(question)) return CATEGORIES[3];
    if (/评测|评估|验证.*结论|幻觉|敏感|隔离|引用|安全/i.test(question)) return CATEGORIES[5];
    if (/rag|检索|召回|bm25|向量|rrf|chunk|表格|语料|切分|实体.*时间/i.test(question)) return CATEGORIES[2];
    if (/trace|hook|sse|websocket|流式|超时|并发|性能|redis|rpc|http|卡死|日志|bug|重试/i.test(question)) return CATEGORIES[4];
    if (/7b|32b|模型路由|微调|prompt.*区别|vllm|温度/i.test(question)) return CATEGORIES[6];
    if (/自我介绍|先说一下|项目.*做什么/i.test(question)) return CATEGORIES[0];
    return CATEGORIES[1];
  }
  function tagsFor(question) {
    const words = ['Agent', 'LangGraph', 'LangChain', 'RAG', 'GraphRAG', 'Prompt', 'Harness', 'MCP', 'ReAct', 'Trace', 'Memory', 'Checkpoint', 'SSE', 'WebSocket', 'BM25', 'RRF', 'Redis', 'vLLM', 'Function Call'];
    return words.filter(w => question.toLowerCase().includes(w.toLowerCase())).slice(0, 4);
  }
  function parseMarkdown(markdown) {
    let section = '自定义题库', current = null; const cards = [], warnings = [];
    const finish = () => {
      if (!current) return;
      const body = current.lines.join('\n').trim();
      const noteLines = [], answerLines = []; let foundAnswer = false;
      for (const line of body.split('\n')) {
        if (/^\s*>/.test(line)) { noteLines.push(line.replace(/^\s*>\s?/, '').replace(/^备考备注[（(]不口述[）)][:：]\s*/, '')); continue; }
        if (/^\s*(?:\*\*)?(?:回答|答案|答)[:：](?:\*\*)?/.test(line)) {
          foundAnswer = true;
          answerLines.push(line.replace(/^\s*(?:\*\*)?(?:回答|答案|答)[:：](?:\*\*)?\s*/, ''));
        } else if (foundAnswer || line.trim()) { answerLines.push(line); }
      }
      const answer = answerLines.join('\n').trim();
      if (!answer) { warnings.push(`“${current.question}”缺少回答，已跳过。`); return; }
      cards.push({ id: 'q-' + hash(normalize(current.question)), question: current.question, answer,
        notes: noteLines.join('\n').trim(), category: /^第[一二三四五六七八九十\d]+部分/.test(section) || section === '自定义题库' ? categoryFor(current.question) : section,
        section, sourceNumber: current.sourceNumber, tags: tagsFor(current.question), origin: 'markdown' });
    };
    for (const line of String(markdown).replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').split('\n')) {
      const sec = line.match(/^##\s+(.+)$/);
      const q = line.match(/^###\s+(?:(\d+)[.、．]\s*)?(.+)$/);
      if (sec) { finish(); current = null; section = sec[1].trim(); }
      else if (q) { finish(); current = { question: q[2].trim(), sourceNumber: q[1] || '', lines: [] }; }
      else if (current) current.lines.push(line);
    }
    finish();
    return { cards, warnings };
  }
  function validateCards(input) {
    if (!Array.isArray(input) || input.length > 10000) throw new Error('题库须为不超过 10,000 条的数组。');
    const ids = new Set();
    return input.map((c, i) => {
      if (!c || typeof c !== 'object' || typeof c.question !== 'string' || typeof c.answer !== 'string' || !c.question.trim() || !c.answer.trim()) throw new Error(`第 ${i + 1} 条需要非空的 question 和 answer。`);
      if (c.question.length > 1000 || c.answer.length > 50000 || String(c.notes || '').length > 50000) throw new Error(`第 ${i + 1} 条内容过长。`);
      let id = typeof c.id === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(c.id) && !['__proto__', 'constructor', 'prototype'].includes(c.id) ? c.id : 'q-' + hash(normalize(c.question));
      if (ids.has(id)) id += '-' + i;
      ids.add(id);
      return { id, question: c.question.trim(), answer: c.answer.trim(), notes: String(c.notes || '').trim(),
        category: String(c.category || categoryFor(c.question)).trim().slice(0, 40) || '自定义题库',
        section: String(c.section || '自定义题库').slice(0, 100), sourceNumber: String(c.sourceNumber || '').slice(0, 20),
        tags: Array.isArray(c.tags) ? c.tags.filter(t => typeof t === 'string').map(t => t.trim().slice(0, 30)).filter(Boolean).slice(0, 10) : tagsFor(c.question),
        origin: String(c.origin || 'import').slice(0, 30) };
    });
  }
  function cleanProgress(cards, input = {}) {
    const progress = {};
    for (const c of cards) {
      const p = input && typeof input[c.id] === 'object' && input[c.id] || {};
      progress[c.id] = { status: Object.hasOwn(STATUS, p.status) ? p.status : 'new', starred: p.starred === true,
        note: typeof p.note === 'string' ? p.note.slice(0, 50000) : '',
        reviews: Number.isSafeInteger(p.reviews) && p.reviews >= 0 ? p.reviews : 0,
        reviewedAt: typeof p.reviewedAt === 'string' && !Number.isNaN(Date.parse(p.reviewedAt)) ? p.reviewedAt : null };
    }
    return progress;
  }
  function parseImport(text, filename = '') {
    if (text.length > 10 * 1024 * 1024) throw new Error('文件超过 10 MB，请拆分后导入。');
    if (/\.json$/i.test(filename) || /^[\s\uFEFF]*[\[{]/.test(text)) {
      let raw; try { raw = JSON.parse(text.replace(/^\uFEFF/, '')); } catch { throw new Error('JSON 格式不正确，请检查文件。'); }
      if (!Array.isArray(raw) && raw.version && raw.version !== 1) throw new Error('备份版本不兼容，请使用版本 1 的备份。');
      const cards = validateCards(Array.isArray(raw) ? raw : raw.cards);
      if (!cards.length) throw new Error('文件中没有题目。');
      return { cards, progress: !Array.isArray(raw) && raw.progress ? cleanProgress(cards, raw.progress) : null, warnings: [], type: 'json' };
    }
    const result = parseMarkdown(text);
    if (!result.cards.length) throw new Error('没有找到完整问答。请用“### 问题”和“**回答：**内容”组织 Markdown。');
    return { ...result, cards: validateCards(result.cards), progress: null, type: 'markdown' };
  }
  function mergeCards(existing, incoming, update = false) {
    const cards = existing.map(c => ({ ...c })); let added = 0, updated = 0, skipped = 0;
    for (const c of incoming) {
      const index = cards.findIndex(old => old.id === c.id || normalize(old.question) === normalize(c.question));
      if (index >= 0) { if (update) { cards[index] = { ...c, id: cards[index].id }; updated++; } else skipped++; }
      else { cards.push({ ...c }); added++; }
    }
    return { cards, added, updated, skipped };
  }
  function filterCards(cards, progress, filters = {}) {
    const terms = String(filters.search || '').toLowerCase().trim().split(/\s+/).filter(Boolean);
    return cards.filter(c => {
      const p = progress[c.id] || {};
      if (filters.category && filters.category !== 'all' && c.category !== filters.category) return false;
      if (filters.scope === 'starred' && !p.starred) return false;
      if (filters.scope === 'review' && p.status !== 'review') return false;
      if (filters.status && filters.status !== 'all' && (p.status || 'new') !== filters.status) return false;
      const haystack = [c.question, c.answer, c.notes, c.category, ...(c.tags || [])].join(' ').toLowerCase();
      return terms.every(t => haystack.includes(t));
    });
  }
  function shuffle(cards, random = Math.random) {
    const copy = [...cards];
    for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
    return copy;
  }
  function localDay(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
  function stats(cards, progress, today = localDay()) {
    return cards.reduce((s, c) => { const p = progress[c.id] || {}; s.total++; if (p.starred) s.starred++; if (p.status === 'mastered') s.mastered++; if (p.status === 'review') s.review++; if (p.reviewedAt && localDay(new Date(p.reviewedAt)) === today) s.today++; return s; }, { total: 0, mastered: 0, review: 0, starred: 0, today: 0 });
  }
  function exportMarkdown(cards) {
    const groups = new Map(); for (const c of cards) { if (!groups.has(c.category)) groups.set(c.category, []); groups.get(c.category).push(c); }
    return '# QV 面试题库\n\n' + [...groups].map(([cat, list]) => `## ${cat}\n\n` + list.map((c, i) => `### ${i + 1}. ${c.question}\n\n**回答：**${c.answer}\n` + (c.notes ? `\n${c.notes.split('\n').map((l, j) => '> ' + (j === 0 ? '备考备注（不口述）：' : '') + l).join('\n')}\n` : '')).join('\n')).join('\n');
  }
  return { CATEGORIES, STATUS, normalize, hash, categoryFor, tagsFor, parseMarkdown, validateCards, cleanProgress, parseImport, mergeCards, filterCards, shuffle, localDay, stats, exportMarkdown };
});
