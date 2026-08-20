let ctx = null;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export async function initFunFx() {
  if (ctx || typeof window === 'undefined' || prefersReducedMotion()) return;
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  ctx = gsap.context(() => {
    gsap.utils.toArray('[data-fun-fx="title"]').forEach((el) => {
      const glow = gsap.fromTo(
        el,
        { textShadow: '0 0 0px rgba(255, 140, 26, 0)' },
        {
          textShadow: '0 0 26px rgba(255, 140, 26, 0.55), 0 0 60px rgba(255, 217, 61, 0.35)',
          duration: 1,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: 1,
        }
      );
      glow.pause();
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => glow.play(),
      });
    });

    const name = document.querySelector('[data-fun-fx="hero"]');
    if (name) {
      gsap.to(name, {
        textShadow: '0 0 36px rgba(255, 217, 61, 0.7), 0 0 80px rgba(255, 111, 199, 0.4)',
        duration: 1.8,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
    }
  });
}

export function destroyFunFx() {
  if (!ctx) return;
  ctx.revert();
  ctx = null;
}