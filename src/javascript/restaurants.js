// ---------- DATA ----------

const restaurants = [
  // ===== PERAK (Ipoh-focused) =====
  {
    id: "ipoh-bean-sprout-kitchen",
    name: "Ipoh Bean Sprout Kitchen",
    desc: "Classic chicken rice with crunchy tauge — simple, comforting, iconic.",
    rating: 4.6,
    loves: 874,
    img: "elements/image/Ipoh Bean Sprout Kitchen.jpg",
    state: "perak",
    halal: true,
    hours: "Daily: 10:00 AM – 10:00 PM",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1019041.4394189307!2d101.26627504999999!3d3.8890882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31caed69d122ae31%3A0xdbf10681533f55e7!2z5aOp576F6Iq96I-c6bih5rKZ5rKz57KJ!5e0!3m2!1szh-CN!2smy!4v1756224121496!5m2!1szh-CN!2smy",
    priceMYR: 15
  },
  {
    id: "nam-heritage-kopitiam",
    name: "Nam Heritage Kopitiam",
    desc: "White coffee, egg tarts, and nostalgic breakfast plates.",
    rating: 4.4,
    loves: 721,
    img: "elements/image/Nam Heritage Kopitiam.jpg",
    state: "perak",
    halal: false,
    hours: "Mon–Sun: 7:30 AM – 6:00 PM",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1018077.6620343974!2d100.55916926562502!3d4.618007599999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31caec7bf9a30957%3A0x34496024fdd1f809!2z5Y2X6aaZ6Iy26aSQ5a6k!5e0!3m2!1szh-CN!2smy!4v1756224146383!5m2!1szh-CN!2smy",
    priceMYR: 12
  },
  {
    id: "riverfront-dimsum-house",
    name: "Riverfront Dim Sum House",
    desc: "Steamed baskets and baked bites by the morning rush.",
    rating: 4.5,
    loves: 665,
    img: "elements/image/Riverfront Dim Sum House.jpg",
    state: "perak",
    halal: false,
    hours: "Daily: 6:30 AM – 2:00 PM",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1018077.6620343974!2d100.55916926562502!3d4.618007599999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cae3005d817893%3A0xe71cf3a239d4d7a4!2z55qH5pmo5omL5bel54K55b-D!5e0!3m2!1szh-CN!2smy!4v1756224185879!5m2!1szh-CN!2smy",
    priceMYR: 20
  },
  {
    id: "assam-house-perak",
    name: "Assam House Perak",
    desc: "Signature asam curries and wok-fried local favorites.",
    rating: 4.3,
    loves: 542,
    img: "elements/image/Assam House Perak.jpg",
    state: "perak",
    halal: true,
    hours: "Tue–Sun: 11:00 AM – 10:00 PM (Mon closed)",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15908.168903564769!2d101.10200825000003!3d4.586443899999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31caec6006a13edd%3A0x307c999ef9b3a24e!2sASSAM%20HOUSE%20RESTAURANT!5e0!3m2!1szh-CN!2smy!4v1756224218545!5m2!1szh-CN!2smy",
    priceMYR: 25
  },
  {
    id: "kampua-and-kungfu-hor-fun",
    name: "Kampua & Kungfu Hor Fun",
    desc: "Silky hor fun with smoky wok hei; comforting soups and sides.",
    rating: 4.2,
    loves: 498,
    img: "elements/image/Kampua & Kungfu Hor Fun.jpg",
    state: "perak",
    halal: false,
    hours: "Daily: 10:30 AM – 9:30 PM",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.9853079530503!2d101.07868999999998!3d4.596654399999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31caed80cd76e3fb%3A0x6d352288e2c26508!2z5Yqf5aSr6Iy26aSQ5buz!5e0!3m2!1szh-CN!2smy!4v1756224245735!5m2!1szh-CN!2smy",
    priceMYR: 18
  },

  // ===== PENANG (George Town-focused) =====
  {
    id: "georgetown-heritage-bistro",
    name: "George Town Heritage Bistro",
    desc: "Peranakan-inspired plates in a shophouse setting.",
    rating: 4.7,
    loves: 1123,
    img: "elements/image/George Town Heritage Bistro.jpg",
    state: "penang",
    halal: false,
    hours: "Tue–Sun: 12:00 PM – 10:00 PM (Mon closed)",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31776.07699481453!2d100.33244101520323!3d5.415503032421623!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304ac3aba67e8d57%3A0xe608ea754ab71aa7!2sHeritage%20Cafe!5e0!3m2!1szh-CN!2smy!4v1756223027050!5m2!1szh-CN!2smy",
    priceMYR: 35
  },
  {
    id: "chulia-street-noodles",
    name: "Chulia Street Noodles",
    desc: "Late-night char kway teow and wonton noodles.",
    rating: 4.5,
    loves: 987,
    img: "elements/image/Chulia Street Noodles.jpg",
    state: "penang",
    halal: false,
    hours: "Daily: 6:00 PM – 1:00 AM",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.994690437665!2d100.3371176!3d5.4177748999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304ac391b4eec9f7%3A0x8df7eaa0a0f58e3e!2z6JGJ6bq16Iy25a6k!5e0!3m2!1szh-CN!2smy!4v1756223085183!5m2!1szh-CN!2smy",
    priceMYR: 12
  },
  {
    id: "peranakan-old-school",
    name: "Peranakan Old School",
    desc: "Grandma’s recipes: pongteh, laksa lemak, and kuih selection.",
    rating: 4.6,
    loves: 1034,
    img: "elements/image/PeranakanOld School.jpg",
    state: "penang",
    halal: true,
    hours: "Wed–Mon: 11:30 AM – 3:00 PM, 6:00 PM – 9:30 PM",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.992730441054!2d100.3424462!3d5.418073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304ac38f1f13997d%3A0xfe62ceb9c5769da8!2sAuntie%20Gaik%20Lean&#39;s%20Old%20School%20Eatery!5e0!3m2!1szh-CN!2smy!4v1756223135867!5m2!1szh-CN!2smy",
    priceMYR: 28
  },
  {
    id: "gurney-seafood-lane",
    name: "Gurney Seafood Lane",
    desc: "Sea breeze, seafood grills, and hawker favourites.",
    rating: 4.3,
    loves: 812,
    img: "elements/image/Gurney Seafood Lane.jpg",
    state: "penang",
    halal: true,
    hours: "Daily: 5:00 PM – 11:00 PM",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15887.352041712891!2d100.30894825929282!3d5.441553320226126!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304ac32014fe2bdb%3A0x22b8bd8363297927!2z5p2x5pa55rW36a6u6Iir!5e0!3m2!1szh-CN!2smy!4v1756223209152!5m2!1szh-CN!2smy",
    priceMYR: 40
  },
  {
    id: "penang-road-dessert-bar",
    name: "Penang Road Dessert Bar",
    desc: "Chendul, ais kacang, and tropical sweets.",
    rating: 4.4,
    loves: 876,
    img: "elements/image/Penang Road Dessert Bar.jpg",
    state: "penang",
    halal: true,
    hours: "Daily: 11:00 AM – 8:30 PM",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63551.98676549734!2d100.2621007216797!3d5.41709310000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304ac398372e414f%3A0x895e8e8972409315!2sRoots%20Dessert%20Cafe!5e0!3m2!1szh-CN!2smy!4v1756223288938!5m2!1szh-CN!2smy",
    priceMYR: 10
  },

  // ===== KELANTAN (Kota Bharu-focused) =====
  {
    id: "kb-nasi-kerabu-garden",
    name: "Kak Ma Cherang Station",
    desc: "Blue rice, fresh herbs, solok lada — Kelantan on a plate.",
    rating: 4.6,
    loves: 665,
    img: "elements/image/Kak Ma Cherang Station.jpg",
    state: "kelantan",
    halal: true,
    hours: "Daily: 8:00 AM – 4:00 PM",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253891.21446857532!2d102.0162983007451!3d6.123943200000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31b6b03970a0441f%3A0x45c5484788b7b307!2sKak%20Ma%20Nasi%20Kerabu%20Cherang!5e0!3m2!1szh-CN!2smy!4v1756223440584!5m2!1szh-CN!2smy",
    priceMYR: 15
  },
  {
    id: "ayam-percik-riverview",
    name: "Ayam Percik Riverview",
    desc: "Smoky grilled chicken slathered in rich percik sauce.",
    rating: 4.5,
    loves: 593,
    img: "elements/image/Ayam Percik Riverview.jpg",
    state: "kelantan",
    halal: true,
    hours: "Tue–Sun: 11:00 AM – 10:00 PM",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253991.16892494028!2d101.93997959453125!3d5.909981600000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31b6998441a349bf%3A0xf5447ed263f1c780!2sAyam%20Percik%20Warisan%20Mek%20Wohid!5e0!3m2!1szh-CN!2smy!4v1756223543637!5m2!1szh-CN!2smy",
    priceMYR: 22
  },
  {
    id: "nasi-ulum-classic",
    name: "Nasi Ulam Classic",
    desc: "Herbaceous rice, budu, and kampung sides — homestyle comfort.",
    rating: 4.3,
    loves: 512,
    img: "elements/image/Nasi Ulam Classic.jpg",
    state: "kelantan",
    halal: true,
    hours: "Daily: 10:00 AM – 9:00 PM",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253887.45073397545!2d101.93271439453125!3d6.1318545000000055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31b6afcecc9d2c09%3A0x7825cc6aad34bed0!2sRestoran%20Nasi%20Ulam%20Cikgu!5e0!3m2!1szh-CN!2smy!4v1756223612324!5m2!1szh-CN!2smy",
    priceMYR: 18
  },
  {
    id: "laksam-lovers",
    name: "Laksam Lovers",
    desc: "Rice noodle rolls in creamy, fish-based gravy — Kelantan specialty.",
    rating: 4.2,
    loves: 486,
    img: "elements/image/Lasksam Lovers.jpg",
    state: "kelantan",
    halal: true,
    hours: "Wed–Mon: 9:00 AM – 6:00 PM (Tue closed)",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253942.26373919204!2d101.86133729453124!3d6.015614999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31b6a3ff7fe15ca9%3A0xe43361416410b420!2sKedai%20Laksam%20Telur%20Puyuh%20Best%20Kelar!5e0!3m2!1szh-CN!2smy!4v1756223677740!5m2!1szh-CN!2smy",
    priceMYR: 12
  },

  // ===== KEDAH (Alor Setar-focused) =====
  {
    id: "alor-setar-mee-rebus-hub",
    name: "Alor Setar Mee Rebus Hub",
    desc: "Thick, savory gravy over springy noodles; local favourite.",
    rating: 4.5,
    loves: 733,
    img: "elements/image/Alor Setar Mee Rebus Hub.png",
    state: "kedah",
    halal: true,
    hours: "Daily: 11:00 AM – 11:00 PM",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126946.42599030024!2d100.24972399726562!3d6.120497999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304b45f37d2da759%3A0x20c428c8cd47573f!2sDawood%20Mee%20Rebus!5e0!3m2!1szh-CN!2smy!4v1756223760523!5m2!1szh-CN!2smy",
    priceMYR: 16
  },
  {
    id: "kedah-nasi-lemak-station",
    name: "Kedah Nasi Lemak Station",
    desc: "Fragrant coconut rice with sambal, fried chicken, and sides.",
    rating: 4.4,
    loves: 645,
    img: "elements/image/Kedah Nasi Lemak Station.jpg",
    state: "kedah",
    halal: true,
    hours: "Daily: 7:00 AM – 3:00 PM",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126941.22114847829!2d100.24116629726561!3d6.142366400000008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304b5b29ebb03ba5%3A0x255dd6dfd452e8ca!2sAlor%20Setar%20Breakfast%20Station!5e0!3m2!1szh-CN!2smy!4v1756223861954!5m2!1szh-CN!2smy",
    priceMYR: 10
  },
  {
    id: "medina-thai-palace-as",
    name: "Medina Thai Palace",
    desc: "Tom yum, pandan chicken, and mango sticky rice in a cozy hall.",
    rating: 4.3,
    loves: 574,
    img: "elements/image/Medina Thai Palace.jpg",
    state: "kedah",
    halal: true,
    hours: "Tue–Sun: 12:00 PM – 10:00 PM (Mon closed)",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.020479127567!2d100.37361990118248!3d6.127946233060415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304b44c8387d9835%3A0x6c27e30e28938d11!2sMedina%20Thai%20Palace%20Alor%20Setar!5e0!3m2!1szh-CN!2smy!4v1756223902406!5m2!1szh-CN!2smy",
    priceMYR: 25
  },
];


