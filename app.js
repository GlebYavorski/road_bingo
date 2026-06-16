const CHANNEL = "@carpemachinatio";
const NEEDED = 24;

let LANG = 'ru';                 // текущий язык интерфейса/списка
const S = () => STRINGS[LANG];   // строки активного языка

// --- Язык: приоритет ?lang= -> localStorage -> navigator.language -> ru ---
function resolveInitialLang() {
  const q = new URLSearchParams(location.search).get('lang');
  if (q === 'ru' || q === 'en') return q;
  try {
    const saved = localStorage.getItem('lang');
    if (saved === 'ru' || saved === 'en') return saved;
  } catch (e) { /* localStorage недоступен */ }
  return (navigator.language || 'ru').toLowerCase().startsWith('ru') ? 'ru' : 'en';
}

// Подставить статичные строки в DOM, заголовок и атрибут <html lang>.
function applyStaticStrings() {
  const s = S();
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const v = s[el.getAttribute('data-i18n')];
    if (typeof v === 'string') el.textContent = v;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const v = s[el.getAttribute('data-i18n-html')];
    if (typeof v === 'string') el.innerHTML = v;
  });
  document.title = s.docTitle;
  document.documentElement.setAttribute('lang', LANG);
}

function updateLangButton() {
  const btn = document.querySelector('.lang-toggle');
  if (!btn) return;
  btn.textContent = LANG === 'ru' ? 'EN' : 'RU';
  btn.title = S().langToggleTitle;
  btn.setAttribute('aria-label', S().langToggleTitle);
}

function setLang(l, fromUser) {
  if (l !== 'ru' && l !== 'en') l = 'ru';
  const ta = document.getElementById('words');
  // Если в поле всё ещё стандартный список — подменяем на список нового языка.
  // Кастомный (отредактированный или из ?list=) не трогаем.
  const wasAtDefault = ta.value.trim() === WORDS[LANG].trim();
  LANG = l;
  if (fromUser) { try { localStorage.setItem('lang', l); } catch (e) { /* недоступно */ } }
  if (wasAtDefault) ta.value = WORDS[LANG];
  applyStaticStrings();
  updateLangButton();
  updateThemeButton();   // подписи кнопки темы тоже локализованы
  updateCounter();
  render();
}
function toggleLang() { setLang(LANG === 'ru' ? 'en' : 'ru', true); }

// --- Тема: автодетект системной + ручное переключение (localStorage) ---
function systemPrefersDark() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}
function currentTheme() {
  const explicit = document.documentElement.getAttribute('data-theme');
  if (explicit === 'dark' || explicit === 'light') return explicit;
  return systemPrefersDark() ? 'dark' : 'light';
}
function updateThemeButton() {
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;
  const dark = currentTheme() === 'dark';
  btn.textContent = dark ? '☀️' : '🌙';
  btn.title = dark ? S().themeToLight : S().themeToDark;
}
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  try { localStorage.setItem('theme', t); } catch (e) { /* недоступно */ }
  updateThemeButton();
}
function toggleTheme() {
  applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
}

// Разбор строки: ведущие эмодзи (до первой буквы) -> картинка, остальное -> подпись.
function parseLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;
  const m = trimmed.match(/[A-Za-zА-Яа-яЁё]/);
  if (!m) return { emoji: trimmed, label: "" };
  const idx = m.index;
  const emoji = trimmed.slice(0, idx).trim();
  const label = trimmed.slice(idx).trim();
  return { emoji: emoji || "•", label };
}

function parseAll() {
  return document.getElementById('words').value
    .split('\n').map(parseLine).filter(Boolean);
}

// Кол-во эмодзи-знаков (с учётом ZWJ/флагов через сегментацию).
function emojiCount(str) {
  if (window.Intl && Intl.Segmenter) {
    const seg = new Intl.Segmenter("ru", { granularity: "grapheme" });
    return [...seg.segment(str)].filter(s => s.segment.trim()).length;
  }
  return [...str].filter(c => c.trim()).length;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function cellHtml(item) {
  const n = emojiCount(item.emoji);
  const cls = n >= 3 ? "emoji three" : (n === 2 ? "emoji two" : "emoji");
  return '<div class="cell"><div class="' + cls + '">' + item.emoji +
         '</div><div class="label">' + escapeHtml(item.label) + '</div></div>';
}

function makeCard(idx, items) {
  const picks = shuffle(items).slice(0, 24);
  const cells = [];
  let p = 0;
  for (let i = 0; i < 25; i++) {
    if (i === 12) {
      cells.push('<div class="cell free"><div class="emoji">🚗</div><div class="label">' +
                 escapeHtml(S().freeLabel) + '</div></div>');
    } else {
      cells.push(cellHtml(picks[p++]));
    }
  }
  return '<div class="card"><h2>' + escapeHtml(S().cardTitle(idx + 1)) +
         '</h2><div class="grid">' + cells.join('') +
         '</div><div class="footer">Telegram: ' + CHANNEL + '</div></div>';
}

function updateCounter() {
  const n = parseAll().length;
  const el = document.getElementById('counter');
  if (n >= NEEDED) {
    el.className = "counter ok";
    el.textContent = S().counterOk(n);
  } else {
    el.className = "counter bad";
    el.textContent = S().counterBad(n);
  }
}

// --- "Грязное" состояние: список изменён, карточки ещё не пересобраны ---
let lastRendered = null;
function markDirty() {
  const dirty = document.getElementById('words').value !== lastRendered;
  document.getElementById('genBtn').classList.toggle('attn', dirty);
  document.getElementById('dirtyNote').classList.toggle('show', dirty);
}
function clearDirty() {
  lastRendered = document.getElementById('words').value;
  document.getElementById('genBtn').classList.remove('attn');
  document.getElementById('dirtyNote').classList.remove('show');
}
function resetList() {
  document.getElementById('words').value = WORDS[LANG];
  updateCounter();
  render();
}

function render() {
  const items = parseAll();
  updateCounter();
  clearDirty();
  if (items.length < NEEDED) {
    document.getElementById('cards').innerHTML = "";
    return;
  }
  let count = parseInt(document.getElementById('count').value, 10) || 8;
  count = Math.max(1, Math.min(40, count));
  const out = [];
  for (let i = 0; i < count; i++) out.push(makeCard(i, items));
  document.getElementById('cards').innerHTML = out.join('');
}

// --- URL-параметр ?list= (base64, UTF-8 safe) ---
function encodeList(text) { return btoa(unescape(encodeURIComponent(text))); }
function decodeList(b64) { return decodeURIComponent(escape(atob(b64))); }

function copyShareLink() {
  const url = location.origin + location.pathname + "?lang=" + LANG + "&list=" +
              encodeURIComponent(encodeList(document.getElementById('words').value));
  navigator.clipboard?.writeText(url).then(
    () => alert(S().shareCopied(url.length)),
    () => prompt(S().copyManual, url)
  ) || prompt(S().copyManual, url);
}

// --- Инициализация ---
(function init() {
  LANG = resolveInitialLang();

  const l = new URLSearchParams(location.search).get('list');
  let initial = WORDS[LANG];
  if (l) {
    try { initial = decodeList(l); } catch (e) { /* битый параметр — дефолт */ }
  }
  const ta = document.getElementById('words');
  ta.value = initial;
  ta.addEventListener('input', () => { updateCounter(); markDirty(); });

  applyStaticStrings();
  updateLangButton();

  // Тема: показать правильную иконку и следить за системной, пока выбор не сделан вручную.
  updateThemeButton();
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (!document.documentElement.getAttribute('data-theme')) updateThemeButton();
    });
  }

  render();
})();
