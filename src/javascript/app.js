gsap.registerPlugin(ScrollTrigger);

const cameFromMain =
  sessionStorage.getItem('from_main') === '1' ||
  /\/main\.html(\?|#|$)/.test(document.referrer);

document.body.classList.add("no-scroll");

document.addEventListener('DOMContentLoaded', (e) => {

  if (cameFromMain) {
    // keep the flag for refresh; clear it AFTER the loader plays once if you want
    // sessionStorage.removeItem('from_main'); // uncomment to play only once per visit


    function startLoader() {
      let counterElement = document.querySelector(".counter");
      let currentValue = 0;
      function updateCounter() {
        if (currentValue === 100) return;
        currentValue += Math.floor(Math.random() * 10) + 5;
        if (currentValue > 100) currentValue = 100;
        counterElement.textContent = currentValue;
        let delay = Math.floor(Math.random() * 200) + 50;
        setTimeout(updateCounter, delay);
      }
      updateCounter();
    }
    startLoader();

    const timeline = gsap.timeline();
    timeline.to(".bar", {
      height: 0,
      duration: 1.5,
      stagger: { amount: 0.5 },
      ease: "power4.inOut",
      onStart: () => { window.scrollTo({ top: 0, behavior: "auto" }); },
      onComplete: () => {
        document.querySelector(".overlay")?.remove();
        document.body.classList.remove("no-scroll");
      }
    }, 2);

    timeline.to(".counter", { opacity: 0, duration: 0.25 }, 2);

    timeline
      .from(".video", { yPercent: 10, opacity: 0, duration: 1.5, ease: "expo.out" }, ">")
      .from("nav", { yPercent: 10, opacity: 0, duration: 1.5, ease: "expo.out" }, "<");

    sessionStorage.setItem('from_main', '0');
  } else {
    document.querySelector(".counter")?.remove();
    document.querySelector(".overlay")?.remove();
    document.body.classList.remove("no-scroll");
  }


  ScrollTrigger.matchMedia({
    // desktop
    "(min-width: 769px)": function () {
      gsap.to('.left-image', {
        x: -400,
        rotation: -30,
        scrollTrigger: { trigger: '.top-place', scrub: true, start: 'top center', end: '150% bottom' }
      });
      gsap.to('.right-image', {
        x: 400,
        rotation: 30,
        scrollTrigger: { trigger: '.top-place', scrub: true, start: 'top center', end: '150% bottom' }
      });
    },

    // mobile
    "(max-width: 768px)": function () {
      gsap.to('.left-image', {
        x: -100,
        rotation: -10,
        scrollTrigger: { trigger: '.top-place', scrub: true, start: 'top center', end: '150% bottom' }
      });
      gsap.to('.right-image', {
        x: 100,
        rotation: 10,
        scrollTrigger: { trigger: '.top-place', scrub: true, start: 'top center', end: '150% bottom' }
      });
    }
  });

  const contentSplit = new SplitText('.top-place > p ', { type: 'lines' });

  gsap.fromTo(
    contentSplit.lines,
    { opacity: 0, yPercent: 100 },
    {
      opacity: 1,
      yPercent: 0,
      ease: "none",
      stagger: 0.06,
      scrollTrigger: {
        trigger: ".top-place p",
        start: "top 80%",
        end: "top 20%",
        scrub: true,
      }
    }
  )

  const scrollers = document.querySelectorAll(".scroller");

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    scrollers.forEach((scroller) => {
      scroller.setAttribute("data-animated", "true");

      const inner = scroller.querySelector(".scroller__inner");
      const cards = [...inner.children];

      // duplicate cards once for smooth looping
      cards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        inner.appendChild(clone);
      });
    });
  }



  const tl = gsap.timeline({
    delay: 0.1, scrollTrigger: {
      trigger: '.top-food',
      start: 'top 30%',
    }
  });
  const contentSplit1 = new SplitText('.food1-content p ', { type: 'lines' });

  tl.from('.food1', {
    yPercent: 10,
    opacity: 0,
    duration: 1.5,
    ease: 'expo.out',
  }, 0);
  tl.from(contentSplit1.lines, {
    opacity: 0,
    yPercent: 100,
    duration: 1.5,
    ease: 'expo.out',
    stagger: 0.06,
  }, 0);



  const contentSplit2 = new SplitText('.food2-content p ', { type: 'lines' });
  const contentSplit3 = new SplitText('.food3-content p ', { type: 'lines' });

  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".food2and3",
      start: "-80% top",
    }
  });

  tl2.from(".food2", {
    yPercent: 10,
    opacity: 0,
    duration: 1.5,
    ease: 'expo.out',
  }, 0)
    .from(contentSplit2.lines, {
      opacity: 0,
      yPercent: 100,
      duration: 1.5,
      ease: "expo.out",
      stagger: 0.06
    }, 0)
    .from(".food3", {
      yPercent: 10,
      opacity: 0,
      duration: 1.5,
      ease: 'expo.out',
    }, 0)
    .from(contentSplit3.lines, {
      opacity: 0,
      yPercent: 100,
      duration: 1.5,
      ease: "expo.out",
      stagger: 0.06
    }, 0);

})

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