// ---------- STARS ----------
const STAR_FULL = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.786 1.402 8.171L12 18.896l-7.336 3.871 1.402-8.171L.132 9.21l8.2-1.192L12 .587z"/></svg>`;
const STAR_EMPTY = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3.2l2.95 5.97 6.6.96-4.78 4.64 1.13 6.58L12 18.9l-5.9 3.45 1.13-6.58-4.78-4.64 6.6-.96L12 3.2z"/></svg>`;
const STAR_HALF = `<svg viewBox="0 0 24 24"><defs><linearGradient id="g"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs><path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.786 1.402 8.171L12 18.896l-7.336 3.871 1.402-8.171L.132 9.21l8.2-1.192L12 .587z" fill="url(#g)" stroke="currentColor" stroke-width="0.6"/></svg>`;

function renderStars(score) {
  const full = Math.floor(score);
  const hasHalf = score - full >= 0.25 && score - full < 0.75;
  const out = [];
  for (let i = 0; i < full; i++) out.push(STAR_FULL);
  if (hasHalf) out.push(STAR_HALF);
  while (out.length < 5) out.push(STAR_EMPTY);
  return out.join("");
}

// ---------- LIKES (localStorage) ----------
const LIKE_KEY = "likes_v1";
const likes = JSON.parse(localStorage.getItem(LIKE_KEY) || "{}"); // { id: true }

