// === favourite.js (final) ===

// === STORAGE KEYS ===
const FAV_KEY = "favouriteFoods";
const COOKIE_NAME = "user_preferences";

// Helpers
const getFavourites = () => JSON.parse(localStorage.getItem(FAV_KEY)) || [];
const setFavourites = (arr) => localStorage.setItem(FAV_KEY, JSON.stringify(arr));

// === Save to localStorage ===
function saveFavourite(food) {
  const favs = getFavourites();
  if (!favs.some(f => String(f.id) === String(food.id))) {
    favs.push({ id: String(food.id), name: food.name, image: food.image });
    setFavourites(favs);
    console.log(`${food.name} added to favourites!`);
  } else {
    console.log(`${food.name} is already in your favourites.`);
  }
  renderFavourites();
}

// === Remove one favourite ===
function removeFromFavourites(id) {
  const favs = getFavourites().filter(f => String(f.id) !== String(id));
  setFavourites(favs);
  renderFavourites();
}

// === Remove all favourites ===
function removeAllFavourites() {
  // get favourites from localStorage
  let favourites = JSON.parse(localStorage.getItem(FAV_KEY)) || [];

  if (favourites.length === 0) {
    alert("No food to remove because no favourites have been added.");
    return; // stop here
  }

  if (!confirm("Are you sure you want to remove all favourites?")) return;

  // clear all favourites
  localStorage.removeItem(FAV_KEY);
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;

  renderFavourites();
  alert("All favourites cleared!");
}


// === Render favourites list ===
function renderFavourites() {
  const container = document.getElementById("favourites-container");
  if (!container) return;

  const removeAllBtn = document.getElementById("removeAllBtn");
  const favourites = getFavourites();

  if (favourites.length === 0) {
    container.innerHTML = `<p class="no-favourites">No favourite foods added yet.</p>`;
    if (removeAllBtn) removeAllBtn.style.display = "none";
    return;
  }

  // Build grid (4 per row handled by CSS)
  container.innerHTML = favourites.map(food => `
    <div class="food-item">
      <img src="${food.image}" alt="${food.name}" class="food-img" />
      <h3 class="food-name">${food.name}</h3>
      <button type="button" class="btn-remove" data-id="${food.id}">Remove</button>
    </div>
  `).join("");

  if (removeAllBtn) removeAllBtn.style.display = "block";
}



// === Social Sharing ===
function shareOnFacebook() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
}

function shareOnTwitter() {
  const text = "Check out my favourite Malaysian foods!";
  const url = encodeURIComponent(window.location.href);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
}

// === Cookie Utilities ===
function setCookie(name, value, days = 7) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = `${name}=${value};${expires};path=/`;
}

function getCookie(name) {
  const nameEQ = name + "=";
  return document.cookie
    .split(";")
    .map(c => c.trim())
    .find(c => c.indexOf(nameEQ) === 0)
    ?.substring(nameEQ.length) || null;
}

// === Initialize on Page Load ===
document.addEventListener("DOMContentLoaded", () => {
  renderFavourites();
  setCookie(COOKIE_NAME, "visited_favourites", 7);

  // Event delegation for item Remove buttons (robust after re-renders)
  const container = document.getElementById("favourites-container");
  if (container) {
    container.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-remove");
      if (!btn) return;
      removeFromFavourites(btn.dataset.id);
    });
  }

  // Static "Remove All" button hookup
  const removeAllBtn = document.getElementById("removeAllBtn");
  if (removeAllBtn) {
    removeAllBtn.addEventListener("click", removeAllFavourites);
  }

  // Debug
  console.log("LocalStorage:", localStorage.getItem(FAV_KEY));
  console.log("Cookies:", getCookie(COOKIE_NAME));
});









//Qiyang code
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



