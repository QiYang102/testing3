// --- Section 1
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


// Verify User
/* ===== Auth helpers (aligned to your login format) ===== */
const USERS_KEY = "users_v1";
const CURRENT_USER_KEY = "user";

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null"); }
  catch { return null; }
}
function getUsersRaw() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "{}"); }
  catch { return {}; }
}
function usersAsArray() {
  const db = getUsersRaw();
  if (Array.isArray(db)) return db;                          // [{username?, name?, email?...}]
  if (db && typeof db === "object") {
    // { username: {password, email, picture, provider} }
    return Object.entries(db).map(([key, val]) => ({ key, ...(val || {}) }));
  }
  return [];
}
const eqi = (a, b) =>
  typeof a === "string" && typeof b === "string" && a.toLowerCase() === b.toLowerCase();

/**
 * Valid when:
 *  - there is a current user; AND
 *  - provider === 'google' with a non-empty email; OR
 *  - provider === 'local' and a record exists under that username (object key),
 *    and if both sides have email, they match (case-insensitive).
 */
function hasValidSession() {
  const u = getCurrentUser();
  if (!u) { console.debug("[auth] no current user"); return false; }

  // Google sign-in: accept if we have an email
  if (u.provider === "google") {
    const ok = !!u.email;
    if (!ok) console.debug("[auth] google user missing email", u);
    return ok;
  }

  // Local sign-in: check users_v1
  const db = getUsersRaw();
  if (db && !Array.isArray(db) && typeof db === "object") {
    const rec = db[u.name]; // username is key
    if (!rec) {
      console.debug("[auth] local user not found in users_v1 by username key", { username: u.name });
      return false;
    }
    // if both have email, enforce equality; else consider it OK
    if (u.email && rec.email) {
      const ok = eqi(u.email, rec.email);
      if (!ok) console.debug("[auth] email mismatch", { session: u.email, record: rec.email });
      return ok;
    }
    return true;
  }

  // If somehow users_v1 is an array, fallback match by email/name/key
  const arr = usersAsArray();
  const ok = arr.some(r =>
    (u.email && r.email && eqi(u.email, r.email)) ||
    (u.name && (eqi(u.name, r.name) || eqi(u.name, r.username) || eqi(u.name, r.key)))
  );
  if (!ok) console.debug("[auth] no match in users_v1 (array fallback)", { user: u, arr });
  return ok;
}

/** Gate any action; if invalid, alert and block. */
function requireLogin(actionLabel = "this action") {
  if (hasValidSession()) return true;
  window.alert(`Please log in to ${actionLabel}.`);
  return false;
}



// --- Section 2: Background stories ---
(() => {
  const card = document.querySelector('.section-2 .info-card');
  if (!card) return;

  // Slides
  const slides = [
    {
      img: 'elements/image/images-perak/history/1 (4).webp',
      text: "From 1861–1874, Perak’s Larut district was engulfed in the Larut Wars, fought between rival Chinese secret societies — the Hai San and Ghee Hin — over tin-mine control and revenue farms. The conflict destabilised the sultanate and drew in Malay chiefs and foreign merchants, setting the stage for British intervention."
    },
    {
      img: 'elements/image/images-perak/history/1 (3).webp',
      text: "On 20 January 1874, the Pangkor Treaty installed a British Resident in Perak, marking the start of indirect colonial rule in the Malay states. Sultan Abdullah accepted the arrangement in return for recognition, while the Resident would ‘advise’ on all matters except Malay religion and custom."
    },
    {
      img: 'elements/image/images-perak/history/1 (2).webp',
      text: "British Resident J.W.W. Birch was assassinated at Pasir Salak on 2 November 1875, sparking the Perak War (1875–76). The reprisals led to the exile of Sultan Abdullah and tightened colonial control, reshaping governance across the peninsula."
    },
    {
      img: 'elements/image/images-perak/history/1 (1).webp',
      text: "In the late 19th and early 20th centuries the Kinta Valley tin boom turned Ipoh into the ‘City of Millionaires’. Bucket dredges, steam pumps and migrant labour transformed the landscape; banks, shophouses and theatres flourished across Old Town and New Town."
    }
  ];

  // Elements
  const imgEl = card.querySelector('.card-media img');
  const pEl = card.querySelector('.card-body p');
  const prev = document.getElementById('bgPrev');
  const next = document.getElementById('bgNext');

  // Typing settings
  const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SPEED = 6; // ms per char (faster than your old 9ms)
  let typeTimer = null;

  // Kill any ongoing typing
  function stopTyping() {
    if (typeTimer) { clearTimeout(typeTimer); typeTimer = null; }
    pEl.classList.remove('typing');
  }

  // Type the given text into pEl quickly with a caret (no pauses)
  function typeText(text) {
    stopTyping();
    if (REDUCE) {            // respect user motion preference
      pEl.textContent = text;
      return;
    }

    pEl.textContent = '';
    pEl.classList.add('typing'); // shows the blinking caret via your CSS
    let i = 0;
    const step = () => {
      if (i <= text.length) {
        pEl.textContent = text.slice(0, i++);
        typeTimer = setTimeout(step, SPEED);
      } else {
        pEl.classList.remove('typing'); // remove caret at end
        typeTimer = null;
      }
    };
    step();
  }

  // Small fade utility
  function fadeSwap(el, setter) {
    el.classList.add('fade-out');
    setTimeout(() => {
      setter();
      el.classList.remove('fade-out');
    }, 180);
  }

  // State + render
  let i = 0;
  const mod = (n, m) => (n % m + m) % m;

  function render() {
    const s = slides[i];

    // swap image with fade
    fadeSwap(imgEl, () => { imgEl.src = s.img; });

    // re-type the text every time
    fadeSwap(pEl, () => { typeText(s.text); });
  }

  // Nav
  prev?.addEventListener('click', () => { i = mod(i - 1, slides.length); render(); });
  next?.addEventListener('click', () => { i = mod(i + 1, slides.length); render(); });

  // Init (override any initial HTML so JS is source of truth)
  render();

  // Preload for smoothness
  slides.forEach(s => { const im = new Image(); im.src = s.img; });
})();