const setLiked = (id, liked) => {
  if (liked) likes[id] = true; else delete likes[id];
  localStorage.setItem(LIKE_KEY, JSON.stringify(likes));
};
const isLiked = id => !!likes[id];

// ---------- CARD RENDER ----------
const foodGrid = document.querySelector(".food");

function makeCard(r) {
  const el = document.createElement("div");
  el.className = "food-col";
  el.dataset.state = r.state;
  el.dataset.halal = r.halal ? "true" : "false";
  el.dataset.id = r.id;

  const liked = isLiked(r.id);
  const extra = liked ? 1 : 0;

  el.innerHTML = `
    <div class="card-media"><img src="${r.img}" alt="${r.name}"></div>
    <div class="card-body">
      <h3 class="card-name">${r.name}</h3>
      <p class="card-desc">${r.desc}</p>
      <div class="card-meta">
        <div class="stars" title="${r.rating.toFixed(1)}">
          ${renderStars(r.rating)} <span class="score">${r.rating.toFixed(1)}</span>
        </div>
        <button class="love ${liked ? 'active' : ''}" data-id="${r.id}" aria-pressed="${liked ? 'true' : 'false'}" title="Love">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.1 21.35l-1.1-1.02C5.14 14.88 2 12.06 2 8.5 2 6 4 4 6.5 4c1.54 0 3.04.74 3.97 1.9C11.46 4.74 12.96 4 14.5 4 17 4 19 6 19 8.5c0 3.56-3.14 6.38-8.01 11.83l-1.09 1.02z"/></svg>
          <span class="love-count" data-base="${r.loves}">${r.loves + extra}</span>
        </button>
      </div>
      <p class="card-price" data-myr="${r.priceMYR}">
        Average Price: RM ${r.priceMYR.toFixed(2)}
      </p>
    </div>
  `;
  return el;
}

