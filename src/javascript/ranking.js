gsap.registerPlugin(ScrollTrigger);

// Force desired sequence regardless of HTML order
const ORDER = ['perak', 'penang', 'kedah', 'kelantan'];
const SPEED = 0.6; // smaller = faster (vertical distance reduced)

function setupOne(id) {
  const outer = document.querySelector(`#outer-${id}`);
  const track = document.querySelector(`#track-${id}`);
  if (!outer || !track) return;

  // compute travel (negative) and distance (positive)
  const travelX = () => Math.min(0, outer.clientWidth - track.scrollWidth);
  const distance = () => Math.abs(travelX());

  if (track.scrollWidth <= outer.clientWidth) return;

  gsap.to(track, {
    x: () => travelX(),
    ease: 'none',
    scrollTrigger: {
      trigger: outer,
      start: 'top-=150 top',
      end: () => '+=' + (distance() * SPEED + 200),
      pin: true,
      pinSpacing: true,
      scrub: true,
      anticipatePin: 1,
    }
  });
}

// Init in forced order
ScrollTrigger.getAll().forEach(t => t.kill());
ORDER.forEach(setupOne);
// Recalculate after images load (important for new sizes)
window.addEventListener('load', () => ScrollTrigger.refresh());
window.addEventListener('resize', () => ScrollTrigger.refresh(), { passive: true });


// dropdown open/close
document.querySelectorAll('.menu-toggle').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const menu = btn.closest('.menu');
    const isOpen = menu.classList.contains('open');

    // close others
    document.querySelectorAll('.menu.open').forEach(m => {
      m.classList.remove('open');
      const t = m.querySelector('.menu-toggle');
      if (t) t.setAttribute('aria-expanded', 'false');
    });

    // toggle this one
    if (!isOpen) {
      menu.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    } else {
      btn.setAttribute('aria-expanded', 'false');
    }
  });
});

// click outside to close
document.addEventListener('click', (e) => {
  if (!e.target.closest('.menu')) {
    document.querySelectorAll('.menu.open').forEach(m => {
      m.classList.remove('open');
      const t = m.querySelector('.menu-toggle');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }
});

// Esc to close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.menu.open').forEach(m => {
      m.classList.remove('open');
      const t = m.querySelector('.menu-toggle');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }
});

// Mobile hamburger toggle
const nav = document.querySelector('nav');
const navToggle = document.querySelector('.nav-toggle');
const navPanel = document.querySelector('.nav-panel');

if (navToggle) {
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = nav.classList.toggle('nav--open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  // close panel on outside click / Esc
  document.addEventListener('click', (e) => {
    if (!e.target.closest('nav')) {
      nav.classList.remove('nav--open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      nav.classList.remove('nav--open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