// --- Section 3 ---
(() => {
  const data = [
    {
      title: "Kellie’s Castle",
      summary:
        "An unfinished Scottish-style mansion built by William Kellie Smith in the early 20th century. The castle, with its mix of Moorish and Indo-Saracenic architecture, is steeped in mystery and ghostly legends.",
      img: "elements/image/images-perak/mgp/Kellie’s Castle.webp",
      do: [
        "Explore the secret passages and rooftop view",
        "Join a guided heritage tour",
        "Take photos of the unique architecture"
      ],
      eat: ["Local Malay food stalls nearby", "Ipoh specialties on the way"],
      tips: ["Visit in the morning or late afternoon to avoid the heat", "Wear comfortable walking shoes"]
    },
    {
      title: "Ipoh Old Town",
      summary:
        "Ipoh’s historic quarter is filled with colonial-era buildings, vibrant street art, and renowned coffee shops. Once a tin-mining hub, today it blends heritage with hip cafés and cultural charm.",
      img: "elements/image/images-perak/mgp/Ipoh Old Town.jpeg",
      do: [
        "Walk the Ipoh Heritage Trail",
        "Admire Ernest Zacharevic’s murals",
        "Sip Ipoh white coffee in a traditional kopitiam"
      ],
      eat: ["Ipoh white coffee", "Bean sprout chicken", "Salted chicken"],
      tips: ["Start your tour early before it gets hot", "Bring a camera for the murals"]
    },
    {
      title: "Gua Tempurung",
      summary:
        "One of the largest limestone caves in Peninsular Malaysia, featuring underground rivers, stalactites, and stalagmites. Popular with adventure seekers for caving tours of varying difficulty.",
      img: "elements/image/images-perak/mgp/Gua Tempurung.jpg",
      do: [
        "Join a guided cave exploration tour",
        "Admire the illuminated cavern formations",
        "Try the river adventure trail"
      ],
      eat: ["Pack light snacks", "Try Malay food stalls in Gopeng town nearby"],
      tips: ["Wear non-slip shoes", "Bring a headlamp for longer tours"]
    },
    {
      title: "Royal Belum State Park",
      summary:
        "A pristine rainforest over 130 million years old, part of the Belum-Temenggor Forest Complex. Home to rare wildlife such as Malayan tigers, elephants, and hornbills, it’s a haven for eco-tourism.",
      img: "elements/image/images-perak/mgp/Royal Belum State Park.jpg",
      do: [
        "Take a boat tour on Tasik Banding",
        "Look for rafflesia blooms",
        "Go birdwatching and wildlife spotting"
      ],
      eat: ["Resort or homestay meals around Lake Banding"],
      tips: ["Book tours with licensed guides", "Apply for entry permits in advance"]
    },
    {
      title: "Taiping Lake Gardens",
      summary:
        "Established in 1880, this is the oldest public garden in Malaysia. It features serene lakes, century-old rain trees, and nearby attractions such as the Taiping Zoo and Bukit Larut (Maxwell Hill).",
      img: "elements/image/images-perak/mgp/Taiping Lake Gardens.jpg",
      do: [
        "Stroll or cycle around the scenic lakes",
        "Visit Taiping Zoo at night",
        "Ride up to Bukit Larut for cooler weather"
      ],
      eat: ["Famous Taiping char kway teow", "Cendol at local stalls"],
      tips: ["Evening visits are cooler", "Bring an umbrella during monsoon season"]
    },
    {
      title: "Pangkor Island",
      summary:
        "A charming island off the coast of Perak, known for its fishing villages, Dutch Fort ruins, and tranquil beaches such as Teluk Nipah and Coral Beach.",
      img: "elements/image/images-perak/mgp/Pangkor Island.jpg",
      do: [
        "Relax on the beaches",
        "Visit the Dutch Fort and Fu Lin Kong temple",
        "Take a boat to see hornbills at sunset"
      ],
      eat: ["Fresh seafood at seaside restaurants", "Pangkor satay fish snacks"],
      tips: ["Best visited outside monsoon season (Nov–Jan)", "Rent a motorbike to explore the island easily"]
    }
  ];

  // ----- DOM -----
  const wrap = document.getElementById("placesCarousel");
  if (!wrap) return;
  const row = wrap.querySelector(".slides");
  const card = document.getElementById("placeCard");

  // ----- STATE -----
  let i = 0;
  const mod = (n, m) => ((n % m) + m) % m;

  // ----- HELPERS -----
  function makeCard(mark, d) {
    const div = document.createElement("div");
    div.className = `card ${mark} enter`;
    div.innerHTML = `<img src="${d.img}" alt="${d.title}">`;
    if (mark === "left") div.addEventListener("click", () => { i = mod(i - 1, data.length); render(); });
    if (mark === "right") div.addEventListener("click", () => { i = mod(i + 1, data.length); render(); });
    return div;
  }

  function renderDetails(d) {
    const li = (arr) => (arr && arr.length) ? arr.map(x => `<li>${x}</li>`).join("") : "<li>—</li>";
    card.innerHTML = `
      <h3 class="pc-title">${d.title}</h3>
      <p class="pc-summary">${d.summary || ""}</p>
      <div class="pc-grid">
        <div class="pc-col">
          <h4>What You Can Do</h4>
          <ul>${li(d.do)}</ul>
        </div>
        <div class="pc-col">
          <h4>What To Eat Nearby</h4>
          <ul>${li(d.eat)}</ul>
        </div>
        <div class="pc-col">
          <h4>Good To Know</h4>
          <ul>${li(d.tips)}</ul>
        </div>
      </div>
    `;
    card.classList.remove("pc-fade"); void card.offsetWidth; card.classList.add("pc-fade");
  }

  function render() {
    row.innerHTML = "";
    const leftIdx = mod(i - 1, data.length);
    const rightIdx = mod(i + 1, data.length);
    row.appendChild(makeCard("left", data[leftIdx]));
    row.appendChild(makeCard("active", data[i]));
    row.appendChild(makeCard("right", data[rightIdx]));

    // clear entry animation classes after they play
    requestAnimationFrame(() => {
      setTimeout(() => {
        row.querySelectorAll(".enter").forEach(el => el.classList.remove("enter"));
      }, 400);
    });

    renderDetails(data[i]);
  }

  // ----- SWIPE (mobile) -----
  let x0 = null;
  row.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
  row.addEventListener("touchend", e => {
    if (x0 == null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) { i = mod(i + (dx < 0 ? 1 : -1), data.length); render(); }
    x0 = null;
  }, { passive: true });

  // ----- INIT -----
  render();

  // Preload images for smoother first transitions
  data.forEach(d => { const im = new Image(); im.src = d.img; });
})();





