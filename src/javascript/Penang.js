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
      img: 'elements/image/images-penang/history/penang-history-4.png',
      text: "In the early 1800s, Penang was a key port under British rule, established by Captain Francis Light in 1786. As a free port, it attracted traders from China, India, the Middle East, and Europe. Goods like tin, rubber, spices, and textiles flowed through its docks. The scene reflects the island’s role as a maritime crossroads, where cultures and economies converged."
    },
    {
      img: 'elements/image/images-penang/history/penang-history-3.png',
      text: "Built between 1885 and 1887, the Penang City Hall and Town Hall (originally known as the Town Hall) served as the seat of local government during British colonial rule. Designed in the Neoclassical and Indo-Saracenic styles, it symbolized British authority and civic development. It housed the municipal council, courts, and public offices."
    },
    {
      img: 'elements/image/images-penang/history/penang-history-2.png',
      text: "The Penang Riots of 1867 were a violent conflict between rival Chinese secret societies—the Hai San and Ghee Hin—over control of opium and gambling monopolies. The riots erupted in George Town, resulting in widespread destruction, dozens of deaths, and over 100 arrests. British authorities intervened, banning secret societies and increasing surveillance."
    },
    {
      img: 'elements/image/images-penang/history/penang-history-1.png',
      text: "This image captures Penang in the 1950s or 1960s, during the final years of British rule and the dawn of Malayan independence (1957). The mix of trishaws, bicycles, and early cars reflects a city in transition. The colonial architecture remains intact, but new signs of modernity appear—electricity, signage in multiple languages, and a growing Malay presence in civic life."
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
      title: "Kek Lok Si Temple",
      summary:
        "Kek Lok Si, the largest Buddhist temple in Malaysia, rises majestically on the slopes of Air Itam. Its 30-meter-tall bronze statue of the Goddess of Mercy (Kuan Yin) watches over the island, while the Pagoda of Rama VI blends Chinese, Thai, and Burmese architecture. With over 10,000 Buddha statues, vibrant prayer halls, and millions of lanterns during Chinese New Year, it’s a spiritual and visual marvel.",
      img: "elements/image/images-penang/mgp/must-go-place1.png",
      do: [
        "Visit the Kuan Yin statue and light incense",
        "Climb the pagoda for panoramic views",
        "Explore during Chinese New Year for lantern festival"
      ],
      "eat": ["Vegetarian meals at temple stalls", "Air Itam duck noodles nearby"],
      "tips": ["Wear modest clothing", "Visit early to avoid crowds and heat"]
    },
    {
      title: "Penang Hill (Bukit Bendera)",
      summary:
        "Rising 735 meters above sea level, Penang Hill offers a cool escape from the tropical heat. Reach the summit via the historic funicular railway, where you’ll be rewarded with sweeping views of George Town and the Strait of Malacca. The hill is also home to The Habitat, a pristine rainforest reserve with canopy walks and rich biodiversity.",
      img: "elements/image/images-penang/mgp/must-go-place2.png",
      do: [
        "Ride the funicular train to the top",
        "Walk the Habitat Skywalk",
        "Enjoy sunrise or sunset views"
      ],
      eat: ["Café at The Habitat", "Local snacks at the lower station"],
      tips: ["Book funicular tickets online to skip queues", "Bring a light jacket — it’s cooler at the top"]
    },
    {
      title: "Penang Botanical Gardens",
      summary: "Established in 1884, the Penang Botanical Gardens is the island’s oldest green space. Nestled at the foothills of Penang Hill, it features lush tropical flora, tranquil waterfalls, orchid gardens, and resident long-tailed macaques. A peaceful retreat for nature lovers, joggers, and photographers.",
      img: "elements/image/images-penang/mgp/must-go-place3.png",
      do: [
        "Walk the orchid and fern trails",
        "Visit the waterfall and lily pond",
        "Birdwatch or join a morning yoga session"
      ],
      eat: ["Bring your own picnic", "Fresh coconut from roadside vendors"],
      tips: ["Best visited in the morning", "Wear insect repellent"]
    },
    {
      title: "Batu Ferringhi Beach",
      summary: "Stretching along Penang’s northwest coast, Batu Ferringhi is the island’s most popular beach destination. With soft sand, gentle waves, and a lively promenade, it’s ideal for swimming, water sports, and seaside dining. By night, the area transforms with neon lights, night markets, and seafood grills.",
      img: "elements/image/images-penang/mgp/must-go-place4.png",
      do: [
        "Try parasailing or jet skiing",
        "Stroll along the beach promenade",
        "Shop and eat at the night market"
      ],
      eat: ["Grilled squid", "Freshly caught fish", "Chendol by the shore"],
      tips: ["Avoid monsoon season (Nov–Jan)", "Sunset is prime photo time"]
    },
    {
      title: "Chew Jetty & Clan Jetties",
      summary: "These historic waterfront settlements were built by Chinese immigrants in the 19th century. Chew Jetty, the largest of the seven clan jetties, features wooden houses on stilts, ancestral altars, and daily life unfolding over the sea. A unique cultural snapshot of Penang’s Peranakan heritage.",
      img: "elements/image/images-penang/mgp/must-go-place5.png",
      do: [
        "Walk the wooden piers and observe daily life",
        "Photograph colorful houses and shrines",
        "Visit during low tide for best reflections"
      ],
      eat: ["Traditional kuih (cakes)", "Tea at a family-run stall"],
      tips: ["Be respectful — this is a living community", "Visit mid-morning for natural light"]
    },
    {
      title: "Penang State Museum & Art Gallery",
      summary: "Housed in a colonial-era building near Fort Cornwallis, this museum tells the story of Penang from prehistoric times to independence. Exhibits include traditional costumes, ancient artifacts, photographs, and displays on the Peranakan, Malay, and Indian communities.",
      img: "elements/image/images-penang/mgp/must-go-place6.png",
      do: [
        "Explore the history and culture galleries",
        "See vintage photos of old George Town",
        "Admire the colonial architecture"
      ],
      eat: ["Café nearby on Light Street", "Grab lunch at Komtar after"],
      tips: ["Free entry", "Closed on Mondays"]
    },
    {
      title: "Tropical Fruit Farm (Penang Hill Fruit Farm)",
      summary: "Located near the base of Penang Hill, this eco-friendly farm introduces visitors to over 100 types of tropical fruits. From durian and rambutan to exotic species like langsat and pulasan, the guided tour includes tastings, farming insights, and jungle trails.",
      img: "elements/image/images-penang/mgp/must-go-place7.png",
      do: [
        "Join a guided fruit-tasting tour",
        "Learn about sustainable farming",
        "Walk the jungle trail and spot wildlife"
      ],
      eat: ["Fresh tropical fruit platters", "Durian tasting (seasonal)"],
      tips: ["Best visited in morning", "Wear closed shoes and bring water"]
    },
    {
      title: "Komtar",
      summary: "Short for Kompleks Tun Abdul Razak, Komtar is Penang’s tallest building and a symbol of urban transformation. Once a government complex, it now features a rooftop skywalk — Rainbow Skywalk — offering thrilling glass-floor views of George Town below.",
      img: "elements/image/images-penang/mgp/must-go-place8.png",
      do: [
        "Walk the Rainbow Skywalk (glass panel floor)",
        "Visit the rooftop observation deck",
        "Explore the shopping mall and food court"
      ],
      eat: ["Hawker food in Komtar basement", "Cafés on upper levels"],
      tips: ["Skywalk tickets include museum entry", "Less crowded on weekdays"]
    },
    {
      title: "Gurney Drive Hawker Centre",
      summary: "Gurney Drive is Penang’s most famous food destination. By day, the hawker centre serves legendary dishes; by night, the Gurney Night Market buzzes with food stalls, fashion, and live music. A must-visit for anyone chasing authentic Malaysian flavors.",
      img: "elements/image/images-penang/mgp/must-go-place9.png",
      do: [
        "Sample top street food vendors",
        "Explore the night market (Wed, Fri, Sat, Sun)",
        "Take a seaside evening stroll"
      ],
      eat: ["Char Kway Teow", "Hokkien Mee", "Oyster Omelette", "Apom Manis"],
      tips: ["Go early — popular stalls sell out", "Use GrabPay or cash"]
    },
    {
      title: "Kapitan Keling Mosque & Little India",
      summary: "The Kapitan Keling Mosque, built in 1801, is a historic landmark serving the Indian-Muslim community. It stands at the heart of Little India — a vibrant district filled with sari shops, spice stalls, gold merchants, and the scent of incense and masala.",
      img: "elements/image/images-penang/mgp/must-go-place10.png",
      do: [
        "Admire the mosque’s Mughal-style architecture",
        "Explore Little India’s colorful streets",
        "Attend cultural festivals like Deepavali"
      ],
      eat: ["Banana leaf rice", "Murtabak", "Mango lassi", "Rose syrup drink"],
      tips: ["Dress modestly when visiting the mosque", "Best explored in late afternoon"]
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
        name: "Asam Laksa",
        img: "elements/image/images-penang/mef/main-dishes/asam-laksa.png",
        desc: "Spicy-sour fish noodle soup with rice noodles, tamarind broth, pineapple, cucumber, and mint.",
        tags: ["Spicy", "Sour", "Best Seller", "Halal"],
        ingredients: ["Mackerel (ikan tenggiri)", "Tamarind", "Rice noodles", "Pineapple", "Cucumber", "Onion", "Chili", "Lemongrass", "Mint"],
        taste: "Tangy, spicy, aromatic, with a refreshing herbal finish.",
        origin: "Iconic Penang street food, rooted in Peranakan and Malay culinary traditions.",
        pair: "Iced lime tea (Sirap Limau) or coconut water.",
        price: "RM 9.50",
        nutrition: ["~480 kcal", "18 g protein", "62 g carbs", "14 g fat"]
      },
      {
        name: "Char Kway Teow",
        img: "elements/image/images-penang/mef/main-dishes/char-kuey-teow.png",
        desc: "Stir-fried flat rice noodles with prawns, cockles, egg, bean sprouts, and chili in dark soy sauce.",
        tags: ["Wok Hei", "Spicy", "Noodles", "Halal (select stalls)"],
        ingredients: ["Flat rice noodles", "Prawns", "Cockles", "Egg", "Bean sprouts", "Chili", "Dark soy sauce", "Lard or oil"],
        taste: "Smoky, savory, slightly sweet, with a bold umami kick from the wok fire.",
        origin: "Hokkien-Chinese heritage, perfected in Penang’s hawker centers.",
        pair: "Clear lime juice or chrysanthemum tea.",
        price: "RM 10.00",
        nutrition: ["~520 kcal", "15 g protein", "70 g carbs", "16 g fat"]
      },
      {
        name: "Hokkien Mee (Penang Prawn Mee)",
        img: "elements/image/images-penang/mef/main-dishes/hokkien-mee.png",
        desc: "Thick noodles in a rich, dark prawn broth, topped with boiled egg, prawns, pork, and fried shallots.",
        tags: ["Hearty", "Savory", "Broth-based", "Halal (available at Muslim stalls)"],
        ingredients: ["Yellow noodles", "Rice noodles", "Prawn stock", "Prawns", "Pork slices", "Boiled egg", "Fried shallots", "Chili"],
        taste: "Deeply umami, slightly sweet, with a spicy kick and rich seafood aroma.",
        origin: "Penang’s signature hawker dish, created by Chinese immigrants.",
        pair: "Iced Teh Tarik or plain water to balance the richness.",
        price: "RM 11.50",
        nutrition: ["~500 kcal", "20 g protein", "65 g carbs", "12 g fat"]
      }
    ],
    beverages: [
      {
        name: "Cendol",
        img: "elements/image/images-penang/mef/beverage/cendol.png",
        desc: "A refreshing iced dessert drink with green rice flour jelly, coconut milk, palm sugar, and red beans.",
        tags: ["Iced", "Sweet", "Dessert Drink", "Halal"],
        ingredients: ["Green jelly (rice flour)", "Coconut milk", "Gula Melaka (palm sugar)", "Shaved ice", "Red beans"],
        taste: "Creamy, sweet, with a rich caramel-like depth from gula melaka and cool texture from the jelly.",
        origin: "Traditional Malay dessert drink, widely perfected in Penang’s street stalls.",
        pair: "Best enjoyed on a hot day or after spicy food.",
        price: "RM 5.00",
        nutrition: ["~280 kcal", "6 g protein", "45 g carbs", "10 g fat"]
      },
      {
        name: "Lime Juice with Soda (Limau Ais Campur)",
        img: "elements/image/images-penang/mef/beverage/Lime-Juice.png",
        desc: "Freshly squeezed lime juice mixed with sugar, soda water, and ice — tangy, fizzy, and ultra- refreshing.",
        tags: ["Iced", "Tangy", "Refreshing", "Non-Alcoholic"],
        ingredients: ["Lime juice", "Sugar", "Soda water", "Ice"],
        taste: "Zesty, sour-sweet, with a crisp bubbly finish.",
        origin: "Popular street drink across Malaysia, especially iconic in Penang’s night markets.",
        pair: "Perfect with spicy or fried street food like char kway teow or nasi kandar.",
        price: "RM 3.80",
        nutrition: ["~110 kcal", "0 g protein", "28 g carbs", "0 g fat"]
      }
    ],
    snacks: [
      {
        name: "Apom Manis",
        img: "elements/image/images-penang/mef/snacks/apom-manis.png",
        desc: "Soft, fluffy pancakes made from fermented rice batter, topped with sugar and grated coconut.",
        tags: ["Sweet", "Traditional", "Halal"],
        ingredients: ["Rice flour", "Fermented batter", "Sugar", "Grated coconut"],
        taste: "Light, slightly tangy, with a sweet, creamy coconut finish.",
        origin: "Malay street snack, widely sold in Penang night markets.",
        pair: "Best enjoyed fresh and warm with a cup of hot tea.",
        price: "RM 1.80 (3 pieces)",
        nutrition: ["~120 kcal", "3 g protein", "25 g carbs", "2 g fat"]
      },
      {
        name: "Onde-Onde (Kuih Koci)",
        img: "elements/image/images-penang/mef/snacks/onde-onde.png",
        desc: "Sticky rice balls filled with palm sugar and rolled in grated coconut — sweet, warm, and fragrant.",
        tags: ["Sweet", "Dessert", "Vegetarian"],
        ingredients: ["Glutinous rice flour", "Gula Melaka(palm sugar)", "Grated coconut"],
        taste: "Chewy, sweet, with molten gula melaka center and floral coconut aroma.",
        origin: "Traditional Peranakan and Malay kuih, popular in Penang hawker stalls.",
        pair: "Teh Tarik or coffee.",
        price: "RM 2.50 (5 pieces)",
        nutrition: ["~140 kcal", "2 g protein", "28 g carbs", "5 g fat"]
      },
      {
        name: "Kuih Bahulu",
        img: "elements/image/images-penang/mef/snacks/kuih-bahulu.png",
        desc: "Mini sponge cakes with a soft, bouncy texture, baked in flower- shaped molds.",
        tags: ["Sweet", "Traditional", "Egg-based", "Halal"],
        ingredients: ["Eggs", "Flour", "Sugar", "Vanilla"],
        taste: "Light, fluffy, slightly eggy, with a hint of sweetness.",
        origin: "Traditional Malay and Peranakan baked snack, often served during festivals.",
        pair: "Afternoon tea or as a gift during Hari Raya.",
        price: "RM 3.00(6 pieces)",
        nutrition: ["~130 kcal", "4 g protein", "20 g carbs", "4 g fat"]
      }
    ],
    sides: [
      {
        name: "Tau Hu Goreng (Fried Tofu with Peanut Sauce)",
        img: "elements/image/images-penang/mef/sides/tahuGoreng.png",
        desc: "Crispy fried tofu served with a warm, savory peanut sauce and chili.",
        tags: ["Vegetarian", "Savory", "Halal (without shrimp paste)"],
        ingredients: ["Fried tofu", "Peanut sauce", "Kecap manis", "Chili", "Shallots", "Lime"],
        taste: "Crispy, nutty, slightly sweet and spicy with a tangy kick.",
        origin: "Chinese-Malay fusion snack, widely sold in Penang street food stalls.",
        pair: "Best with nasi kandar, char kway teow, or as a standalone side.",
        price: "RM 5.50",
        nutrition: ["~180 kcal", "8 g protein", "15 g carbs", "10 g fat"]
      },
      {
        name: "Otak-Otak",
        img: "elements/image/images-penang/mef/sides/Otak-Otak.png",
        desc: "Spiced fish mousse grilled in banana leaf — aromatic, soft, and smoky.",
        tags: ["Grilled", "Spicy", "Seafood", "Halal"],
        ingredients: ["Fish paste (mackerel)", "Coconut milk", "Spices", "Chilies", "Banana leaf"],
        taste: "Creamy, spicy, with a smoky aroma from grilling and rich coconut depth.",
        origin: "Traditional Malay coastal dish, with Penang’s version known for bold flavor.",
        pair: "Great with steamed rice, nasi kandar, or as a snack with lime.",
        price: "RM 6.00 (2 pieces)",
        nutrition: ["~210 kcal", "12 g protein", "8 g carbs", "14 g fat"]
      }
    ],
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
    id: "1",
    name: "Asam Laksa",
    image: "elements/image/images-penang/mef/main-dishes/asam-laksa.png",
    desc: "Spicy and sour fish noodle soup with tamarind, mint, and chili. A true Penang original.",
    category: "main-dishes"
  },
  {
    id: "2",
    name: "Char Kway Teow",
    image: "elements/image/images-penang/mef/main-dishes/char-kuey-teow.png",
    desc: "Stir-fried flat rice noodles with egg, prawns, bean sprouts, and dark soy sauce.",
    category: "main-dishes"
  },
  {
    id: "3",
    name: "Hokkien Mee (Penang Prawn Mee)s",
    image: "elements/image/images-penang/mef/main-dishes/hokkien-mee.png",
    desc: "Thick noodles braised in a rich, dark broth with pork, squid, and hard-boiled egg.",
    category: "main-dishes"
  },
  {
    id: "4",
    name: "Cendol",
    image: "elements/image/images-penang/mef/beverage/cendol.png",
    desc: "Iced dessert with green jelly, coconut milk, palm sugar, and red beans.",
    category: "beverages"
  },
  {
    id: "5",
    name: "Lime Juice with Soda (Limau Ais Campur)",
    image: "elements/image/images-penang/mef/beverage/Lime-Juice.png",
    desc: "Freshly squeezed lime with sugar and soda — tangy, fizzy, and ultra-refreshing.",
    category: "beverages"
  },
  {
    id: "6",
    name: "Apom Manis",
    image: "elements/image/images-penang/mef/snacks/apom-manis.png",
    desc: "Soft, fluffy pancakes made from fermented rice batter, topped with sugar and grated coconut.",
    category: "snacks"
  },
  {
    id: "7",
    name: "Onde-Onde (Kuih Koci)",
    image: "elements/image/images-penang/mef/snacks/onde-onde.png",
    desc: "Sticky rice balls filled with palm sugar and rolled in grated coconut — sweet, warm, and fragrant.",
    category: "snacks"
  },
  {
    id: "8",
    name: "Kuih Bahulu",
    image: "elements/image/images-penang/mef/snacks/kuih-bahulu.png",
    desc: "Mini sponge cakes with a soft, bouncy texture, baked in flower- shaped molds.",
    category: "snacks"
  },
  {
    id: "9",
    name: "Tau Hu Goreng (Fried Tofu with Peanut Sauce)",
    image: "elements/image/images-penang/mef/sides/tahuGoreng.png",
    desc: "Crispy fried tofu served with a warm, savory peanut sauce and chili.",
    category: "sides"
  },
  {
    id: "10",
    name: "Otak-Otak",
    image: "elements/image/images-penang/mef/sides/Otak-Otak.png",
    desc: "Spiced fish mousse grilled in banana leaf — aromatic, soft, and smoky.",
    category: "sides"
  },
  {
    id: "11",
    name: "Nasi Kandar",
    image: "elements/image/images-penang/mef/main-dishes/nasi-kandar.png",
    desc: "Steamed rice served with a variety of curries, fried chicken, squid, and gravy.",
    category: "main-dishes"
  },
  {
    id: "12",
    name: "Rojak",
    image: "elements/image/images-penang/mef/sides/rojak.png",
    desc: "Fruit and fritter salad with a sweet, spicy palm sugar and shrimp paste dressing.",
    category: "sides"
  },
  {
    id: "13",
    name: "Chee Cheong Fun",
    image: "elements/image/images-penang/mef/sides/chee-cheong-fun.png",
    desc: "Rice noodle rolls filled with shrimp or char siu, served with sweet soy and chili sauce.",
    category: "sides"
  },
  {
    id: "14",
    name: "Roti Canai",
    image: "elements/image/images-penang/mef/sides/roti-canai.png",
    desc: "Flaky flatbread served with dhal or curry for dipping — a Malaysian staple.",
    category: "sides"
  },
  {
    id: "15",
    name: "Ice Kacang",
    image: "elements/image/images-penang/mef/beverage/ice-kacang.png",
    desc: "Shaved ice mountain topped with sweet syrups, fruits, beans, and condensed milk.",
    category: "beverages"
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
    { id: 'c_teo', name: 'Teo QiYang', verified: true, text: 'Nothing beats a bowl of Asam Laksa at Air Itam Market on a hot afternoon. The tangy broth? Absolute fire!', likes: 999, avatar: 'elements/image/images-kedah/avatars/wyz.png' },
    { id: 'c_taylor_swift', name: 'Taylor Swift', verified: true, text: 'Tried Char Kway Teow at Gurney Drive — smoky, savory, and so delicious I might write a song about it.', likes: 320, avatar: 'elements/image/images-kedah/avatars/ts.png' },
    { id: 'c_the_rock', name: 'The Rock', verified: true, text: 'Roti Canai with dhal at a mamak stall at 2AM? That’s what I call a victory meal. Strong. Simple. Perfect.', likes: 210, avatar: 'elements/image/images-kedah/avatars/tr.png' },
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
