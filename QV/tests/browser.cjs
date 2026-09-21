/* Optional end-to-end tests. No browser dependency is needed to run the app. */
const path = require('node:path');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const args = process.argv.slice(2);
const option = name => args[args.indexOf(name) + 1];
const playwrightPath = process.env.PLAYWRIGHT_MODULE || (args.includes('--playwright') ? option('--playwright') : 'playwright');
const { chromium } = require(playwrightPath);
const browserPath = process.env.CHROME_PATH || (args.includes('--browser') ? option('--browser') : undefined);
const root = path.resolve(__dirname, '..'), qa = path.join(root, '.qa');
fs.mkdirSync(qa, { recursive: true });
const PORT = 4187, url = `http://127.0.0.1:${PORT}`;
const server = spawn(process.execPath, [path.join(root, 'serve.cjs')], { env: { ...process.env, PORT: String(PORT) }, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
let browser;
const errors = [], results = [];
const wait = ms => new Promise(r => setTimeout(r, ms));
function passed(name) { results.push(name); console.log('PASS:', name); }
async function screenshot(page, name) { await page.screenshot({ path: path.join(qa, name + '.png'), fullPage: true, animations: 'disabled' }); }
async function main() {
  await new Promise((resolve, reject) => { server.stdout.once('data', resolve); server.once('error', reject); server.once('exit', code => { if (code) reject(new Error('Preview server failed')); }); });
  browser = await chromium.launch({ headless: true, executablePath: browserPath });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1050 }, locale: 'zh-CN', acceptDownloads: true });
  const page = await context.newPage(); page.on('pageerror', err => errors.push(err.message));
  await page.goto(url); await page.locator('#current-question').waitFor();
  const initial = await page.locator('#nav-total').textContent();
  assert.equal(initial, '67'); assert.equal(await page.locator('.queue-item').count(), 67);
  assert.equal(await page.locator('#current-answer').count(), 0);
  await screenshot(page, 'desktop-study'); passed('Initial 67-card deck and hidden answer');

  await page.locator('#timer-toggle').click(); await wait(1100);
  assert.notEqual(await page.locator('#timer-display').textContent(), '01:00');
  await page.locator('#timer-toggle').click(); const stopped = await page.locator('#timer-display').textContent();
  await wait(1100); assert.equal(await page.locator('#timer-display').textContent(), stopped);
  await page.locator('[data-action="timer-reset"]').click(); assert.equal(await page.locator('#timer-display').textContent(), '01:00');
  passed('Timer starts, pauses and resets');

  const firstQuestion = await page.locator('#current-question').textContent();
  await page.locator('#current-question').click(); await page.keyboard.press('s');
  assert.equal(await page.locator('#nav-starred').textContent(), '1');
  await page.locator('#reveal-button').click();
  await page.locator('#personal-note').fill('用自己的导诊项目解释工作流与 Agent 的边界。');
  await page.locator('#current-question').click(); await wait(500);
  await screenshot(page, 'desktop-answer');
  await page.locator('[data-action="rate"][data-value="mastered"]').click();
  assert.notEqual(await page.locator('#current-question').textContent(), firstQuestion);
  await page.reload();
  assert.equal(await page.locator('#nav-starred').textContent(), '1');
  await page.locator('[data-nav="starred"]').click();
  assert.equal(await page.locator('#current-question').textContent(), firstQuestion);
  await page.locator('#reveal-button').click();
  assert.match(await page.locator('#personal-note').inputValue(), /导诊/);
  assert.match(await page.locator('.flashcard .status-badge').textContent(), /已掌握/);
  passed('Star, note, rating and persistence after reload');

  await page.locator('[data-nav="study"]').click();
  await page.locator('#search').fill('RRF'); assert.ok((await page.locator('.queue-item').count()) >= 3);
  await page.locator('#search').fill('___NO_RESULT___'); assert.equal(await page.locator('.empty-state').count(), 1);
  await page.locator('#clear-filters').click();
  await page.locator('[data-category="RAG 与检索"]').click();
  assert.ok(await page.locator('.queue-item').count() < 67);
  await page.locator('#library-view').click(); await screenshot(page, 'desktop-library');
  assert.ok(await page.locator('.library-card').count() > 5);
  await page.locator('#clear-filters').click(); passed('Search, empty state, category and library view');

  await page.locator('#add-button').click();
  await page.locator('#edit-question').fill('自定义测试：如何组织一个可验证的回答？');
  await page.locator('#edit-category').fill('我的测试主题');
  await page.locator('#edit-answer').fill('先给结论，再用证据说明。');
  await page.locator('#edit-notes').fill('[官方资料](https://example.com)');
  await page.locator('#edit-answer').press('Space');
  assert.equal(await page.locator('#editor-dialog').getAttribute('open'), '');
  await page.locator('#editor-form button[type="submit"]').click();
  assert.equal(await page.locator('#nav-total').textContent(), '68');
  await page.locator('#study-view').click();
  assert.match(await page.locator('#current-question').textContent(), /自定义测试/);
  await page.locator('.flashcard [data-action="edit"]').click();
  await page.locator('#edit-answer').fill('更新后的答案：先定义验收条件，再执行并验证。');
  await page.locator('#editor-form button[type="submit"]').click();
  await page.locator('#reveal-button').click(); assert.match(await page.locator('.answer-text').textContent(), /更新后的答案/);
  await screenshot(page, 'desktop-edited');
  await page.locator('.flashcard [data-action="edit"]').click();
  await screenshot(page, 'desktop-editor');
  await page.locator('#edit-answer').fill('不应被保存的修改');
  await page.locator('#editor-dialog [data-close]').first().click();
  await page.locator('#confirm-action').click();
  assert.match(await page.locator('.answer-text').textContent(), /更新后的答案/);
  passed('Add, edit, custom category, input shortcuts and discard confirmation');

  await page.locator('#export-button').click();
  const downloaded = page.waitForEvent('download'); await page.locator('#export-json').click();
  const download = await downloaded; const backupPath = path.join(qa, 'test-backup.json'); await download.saveAs(backupPath);
  const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
  assert.equal(backup.cards.length, 68); assert.ok(Object.values(backup.progress).some(p => p.note.includes('导诊')));
  await page.locator('.flashcard [data-action="edit"]').click(); await page.locator('#delete-button').click(); await page.locator('#confirm-action').click();
  assert.equal(await page.locator('#nav-total').textContent(), '67');
  await page.locator('#import-button').click(); await page.locator('#import-file').setInputFiles(backupPath);
  await page.locator('#restore-option:not([hidden])').waitFor();
  await page.locator('#restore-backup').check(); await page.locator('#apply-import').click(); await page.locator('#confirm-action').click();
  assert.equal(await page.locator('#nav-total').textContent(), '68'); assert.equal(await page.locator('#nav-starred').textContent(), '1');
  passed('JSON download, confirmed deletion and complete backup restoration');

  await page.locator('#import-button').click();
  const injectionQuestion = '<img src=x onerror="window.__xss=1"> 安全导入测试';
  await page.locator('#import-text').fill(`## 导入测试主题\n\n### ${injectionQuestion}\n\n**回答：**<script>window.__xss=2</script> [不安全](javascript:alert(1)) **安全文字**\n\n> 备考备注（不口述）：[有效链接](https://example.com)`);
  await page.locator('#preview-import').click(); assert.match(await page.locator('#import-preview').textContent(), /新增 1/);
  await page.locator('#apply-import').click(); assert.equal(await page.locator('#nav-total').textContent(), '69');
  await page.locator('#reveal-button').click();
  assert.equal(await page.locator('#current-question img').count(), 0);
  assert.equal(await page.locator('.answer-text script').count(), 0);
  assert.equal(await page.locator('.answer-text a').count(), 0);
  assert.equal(await page.evaluate(() => window.__xss), undefined);
  assert.equal(await page.locator('.flashcard .category-badge').textContent(), '导入测试主题');
  passed('Markdown preview/import, custom category and safe text rendering');

  await page.locator('#import-button').click();
  await page.locator('#import-text').fill('## 导入测试主题\n\n### ' + injectionQuestion + '\n\n**回答：**已更新的导入答案');
  await page.locator('#preview-import').click(); assert.match(await page.locator('#import-preview').textContent(), /跳过重复 1/);
  await page.locator('#update-duplicates').check(); assert.match(await page.locator('#import-preview').textContent(), /更新 1/);
  await page.locator('#apply-import').click(); assert.equal(await page.locator('#nav-total').textContent(), '69');
  await page.locator('#reveal-button').click(); assert.equal(await page.locator('.answer-text').textContent(), '已更新的导入答案');
  await page.locator('#import-button').click(); await page.locator('#import-text').fill('{"cards":['); await page.locator('#preview-import').click();
  assert.equal(await page.locator('#apply-import').isDisabled(), true); await page.locator('#import-dialog [data-close]').click();
  passed('Duplicate skip/update and malformed import rejection');

  await page.locator('[data-nav="study"]').click();
  await page.locator('#shuffle-button').click(); assert.equal(await page.locator('#shuffle-button').getAttribute('aria-pressed'), 'true');
  await page.locator('#shuffle-button').click(); assert.equal(await page.locator('#current-question').textContent(), firstQuestion);
  await page.locator('#theme-button').click(); await screenshot(page, 'desktop-dark');
  await page.reload(); assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.locator('#theme-button').click(); passed('Shuffle restore and theme persistence');

  await page.locator('#focus-button').click();
  assert.equal(await page.locator('.hero').isVisible(), false);
  await screenshot(page, 'desktop-focus');
  await page.reload(); assert.equal(await page.locator('#focus-button').getAttribute('aria-pressed'), 'true');
  await page.locator('#focus-button').click(); assert.equal(await page.locator('.hero').isVisible(), true);
  passed('Focus mode hides overview and persists');

  const mobileContext = await browser.newContext({ locale: 'zh-CN' });
  const mobile = await mobileContext.newPage(); mobile.on('pageerror', err => errors.push(err.message));
  await mobile.setViewportSize({ width: 390, height: 844 }); await mobile.goto(url);
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await screenshot(mobile, 'mobile-study'); await mobile.locator('#menu-button').click();
  await mobile.locator('[data-category="记忆与上下文"]').click();
  assert.equal(await mobile.locator('#menu-button').getAttribute('aria-expanded'), 'false');
  await mobile.locator('#reveal-button').click(); await screenshot(mobile, 'mobile-answer');
  await mobile.locator('#add-button').click(); await screenshot(mobile, 'mobile-editor');
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await mobile.locator('#editor-dialog [data-close]').first().click(); passed('Mobile layout, navigation, answer and editor without horizontal overflow');

  const offline = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const filePage = await offline.newPage(); filePage.on('pageerror', err => errors.push(err.message));
  await offline.setOffline(true); await filePage.goto(pathToFileURL(path.join(root, 'index.html')).href);
  await filePage.locator('#current-question').waitFor();
  assert.equal(await filePage.locator('#nav-total').textContent(), '67');
  await filePage.locator('#reveal-button').click(); assert.ok((await filePage.locator('.answer-text').textContent()).length > 100);
  passed('Double-click file URL works completely offline');
  assert.deepEqual(errors, []); passed('No browser JavaScript errors');
  fs.writeFileSync(path.join(qa, 'results.json'), JSON.stringify({ passed: results, errors }, null, 2));
}
main().catch(err => { console.error(err); process.exitCode = 1; }).finally(async () => { if (browser) await browser.close(); server.kill(); });