// Section 4
(() => {
  // ---- Data (expanded with optional fields) ----
  const DATA = {
    main: [
      {
        name: "Nasi Kandar",
        img: "elements/image/images-perak/food/Nasi Kandar.avif",
        desc: "Steamed rice served with a variety of curries, fried chicken, squid, vegetables, and thick gravy. Famous in Ipoh and across Perak.",
        tags: ["Hearty", "Spicy", "Curry", "Halal"],
        ingredients: ["Steamed rice", "Mixed curries", "Fried chicken", "Okra", "Squid curry", "Thick gravy"],
        taste: "Rich, spicy, savory with layered curry flavors.",
        origin: "Brought by Tamil Muslim traders and perfected in Perak, especially Ipoh.",
        pair: "Teh Tarik or iced lime juice.",
        price: "RM 12.00",
        nutrition: ["~650 kcal", "28 g protein", "85 g carbs", "20 g fat"]
      },
      {
        name: "Ipoh Bean Sprout Chicken",
        img: "elements/image/images-perak/food/Ipoh Bean Sprout Chicken.jpg",
        desc: "Poached chicken served with crunchy bean sprouts, soy sauce, and sesame oil. A simple yet iconic Ipoh dish.",
        tags: ["Light", "Savory", "Street Food", "Halal (available at Muslim stalls)"],
        ingredients: ["Chicken", "Bean sprouts", "Soy sauce", "Sesame oil", "Garlic"],
        taste: "Tender chicken with fragrant soy flavors and crunchy sprouts.",
        origin: "Ipoh specialty, made unique by the crisp, fat bean sprouts grown in Perak’s mineral-rich water.",
        pair: "Plain rice or rice noodles (kuey teow soup).",
        price: "RM 9.00",
        nutrition: ["~400 kcal", "30 g protein", "12 g carbs", "20 g fat"]
      },
      {
        name: "Mee Rebus Mamak",
        img: "elements/image/images-perak/food/Mee Rebus Mamak.jpg",
        desc: "Yellow noodles in a thick, spicy-sweet potato gravy, garnished with boiled egg, tofu, bean sprouts, and lime.",
        tags: ["Noodles", "Spicy", "Sweet-Savory", "Halal"],
        ingredients: ["Yellow noodles", "Sweet potato gravy", "Tofu", "Bean sprouts", "Boiled egg", "Lime"],
        taste: "Thick, slightly sweet gravy balanced with chili spice and citrus tang.",
        origin: "Popular at Mamak stalls across Perak, especially Taiping.",
        pair: "Iced Milo or lime juice.",
        price: "RM 7.50",
        nutrition: ["~520 kcal", "14 g protein", "80 g carbs", "12 g fat"]
      }
    ],
    beverages: [
      {
        name: "Ipoh White Coffee",
        img: "elements/image/images-perak/food/Ipoh White Coffee.jpg",
        desc: "Smooth, aromatic coffee made with beans roasted in margarine and served with condensed milk. Ipoh’s world-famous drink.",
        tags: ["Hot", "Coffee", "Sweet", "Halal"],
        ingredients: ["Coffee beans", "Margarine", "Condensed milk", "Sugar"],
        taste: "Creamy, aromatic, slightly caramelized.",
        origin: "Ipoh’s Old Town kopitiams in the early 20th century.",
        pair: "Perfect with kaya toast or pastries.",
        price: "RM 4.50",
        nutrition: ["~180 kcal", "4 g protein", "28 g carbs", "6 g fat"]
      },
      {
        name: "Air Mata Kucing",
        img: "elements/image/images-perak/food/Air Mata Kucing.webp",
        desc: "Refreshing herbal drink made from longan, winter melon, and luo han guo, often sold in Perak night markets.",
        tags: ["Iced", "Sweet", "Herbal", "Halal"],
        ingredients: ["Longan", "Winter melon", "Luo Han Guo fruit", "Sugar", "Water"],
        taste: "Sweet, cooling, with a light herbal aroma.",
        origin: "Popular in Perak and traditional Chinese communities in Malaysia.",
        pair: "Street food or fried snacks.",
        price: "RM 3.00",
        nutrition: ["~90 kcal", "0 g protein", "22 g carbs", "0 g fat"]
      }
    ],
    snacks: [
      {
        name: "Heong Peng (Fragrant Biscuits)",
        img: "elements/image/images-perak/food/Heong Peng (Fragrant Biscuits).jpg",
        desc: "Flaky biscuits filled with a sweet, sticky malt and shallot filling, baked in traditional clay ovens.",
        tags: ["Sweet", "Traditional", "Snack"],
        ingredients: ["Flour", "Malt sugar", "Shallots", "Sesame seeds"],
        taste: "Crispy outside, sweet and fragrant filling inside.",
        origin: "Ipoh specialty biscuit, loved as a souvenir snack.",
        pair: "Best enjoyed with tea.",
        price: "RM 6.00 (6 pieces)",
        nutrition: ["~160 kcal", "3 g protein", "30 g carbs", "4 g fat"]
      },
      {
        name: "Kaya Puff",
        img: "elements/image/images-perak/food/Kaya Puff.jpeg",
        desc: "Flaky pastry filled with coconut jam (kaya), golden brown and buttery.",
        tags: ["Sweet", "Pastry", "Traditional"],
        ingredients: ["Flour", "Butter", "Egg", "Coconut jam (kaya)"],
        taste: "Sweet coconut flavor wrapped in crisp, flaky pastry.",
        origin: "Famous Ipoh pastry shops and bakeries.",
        pair: "Tea or Ipoh White Coffee.",
        price: "RM 1.80 each",
        nutrition: ["~150 kcal", "2 g protein", "20 g carbs", "7 g fat"]
      }
    ],
    sides: [
      {
        name: "Chee Cheong Fun (Ipoh Style)",
        img: "elements/image/images-perak/food/Chee Cheong Fun (Ipoh Style).webp",
        desc: "Steamed rice noodle rolls served with a sweet red sauce, chili paste, and pickled green chilies.",
        tags: ["Noodles", "Savory", "Street Food"],
        ingredients: ["Rice noodles", "Sweet red sauce", "Chili paste", "Pickled green chilies"],
        taste: "Soft noodles with a mix of sweet and spicy flavors.",
        origin: "Ipoh’s unique version, different from Penang’s prawn paste style.",
        pair: "Good as a light breakfast or supper.",
        price: "RM 4.50",
        nutrition: ["~280 kcal", "5 g protein", "55 g carbs", "4 g fat"]
      },
      {
        name: "Popiah Basah (Fresh Spring Rolls)",
        img: "elements/image/images-perak/food/Popiah Basah (Fresh Spring Rolls).JPG",
        desc: "Fresh spring rolls filled with turnip, carrots, bean sprouts, and peanuts, wrapped in a soft crepe skin.",
        tags: ["Light", "Vegetarian", "Snack"],
        ingredients: ["Crepe skin", "Turnip", "Carrot", "Bean sprouts", "Peanuts"],
        taste: "Fresh, crunchy, slightly sweet and savory.",
        origin: "Popular at Ipoh hawker stalls and night markets.",
        pair: "Best enjoyed with chili sauce.",
        price: "RM 3.50",
        nutrition: ["~190 kcal", "6 g protein", "28 g carbs", "5 g fat"]
      }
    ]
  };



  const CAT_BG = {
    main: "elements/image/images-kedah/mef/bg/food bg.png",
    beverages: "elements/image/images-kedah/mef/bg/beverage bg.png",
    sides: "elements/image/images-kedah/mef/bg/side bg.png",
    snacks: "elements/image/images-kedah/mef/bg/snack bg.png",
  };

  // ---- DOM ----
  const hero = document.getElementById("foodHero");
  if (!hero) return;
  const tabs = hero.querySelectorAll(".food-tab");
  const nameEl = hero.querySelector("#foodName");
  const imgEl = hero.querySelector("#foodImg");
  const bgEl = hero.querySelector("#foodBg");
  const prev = hero.querySelector("#foodPrev");
  const next = hero.querySelector("#foodNext");
  const bar = hero.querySelector(".food-progress > span");
  const stageEl = hero.querySelector(".food-stage");
  const plateEl = hero.querySelector(".food-plate");

  // Info area
  const titleEl = document.getElementById("foodTitle");
  const tagsEl = document.getElementById("foodTags");
  const textEl = document.getElementById("foodText");
  const ingrEl = document.getElementById("foodIngr");
  const tasteEl = document.getElementById("foodTaste");
  const originEl = document.getElementById("foodOrigin");
  const pairEl = document.getElementById("foodPair");
  const priceEl = document.getElementById("foodPrice");
  const nutriEl = document.getElementById("foodNutri");

  const sec = {
    desc: document.getElementById("sec-desc"),
    ingr: document.getElementById("sec-ingr"),
    taste: document.getElementById("sec-taste"),
    origin: document.getElementById("sec-origin"),
    pair: document.getElementById("sec-pair"),
    price: document.getElementById("sec-price"),
    nutri: document.getElementById("sec-nutri"),
  };

  // ---- State ----
  let cat = "main";
  let i = 0;
  const mod = (n, m) => (n % m + m) % m;

  // ---- Fit name ----
  function fitNameToStage() {
    if (!stageEl || !plateEl || !nameEl) return;
    nameEl.style.whiteSpace = "normal";
    nameEl.style.overflow = "hidden";
    nameEl.style.display = "block";

    const stageRect = stageEl.getBoundingClientRect();
    const plateRect = plateEl.getBoundingClientRect();
    const verticalGap = 16;
    const available = Math.max(24, (plateRect.top - stageRect.top) - verticalGap);
    const lineHeightPx = parseFloat(getComputedStyle(nameEl).lineHeight) || 36;
    const maxLines = 2;
    const hardMax = Math.max(24, Math.min(available, lineHeightPx * maxLines + 4));
    const MIN = 16, MAX = 64;
    let lo = MIN, hi = MAX, best = MIN;
    for (let k = 0; k < 10; k++) {
      const mid = (lo + hi >> 1);
      nameEl.style.fontSize = mid + "px";
      nameEl.style.maxHeight = hardMax + "px";
      const fits = nameEl.scrollHeight <= hardMax + 1;
      if (fits) { best = mid; lo = mid + 1; } else { hi = mid - 1; }
    }
    nameEl.style.fontSize = best + "px";
    nameEl.style.maxHeight = hardMax + "px";
  }
  const fitSoon = () => requestAnimationFrame(() => requestAnimationFrame(fitNameToStage));

  // ---- Fade helpers ----
  const FADE_MS = 220;
  const fadeEls = [nameEl, imgEl, titleEl, textEl];
  fadeEls.forEach(el => el && el.classList.add("food-fade"));

  function swapWithFade(updateFn) {
    fadeEls.forEach(el => el && el.classList.remove("is-visible"));
    setTimeout(() => {
      updateFn();
      fadeEls.forEach(el => { if (el) void el.offsetWidth; });
      fadeEls.forEach(el => el && el.classList.add("is-visible"));
      fitSoon();
    }, FADE_MS);
  }

  const setHidden = (el, cond) => { if (!el) return; el.classList.toggle("is-hidden", !!cond); };

  // ---- Render ----
  function render() {
    const list = DATA[cat] || [];
    if (!list.length) {
      nameEl.textContent = "";
      imgEl.removeAttribute("src");
      imgEl.alt = "";
      bar.style.width = "0%";
      if (bgEl) bgEl.removeAttribute("src");
      fitSoon();
      return;
    }
    const item = list[i];

    // progress + bg update immediately
    bar.style.width = (((i + 1) / list.length) * 100) + "%";
    if (bgEl) bgEl.src = CAT_BG[cat] || "";

    // fade in content
    swapWithFade(() => {
      nameEl.textContent = item.name || "";
      imgEl.src = item.img || "";
      imgEl.alt = item.name || "";

      titleEl.textContent = item.name || "";

      tagsEl.innerHTML = "";
      (item.tags || []).forEach(t => {
        const span = document.createElement("span");
        span.className = "food-tag";
        span.textContent = (t || "").trim();
        tagsEl.appendChild(span);
      });
      setHidden(tagsEl, !(item.tags && item.tags.length));

      textEl.textContent = item.desc || "";
      setHidden(sec.desc, !item.desc);

      ingrEl.innerHTML = "";
      (item.ingredients || []).forEach(x => {
        const li = document.createElement("li");
        li.textContent = x;
        ingrEl.appendChild(li);
      });
      setHidden(sec.ingr, !(item.ingredients && item.ingredients.length));

      tasteEl.textContent = item.taste || "";
      originEl.textContent = item.origin || "";
      pairEl.textContent = item.pair || "";
      setHidden(sec.taste, !item.taste);
      setHidden(sec.origin, !item.origin);
      setHidden(sec.pair, !item.pair);

      priceEl.textContent = item.price || "";
      setHidden(sec.price, !item.price);

      const n = item.nutrition || [];
      if (n.length === 4) {
        nutriEl.innerHTML =
          "<tr><th>Calories</th><th>Protein</th><th>Carbs</th><th>Fat</th></tr>" +
          `<tr><td>${n[0]}</td><td>${n[1]}</td><td>${n[2]}</td><td>${n[3]}</td></tr>`;
        setHidden(sec.nutri, false);
      } else {
        nutriEl.innerHTML = "";
        setHidden(sec.nutri, true);
      }
    });

    if (imgEl.complete) { fitSoon(); }
    else { imgEl.onload = fitSoon; imgEl.onerror = fitSoon; }
  }

  function setActiveTab(btn) {
    hero.querySelectorAll(".food-tab").forEach(b => b.classList.toggle("is-active", b === btn));
  }

  // ---- Events ----
  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      const nextCat = btn.dataset.cat;
      if (!DATA[nextCat]) return;
      cat = nextCat; i = 0;
      setActiveTab(btn);
      render();
    });
  });

  document.getElementById("foodPrev").addEventListener("click", () => {
    const list = DATA[cat] || []; if (!list.length) return;
    i = mod(i - 1, list.length); render();
  });
  document.getElementById("foodNext").addEventListener("click", () => {
    const list = DATA[cat] || []; if (!list.length) return;
    i = mod(i + 1, list.length); render();
  });

  window.addEventListener("resize", fitSoon);
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(fitSoon).catch(() => { }); }

  // ---- Init ----
  render();

  // Preload
  [...Object.values(CAT_BG), ...Object.values(DATA).flatMap(arr => arr.map(x => x.img))]
    .forEach(src => { const im = new Image(); im.src = src; });
})();


