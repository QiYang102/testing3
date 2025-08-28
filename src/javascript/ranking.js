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



// dropdown toggle
document.querySelectorAll('.menu-toggle').forEach((btn) => {
  btn.addEventListener('click', () => {
    const menu = btn.closest('.menu');
    const isOpen = menu.classList.contains('open');

    document.querySelectorAll('.menu.open').forEach(m => {
      m.classList.remove('open');
      const t = m.querySelector('.menu-toggle');
      if (t) t.setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      menu.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    } else {
      btn.setAttribute('aria-expanded', 'false');
    }
  });
});

// close dropdown outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.menu')) {
    document.querySelectorAll('.menu.open').forEach(m => {
      m.classList.remove('open');
      const t = m.querySelector('.menu-toggle');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }
});

// Esc closes dropdown
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.menu.open').forEach(m => {
      m.classList.remove('open');
      const t = m.querySelector('.menu-toggle');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }
});

// highlight parent if child is active
document.querySelectorAll('.menu').forEach(menu => {
  const activeChild = menu.querySelector('.menu-list a.active');
  if (activeChild) {
    const toggleBtn = menu.querySelector('.menu-toggle');
    if (toggleBtn) toggleBtn.classList.add('active');
  }
});

// burger toggle
const burgerInput = document.getElementById("burger");
const nav = document.querySelector("nav");

burgerInput.addEventListener("change", () => {
  if (burgerInput.checked) {
    nav.classList.add("nav--open");
  } else {
    nav.classList.remove("nav--open");
  }
});

// active link highlight on click
const navLinks = document.querySelectorAll('.links a, .menu-list a');
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    navLinks.forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.menu-toggle').forEach(mt => mt.classList.remove('active'));

    e.target.classList.add('active');

    const parentMenu = e.target.closest('.menu');
    if (parentMenu) {
      const toggleBtn = parentMenu.querySelector('.menu-toggle');
      if (toggleBtn) toggleBtn.classList.add('active');
    }
  });
});



