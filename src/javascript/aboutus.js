// --- Dropdown menus & mobile nav ---
// Reuse the same patterns used on other pages for consistency.
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

// --- Tiny enhancement: animate dots on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(ent => {
    if (ent.isIntersecting) ent.target.classList.add('pulse');
  });
}, { threshold: 0.8 });

document.querySelectorAll('.timeline .dot').forEach(d => observer.observe(d));


// Fallback list (used if API fails or is slow)
const fallbackEmojis = ["😋", "🍜", "🍤", "🍡", "🍦", "🥟", "🍢", "🍽️", "🍲"];

// Get a random emoji from API (EmojiHub) with fallback
async function getRandomEmoji() {
  try {
    const res = await fetch("https://emojihub.yurace.pro/api/random", { cache: "no-store" });
    if (!res.ok) throw new Error("Bad response");
    const data = await res.json();
    // EmojiHub returns htmlCode like ["&#x1F60B;"], which we can inject safely as HTML
    if (data && Array.isArray(data.htmlCode) && data.htmlCode[0]) {
      return { type: "html", value: data.htmlCode[0] };
    }
  } catch (err) {
    // fall through to local fallback
  }
  // Local fallback
  const value = fallbackEmojis[Math.floor(Math.random() * fallbackEmojis.length)];
  return { type: "text", value };
}

document.querySelectorAll('.emoji-wrap img').forEach(img => {
  img.addEventListener('mouseenter', () => spawnEmoji(img));
  img.addEventListener('click', () => spawnEmoji(img));
});

async function spawnEmoji(img) {
  const wrap = img.parentElement;
  const emoji = document.createElement('span');
  emoji.className = 'emoji';

  // Fetch from API (with fallback)
  const rnd = await getRandomEmoji();
  if (rnd.type === "html") {
    emoji.innerHTML = rnd.value;   // API provides an HTML entity (e.g., &#x1F60B;)
  } else {
    emoji.textContent = rnd.value; // fallback: plain unicode character
  }

  // random horizontal offset
  const offset = Math.random() * 40 - 20;
  emoji.style.left = (img.offsetWidth / 2 + offset) + "px";
  emoji.style.top = "0px";

  wrap.appendChild(emoji);

  // remove after animation
  setTimeout(() => emoji.remove(), 1000);
}


