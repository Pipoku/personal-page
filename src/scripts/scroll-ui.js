const progress = document.getElementById('scroll-progress');
const backToTop = document.getElementById('back-to-top');

function onScroll() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  const p = max > 0 ? doc.scrollTop / max : 0;
  progress.style.transform = `scaleX(${p})`;
  backToTop.classList.toggle('visible', doc.scrollTop > 600);
}

onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const navLinks = [...document.querySelectorAll('.nav__links a[href^="#"], .nav__mobile a[href^="#"]')];
const sections = [...document.querySelectorAll('main section[id]')].filter((s) =>
  navLinks.some((a) => a.getAttribute('href') === `#${s.id}`)
);

const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((a) => {
        const active = a.getAttribute('href') === `#${id}`;
        a.classList.toggle('active', active);
        a.setAttribute('aria-current', active ? 'true' : 'false');
      });
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach((s) => spy.observe(s));