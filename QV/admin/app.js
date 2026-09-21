(function () {
  'use strict';
  const C = window.QVCore, $ = id => document.getElementById(id);
  const KEY = 'qv.workspace.v1';
  const paths = {
    publish: '<path d="M12 16V3m-4 4 4-4 4 4M5 12H3v9h18v-9h-2"/><path d="M8 21v-4h8v4"/>',
    focus: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/><circle cx="12" cy="12" r="3"/>',
    cards: '<rect x="6" y="5" width="14" height="16" rx="2"/><path d="M3 16V4a2 2 0 0 1 2-2h11M10 10h6M10 14h4"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.1M3 12h.1M3 18h.1"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/>',
    repeat: '<path d="m17 2 4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4m14-1v2a3 3 0 0 1-3 3H3"/>',
    spark: '<path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4Z"/>',
    keyboard: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h.1M10 9h.1M14 9h.1M18 9h.1M6 12h.1M10 12h.1M14 12h.1M18 12h.1M7 15h10"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    moon: '<path d="M20.5 13.7A9 9 0 0 1 10.3 3.5a9 9 0 1 0 10.2 10.2Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
    upload: '<path d="M12 16V3m-4 4 4-4 4 4M4 15v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5"/>',
    download: '<path d="M12 3v13m-4-4 4 4 4-4M4 15v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    search: '<circle cx="10.8" cy="10.8" r="7"/><path d="m16 16 5 5"/>',
    shuffle: '<path d="m18 3 3 3-3 3m0 6 3 3-3 3M3 6h3c4 0 8 12 12 12h3M3 18h3c2 0 4-3 6-6s4-6 6-6h3"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    circle: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l2 2"/>',
    trash: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
    edit: '<path d="m15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-4-4L5 15Z"/>',
    'arrow-right': '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    'arrow-left': '<path d="M20 12H4m6-6-6 6 6 6"/>',
    file: '<path d="M14 2H5a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V8Zm0 0v6h6M8 13h8m-8 4h6"/>',
    archive: '<rect x="3" y="3" width="18" height="4" rx="1"/><path d="M5 7v14h14V7M9 11h6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
    play: '<path d="m8 4 12 8-12 8Z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    reset: '<path d="M3 10a9 9 0 1 1 1 7M3 4v6h6"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    book: '<path d="M12 5c-3-2-7-2-10-1v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1Zm0 0v15"/>',
    copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>'
  };
  const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.cards}</svg>`;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  function inline(text) {
    const tokens = [];
    // Parse a small, safe Markdown subset. Raw HTML is always text.
    let safe = esc(text).replace(/`([^`]+)`/g, (_, code) => { tokens.push(`<code>${code}</code>`); return `\u0000${tokens.length - 1}\u0000`; });
    safe = safe.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, label, url) => { tokens.push(`<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`); return `\u0000${tokens.length - 1}\u0000`; });
    return safe.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\u0000(\d+)\u0000/g, (_, i) => tokens[Number(i)] || '');
  }
  function markdown(text) {
    return String(text).split(/\n\s*\n/).map(block => {
      if (/^```/.test(block.trim())) return `<pre><code>${esc(block.trim().replace(/^```[^\n]*\n?/, '').replace(/\n?```$/, ''))}</code></pre>`;
      if (block.split('\n').every(l => /^\s*[-*] /.test(l))) return '<ul>' + block.split('\n').map(l => `<li>${inline(l.replace(/^\s*[-*] /, ''))}</li>`).join('') + '</ul>';
      return `<p>${block.split('\n').map(inline).join('<br>')}</p>`;
    }).join('');
  }
  let storageFailed = false, storageConflict = false, loadError = '';
  const seed = C.validateCards(window.QV_SEED?.cards || []);
  let db = { version: 1, cards: seed, progress: C.cleanProgress(seed), theme: 'light', lastId: seed[0]?.id || null };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.version !== 1) throw new Error('题库版本不兼容');
      const cards = C.validateCards(parsed.cards);
      db = { version: 1, cards, progress: C.cleanProgress(cards, parsed.progress), theme: parsed.theme === 'dark' ? 'dark' : 'light', lastId: parsed.lastId, focus: parsed.focus === true };
    }
  } catch { storageFailed = true; loadError = '本地记录暂时无法读取，正在显示初始题库。请先检查浏览器存储或导入备份。'; }
  const ui = { view: 'study', scope: 'all', category: 'all', status: 'all', search: '', id: db.lastId,
    revealed: false, shuffled: false, order: [], editorId: null, editorSnapshot: '', importData: null,
    importName: '', timerRemaining: 60, timerEnd: null, timerInterval: null, toastTimer: null, noteTimer: null };
  function progress(id) { return db.progress[id] || (db.progress[id] = C.cleanProgress([{ id }])[id]); }
  function save() {
    if (storageConflict) { storageFailed = true; renderSaveStatus(); toast('另一标签页已有更新，已暂停覆盖保存。请备份当前内容后刷新同步。', 7000); return; }
    try { localStorage.setItem(KEY, JSON.stringify(db)); storageFailed = false; }
    catch { storageFailed = true; toast('浏览器无法保存记录，请立即下载完整备份；当前更改仍保留在此页面。', 7000); }
    renderSaveStatus();
  }
  function renderSaveStatus() {
    $('save-status').classList.toggle('error', storageFailed);
    $('save-status').innerHTML = storageFailed ? '未保存 · 请备份' : '<span class="online-dot"></span>已保存到本地';
    $('save-status').title = storageFailed ? '浏览器存储不可用，请通过备份按钮下载当前数据。' : '记录保存在当前浏览器，不会自动同步到其他设备。';
  }
  function toast(message, duration = 3000) {
    clearTimeout(ui.toastTimer); $('toast').textContent = message; $('toast').hidden = false;
    ui.toastTimer = setTimeout(() => { $('toast').hidden = true; }, duration);
  }
  function deck() {
    const cards = C.filterCards(db.cards, db.progress, ui);
    if (!ui.shuffled) return cards;
    const positions = new Map(ui.order.map((id, i) => [id, i]));
    return cards.sort((a, b) => (positions.get(a.id) ?? 1e6) - (positions.get(b.id) ?? 1e6));
  }
  function current() { return db.cards.find(c => c.id === ui.id); }
  function categories() { return [...new Set([...C.CATEGORIES.filter(cat => db.cards.some(c => c.category === cat)), ...db.cards.map(c => c.category)])]; }
  function statusBadge(id) { const status = progress(id).status; return `<span class="status-badge ${status}">${C.STATUS[status]}</span>`; }
  function applyTheme() {
    document.documentElement.dataset.theme = db.theme;
    $('theme-button').innerHTML = icon(db.theme === 'dark' ? 'sun' : 'moon');
    $('theme-button').setAttribute('aria-label', db.theme === 'dark' ? '切换浅色模式' : '切换深色模式');
    $('theme-button').title = $('theme-button').getAttribute('aria-label');
    document.body.classList.toggle('focus-mode', db.focus === true);
    $('focus-button').setAttribute('aria-pressed', String(db.focus === true));
    $('focus-button').innerHTML = icon('focus') + `<span>${db.focus ? '退出专注' : '专注模式'}</span>`;
  }
  function renderChrome() {
    const s = C.stats(db.cards, db.progress);
    $('nav-total').textContent = s.total; $('nav-starred').textContent = s.starred; $('nav-review').textContent = s.review;
    const activeNav = ui.scope !== 'all' ? ui.scope : ui.view;
    document.querySelectorAll('[data-nav]').forEach(b => { b.classList.toggle('active', b.dataset.nav === activeNav); b.setAttribute('aria-current', b.dataset.nav === activeNav ? 'page' : 'false'); });
    const titles = { study: '闪卡练习', library: '题库管理', starred: '我的收藏', review: '待复习' };
    $('page-title').textContent = titles[activeNav];
    $('section-title').textContent = ui.view === 'library' ? '你的知识，持续生长' : ui.scope === 'review' ? '把难题，再想一遍' : ui.scope === 'starred' ? '值得多练的好问题' : '专注这一题';
    $('section-subtitle').textContent = ui.view === 'library' ? '整理思路，也积累自己的答案。' : '从熟悉的概念，到自己的理解。';
    const colors = ['#7aa38a', '#8ba0bd', '#b6a48b', '#ac9bb7', '#87b5b5', '#c7a58f', '#a5ac81'];
    const cats = categories(); $('topic-total').textContent = String(cats.length).padStart(2, '0');
    $('category-nav').innerHTML = [{ label: '全部主题', value: 'all', count: db.cards.length }, ...cats.map(c => ({ label: c, value: c, count: db.cards.filter(x => x.category === c).length }))].map((c, i) => `<button class="category-item${ui.category === c.value ? ' active' : ''}" data-category="${esc(c.value)}" aria-pressed="${ui.category === c.value}"><span class="dot" style="--topic-color:${colors[(i + 6) % colors.length]}"></span><span>${esc(c.label)}</span><span>${c.count}</span></button>`).join('');
    $('stats').innerHTML = [ ['题库总量', s.total, '题', 'book'], ['今日已练', s.today, '题', 'spark'], ['已经掌握', s.mastered, '题', 'checkCircle'], ['需要复习', s.review, '题', 'repeat'] ].map(([label, n, unit, symbol]) => `<div class="stat"><div><div class="stat-label">${label}</div><div class="stat-number">${n}<small>${unit}</small></div></div><span class="stat-symbol">${icon(symbol)}</span></div>`).join('');
    $('status-filters').innerHTML = Object.entries({ all: '全部', ...C.STATUS }).map(([status, label]) => `<button class="status-chip${ui.status === status ? ' active' : ''}" data-status="${status}" aria-pressed="${ui.status === status}">${label}</button>`).join('');
    ['study', 'library'].forEach(view => { $(view + '-view').classList.toggle('active', ui.view === view); $(view + '-view').setAttribute('aria-pressed', String(ui.view === view)); });
    $('clear-filters').hidden = ui.category === 'all' && ui.status === 'all' && !ui.search && ui.scope === 'all';
    $('shuffle-button').setAttribute('aria-pressed', String(ui.shuffled));
    $('shuffle-button').innerHTML = icon(ui.shuffled ? 'reset' : 'shuffle') + `<span>${ui.shuffled ? '恢复顺序' : '随机练习'}</span>`;
    $('category-options').innerHTML = [...new Set([...C.CATEGORIES, ...cats])].map(c => `<option value="${esc(c)}"></option>`).join('');
    renderSaveStatus();
  }
  function emptyHTML() {
    const noCards = db.cards.length === 0;
    const heading = noCards ? '从第一个好问题开始' : ui.search ? '没有找到匹配的问题' : ui.scope === 'starred' ? '把重要问题留在这里' : ui.scope === 'review' ? '暂时没有待复习的题目' : '这个筛选下还没有题目';
    const hint = noCards ? '新增一道问题，或导入已有的 Markdown 题库。' : ui.scope === 'starred' && !ui.search ? '点击题目右上角的星标，建立自己的重点清单。' : ui.scope === 'review' && !ui.search ? '练习后标记“待复习”，下次就能集中巩固。' : '试试其他关键词，或清空主题和掌握度筛选。';
    return `<div class="empty-state"><span class="empty-icon">${icon(noCards ? 'plus' : ui.scope === 'starred' ? 'star' : 'search')}</span><h3>${heading}</h3><p>${hint}</p><button class="button primary" data-action="${noCards ? 'add' : 'clear'}">${noCards ? '新增第一个问题' : '查看全部题目'}${icon('arrow-right')}</button></div>`;
  }
  function questionTools(c) { const p = progress(c.id); return `<div class="card-tools"><button class="icon-button${p.starred ? ' starred' : ''}" data-action="star" data-id="${c.id}" aria-label="${p.starred ? '取消收藏' : '收藏问题'}" aria-pressed="${p.starred}" title="${p.starred ? '取消收藏' : '收藏问题'}（S）">${icon('star')}</button><button class="icon-button" data-action="edit" data-id="${c.id}" aria-label="编辑问题" title="编辑问题（E）">${icon('edit')}</button></div>`; }
  function notesHTML(c) { return c.notes ? `<details class="notes-details"><summary>备考备注与参考资料 <span>· 不需要口述</span></summary><div class="markdown">${markdown(c.notes)}</div></details>` : ''; }
  function renderStudy(cards) {
    const index = cards.findIndex(c => c.id === ui.id), c = cards[index], p = progress(c.id);
    const source = c.section ? `${c.section.replace(/^(第一|第二)部分\s*/, '')}${c.sourceNumber ? ' · 原题 ' + c.sourceNumber : ''}` : '我的题库';
    const words = c.answer.replace(/\s/g, '').length, seconds = Math.max(10, Math.round(words / 4));
    return `<div class="study-layout"><div class="study-primary">
      <article class="flashcard" aria-labelledby="current-question">
        <div class="card-top"><div class="card-badges"><span class="category-badge">${esc(c.category)}</span>${statusBadge(c.id)}</div>${questionTools(c)}</div>
        <div class="card-body"><div class="question-kicker">QUESTION ${String(index + 1).padStart(2, '0')}</div><h3 class="card-question" id="current-question">${esc(c.question)}</h3><div class="question-source">${icon('file')}${esc(source)}</div>
        ${ui.revealed ? `<div class="answer-area" id="current-answer"><div class="answer-title"><strong>${icon('book')}参考回答</strong><span>约 ${seconds} 秒口述</span></div><div class="answer-text markdown">${markdown(c.answer)}</div>${notesHTML(c)}<label class="private-note"><span>我的理解与补充<small>自动保存</small></span><textarea id="personal-note" rows="2" maxlength="50000" placeholder="用自己的项目举例，或者记下还没想清楚的地方…">${esc(p.note)}</textarea></label></div>` : '<div class="recall-hint"><p>先试着用自己的话回答。</p><p>说清楚「是什么」，再补充「为什么」和「怎么做」。</p></div>'}
        <div class="reveal-row"><button id="reveal-button" class="button reveal-button" data-action="reveal" aria-expanded="${ui.revealed}">${icon(ui.revealed ? 'reset' : 'eye')}${ui.revealed ? '收起答案，再想一遍' : '查看参考回答'}<kbd>Space</kbd></button></div></div>
        <div class="card-bottom"><div class="timer"><span class="timer-label">${icon('clock')} 口述计时</span><span class="timer-time" id="timer-display">01:00</span><button class="icon-button" id="timer-toggle" data-action="timer" aria-label="开始计时" title="开始 / 暂停（T）">${icon('play')}</button><button class="icon-button" data-action="timer-reset" aria-label="重置计时" title="重置计时">${icon('reset')}</button></div><span>先独立回答，再对照参考</span></div>
      </article>
      <div class="rating-header"><span>这道题，你掌握得怎么样？</span><small>${ui.revealed ? '标记后自动进入下一题' : '展开答案后即可标记'}</small></div>
      <div class="rating-buttons">${[['review', 'repeat', '待复习', '1'], ['learning', 'circle', '有些印象', '2'], ['mastered', 'checkCircle', '已掌握', '3']].map(([status, symbol, label, key]) => `<button class="rating-button ${status}" data-action="rate" data-value="${status}" ${ui.revealed ? '' : 'disabled'}>${icon(symbol)}${label}<kbd>${key}</kbd></button>`).join('')}</div>
      <div class="deck-navigation"><button id="prev-button" class="button secondary" data-action="prev" ${index === 0 ? 'disabled' : ''}>${icon('arrow-left')}上一题</button><span class="deck-counter"><strong>${String(index + 1).padStart(2, '0')}</strong> / ${cards.length}<br><small>${ui.shuffled ? '随机顺序' : '顺序练习'}</small></span><button id="next-button" class="button secondary" data-action="next" ${index === cards.length - 1 ? 'disabled' : ''}>下一题${icon('arrow-right')}</button></div><div class="deck-progress"><span style="width:${(index + 1) / cards.length * 100}%"></span></div><div class="keyboard-hint"><span><kbd>Space</kbd> 展开答案</span><span><kbd>←</kbd> <kbd>→</kbd> 切换问题</span><span><kbd>S</kbd> 收藏</span><span><kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> 标记</span></div>
      </div><aside class="study-aside" aria-label="当前题组"><div class="queue-panel"><div class="queue-heading"><h3>当前题组</h3><span>${cards.length} QUESTIONS</span></div><div class="queue-list">${cards.map((item, i) => `<button class="queue-item${item.id === c.id ? ' active' : ''}" data-action="jump" data-id="${item.id}" ${item.id === c.id ? 'aria-current="true"' : ''}><span>${String(i + 1).padStart(2, '0')}</span><span>${esc(item.question)}</span><i class="queue-state ${progress(item.id).status}"></i></button>`).join('')}</div><div class="queue-footer">${icon('checkCircle')}本组已掌握 ${cards.filter(item => progress(item.id).status === 'mastered').length} / ${cards.length}</div></div><div class="practice-tip"><strong>${icon('spark')}一点练习建议</strong><p>不必逐字背诵。先给出<em>核心判断</em>，再用<em>实际经历</em>展开。能讲清边界，比堆砌术语更加分。</p></div></aside></div>`;
  }
  function renderLibrary(cards) {
    return `<div class="library-grid">${cards.map(c => `<article class="library-card"><div class="library-top"><span class="category-badge">${esc(c.category)}</span>${questionTools(c)}</div><h3>${esc(c.question)}</h3><p class="library-preview">${esc(c.answer)}</p><details><summary>展开完整回答</summary><div class="answer-text markdown">${markdown(c.answer)}</div>${notesHTML(c)}</details><div class="library-bottom">${statusBadge(c.id)}<div class="library-buttons"><button class="button small subtle" data-action="edit" data-id="${c.id}">${icon('edit')}编辑</button><button class="button small secondary" data-action="practice" data-id="${c.id}">练习${icon('arrow-right')}</button></div></div></article>`).join('')}</div>`;
  }
  function render() {
    const active = document.activeElement?.id;
    const cards = deck();
    if (!cards.some(c => c.id === ui.id)) { ui.id = cards[0]?.id || null; ui.revealed = false; resetTimer(); }
    if (ui.id) db.lastId = ui.id;
    renderChrome(); $('result-count').textContent = `${cards.length} 道问题`;
    $('content').innerHTML = !cards.length ? emptyHTML() : ui.view === 'study' ? renderStudy(cards) : renderLibrary(cards);
    updateTimer();
    if (active && $(active) && !$(active).disabled) $(active).focus({ preventScroll: true });
    const queue = document.querySelector('.queue-list'), selected = document.querySelector('.queue-item.active');
    if (queue && selected) queue.scrollTop = Math.max(0, selected.getBoundingClientRect().top - queue.getBoundingClientRect().top - 100);
  }
  function navigate(id) {
    if (!id) return; flushNote(); resetTimer(); ui.id = id; ui.revealed = false; db.lastId = id; save(); render();
  }
  function step(amount) { const cards = deck(), index = cards.findIndex(c => c.id === ui.id); navigate(cards[index + amount]?.id); }
  function changeFilters(changes) { flushNote(); resetTimer(); Object.assign(ui, changes); ui.revealed = false; render(); closeSidebar(); }
  function clearFilters() { $('search').value = ''; changeFilters({ scope: 'all', category: 'all', status: 'all', search: '' }); }
  function rate(status) {
    if (!ui.revealed || !current()) return;
    const cards = deck(), index = cards.findIndex(c => c.id === ui.id), id = ui.id;
    Object.assign(progress(id), { status, reviews: progress(id).reviews + 1, reviewedAt: new Date().toISOString() });
    const nextId = cards[index + 1]?.id || id;
    navigate(nextId);
    toast(`已标记为「${C.STATUS[status]}」${index === cards.length - 1 ? ' · 已到本组末尾' : ''}`);
  }
  function toggleStar(id) { progress(id).starred = !progress(id).starred; flushNote(); save(); render(); toast(progress(id).starred ? '已加入收藏，重要问题随时回看。' : '已取消收藏'); }
  function flushNote() { if (ui.noteTimer) { clearTimeout(ui.noteTimer); ui.noteTimer = null; save(); } }
  function resetTimer() { clearInterval(ui.timerInterval); ui.timerInterval = null; ui.timerEnd = null; ui.timerRemaining = 60; updateTimer(); }
  function updateTimer() {
    if (ui.timerEnd) ui.timerRemaining = Math.max(0, Math.ceil((ui.timerEnd - Date.now()) / 1000));
    if ($('timer-display')) { $('timer-display').textContent = `${String(Math.floor(ui.timerRemaining / 60)).padStart(2, '0')}:${String(ui.timerRemaining % 60).padStart(2, '0')}`; $('timer-display').classList.toggle('expired', ui.timerRemaining === 0); }
    if ($('timer-toggle')) { $('timer-toggle').innerHTML = icon(ui.timerEnd ? 'pause' : 'play'); $('timer-toggle').setAttribute('aria-label', ui.timerEnd ? '暂停计时' : '开始计时'); }
    if (ui.timerEnd && ui.timerRemaining === 0) { clearInterval(ui.timerInterval); ui.timerInterval = null; ui.timerEnd = null; updateTimer(); toast('一分钟到了。对照参考答案，看看哪些地方还能说得更清楚。', 4500); }
  }
  function toggleTimer() {
    if (!current() || ui.view !== 'study') return;
    if (ui.timerEnd) { updateTimer(); clearInterval(ui.timerInterval); ui.timerInterval = null; ui.timerEnd = null; }
    else { if (ui.timerRemaining === 0) ui.timerRemaining = 60; ui.timerEnd = Date.now() + ui.timerRemaining * 1000; ui.timerInterval = setInterval(updateTimer, 200); }
    updateTimer();
  }
  function editorValues() { return JSON.stringify(['edit-question', 'edit-category', 'edit-tags', 'edit-answer', 'edit-notes'].map(id => $(id).value)); }
  function showDialog(id) { flushNote(); if (ui.timerEnd) toggleTimer(); $(id).showModal(); }
  function ask(title, message, label, action) {
    $('confirm-title').textContent = title; $('confirm-message').textContent = message; $('confirm-action').textContent = label;
    $('confirm-action').onclick = () => { $('confirm-dialog').close(); action(); }; showDialog('confirm-dialog');
  }
  function closeDialog(id) {
    if (id === 'editor-dialog' && editorValues() !== ui.editorSnapshot) { ask('放弃未保存的修改？', '关闭后，本次尚未保存的文字会丢失。', '放弃修改', () => $('editor-dialog').close()); return; }
    $(id).close();
  }
  function editCard(id = null) {
    const c = db.cards.find(c => c.id === id); ui.editorId = c?.id || null;
    $('editor-title').textContent = c ? '把答案打磨得更好' : '新增一个好问题';
    $('edit-question').value = c?.question || ''; $('edit-answer').value = c?.answer || '';
    $('edit-category').value = c?.category || (ui.category !== 'all' ? ui.category : 'Agent 与工具');
    $('edit-tags').value = c?.tags.join(', ') || ''; $('edit-notes').value = c?.notes || '';
    $('delete-button').hidden = !c; $('editor-error').hidden = true;
    ui.editorSnapshot = editorValues(); estimateAnswer(); showDialog('editor-dialog'); $('edit-question').focus();
  }
  function estimateAnswer() { const n = $('edit-answer').value.trim().length; $('answer-estimate').textContent = n ? `${n} 字符 · 约 ${Math.max(1, Math.round(n / 4))} 秒口述 · 建议回答控制在一分钟内` : '建议 120–220 字，支持简单 Markdown。'; }
  function saveEditor(e) {
    e.preventDefault();
    const question = $('edit-question').value.trim(), answer = $('edit-answer').value.trim(), category = $('edit-category').value.trim();
    if (!question || !answer || !category) { $('editor-error').textContent = '问题、主题和回答不能只包含空格。'; $('editor-error').hidden = false; return; }
    if (db.cards.some(c => c.id !== ui.editorId && C.normalize(c.question) === C.normalize(question))) { $('editor-error').textContent = '题库中已有相同问题，请编辑原题，或给新问题增加明确的区别。'; $('editor-error').hidden = false; return; }
    const existing = db.cards.find(c => c.id === ui.editorId);
    const item = { ...existing, id: existing?.id || 'custom-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7), question, answer, category,
      tags: [...new Set($('edit-tags').value.split(/[,，]/).map(t => t.trim()).filter(Boolean))].slice(0, 10), notes: $('edit-notes').value.trim(), section: existing?.section || '我的新增问题', sourceNumber: existing?.sourceNumber || '', origin: existing?.origin || 'custom' };
    if (existing) db.cards[db.cards.indexOf(existing)] = item; else { db.cards.push(item); progress(item.id); }
    ui.id = item.id; ui.revealed = false; db.lastId = item.id; save(); $('editor-dialog').close();
    if (!deck().some(c => c.id === item.id)) { ui.category = 'all'; ui.status = 'all'; ui.scope = 'all'; ui.search = ''; $('search').value = ''; }
    render(); toast(existing ? '修改已保存，答案又清楚了一点。' : '问题已加入题库。');
  }
  function deleteCard() {
    const id = ui.editorId, c = db.cards.find(c => c.id === id); if (!c) return;
    ask('删除这道问题？', '题目、收藏标记和个人笔记将一并删除。建议先导出备份。', '删除问题', () => {
      db.cards = db.cards.filter(item => item.id !== id); delete db.progress[id]; if (ui.id === id) { ui.id = null; resetTimer(); }
      save(); $('editor-dialog').close(); render(); toast('问题已删除');
    });
  }
  function invalidateImport() { ui.importData = null; $('import-preview').hidden = true; $('apply-import').disabled = true; $('import-error').hidden = true; $('restore-option').hidden = true; $('restore-backup').checked = false; }
  function openImport() { $('import-text').value = ''; $('import-file').value = ''; $('update-duplicates').checked = false; ui.importName = ''; invalidateImport(); showDialog('import-dialog'); }
  async function readImportFile(file) {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { invalidateImport(); $('import-error').textContent = '文件超过 10 MB，请拆分后再导入。'; $('import-error').hidden = false; return; }
    try { $('import-text').value = await file.text(); ui.importName = file.name; previewImport(); }
    catch { invalidateImport(); $('import-error').textContent = '无法读取文件，请重新选择。'; $('import-error').hidden = false; }
  }
  function previewImport() {
    try {
      ui.importData = C.parseImport($('import-text').value, ui.importName);
      const result = C.mergeCards(db.cards, ui.importData.cards, $('update-duplicates').checked);
      const restore = $('restore-backup').checked && ui.importData.progress;
      $('import-preview').innerHTML = `<strong>识别到 ${ui.importData.cards.length} 道问题</strong><br>${restore ? '将恢复完整题库及学习记录。' : `新增 ${result.added} 道 · ${$('update-duplicates').checked ? '更新 ' + result.updated : '跳过重复 ' + result.skipped} 道`}<small>${esc(ui.importName || '粘贴内容')}${ui.importData.warnings.length ? ' · ' + ui.importData.warnings.map(esc).join(' ') : ''}</small>`;
      $('import-preview').hidden = false; $('import-error').hidden = true; $('apply-import').disabled = false; $('restore-option').hidden = !ui.importData.progress;
    } catch (err) { invalidateImport(); $('import-error').textContent = err.message; $('import-error').hidden = false; }
  }
  function applyImport() {
    if (!ui.importData) return;
    const doImport = () => {
      const restore = $('restore-backup').checked && ui.importData.progress;
      if (restore) { db.cards = ui.importData.cards; db.progress = C.cleanProgress(db.cards, ui.importData.progress); }
      else { const result = C.mergeCards(db.cards, ui.importData.cards, $('update-duplicates').checked); db.cards = result.cards; db.progress = C.cleanProgress(db.cards, db.progress); }
      ui.shuffled = false; ui.order = []; ui.id = ui.importData.cards[0]?.id || null; db.lastId = ui.id;
      save(); $('import-dialog').close(); clearFilters(); toast(restore ? '备份已恢复，学习记录也一起回来了。' : '导入完成，可以开始练习了。');
    };
    if ($('restore-backup').checked) ask('用备份替换当前题库？', '当前题目、收藏、掌握度和个人笔记都会被此备份替换。未备份的内容无法恢复。', '确认恢复', doImport);
    else doImport();
  }
  function download(content, name, type) {
    const url = URL.createObjectURL(new Blob([content], { type })), link = document.createElement('a');
    link.href = url; link.download = name; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 30000);
  }
  function exportData(type) {
    flushNote(); const stamp = C.localDay();
    if (type === 'json') download(JSON.stringify({ version: 1, app: 'QV', exportedAt: new Date().toISOString(), cards: db.cards, progress: db.progress }, null, 2), `QV-backup-${stamp}.json`, 'application/json;charset=utf-8');
    else download(C.exportMarkdown(db.cards), `QV-questions-${stamp}.md`, 'text/markdown;charset=utf-8');
    toast('已生成下载文件，请妥善保存。'); $('export-dialog').close();
  }
  async function publishPublic() {
    flushNote();
    const button = $('publish-button'), original = button.innerHTML;
    button.disabled = true; button.textContent = '正在发布…';
    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cards: db.cards })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) throw new Error(result.message || '本机发布服务没有响应。');
      toast(`已更新 public 只读版，共 ${result.count} 道题。下一步提交并推送 GitHub。`, 6500);
    } catch (error) {
      toast(location.protocol === 'file:'
        ? '发布需要本机服务：在 QV 目录运行 npm.cmd start，再访问 /admin/。'
        : `发布失败：${error.message}`, 7500);
    } finally {
      button.disabled = false; button.innerHTML = original;
    }
  }
  function closeSidebar() { $('sidebar').classList.remove('open'); $('sidebar-shade').hidden = true; $('menu-button').setAttribute('aria-expanded', 'false'); }

  document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
  document.addEventListener('click', e => {
    const close = e.target.closest('[data-close]'); if (close) { closeDialog(close.dataset.close); return; }
    const nav = e.target.closest('[data-nav]');
    if (nav) { const value = nav.dataset.nav; $('search').value = ''; changeFilters({ view: value === 'library' ? 'library' : 'study', scope: ['starred', 'review'].includes(value) ? value : 'all', category: 'all', status: 'all', search: '' }); return; }
    const cat = e.target.closest('[data-category]'); if (cat) { changeFilters({ category: cat.dataset.category }); return; }
    const status = e.target.closest('[data-status]'); if (status) { changeFilters({ status: status.dataset.status }); return; }
    const action = e.target.closest('[data-action]'); if (!action || action.disabled) return;
    const id = action.dataset.id || ui.id;
    switch (action.dataset.action) {
      case 'star': toggleStar(id); break;
      case 'edit': editCard(id); break;
      case 'add': editCard(); break;
      case 'clear': clearFilters(); break;
      case 'reveal': flushNote(); ui.revealed = !ui.revealed; if (ui.timerEnd) toggleTimer(); render(); $('reveal-button')?.focus({ preventScroll: true }); break;
      case 'rate': rate(action.dataset.value); break;
      case 'next': step(1); break;
      case 'prev': step(-1); break;
      case 'jump': navigate(id); break;
      case 'practice': ui.view = 'study'; navigate(id); $('workspace').scrollIntoView({ behavior: 'smooth', block: 'start' }); break;
      case 'timer': toggleTimer(); break;
      case 'timer-reset': resetTimer(); break;
    }
  });
  $('search').addEventListener('input', e => changeFilters({ search: e.target.value }));
  $('clear-filters').onclick = clearFilters;
  $('study-view').onclick = () => changeFilters({ view: 'study' });
  $('library-view').onclick = () => changeFilters({ view: 'library' });
  $('shuffle-button').onclick = () => { ui.shuffled = !ui.shuffled; ui.order = ui.shuffled ? C.shuffle(db.cards).map(c => c.id) : []; ui.id = null; changeFilters({}); toast(ui.shuffled ? '已打乱题目顺序' : '已恢复原始顺序'); };
  $('theme-button').onclick = () => { db.theme = db.theme === 'dark' ? 'light' : 'dark'; applyTheme(); save(); };
  $('focus-button').onclick = () => { db.focus = !db.focus; applyTheme(); save(); $('workspace').scrollIntoView({ behavior: 'instant', block: 'start' }); };
  $('add-button').onclick = () => editCard();
  $('help-button').onclick = () => showDialog('help-dialog');
  $('import-button').onclick = openImport;
  $('export-button').onclick = () => showDialog('export-dialog');
  $('publish-button').onclick = publishPublic;
  $('export-json').onclick = () => exportData('json'); $('export-markdown').onclick = () => exportData('md');
  $('editor-form').onsubmit = saveEditor; $('delete-button').onclick = deleteCard;
  $('edit-answer').oninput = estimateAnswer;
  $('import-file').onchange = e => readImportFile(e.target.files[0]);
  $('import-text').oninput = () => { ui.importName = ''; invalidateImport(); };
  $('preview-import').onclick = previewImport; $('apply-import').onclick = applyImport;
  $('update-duplicates').onchange = () => { if (ui.importData) previewImport(); };
  $('restore-backup').onchange = () => { if (ui.importData) previewImport(); };
  $('file-drop').ondragover = e => { e.preventDefault(); $('file-drop').classList.add('dragging'); };
  $('file-drop').ondragleave = () => $('file-drop').classList.remove('dragging');
  $('file-drop').ondrop = e => { e.preventDefault(); $('file-drop').classList.remove('dragging'); readImportFile(e.dataTransfer.files[0]); };
  $('menu-button').onclick = () => { const open = !$('sidebar').classList.contains('open'); $('sidebar').classList.toggle('open', open); $('sidebar-shade').hidden = !open; $('menu-button').setAttribute('aria-expanded', String(open)); };
  $('sidebar-shade').onclick = closeSidebar;
  document.addEventListener('input', e => { if (e.target.id === 'personal-note' && current()) { progress(ui.id).note = e.target.value; clearTimeout(ui.noteTimer); ui.noteTimer = setTimeout(() => { ui.noteTimer = null; save(); }, 400); } });
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('cancel', e => { if (dialog.id === 'editor-dialog') { e.preventDefault(); closeDialog(dialog.id); } });
    dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeDialog(dialog.id); } });
  });
  document.addEventListener('keydown', e => {
    if (document.querySelector('dialog[open]') || e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
    if (e.target.closest('input,textarea,select,[contenteditable="true"]')) return;
    const key = e.key.toLowerCase();
    if (key === '/') { e.preventDefault(); $('search').focus(); return; }
    if (key === '?') { e.preventDefault(); showDialog('help-dialog'); return; }
    if (key === 'n') { e.preventDefault(); editCard(); return; }
    if (key === 'escape') { closeSidebar(); return; }
    if (ui.view !== 'study' || !current()) return;
    if (key === ' ' && e.target.closest('button,a')) return;
    const actions = { arrowleft: () => step(-1), arrowright: () => step(1), s: () => toggleStar(ui.id), e: () => editCard(ui.id), t: toggleTimer,
      ' ': () => $('reveal-button')?.click(), '1': () => rate('review'), '2': () => rate('learning'), '3': () => rate('mastered') };
    if (actions[key]) { e.preventDefault(); actions[key](); }
  });
  window.addEventListener('pagehide', flushNote);
  window.addEventListener('beforeunload', e => { flushNote(); if (storageFailed) { e.preventDefault(); e.returnValue = ''; } });
  // Prevent silent overwrites when another tab edits this same browser's library.
  window.addEventListener('storage', e => {
    if (e.key !== KEY || !e.newValue) return;
    if (document.querySelector('dialog[open]') || document.activeElement?.id === 'personal-note' || ui.noteTimer) { storageConflict = true; storageFailed = true; renderSaveStatus(); toast('另一标签页更新了题库，已暂停覆盖保存。请备份当前修改，再刷新同步。', 7000); return; }
    try { const parsed = JSON.parse(e.newValue), cards = C.validateCards(parsed.cards); if (parsed.version !== 1) return; db = { ...parsed, cards, progress: C.cleanProgress(cards, parsed.progress) }; applyTheme(); render(); } catch { /* Preserve current state on invalid external writes. */ }
  });
  applyTheme(); render(); if (loadError) toast(loadError, 7000);
})();
