(function () {
  'use strict';

  const C = window.QVCore;
  const $ = id => document.getElementById(id);
  const KEY = 'qv.public.practice.v1';
  const paths = {
    focus: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/><circle cx="12" cy="12" r="3"/>',
    cards: '<rect x="6" y="5" width="14" height="16" rx="2"/><path d="M3 16V4a2 2 0 0 1 2-2h11M10 10h6M10 14h4"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.1M3 12h.1M3 18h.1"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/>',
    repeat: '<path d="m17 2 4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4m14-1v2a3 3 0 0 1-3 3H3"/>',
    spark: '<path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4Z"/>',
    keyboard: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h.1M10 9h.1M14 9h.1M18 9h.1M6 12h.1M10 12h.1M14 12h.1M18 12h.1M7 15h10"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    moon: '<path d="M20.5 13.7A9 9 0 0 1 10.3 3.5a9 9 0 1 0 10.2 10.2Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    search: '<circle cx="10.8" cy="10.8" r="7"/><path d="m16 16 5 5"/>',
    shuffle: '<path d="m18 3 3 3-3 3m0 6 3 3-3 3M3 6h3c4 0 8 12 12 12h3M3 18h3c2 0 4-3 6-6s4-6 6-6h3"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    circle: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l2 2"/>',
    'arrow-right': '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    'arrow-left': '<path d="M20 12H4m6-6-6 6 6 6"/>',
    file: '<path d="M14 2H5a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V8Zm0 0v6h6M8 13h8m-8 4h6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
    play: '<path d="m8 4 12 8-12 8Z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    reset: '<path d="M3 10a9 9 0 1 1 1 7M3 4v6h6"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    book: '<path d="M12 5c-3-2-7-2-10-1v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1Zm0 0v15"/>'
  };
  const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.cards}</svg>`;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

  function inline(text) {
    const tokens = [];
    let safe = esc(text).replace(/`([^`]+)`/g, (_, code) => {
      tokens.push(`<code>${code}</code>`);
      return `\u0000${tokens.length - 1}\u0000`;
    });
    safe = safe.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, label, url) => {
      tokens.push(`<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`);
      return `\u0000${tokens.length - 1}\u0000`;
    });
    return safe.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\u0000(\d+)\u0000/g, (_, i) => tokens[Number(i)] || '');
  }

  function markdown(text) {
    return String(text).split(/\n\s*\n/).map(block => {
      if (/^```/.test(block.trim())) return `<pre><code>${esc(block.trim().replace(/^```[^\n]*\n?/, '').replace(/\n?```$/, ''))}</code></pre>`;
      if (block.split('\n').every(line => /^\s*[-*] /.test(line))) return '<ul>' + block.split('\n').map(line => `<li>${inline(line.replace(/^\s*[-*] /, ''))}</li>`).join('') + '</ul>';
      return `<p>${block.split('\n').map(inline).join('<br>')}</p>`;
    }).join('');
  }

  const cards = C.validateCards(window.QV_SEED?.cards || []);
  let storageFailed = false;
  let state = {
    version: 1,
    progress: C.cleanProgress(cards),
    theme: 'light',
    lastId: cards[0]?.id || null,
    focus: false
  };

  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && saved.version === 1) {
      state = {
        version: 1,
        progress: C.cleanProgress(cards, saved.progress),
        theme: saved.theme === 'dark' ? 'dark' : 'light',
        lastId: cards.some(card => card.id === saved.lastId) ? saved.lastId : cards[0]?.id || null,
        focus: saved.focus === true
      };
    }
  } catch {
    storageFailed = true;
  }

  const ui = {
    view: 'study',
    scope: 'all',
    category: 'all',
    status: 'all',
    search: '',
    id: state.lastId,
    revealed: false,
    shuffled: false,
    order: [],
    timerRemaining: 60,
    timerEnd: null,
    timerInterval: null,
    toastTimer: null,
    noteTimer: null
  };

  function progress(id) {
    return state.progress[id] || (state.progress[id] = C.cleanProgress([{ id }])[id]);
  }

  function renderSaveStatus() {
    $('save-status').classList.toggle('error', storageFailed);
    $('save-status').innerHTML = storageFailed ? '当前浏览器无法保存进度' : '<span class="online-dot"></span>进度保存在本机';
    $('save-status').title = '收藏、掌握度和个人笔记只保存在当前浏览器，不会上传。';
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      storageFailed = false;
    } catch {
      storageFailed = true;
      toast('当前浏览器无法保存练习进度。', 5000);
    }
    renderSaveStatus();
  }

  function toast(message, duration = 3000) {
    clearTimeout(ui.toastTimer);
    $('toast').textContent = message;
    $('toast').hidden = false;
    ui.toastTimer = setTimeout(() => { $('toast').hidden = true; }, duration);
  }

  function deck() {
    const result = C.filterCards(cards, state.progress, ui);
    if (!ui.shuffled) return result;
    const positions = new Map(ui.order.map((id, index) => [id, index]));
    return result.sort((a, b) => (positions.get(a.id) ?? 1e6) - (positions.get(b.id) ?? 1e6));
  }

  function current() { return cards.find(card => card.id === ui.id); }
  function categories() { return [...new Set([...C.CATEGORIES.filter(cat => cards.some(card => card.category === cat)), ...cards.map(card => card.category)])]; }
  function statusBadge(id) { const status = progress(id).status; return `<span class="status-badge ${status}">${C.STATUS[status]}</span>`; }

  function applyTheme() {
    document.documentElement.dataset.theme = state.theme;
    $('theme-button').innerHTML = icon(state.theme === 'dark' ? 'sun' : 'moon');
    $('theme-button').setAttribute('aria-label', state.theme === 'dark' ? '切换浅色模式' : '切换深色模式');
    $('theme-button').title = $('theme-button').getAttribute('aria-label');
    document.body.classList.toggle('focus-mode', state.focus);
    $('focus-button').setAttribute('aria-pressed', String(state.focus));
    $('focus-button').innerHTML = icon('focus') + `<span>${state.focus ? '退出专注' : '专注模式'}</span>`;
  }

  function renderChrome() {
    const summary = C.stats(cards, state.progress);
    $('nav-total').textContent = summary.total;
    $('nav-starred').textContent = summary.starred;
    $('nav-review').textContent = summary.review;
    const activeNav = ui.scope !== 'all' ? ui.scope : ui.view;
    document.querySelectorAll('[data-nav]').forEach(button => {
      const active = button.dataset.nav === activeNav;
      button.classList.toggle('active', active);
      button.setAttribute('aria-current', active ? 'page' : 'false');
    });
    const titles = { study: '闪卡练习', library: '题目列表', starred: '我的收藏', review: '待复习' };
    $('page-title').textContent = titles[activeNav];
    $('section-title').textContent = ui.view === 'library' ? '浏览全部问题' : ui.scope === 'review' ? '把难题，再想一遍' : ui.scope === 'starred' ? '值得多练的好问题' : '专注这一题';
    $('section-subtitle').textContent = ui.view === 'library' ? '展开参考回答，或选择一道题开始练习。' : '从熟悉的概念，到自己的理解。';

    const colors = ['#7aa38a', '#8ba0bd', '#b6a48b', '#ac9bb7', '#87b5b5', '#c7a58f', '#a5ac81'];
    const categoryList = categories();
    $('topic-total').textContent = String(categoryList.length).padStart(2, '0');
    const navItems = [{ label: '全部主题', value: 'all', count: cards.length }, ...categoryList.map(category => ({ label: category, value: category, count: cards.filter(card => card.category === category).length }))];
    $('category-nav').innerHTML = navItems.map((item, index) => `<button class="category-item${ui.category === item.value ? ' active' : ''}" data-category="${esc(item.value)}" aria-pressed="${ui.category === item.value}"><span class="dot" style="--topic-color:${colors[(index + 6) % colors.length]}"></span><span>${esc(item.label)}</span><span>${item.count}</span></button>`).join('');
    $('stats').innerHTML = [
      ['题库总量', summary.total, '题', 'book'],
      ['今日已练', summary.today, '题', 'spark'],
      ['已经掌握', summary.mastered, '题', 'checkCircle'],
      ['需要复习', summary.review, '题', 'repeat']
    ].map(([label, amount, unit, symbol]) => `<div class="stat"><div><div class="stat-label">${label}</div><div class="stat-number">${amount}<small>${unit}</small></div></div><span class="stat-symbol">${icon(symbol)}</span></div>`).join('');
    $('status-filters').innerHTML = Object.entries({ all: '全部', ...C.STATUS }).map(([status, label]) => `<button class="status-chip${ui.status === status ? ' active' : ''}" data-status="${status}" aria-pressed="${ui.status === status}">${label}</button>`).join('');
    ['study', 'library'].forEach(view => {
      $(view + '-view').classList.toggle('active', ui.view === view);
      $(view + '-view').setAttribute('aria-pressed', String(ui.view === view));
    });
    $('clear-filters').hidden = ui.category === 'all' && ui.status === 'all' && !ui.search && ui.scope === 'all';
    $('shuffle-button').setAttribute('aria-pressed', String(ui.shuffled));
    $('shuffle-button').innerHTML = icon(ui.shuffled ? 'reset' : 'shuffle') + `<span>${ui.shuffled ? '恢复顺序' : '随机练习'}</span>`;
    renderSaveStatus();
  }

  function emptyHTML() {
    const heading = ui.search ? '没有找到匹配的问题' : ui.scope === 'starred' ? '还没有收藏问题' : ui.scope === 'review' ? '暂时没有待复习的题目' : '这个筛选下还没有题目';
    const hint = ui.scope === 'starred' && !ui.search ? '点击题目右上角的星标，建立自己的重点清单。' : ui.scope === 'review' && !ui.search ? '练习后标记“待复习”，下次就能集中巩固。' : '试试其他关键词，或清空主题和掌握度筛选。';
    return `<div class="empty-state"><span class="empty-icon">${icon(ui.scope === 'starred' ? 'star' : 'search')}</span><h3>${heading}</h3><p>${hint}</p><button class="button primary" data-action="clear">查看全部题目${icon('arrow-right')}</button></div>`;
  }

  function questionTools(card) {
    const itemProgress = progress(card.id);
    return `<div class="card-tools"><button class="icon-button${itemProgress.starred ? ' starred' : ''}" data-action="star" data-id="${card.id}" aria-label="${itemProgress.starred ? '取消收藏' : '收藏问题'}" aria-pressed="${itemProgress.starred}" title="${itemProgress.starred ? '取消收藏' : '收藏问题'}（S）">${icon('star')}</button></div>`;
  }

  function notesHTML(card) {
    return card.notes ? `<details class="notes-details"><summary>备考备注与参考资料 <span>· 不需要口述</span></summary><div class="markdown">${markdown(card.notes)}</div></details>` : '';
  }

  function renderStudy(filtered) {
    const index = filtered.findIndex(card => card.id === ui.id);
    const card = filtered[index];
    const itemProgress = progress(card.id);
    const source = card.section ? `${card.section.replace(/^(第一|第二)部分\s*/, '')}${card.sourceNumber ? ' · 原题 ' + card.sourceNumber : ''}` : '公开题库';
    const seconds = Math.max(10, Math.round(card.answer.replace(/\s/g, '').length / 4));
    return `<div class="study-layout"><div class="study-primary">
      <article class="flashcard" aria-labelledby="current-question">
        <div class="card-top"><div class="card-badges"><span class="category-badge">${esc(card.category)}</span>${statusBadge(card.id)}</div>${questionTools(card)}</div>
        <div class="card-body"><div class="question-kicker">QUESTION ${String(index + 1).padStart(2, '0')}</div><h3 class="card-question" id="current-question">${esc(card.question)}</h3><div class="question-source">${icon('file')}${esc(source)}</div>
        ${ui.revealed ? `<div class="answer-area" id="current-answer"><div class="answer-title"><strong>${icon('book')}参考回答</strong><span>约 ${seconds} 秒口述</span></div><div class="answer-text markdown">${markdown(card.answer)}</div>${notesHTML(card)}<label class="private-note"><span>我的理解与补充<small>仅保存在当前浏览器</small></span><textarea id="personal-note" rows="2" maxlength="50000" placeholder="用自己的项目举例，或者记下还没想清楚的地方…">${esc(itemProgress.note)}</textarea></label></div>` : '<div class="recall-hint"><p>先试着用自己的话回答。</p><p>说清楚「是什么」，再补充「为什么」和「怎么做」。</p></div>'}
        <div class="reveal-row"><button id="reveal-button" class="button reveal-button" data-action="reveal" aria-expanded="${ui.revealed}">${icon(ui.revealed ? 'reset' : 'eye')}${ui.revealed ? '收起答案，再想一遍' : '查看参考回答'}<kbd>Space</kbd></button></div></div>
        <div class="card-bottom"><div class="timer"><span class="timer-label">${icon('clock')} 口述计时</span><span class="timer-time" id="timer-display">01:00</span><button class="icon-button" id="timer-toggle" data-action="timer" aria-label="开始计时" title="开始 / 暂停（T）">${icon('play')}</button><button class="icon-button" data-action="timer-reset" aria-label="重置计时" title="重置计时">${icon('reset')}</button></div><span>先独立回答，再对照参考</span></div>
      </article>
      <div class="rating-header"><span>这道题，你掌握得怎么样？</span><small>${ui.revealed ? '标记后自动进入下一题' : '展开答案后即可标记'}</small></div>
      <div class="rating-buttons">${[['review', 'repeat', '待复习', '1'], ['learning', 'circle', '有些印象', '2'], ['mastered', 'checkCircle', '已掌握', '3']].map(([status, symbol, label, key]) => `<button class="rating-button ${status}" data-action="rate" data-value="${status}" ${ui.revealed ? '' : 'disabled'}>${icon(symbol)}${label}<kbd>${key}</kbd></button>`).join('')}</div>
      <div class="deck-navigation"><button id="prev-button" class="button secondary" data-action="prev" ${index === 0 ? 'disabled' : ''}>${icon('arrow-left')}上一题</button><span class="deck-counter"><strong>${String(index + 1).padStart(2, '0')}</strong> / ${filtered.length}<br><small>${ui.shuffled ? '随机顺序' : '顺序练习'}</small></span><button id="next-button" class="button secondary" data-action="next" ${index === filtered.length - 1 ? 'disabled' : ''}>下一题${icon('arrow-right')}</button></div><div class="deck-progress"><span style="width:${(index + 1) / filtered.length * 100}%"></span></div><div class="keyboard-hint"><span><kbd>Space</kbd> 展开答案</span><span><kbd>←</kbd> <kbd>→</kbd> 切换问题</span><span><kbd>S</kbd> 收藏</span><span><kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> 标记</span></div>
      </div><aside class="study-aside" aria-label="当前题组"><div class="queue-panel"><div class="queue-heading"><h3>当前题组</h3><span>${filtered.length} QUESTIONS</span></div><div class="queue-list">${filtered.map((item, itemIndex) => `<button class="queue-item${item.id === card.id ? ' active' : ''}" data-action="jump" data-id="${item.id}" ${item.id === card.id ? 'aria-current="true"' : ''}><span>${String(itemIndex + 1).padStart(2, '0')}</span><span>${esc(item.question)}</span><i class="queue-state ${progress(item.id).status}"></i></button>`).join('')}</div><div class="queue-footer">${icon('checkCircle')}本组已掌握 ${filtered.filter(item => progress(item.id).status === 'mastered').length} / ${filtered.length}</div></div><div class="practice-tip"><strong>${icon('spark')}一点练习建议</strong><p>不必逐字背诵。先给出<em>核心判断</em>，再用<em>实际经历</em>展开。能讲清边界，比堆砌术语更加分。</p></div></aside></div>`;
  }

  function renderLibrary(filtered) {
    return `<div class="library-grid">${filtered.map(card => `<article class="library-card"><div class="library-top"><span class="category-badge">${esc(card.category)}</span>${questionTools(card)}</div><h3>${esc(card.question)}</h3><p class="library-preview">${esc(card.answer)}</p><details><summary>展开完整回答</summary><div class="answer-text markdown">${markdown(card.answer)}</div>${notesHTML(card)}</details><div class="library-bottom">${statusBadge(card.id)}<div class="library-buttons"><button class="button small secondary" data-action="practice" data-id="${card.id}">开始练习${icon('arrow-right')}</button></div></div></article>`).join('')}</div>`;
  }

  function render() {
    const activeId = document.activeElement?.id;
    const filtered = deck();
    if (!filtered.some(card => card.id === ui.id)) {
      ui.id = filtered[0]?.id || null;
      ui.revealed = false;
      resetTimer();
    }
    if (ui.id) state.lastId = ui.id;
    renderChrome();
    $('result-count').textContent = `${filtered.length} 道问题`;
    $('content').innerHTML = !filtered.length ? emptyHTML() : ui.view === 'study' ? renderStudy(filtered) : renderLibrary(filtered);
    updateTimer();
    if (activeId && $(activeId) && !$(activeId).disabled) $(activeId).focus({ preventScroll: true });
    const queue = document.querySelector('.queue-list');
    const selected = document.querySelector('.queue-item.active');
    if (queue && selected) queue.scrollTop = Math.max(0, selected.getBoundingClientRect().top - queue.getBoundingClientRect().top - 100);
  }

  function scrollToCardOnMobile() {
    if (!window.matchMedia('(max-width: 760px)').matches) return;
    document.activeElement?.blur?.();
    requestAnimationFrame(() => document.querySelector('.flashcard')?.scrollIntoView({ behavior: 'auto', block: 'start' }));
  }

  function navigate(id, scrollMobile = true) {
    if (!id) return;
    flushNote();
    resetTimer();
    ui.id = id;
    ui.revealed = false;
    state.lastId = id;
    save();
    render();
    if (scrollMobile) scrollToCardOnMobile();
  }

  function step(amount) {
    const filtered = deck();
    const index = filtered.findIndex(card => card.id === ui.id);
    navigate(filtered[index + amount]?.id);
  }

  function closeSidebar() {
    $('sidebar').classList.remove('open');
    $('sidebar-shade').hidden = true;
    $('menu-button').setAttribute('aria-expanded', 'false');
  }

  function changeFilters(changes) {
    flushNote();
    resetTimer();
    Object.assign(ui, changes);
    ui.revealed = false;
    render();
    closeSidebar();
  }

  function clearFilters() {
    $('search').value = '';
    changeFilters({ scope: 'all', category: 'all', status: 'all', search: '' });
  }

  function rate(status) {
    if (!ui.revealed || !current()) return;
    const filtered = deck();
    const index = filtered.findIndex(card => card.id === ui.id);
    const id = ui.id;
    Object.assign(progress(id), { status, reviews: progress(id).reviews + 1, reviewedAt: new Date().toISOString() });
    const nextId = filtered[index + 1]?.id || id;
    navigate(nextId);
    toast(`已标记为「${C.STATUS[status]}」${index === filtered.length - 1 ? ' · 已到本组末尾' : ''}`);
  }

  function toggleStar(id) {
    progress(id).starred = !progress(id).starred;
    flushNote();
    save();
    render();
    toast(progress(id).starred ? '已加入收藏。' : '已取消收藏。');
  }

  function flushNote() {
    if (!ui.noteTimer) return;
    clearTimeout(ui.noteTimer);
    ui.noteTimer = null;
    save();
  }

  function resetTimer() {
    clearInterval(ui.timerInterval);
    ui.timerInterval = null;
    ui.timerEnd = null;
    ui.timerRemaining = 60;
    updateTimer();
  }

  function updateTimer() {
    if (ui.timerEnd) ui.timerRemaining = Math.max(0, Math.ceil((ui.timerEnd - Date.now()) / 1000));
    if ($('timer-display')) {
      $('timer-display').textContent = `${String(Math.floor(ui.timerRemaining / 60)).padStart(2, '0')}:${String(ui.timerRemaining % 60).padStart(2, '0')}`;
      $('timer-display').classList.toggle('expired', ui.timerRemaining === 0);
    }
    if ($('timer-toggle')) {
      $('timer-toggle').innerHTML = icon(ui.timerEnd ? 'pause' : 'play');
      $('timer-toggle').setAttribute('aria-label', ui.timerEnd ? '暂停计时' : '开始计时');
    }
    if (ui.timerEnd && ui.timerRemaining === 0) {
      clearInterval(ui.timerInterval);
      ui.timerInterval = null;
      ui.timerEnd = null;
      updateTimer();
      toast('一分钟到了。对照参考答案，看看哪里还能说得更清楚。', 4500);
    }
  }

  function toggleTimer() {
    if (!current() || ui.view !== 'study') return;
    if (ui.timerEnd) {
      updateTimer();
      clearInterval(ui.timerInterval);
      ui.timerInterval = null;
      ui.timerEnd = null;
    } else {
      if (ui.timerRemaining === 0) ui.timerRemaining = 60;
      ui.timerEnd = Date.now() + ui.timerRemaining * 1000;
      ui.timerInterval = setInterval(updateTimer, 200);
    }
    updateTimer();
  }

  function showHelp() {
    flushNote();
    if (ui.timerEnd) toggleTimer();
    $('help-dialog').showModal();
  }

  document.querySelectorAll('[data-icon]').forEach(element => { element.innerHTML = icon(element.dataset.icon); });

  document.addEventListener('click', event => {
    const close = event.target.closest('[data-close]');
    if (close) { $(close.dataset.close).close(); return; }
    const nav = event.target.closest('[data-nav]');
    if (nav) {
      const value = nav.dataset.nav;
      $('search').value = '';
      changeFilters({ view: value === 'library' ? 'library' : 'study', scope: ['starred', 'review'].includes(value) ? value : 'all', category: 'all', status: 'all', search: '' });
      return;
    }
    const category = event.target.closest('[data-category]');
    if (category) { changeFilters({ category: category.dataset.category }); return; }
    const status = event.target.closest('[data-status]');
    if (status) { changeFilters({ status: status.dataset.status }); return; }
    const action = event.target.closest('[data-action]');
    if (!action || action.disabled) return;
    const id = action.dataset.id || ui.id;
    switch (action.dataset.action) {
      case 'star': toggleStar(id); break;
      case 'clear': clearFilters(); break;
      case 'reveal':
        flushNote();
        ui.revealed = !ui.revealed;
        if (ui.timerEnd) toggleTimer();
        render();
        $('reveal-button')?.focus({ preventScroll: true });
        break;
      case 'rate': rate(action.dataset.value); break;
      case 'next': step(1); break;
      case 'prev': step(-1); break;
      case 'jump': navigate(id); break;
      case 'practice':
        ui.view = 'study';
        navigate(id, false);
        $('workspace').scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      case 'timer': toggleTimer(); break;
      case 'timer-reset': resetTimer(); break;
    }
  });

  $('search').addEventListener('input', event => changeFilters({ search: event.target.value }));
  $('clear-filters').onclick = clearFilters;
  $('study-view').onclick = () => changeFilters({ view: 'study' });
  $('library-view').onclick = () => changeFilters({ view: 'library' });
  $('shuffle-button').onclick = () => {
    ui.shuffled = !ui.shuffled;
    ui.order = ui.shuffled ? C.shuffle(cards).map(card => card.id) : [];
    ui.id = null;
    changeFilters({});
    toast(ui.shuffled ? '已打乱题目顺序。' : '已恢复原始顺序。');
  };
  $('theme-button').onclick = () => { state.theme = state.theme === 'dark' ? 'light' : 'dark'; applyTheme(); save(); };
  $('focus-button').onclick = () => { state.focus = !state.focus; applyTheme(); save(); $('workspace').scrollIntoView({ behavior: 'instant', block: 'start' }); };
  $('help-button').onclick = showHelp;
  $('menu-button').onclick = () => {
    const open = !$('sidebar').classList.contains('open');
    $('sidebar').classList.toggle('open', open);
    $('sidebar-shade').hidden = !open;
    $('menu-button').setAttribute('aria-expanded', String(open));
  };
  $('sidebar-shade').onclick = closeSidebar;

  document.addEventListener('input', event => {
    if (event.target.id !== 'personal-note' || !current()) return;
    progress(ui.id).note = event.target.value;
    clearTimeout(ui.noteTimer);
    ui.noteTimer = setTimeout(() => { ui.noteTimer = null; save(); }, 400);
  });

  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
  });

  document.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return;
    if (document.querySelector('dialog[open]')) return;
    if (event.target.closest('input,textarea,select,[contenteditable="true"]')) return;
    const key = event.key.toLowerCase();
    if (key === '/') { event.preventDefault(); $('search').focus(); return; }
    if (key === '?') { event.preventDefault(); showHelp(); return; }
    if (key === 'escape') { closeSidebar(); return; }
    if (ui.view !== 'study' || !current()) return;
    if (key === ' ') {
      event.preventDefault();
      ui.revealed = !ui.revealed;
      if (ui.timerEnd) toggleTimer();
      render();
    } else if (key === 'arrowleft') {
      event.preventDefault(); step(-1);
    } else if (key === 'arrowright') {
      event.preventDefault(); step(1);
    } else if (key === 's') {
      event.preventDefault(); toggleStar(ui.id);
    } else if (key === 't') {
      event.preventDefault(); toggleTimer();
    } else if (ui.revealed && ['1', '2', '3'].includes(key)) {
      event.preventDefault(); rate({ 1: 'review', 2: 'learning', 3: 'mastered' }[key]);
    }
  });

  window.addEventListener('beforeunload', flushNote);
  window.addEventListener('storage', event => {
    if (event.key !== KEY || !event.newValue || document.activeElement?.id === 'personal-note') return;
    try {
      const incoming = JSON.parse(event.newValue);
      if (incoming.version !== 1) return;
      state.progress = C.cleanProgress(cards, incoming.progress);
      state.theme = incoming.theme === 'dark' ? 'dark' : 'light';
      state.focus = incoming.focus === true;
      state.lastId = cards.some(card => card.id === incoming.lastId) ? incoming.lastId : state.lastId;
      ui.id = state.lastId;
      applyTheme();
      render();
      toast('已同步此浏览器中另一标签页的练习进度。');
    } catch { /* Ignore malformed external storage events. */ }
  });

  applyTheme();
  render();
  if (!cards.length) toast('公开题库暂时没有内容。', 6000);
  if (storageFailed) toast('题库可以正常练习，但当前浏览器无法保存进度。', 6000);
})();