// New Section Food List
// === Penang.js ===
// Handles rendering Penang foods + favourites integration

// Must match favourite.js
const FAV_KEY = "favouriteFoods";

// === FOOD DATA ===
const foodItems = [
  {
    id: "pk1",
    name: "Nasi Kandar",
    image: "elements/image/images-perak/food/Nasi Kandar.avif",
    desc: "Steamed rice served with a variety of curries, fried chicken, squid, vegetables, and thick gravy. Famous in Ipoh and across Perak.",
    category: "main-dishes"
  },
  {
    id: "pk2",
    name: "Ipoh Bean Sprout Chicken",
    image: "elements/image/images-perak/food/Ipoh Bean Sprout Chicken.jpg",
    desc: "Poached chicken served with crunchy bean sprouts, soy sauce, and sesame oil. A simple yet iconic Ipoh dish.",
    category: "main-dishes"
  },
  {
    id: "pk3",
    name: "Mee Rebus Mamak",
    image: "elements/image/images-perak/food/Mee Rebus Mamak.jpg",
    desc: "Yellow noodles in a thick, spicy-sweet potato gravy, garnished with boiled egg, tofu, bean sprouts, and lime.",
    category: "main-dishes"
  },
  {
    id: "pk4",
    name: "Ipoh White Coffee",
    image: "elements/image/images-perak/food/Ipoh White Coffee.jpg",
    desc: "Smooth, aromatic coffee made with beans roasted in margarine and served with condensed milk. Ipoh’s world-famous drink.",
    category: "beverages"
  },
  {
    id: "pk5",
    name: "Air Mata Kucing",
    image: "elements/image/images-perak/food/Air Mata Kucing.webp",
    desc: "Refreshing herbal drink made from longan, winter melon, and luo han guo, often sold in Perak night markets.",
    category: "beverages"
  },
  {
    id: "pk6",
    name: "Heong Peng (Fragrant Biscuits)",
    image: "elements/image/images-perak/food/Heong Peng (Fragrant Biscuits).jpg",
    desc: "Flaky biscuits filled with a sweet, sticky malt and shallot filling, baked in traditional clay ovens.",
    category: "snacks"
  },
  {
    id: "pk7",
    name: "Kaya Puff",
    image: "elements/image/images-perak/food/Kaya Puff.jpeg",
    desc: "Flaky pastry filled with coconut jam (kaya), golden brown and buttery.",
    category: "snacks"
  },
  {
    id: "pk8",
    name: "Chee Cheong Fun (Ipoh Style)",
    image: "elements/image/images-perak/food/Chee Cheong Fun (Ipoh Style).webp",
    desc: "Steamed rice noodle rolls served with a sweet red sauce, chili paste, and pickled green chilies.",
    category: "sides"
  },
  {
    id: "pk9",
    name: "Popiah Basah (Fresh Spring Rolls)",
    image: "elements/image/images-perak/food/Popiah Basah (Fresh Spring Rolls).JPG",
    desc: "Fresh spring rolls filled with turnip, carrots, bean sprouts, and peanuts, wrapped in a soft crepe skin.",
    category: "sides"
  },
  {
    id: "pk10",
    name: "Ipoh Hor Fun",
    image: "elements/image/images-perak/food/Ipoh Hor Fun.jpg",
    desc: "Flat rice noodles in a silky chicken and prawn broth, topped with shredded chicken and prawns. A comforting Ipoh specialty.",
    category: "main-dishes"
  },
  {
    id: "pk11",
    name: "Satay Perak",
    image: "elements/image/images-perak/food/Satay Perak.jpeg",
    desc: "Skewered, marinated meat grilled over charcoal and served with a rich peanut sauce. Distinctively spiced Perak-style satay.",
    category: "sides"
  },
  {
    id: "pk12",
    name: "Ipoh Kaya Toast",
    image: "elements/image/images-perak/food/Ipoh Kaya Toast.jpg",
    desc: "Crispy toasted bread with butter and kaya (coconut jam), a perfect companion to Ipoh White Coffee.",
    category: "snacks"
  },
  {
    id: "pk13",
    name: "Ipoh Dim Sum",
    image: "elements/image/images-perak/food/Ipoh Dim Sum.webp",
    desc: "Traditional Chinese dim sum including har gow, siu mai, and char siu bao, reflecting Ipoh’s Cantonese influence.",
    category: "sides"
  },
  {
    id: "pk14",
    name: "Tau Fu Fah (Soy Pudding)",
    image: "elements/image/images-perak/food/Tau Fu Fah (Soy Pudding).jpeg",
    desc: "Soft soybean pudding served with syrup or palm sugar. A light, sweet Perak dessert.",
    category: "snacks"
  }
];