function renderAll() {
  foodGrid.innerHTML = "";
  restaurants.forEach(r => foodGrid.appendChild(makeCard(r)));
}
renderAll();

// like toggle (persist)
foodGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".love");
  if (!btn) return;
  const id = btn.dataset.id;
  const countEl = btn.querySelector(".love-count");
  const base = parseInt(countEl.dataset.base, 10) || 0;
  const willLike = !btn.classList.contains("active");

  btn.classList.toggle("active", willLike);
  btn.setAttribute("aria-pressed", willLike ? "true" : "false");
  setLiked(id, willLike);
  countEl.textContent = base + (willLike ? 1 : 0);
});

// ---------- FILTER + SEARCH ----------
let currentFilter = "all";
let searchQuery = "";

// animate visible cards
let animRunning = false;  // simple guard

function animateCards() {
  if (animRunning) return;           // don't restart if still animating
  // visible cards only
  const cards = gsap.utils.toArray('.food .food-col')
    .filter(el => getComputedStyle(el).display !== 'none');

  animRunning = true;
  gsap.fromTo(cards,
    { y: 30, opacity: 0 },          // fixed px => same distance for all
    {
      y: 0, opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.06,
      onComplete: () => (animRunning = false)
    }
  );
}


// apply filters (cause = 'filter' | 'search')
function applyFilters(cause = "filter") {
  const cards = foodGrid.querySelectorAll(".food-col");

  cards.forEach(card => {
    const state = (card.dataset.state || "").toLowerCase();
    const halal = card.dataset.halal === "true";

    // chip filter
    let pass = true;
    switch (currentFilter) {
      case "perak":
      case "penang":
      case "kedah":
      case "kelantan":
        pass = state === currentFilter; break;
      case "halal":
        pass = halal === true; break;
      case "non-halal":
        pass = halal === false; break;
      case "high-rate": {
        const s = parseFloat(card.querySelector(".score")?.textContent || "0");
        pass = s >= 4.5; break;
      }
      default: pass = true; // all
    }

    // text search (name + desc)
    const name = (card.querySelector(".card-name")?.textContent || "").toLowerCase();
    const desc = (card.querySelector(".card-desc")?.textContent || "").toLowerCase();
    const matchSearch = !searchQuery || name.includes(searchQuery) || desc.includes(searchQuery);

    card.style.display = (pass && matchSearch) ? "" : "none";
  });

  if (cause !== "search") requestAnimationFrame(animateCards);
}

