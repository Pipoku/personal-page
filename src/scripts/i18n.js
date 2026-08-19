import { translations, languages, defaultLang } from '../i18n/translations.js';

const STORAGE_KEY = 'rc-lang';

export function currentLang() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && languages.includes(stored)) return stored;
  return (navigator.language || defaultLang).toLowerCase().startsWith('es') ? 'es' : defaultLang;
}

export function applyLang(lang) {
  const dict = translations[lang] ?? translations[defaultLang];

  document.documentElement.lang = lang;
  document.title = dict['meta.title'];

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    const value = dict[key] ?? translations[defaultLang][key];
    const attr = el.dataset.i18nAttr;
    if (attr) el.setAttribute(attr, value);
    else el.textContent = value;
  });

  document.querySelectorAll('[data-i18n-roles]').forEach((el) => {
    el.dataset.roles = JSON.stringify(dict['roles']);
  });

  document.querySelectorAll('[data-lang-btn]').forEach((btn) => {
    const active = btn.dataset.langBtn === lang;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });

  document.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang } }));
}

export function setLang(lang) {
  if (!languages.includes(lang)) return;
  localStorage.setItem(STORAGE_KEY, lang);
  applyLang(lang);
}

applyLang(currentLang());

window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY) applyLang(currentLang());
});