// === RENDER FOOD ITEMS ===
function renderFoodItems(items) {
  const foodGrid = document.getElementById("foodGrid");
  if (!foodGrid) {
    console.error("❌ #foodGrid not found in DOM");
    return;
  }
  foodGrid.innerHTML = ""; // Clear existing content

  items.forEach(item => {
    const foodElement = document.createElement("div");
    foodElement.classList.add("food-item");
    foodElement.setAttribute("data-category", item.category);

    foodElement.innerHTML = `
      <img src="${item.image}" alt="${item.name}" loading="lazy">
      <h4>${item.name}</h4>
      <p class="food-desc">${item.desc}</p>
      <div class="food-buttons">
        <button class="add-favourite-btn" 
                data-id="${item.id}" 
                data-name="${item.name}" 
                data-image="${item.image}">
          ♡ Add to Favourites
        </button>
      </div>
    `;

    foodGrid.appendChild(foodElement);
  });

  // Attach event listeners + update states
  attachFavouriteListeners();
  updateFavouriteButtons();
}

// === FILTER FUNCTIONALITY ===
function setupFilters() {
  document.querySelectorAll(".filter-tabs .tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".filter-tabs .tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.getAttribute("data-filter");
      const filteredItems = filter === "all"
        ? foodItems
        : foodItems.filter(item => item.category === filter);

      renderFoodItems(filteredItems);
    });
  });
}