// chip listeners
document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    applyFilters("filter");       // animate
  });
});

// search (no animation)
const searchInput = document.getElementById("search-bar");
const clearBtn = document.querySelector(".clear-btn");
const debounce = (fn, ms = 200) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

searchInput?.addEventListener("input", debounce(() => {
  searchQuery = (searchInput.value || "").toLowerCase().trim();
  applyFilters("search");         // no animation
}, 150));

clearBtn?.addEventListener("click", () => {
  searchInput.value = "";
  searchQuery = "";
  applyFilters("search");         // no animation
});

// Save search query in sessionStorage
searchInput?.addEventListener("input", () => {
  sessionStorage.setItem("lastSearch", searchInput.value);
});

// Restore last search when page reloads
window.addEventListener("load", () => {
  const saved = sessionStorage.getItem("lastSearch");
  if (saved) {
    searchInput.value = saved;
    searchQuery = saved.toLowerCase();
    applyFilters("search");
  }
});

// helper to find restaurant by card click
function getRestaurantFromCard(el) {
  const card = el.closest('.food-col');
  if (!card) return null;

  // You can store the id on the card to make it precise
  // When creating the card, set: wrap.dataset.id = r.id;
  const id = card.dataset.id;
  return restaurants.find(r => r.id === id) || null;
}

// open/close modal
const modal = document.getElementById('restaurant-modal');
const modalContent = document.getElementById('modal-content');

function openModal(r) {
  modalContent.innerHTML = `
    <div class="mc-left">
      <div class="mc-hero">
        <img src="${r.img}" alt="${r.name}">
        <button class="mc-close" data-close>&times;</button>
      </div>
      <div class="mc-info">
        <h2>${r.name}</h2>
        <div class="mc-meta">⭐ ${r.rating.toFixed(1)} • ${r.halal ? 'Halal' : 'Non-Halal'} • ${r.state.replace('-', ' ')}</div>
        <p>${r.desc}</p>
        <p><strong>Opening Hours:</strong> ${r.hours ?? '—'}</p>
      </div>
    </div>
    <div class="mc-map">
      <iframe src="${r.map}" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  `;
  modal.classList.add('open');            // <- shows overlay
  document.body.classList.add('modal-open');
}

function closeModal() {
  modal.classList.remove('open');
  document.body.classList.remove('modal-open');
}

/* close handlers */
modal.addEventListener('click', (e) => {
  if (e.target.matches('[data-close], .modal-backdrop')) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

/* example: open from a card click (ensure your card has data-id) */
document.querySelector('.food').addEventListener('click', (e) => {
  if (e.target.closest('.love')) return;
  const card = e.target.closest('.food-col');
  if (!card) return;
  const data = restaurants.find(x => x.id === card.dataset.id);
  if (data) openModal(data);
});





// initial pass + entrance anim
applyFilters("filter");
animateCards();




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



// ---------- CURRENCY CONVERSION ----------

// --- Currency display helper ---
const CURRENCY_SYMBOL = { MYR: "RM", USD: "$", SGD: "S$", EUR: "€", JPY: "¥", GBP: "£" };

function updatePricesForCurrency(curr) {
  const symbol = CURRENCY_SYMBOL[curr] || curr;

  // MYR = no fetch needed
  if (curr === "MYR") {
    document.querySelectorAll(".card-price").forEach(el => {
      const baseMYR = parseFloat(el.dataset.myr);
      el.textContent = `Average Price: ${symbol} ${baseMYR.toFixed(2)}`;
    });
    return;
  }

  // Convert MYR -> selected currency using ER API (rates are "MYR per <base>")
  fetch(`https://open.er-api.com/v6/latest/${curr}`)
    .then(r => r.json())
    .then(data => {
      const rateToMYR = data?.rates?.MYR;              // e.g., 1 USD = 4.7 MYR
      if (!rateToMYR) return;                          // guard

      document.querySelectorAll(".card-price").forEach(el => {
        const baseMYR = parseFloat(el.dataset.myr);
        const converted = (baseMYR / rateToMYR).toFixed(2); // MYR -> curr
        el.textContent = `Average Price: ${symbol} ${converted}`;
      });
    })
    .catch(console.error);
}



const currencySelect = document.getElementById("currencySelect");

currencySelect?.addEventListener("change", () => {
  // Save the preference (only if user consented)
  if (userConsentedAll()) setCookie("currency_pref", currencySelect.value, 365);

  // Always reflect the UI immediately
  updatePricesForCurrency(currencySelect.value);
});