// === UPDATE FAVOURITE BUTTONS UI ===
function updateFavouriteButtons() {
  const favourites = JSON.parse(localStorage.getItem(FAV_KEY)) || [];

  document.querySelectorAll(".add-favourite-btn").forEach(btn => {
    const id = btn.getAttribute("data-id");
    const isFav = favourites.some(f => f.id === id);

    btn.textContent = isFav ? "❤️ Remove from Favourites" : "♡ Add to Favourites";
    btn.classList.toggle("btn-remove", isFav);
    btn.classList.toggle("btn-add", !isFav);
  });
}

// === ATTACH FAVOURITE BUTTON LISTENERS ===
function attachFavouriteListeners() {
  const buttons = document.querySelectorAll(".add-favourite-btn");
  if (buttons.length === 0) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", function () {
      // NEW: require login
      if (!requireLogin('add or remove favourites')) return;

      const id = this.getAttribute("data-id");
      const name = this.getAttribute("data-name");
      const image = this.getAttribute("data-image");

      let favourites = JSON.parse(localStorage.getItem(FAV_KEY)) || [];
      const exists = favourites.some(f => f.id === id);

      if (exists) {
        favourites = favourites.filter(f => f.id !== id);
      } else {
        favourites.push({ id, name, image });
      }
      localStorage.setItem(FAV_KEY, JSON.stringify(favourites));
      updateFavouriteButtons();
    });
  });
}

// === INIT ===
document.addEventListener("DOMContentLoaded", () => {
  renderFoodItems(foodItems);   // Load all foods
  setupFilters();               // Enable filters
});


//new until here

// --- Section 5 - Comments---
(() => {
  // ====== SPEED KNOBS  ======
  const ROTATE_MS = 2000;  // auto-rotate interval (ms)
  const PAUSE_MS = 3000;  // pause after user action (ms)

  // ====== DOM ======
  const carousel = document.getElementById('commentCarousel');
  const card = document.getElementById('commentCard');
  const openBtn = document.getElementById('openComment');
  const form = document.getElementById('commentForm');
  const cancel = document.getElementById('cancelComment');
  const send = document.getElementById('sendComment');
  const input = document.getElementById('commentInput');
  if (!carousel || !card) return;

  const btnNext = document.getElementById('nextComment');
  const btnPrev = document.getElementById('prevComment');

  // ====== CONSTS / STORAGE ======
  const DEFAULT_AVATAR = 'elements/image/images-kedah/avatars/unknownuser.png';
  const LS_COMMENTS = 'mi_comments_v1';
  const LS_LIKES = 'mi_likes_v1';

  const loadUserComments = () => {
    try { return JSON.parse(localStorage.getItem(LS_COMMENTS) || '[]'); } catch { return []; }
  };
  const saveUserComments = (arr) => localStorage.setItem(LS_COMMENTS, JSON.stringify(arr));

  const getLikesMap = () => {
    try { return JSON.parse(localStorage.getItem(LS_LIKES) || '{}'); } catch { return {}; }
  };
  const setLiked = (id, liked) => {
    const m = getLikesMap(); liked ? m[id] = 1 : delete m[id];
    localStorage.setItem(LS_LIKES, JSON.stringify(m));
  };
  const isLiked = (id) => !!getLikesMap()[id];

  const fmt = (n) => (n > 999 ? '999+' : String(n));

  // Seeds + persisted comments
  const seeds = [
    {
      id: 'c_teo',
      name: 'Teo QiYang',
      verified: true,
      text: 'Ipoh white coffee in the morning hits differently — smooth, rich, and the best way to start the day in Perak.',
      likes: 999,
      avatar: 'elements/image/images-kedah/avatars/wyz.png'
    },
    {
      id: 'c_taylor_swift',
      name: 'Taylor Swift',
      verified: true,
      text: 'Had Kaya Puff in Ipoh and honestly… it’s sweeter than my love songs. Perfect with a cup of coffee.',
      likes: 320,
      avatar: 'elements/image/images-kedah/avatars/ts.png'
    },
    {
      id: 'c_the_rock',
      name: 'The Rock',
      verified: true,
      text: 'Heong Peng biscuits are tough on the outside but sweet inside. Just like life. Strong snack, brother!',
      likes: 210,
      avatar: 'elements/image/images-kedah/avatars/tr.png'
    },
  ];

  const comments = [...seeds, ...loadUserComments()];

  // ====== STATE / TIMERS ======
  let i = 0;
  let timer = null;
  let paused = false;
  let pauseTimer = null;

  const stopAuto = () => { clearInterval(timer); timer = null; };
  const startAuto = () => {
    stopAuto();
    timer = setInterval(() => { if (!paused) next(); }, ROTATE_MS);
  };
  const pauseFor = (ms = PAUSE_MS) => {
    // hard stop autoplay, then resume after ms
    paused = true;
    stopAuto();
    clearTimeout(pauseTimer);
    pauseTimer = setTimeout(() => {
      paused = false;
      startAuto();
    }, ms);
  };

  // ====== RENDER ======
  function render() {
    const c = comments[i];
    const liked = isLiked(c.id);
    const displayLikes = c.likes + (isLiked(c.id) ? 1 : 0);
    const avatarSrc = c.avatar || DEFAULT_AVATAR;

    card.innerHTML = `
      <div class="avatar"><img src="${avatarSrc}" alt="${c.name}"></div>
      <div class="name-row">
        <span>${c.name}</span>${c.verified ? '<span class="verify" title="verified"></span>' : ''}
      </div>
      <div class="text">${c.text}</div>
      <div class="likes">
        <button class="heart-btn" aria-label="Like or Unlike"><span class="heart ${liked ? 'liked' : ''}"></span></button>
        <span class="like-count">${fmt(displayLikes)}</span>
      </div>
    `;

    // tiny fade-in
    // fancy animate-in
    card.classList.remove('comment-animate');
    void card.offsetWidth; // force reflow
    card.classList.add('comment-animate');


    // Like toggle
    const heartBtn = card.querySelector('.heart-btn');
    const heart = card.querySelector('.heart');
    const countEl = card.querySelector('.like-count');
    heartBtn.addEventListener('click', () => {
      const nowLiked = !isLiked(c.id);
      setLiked(c.id, nowLiked);
      heart.classList.toggle('liked', nowLiked);
      countEl.textContent = fmt((c.likes || 0) + (nowLiked ? 1 : 0));
      pauseFor(); // fully pause & restart after delay
    });
  }

  // ====== NAV / AUTO ======
  const next = () => { i = (i + 1) % comments.length; render(); };
  const prev = () => { i = (i - 1 + comments.length) % comments.length; render(); };

  if (btnNext) btnNext.addEventListener('click', () => { next(); pauseFor(); });
  if (btnPrev) btnPrev.addEventListener('click', () => { prev(); pauseFor(); });

  // Swipe
  let x0 = null;
  carousel.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    if (x0 == null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) (dx < 0 ? next() : prev());
    x0 = null;
    pauseFor();
  }, { passive: true });

  // Hover pause (desktop)
  carousel.addEventListener('mouseenter', () => { paused = true; stopAuto(); });
  carousel.addEventListener('mouseleave', () => { paused = false; startAuto(); });

  // ====== FORM ======
  openBtn.addEventListener('click', () => {
    if (!requireLogin('write a comment')) return;   // NEW
    form.hidden = false;
    input.focus();
    paused = true;
    stopAuto();
  });

  cancel.addEventListener('click', () => { input.value = ''; form.hidden = true; paused = false; startAuto(); });

  send.addEventListener('click', () => {
    if (!requireLogin('write a comment')) return;   // NEW

    const text = (input.value || '').trim();
    if (!text) { input.focus(); input.placeholder = "Comment can't be empty"; return; }

    const id = 'c_user_' + Date.now();
    const u = getCurrentUser() || {};
    const newComment = {
      id,
      name: u.name || 'UnknownUser',
      verified: false,
      text,
      likes: 0,
      avatar: (u.pic || u.picture) || DEFAULT_AVATAR
    };

    const stored = loadUserComments(); stored.push(newComment); saveUserComments(stored);
    comments.push(newComment); i = comments.length - 1; render();

    input.value = ''; form.hidden = true; paused = false; startAuto();
  });

  // ====== INIT ======
  render();
  startAuto();
})();
