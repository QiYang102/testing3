// --- Section 1
// dropdown open/close
document.querySelectorAll('.menu-toggle').forEach((btn) => {
  btn.addEventListener('click', (e) => {
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

// close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.menu')) {
    document.querySelectorAll('.menu.open').forEach(m => {
      m.classList.remove('open');
      const t = m.querySelector('.menu-toggle');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }
});

// Esc key closes dropdown
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.menu.open').forEach(m => {
      m.classList.remove('open');
      const t = m.querySelector('.menu-toggle');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }
});

// Highlight parent dropdown if a child is active
document.querySelectorAll('.menu').forEach(menu => {
  const activeChild = menu.querySelector('.menu-list a.active');
  if (activeChild) {
    const toggleBtn = menu.querySelector('.menu-toggle');
    if (toggleBtn) toggleBtn.classList.add('active');
  }
});

// === Burger toggle for mobile nav ===
const burgerInput = document.getElementById("burger");
const nav = document.querySelector(".site-nav");

burgerInput.addEventListener("change", () => {
  if (burgerInput.checked) {
    nav.classList.add("nav--open");
  } else {
    nav.classList.remove("nav--open");
  }
});

// === Active link highlight ===
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
      img: 'elements/image/images-kedah/bg/kedah bg 1.png',
      text: "The history of Kedah does not start with rice, but with iron. Around 2,000 years ago, the Sungai Batu Archaeological Complex was one of Southeast Asia’s earliest urban centers. Archaeologists have found iron smelting furnaces, heaps of slag, and workshops that attest that Kedah was one of Southeast Asia’s primary iron centers. The industry supported thriving trade networks that linked Kedah with India, China, and the Middle East, turning it into a corner of world-wide commerce long before most other regional civilizations."
    },
    {
      img: 'elements/image/images-kedah/bg/kedah bg 2.png',
      text: "Kedah complemented its iron industry with an extensive network of river jetties, ports, and management centers. The structures attest that Kedah was no isolated village, but rather a cosmopolitan entrepôt. Traders from all over Asia anchored here and swapped iron, spices, and cultural practices. The finds at Sungai Batu rewrite Kedah’s past, pushing it at the very center of Asia’s earliest international maritime network."
    },
    {
      img: 'elements/image/images-kedah/bg/kedah bg 3.png',
      text: "Ancient Kedah was more than just an industrial hub, but also a religious landscape. Archaeologists unearthed ritual centers and Buddhist monuments at the site, testifying that religion and culture flourished alongside commerce. The monuments mirror the diversity of influences that molded Kedah’s identity, Hindu, Buddhist, and later Islamic faiths, making Kedah itself a veritable crossroads of civilizations."
    },
    {
      img: 'elements/image/images-kedah/bg/kedah bg 4.png',
      text: "While iron forged Kedah’s ancient image, rice shapes its contemporary one. The state gradually transformed from an industrial entrepôt into Malaysia’s “rice bowl” (Jelapang Padi), yielding nearly half of the country’s rice today. Kedah’s fertile plains, shielded and farmed by generations, are emblematic of food security, but also of the long-term versatility of the state through the centuries."
    }
  ];

  // Elements
  const imgEl = card.querySelector('.card-media img');
  const pEl   = card.querySelector('.card-body p');
  const prev  = document.getElementById('bgPrev');
  const next  = document.getElementById('bgNext');

  // Typing settings
  const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SPEED  = 6; // ms per char (faster than your old 9ms)
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
      title: "Wat Nikrodharam",
      summary:
        "Wat Nikrodharam is Kedah’s largest and most prominent Thai Buddhist temple, located in the heart of Alor Setar. Built in 1968, it showcases a blend of Thai, Chinese, and Burmese architecture, featuring ornate golden roofs, colorful statues, and detailed murals. As both a place of worship and a cultural emblem for the state’s Thai-Buddhist community, the temple stands as a living testament to Kedah’s rich cultural diversity.",
      img: "elements/image/images-kedah/mgp/wat nikrodharam.png",
      do: [ "Admire Thai-inspired architecture", "Explore colorful statues and murals", "Join temple festivals if visiting during celebrations" ],
      eat: [ "Nearby stalls (Thai-influenced dishes)", "Laksa Kedah and Nasi Lemak" ],
      tips: [ "Dress modestly and be respectful", "Entry is free", "Quieter in the morning" ],
    },
    {
      title: "Alor Setar Tower",
      summary:
        "Alor Setar Tower rises 165.5 meters above the Kedah skyline, offering breathtaking views of the “Rice Bowl of Malaysia.” More than just a telecommunications tower, it stands as an icon of the city. From the top, visitors can enjoy sweeping panoramas of lush paddy fields, the majestic Gunung Keriang, and even the distant coastline. By night, the tower glows brightly, adding a touch of modern sparkle to the city’s historic charm.",
      img: "elements/image/images-kedah/mgp/alor setar tower.jpg",
      do: [
        "Visit the observation deck for 360° views",
        "Dine at the revolving restaurant",
        "Capture sunset and night photos",
      ],
      eat: ["Nasi Lemak Royale (spicy, rich rice dish)", "Mee Abu (local noodles)"],
      tips: [ "Best light: sunrise or sunset", "Tickets available at entrance" ],
    },
    {
      title: "Zahir Mosque",
      summary:
        "Zahir Mosque is one of Malaysia’s oldest and most stunning mosques, constructed in 1912. With its striking Moorish-style domes and graceful minarets, it stands as a powerful symbol of Alor Setar and Kedah’s Islamic heritage. Beyond its role as a place of worship, the mosque is renowned for hosting the annual Quran-reading competition, drawing participants from across the globe.",
      img: "elements/image/images-kedah/mgp/zahir mosque.jpg",
      do: [ "Admire its domes & minarets", "Join guided mosque tours", "Capture photos at sunset" ],
      eat: [ "Kuey Teow Kerang (cockle noodles)", "Roti Canai Telur Bawang (flatbread with eggs & onions)" ],
      tips: [ "Non-Muslims welcome outside prayer times", "Fridays are the busiest & liveliest", "Dress appropriately", "Entry is free" ],
    },
    {
      title: "Bujang Valley Archaeological Site",
      summary:
        "Bujang Valley is the birthplace of ancient Kedah civilization, with ruins that stretch back more than 1,500 years. Once a thriving Hindu-Buddhist hub along the maritime silk route, it reveals Kedah’s early importance as a cosmopolitan trading center. Today, visitors can stroll among the candi (temple ruins), read ancient inscriptions, and explore the Bujang Valley Archaeological Museum, home to artifacts that reshape the story of Malaysian history.",
      img: "elements/image/images-kedah/mgp/bujang valley.jpg",
      do: ["Explore temple ruins (candi)", "Visit the museum", "Learn about Kedah’s ancient trade"],
      eat: ["Local warungs nearby", "Laksa Kedah (sour-spicy noodle soup)", "Nasi Daging Utara (spiced beef rice)"],
      tips: ["Go in the morning; it’s hot by noon", "Wear comfortable shoes"],
    },
    {
      title: "Payar Island",
      summary:
        "Payar Island is a marine sanctuary located just south of Langkawi, renowned for its crystal-clear waters and vibrant coral reefs. Recognized as one of the best snorkeling and diving spots in northern Malaysia, it is a popular highlight of day-trip packages from Langkawi. With its calm and pristine environment, Pulau Payar is an ideal escape for both adventurers and families seeking a peaceful island retreat.",
      img: "elements/image/images-kedah/mgp/payar island.png",
      do: [ "Snorkel with coral reefs", "Dive with tropical fish", "Relax on quiet beaches" ],
      eat: [ "Tour packages usually include meals", "Back in Langkawi: seafood grills & satay" ],
      tips: [ "Accessible only by boat tours", "Best season: Nov–Mar (calm seas)" ]
    },
    {
      title: "Mount Jerai",
      summary:
        "Mount Jerai, standing 1,217m above sea level, is Kedah’s sacred peak that once served as a guiding landmark for traders navigating the Straits of Malacca. Today, it is a serene highland retreat, offering cool mountain air, lush greenery, and sweeping views over endless rice fields and the Andaman Sea. With its blend of natural beauty and spiritual heritage, Mount Jerai is a must-visit for both nature enthusiasts and history lovers.",
      img: "elements/image/images-kedah/mgp/mount jerai.jpg",
      do: ["Drive or hike up for views", "Visit the botanical park", "Stay overnight at Jerai Hill Resort"],
      eat: ["Ikan Bakar Yan (grilled fish)", "Fresh seafood restaurants"],
      tips: ["Bring a jacket, evenings are cool", "Mornings often give clearest views"],
    },
    {
      title: "Kedah Paddy Fields",
      summary:
        "Kedah’s endless paddy fields are the reason it’s called the “Rice Bowl of Malaysia.” Sprawling across the plains, they shift between shades of green and gold with the seasons. These fields are more than farmland. They are living cultural landscapes, reflecting Kedah’s farming heritage, rural life, and role in sustaining food security. For visitors, they offer a peaceful retreat and a photographer’s dream backdrop.",
      img: "elements/image/images-kedah/mgp/kedah paddy fields.png",
      do: [ "Cycle or drive through scenic lanes", "Visit villages for cultural insight", "Photograph sunrise and sunset"],
      eat: [ "Ulam with sambal belacan (herbs & chili paste)", "Gulai nangka (jackfruit curry)", "Nasi ulam (herbed rice)" ],
      tips: [ "March–April & Sept–Oct: lush green", "May–June & Nov–Dec: golden harvest"],
    },
    {
      title: "Kuala Kedah Fort",
      summary:
        "Kuala Kedah Fort is a 17th-century stronghold that stands as a powerful reminder of Kedah’s resilience against foreign invasions. Once the state’s main coastal defense, it faced fierce battles with the Portuguese, Acehnese, and Siamese. Today, visitors can stroll through its ancient ruins and explore the small museum, which tells the story of Kedah’s role in maritime history. Sitting at the river mouth, the fort offers a tranquil yet scenic atmosphere, where history and nature blend together.",
      img: "elements/image/images-kedah/mgp/kuala kedah fort.png",
      do: [ "Explore the fort ruins", "Visit the small museum", "Enjoy river and coastal views" ],
      eat: [ "Mee Udang (prawn noodles)" , "Fresh seafood by the jetty" ],
      tips: [ "Little shade — bring a hat & water", "Best in morning or evening" ],
    },
    {
      title: "Kuala Kedah Mosque",
      summary:
        "Kuala Kedah Mosque is a reflection of the deep Islamic heritage of Kedah’s coastal community. Its simple yet graceful design rises against the sea, offering a peaceful stop for travelers. More than a religious site, the mosque is also a local gathering place, embodying the spiritual heart of life in Kedah.",
      img: "elements/image/images-kedah/mgp/kuala kedah mosque.jpg",
      do: [ "Admire its architecture", "Join prayers (if Muslim)", "Take sunset photos" ],
      eat: [ "Pasembur (crispy fritters with peanut sauce)", "Char Kuey Teow basah (wet stir-fried noodles)" ],
      tips: [ "Dress modestly when visiting", "Best at golden hour for photos" ],
    },
    {
      title: "Langkawi Island",
      summary:
        "Langkawi is Kedah's pearl and Malaysia's most famous island retreat. As a UNESCO Global Geopark, it boasts dramatic limestone outcrops, thriving mangrove forests, and lush rainforests. From mythic landmarks like Mahsuri’s Tomb to the grand eagle statue at Dataran Lang, and its stunning world-class beaches, Langkawi is both a tropical escape and a cultural jewel.",
      img: "elements/image/images-kedah/mgp/langkawi.png",
      do: [ "Visit Eagle Square (Dataran Lang)", "Ride the SkyCab & Sky Bridge", "Island-hop or explore mangroves", "Relax at Pantai Cenang beach" ],
      eat: [ "Laksa Power (Pantai Cenang)", "Ikan Bakar (grilled fish)", "Fresh seafood night markets" ],
      tips: [ "Best season: Nov–Apr (dry season)", "Duty-free shopping is everywhere" ],
    },
  ];

  // ----- DOM -----
  const wrap = document.getElementById("placesCarousel");
  if (!wrap) return;
  const row  = wrap.querySelector(".slides");
  const card = document.getElementById("placeCard");

  // ----- STATE -----
  let i = 0;
  const mod = (n, m) => ((n % m) + m) % m;

  // ----- HELPERS -----
  function makeCard(mark, d) {
    const div = document.createElement("div");
    div.className = `card ${mark} enter`;
    div.innerHTML = `<img src="${d.img}" alt="${d.title}">`;
    if (mark === "left")  div.addEventListener("click", () => { i = mod(i - 1, data.length); render(); });
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
    const leftIdx  = mod(i - 1, data.length);
    const rightIdx = mod(i + 1, data.length);
    row.appendChild(makeCard("left",   data[leftIdx]));
    row.appendChild(makeCard("active", data[i]));
    row.appendChild(makeCard("right",  data[rightIdx]));

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
  row.addEventListener("touchend",   e => {
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
        name: "Nasi Ulam Kedah",
        img: "elements/image/images-kedah/mef/main/nasi ulam.png",
        desc: "Fragrant rice mixed with fresh herbs, vegetables, and grated coconut, served with sambal and salted fish.",
        tags: ["Healthy", "Traditional", "Herbal"],
        ingredients: ["Rice", "Ulam herbs", "Grated coconut", "Salted fish", "Sambal"],
        taste: "Fresh, aromatic, slightly spicy.",
        origin: "Traditional Kedah village dish.",
        pair: "Ikan Pekasam or Air Nira Nipah.",
        price: "RM 8.00",
        nutrition: ["~480 kcal","12 g protein","68 g carbs","14 g fat"]
      },
      {
        name: "Nasi Daging Utara",
        img: "elements/image/images-kedah/mef/main/nasi daging.png",
        desc: "Rice infused with beef broth, served with tender beef slices and tangy air asam (tamarind chili dip).",
        tags: ["Rice", "Beef", "Specialty"],
        ingredients: ["Rice", "Beef", "Air asam", "Spices"],
        taste: "Savory, tangy, hearty.",
        origin: "Signature northern Kedah festive dish.",
        pair: "Teh O Panas.",
        price: "RM 10.50",
        nutrition: ["~600 kcal","24 g protein","72 g carbs","20 g fat"]
      },
      {
        name: "Laksa Kedah",
        img: "elements/image/images-kedah/mef/main/laksa kedah.png",
        desc: "Rice noodles served in spicy tamarind-based fish gravy, topped with herbs, cucumber, and boiled egg.",
        tags: ["Noodles", "Spicy", "Halal"],
        ingredients: ["Rice noodles", "Fish", "Tamarind", "Chili", "Cucumber", "Egg"],
        taste: "Tangy, spicy, aromatic.",
        origin: "Northern Kedah staple.",
        pair: "Sirap Limau or Teh Ais.",
        price: "RM 9.50",
        nutrition: ["~520 kcal","18 g protein","70 g carbs","15 g fat"]
      },  
    ],
    beverages: [
      {
        name: "Air Nira Nipah",
        img: "elements/image/images-kedah/mef/beverages/air nira.png",
        desc: "Refreshing sweet sap drink tapped from the nipah palm, enjoyed chilled.",
        tags: ["Refreshing", "Natural"],
        ingredients: ["Nipah palm sap"],
        taste: "Sweet, cooling, lightly fruity.",
        origin: "Traditional Kedah coastal drink.",
        pair: "Great with spicy dishes like Laksa Kedah.",
        price: "RM 4.00",
        nutrition: ["~120 kcal","0 g protein","30 g carbs","0 g fat"]
      },
      {
        name: "Teh Ais Madu",
        img: "elements/image/images-kedah/mef/beverages/teh ais madu.png",
        desc: "Iced tea sweetened with honey, a popular Kedah thirst quencher.",
        tags: ["Sweet", "Iced"],
        ingredients: ["Black tea", "Honey", "Ice"],
        taste: "Smooth, floral sweetness with a hint of bitterness.",
        origin: "Local mamak drink innovation.",
        pair: "Nasi Daging Utara.",
        price: "RM 3.50",
        nutrition: ["~90 kcal","0 g protein","22 g carbs","0 g fat"]
      },
    ],
    snacks: [
      {
        name: "Kuih Peneram",
        img: "elements/image/images-kedah/mef/snacks/kuih peneram.png",
        desc: "Deep-fried brown sugar dough rings with a chewy inside and crispy crust.",
        tags: ["Traditional", "Sweet"],
        ingredients: ["Rice flour", "Palm sugar", "Oil"],
        taste: "Sweet, chewy, slightly smoky.",
        origin: "Classic Kedah street snack.",
        pair: "Hot tea or coffee.",
        price: "RM 2.50 (3 pcs)",
        nutrition: ["~220 kcal","3 g protein","38 g carbs","7 g fat"]
      },
      {
        name: "Kuih Karas (Kuih Jala)",
        img: "elements/image/images-kedah/mef/snacks/kuih karas.png",
        desc: "Crispy lacy snack made from rice flour and sugar.",
        tags: ["Crunchy", "Sweet"],
        ingredients: ["Rice flour", "Sugar", "Oil"],
        taste: "Light, crispy, caramelized sweetness.",
        origin: "Traditional Kedah kuih.",
        pair: "Kopi O Kedah.",
        price: "RM 2.00",
        nutrition: ["~180 kcal","2 g protein","32 g carbs","6 g fat"]
      },
      {
        name: "Kuih Dangai",
        img: "elements/image/images-kedah/mef/snacks/kuih dangai.png",
        desc: "Toasted glutinous rice cake filled with grated coconut.",
        tags: ["Toasted", "Coconut"],
        ingredients: ["Glutinous rice flour", "Grated coconut", "Sugar"],
        taste: "Nutty, smoky, coconut-rich.",
        origin: "Traditional Kedah kuih.",
        pair: "Air Nira Nipah.",
        price: "RM 3.00",
        nutrition: ["~250 kcal","4 g protein","40 g carbs","9 g fat"]
      }
    ],
    sides: [
      {
        name: "Kerabu",
        img: "elements/image/images-kedah/mef/sides/kerabu.png",
        desc: "Herb-loaded salad with lime, chilies, and fish sauce.",
        tags: ["Salad", "Tangy", "Fresh"],
        ingredients: ["Herbs", "Lime juice", "Chilies", "Fish sauce / Budu", "Shredded fruits"],
        taste: "Tangy, spicy, fragrant, slightly salty.",
        origin: "Traditional Malay-style salad, popular in Kedah kampung feasts.",
        pair: "Best enjoyed with Nasi Ulam or grilled fish.",
        price: "RM 6.50",
        nutrition: ["~160 kcal","4 g protein","20 g carbs","7 g fat"]
      },
      {
        name: "Acar",
        img: "elements/image/images-kedah/mef/sides/acar.png",
        desc: "Pickled vegetables with turmeric and peanuts, often served at kenduri (feasts).",
        tags: ["Pickled", "Vibrant"],
        ingredients: ["Vegetables", "Turmeric", "Peanuts", "Vinegar"],
        taste: "Sweet, sour, mildly spicy.",
        origin: "Malay-Indian influenced side dish.",
        pair: "Beef curry and rice.",
        price: "RM 5.50",
        nutrition: ["~120 kcal","4 g protein","20 g carbs","4 g fat"]
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
  const imgEl  = hero.querySelector("#foodImg");
  const bgEl   = hero.querySelector("#foodBg");
  const prev   = hero.querySelector("#foodPrev");
  const next   = hero.querySelector("#foodNext");
  const bar    = hero.querySelector(".food-progress > span");
  const stageEl= hero.querySelector(".food-stage");
  const plateEl= hero.querySelector(".food-plate");

  // Info area
  const titleEl = document.getElementById("foodTitle");
  const tagsEl  = document.getElementById("foodTags");
  const textEl  = document.getElementById("foodText");
  const ingrEl  = document.getElementById("foodIngr");
  const tasteEl = document.getElementById("foodTaste");
  const originEl= document.getElementById("foodOrigin");
  const pairEl  = document.getElementById("foodPair");
  const priceEl = document.getElementById("foodPrice");
  const nutriEl = document.getElementById("foodNutri");

  const sec = {
    desc:  document.getElementById("sec-desc"),
    ingr:  document.getElementById("sec-ingr"),
    taste: document.getElementById("sec-taste"),
    origin:document.getElementById("sec-origin"),
    pair:  document.getElementById("sec-pair"),
    price: document.getElementById("sec-price"),
    nutri: document.getElementById("sec-nutri"),
  };

  // ---- State ----
  let cat = "main";
  let i = 0;
  const mod = (n,m)=>(n % m + m) % m;

  // ---- Fit name ----
  function fitNameToStage(){
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
    let lo=MIN, hi=MAX, best=MIN;
    for (let k=0;k<10;k++){
      const mid = (lo+hi>>1);
      nameEl.style.fontSize = mid+"px";
      nameEl.style.maxHeight = hardMax+"px";
      const fits = nameEl.scrollHeight <= hardMax + 1;
      if (fits){ best=mid; lo=mid+1; } else { hi=mid-1; }
    }
    nameEl.style.fontSize = best+"px";
    nameEl.style.maxHeight = hardMax+"px";
  }
  const fitSoon = ()=>requestAnimationFrame(()=>requestAnimationFrame(fitNameToStage));

  // ---- Fade helpers ----
  const FADE_MS = 220;
  const fadeEls = [nameEl, imgEl, titleEl, textEl];
  fadeEls.forEach(el => el && el.classList.add("food-fade"));

  function swapWithFade(updateFn){
    fadeEls.forEach(el => el && el.classList.remove("is-visible"));
    setTimeout(() => {
      updateFn();
      fadeEls.forEach(el => { if (el) void el.offsetWidth; });
      fadeEls.forEach(el => el && el.classList.add("is-visible"));
      fitSoon();
    }, FADE_MS);
  }

  const setHidden = (el, cond)=>{ if(!el) return; el.classList.toggle("is-hidden", !!cond); };

  // ---- Render ----
  function render(){
    const list = DATA[cat] || [];
    if(!list.length){
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
    bar.style.width = (((i+1)/list.length)*100) + "%";
    if (bgEl) bgEl.src = CAT_BG[cat] || "";

    // fade in content
    swapWithFade(() => {
      nameEl.textContent = item.name || "";
      imgEl.src = item.img || "";
      imgEl.alt = item.name || "";

      titleEl.textContent = item.name || "";

      tagsEl.innerHTML = "";
      (item.tags || []).forEach(t=>{
        const span = document.createElement("span");
        span.className = "food-tag";
        span.textContent = (t || "").trim();
        tagsEl.appendChild(span);
      });
      setHidden(tagsEl, !(item.tags && item.tags.length));

      textEl.textContent = item.desc || "";
      setHidden(sec.desc, !item.desc);

      ingrEl.innerHTML = "";
      (item.ingredients || []).forEach(x=>{
        const li = document.createElement("li");
        li.textContent = x;
        ingrEl.appendChild(li);
      });
      setHidden(sec.ingr, !(item.ingredients && item.ingredients.length));

      tasteEl.textContent  = item.taste  || "";
      originEl.textContent = item.origin || "";
      pairEl.textContent   = item.pair   || "";
      setHidden(sec.taste, !item.taste);
      setHidden(sec.origin,!item.origin);
      setHidden(sec.pair,  !item.pair);

      priceEl.textContent = item.price || "";
      setHidden(sec.price, !item.price);

      const n = item.nutrition || [];
      if (n.length === 4){
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

  function setActiveTab(btn){
    hero.querySelectorAll(".food-tab").forEach(b=>b.classList.toggle("is-active", b===btn));
  }

  // ---- Events ----
  tabs.forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const nextCat = btn.dataset.cat;
      if(!DATA[nextCat]) return;
      cat = nextCat; i = 0;
      setActiveTab(btn);
      render();
    });
  });

  document.getElementById("foodPrev").addEventListener("click", ()=>{
    const list = DATA[cat]||[]; if(!list.length) return;
    i = mod(i-1, list.length); render();
  });
  document.getElementById("foodNext").addEventListener("click", ()=>{
    const list = DATA[cat]||[]; if(!list.length) return;
    i = mod(i+1, list.length); render();
  });

  window.addEventListener("resize", fitSoon);
  if (document.fonts && document.fonts.ready){ document.fonts.ready.then(fitSoon).catch(()=>{}); }

  // ---- Init ----
  render();

  // Preload
  [...Object.values(CAT_BG), ...Object.values(DATA).flatMap(arr => arr.map(x => x.img))]
    .forEach(src => { const im = new Image(); im.src = src; });
})();






// New Section Food List

// Must match favourite.js
const FAV_KEY = "favouriteFoods";

// === FOOD DATA ===
const foodItems = [
  {
    id: "kh1",
    name: "Laksa Kedah",
    image: "elements/image/images-kedah/mef/main/laksa kedah.png",
    desc: "Rice noodles in a tamarind-forward fish broth, topped with herbs and chilies.",
    category: "main-dishes"
  },
  {
    id: "kh2",
    name: "Nasi Daging Utara",
    image: "elements/image/images-kedah/mef/main/nasi daging.png",
    desc: "Fragrant rice with spiced beef slices, served with tangy air asam (tamarind chili dip).",
    category: "main-dishes"
  },
  {
    id: "kh3",
    name: "Peknga",
    image: "elements/image/images-kedah/mef/main/peknga.png",
    desc: "Coconut milk flatbread, grilled until golden and often paired with curry or sambal.",
    category: "main-dishes"
  },
  {
    id: "kh4",
    name: "Gulai Nangka",
    image: "elements/image/images-kedah/mef/main/gulai nangka.png",
    desc: "Young jackfruit cooked in rich coconut curry with northern spices.",
    category: "main-dishes"
  },
  {
    id: "kh5",
    name: "Air Nira Nipah",
    image: "elements/image/images-kedah/mef/beverages/air nira.png",
    desc: "Refreshing sweet sap drink tapped from the nipah palm, enjoyed chilled.",
    category: "beverages"
  },
  {
    id: "kh6",
    name: "Teh Ais Madu",
    image: "elements/image/images-kedah/mef/beverages/teh ais madu.png",
    desc: "Iced tea sweetened with honey, a popular Kedah thirst quencher.",
    category: "beverages"
  },
  {
    id: "kh7",
    name: "Air Asam Kedah",
    image: "elements/image/images-kedah/mef/beverages/air asam.png",
    desc: "Tamarind drink with chili and salt, tangy and cooling.",
    category: "beverages"
  },
  {
    id: "kh8",
    name: "Kopi O Kedah",
    image: "elements/image/images-kedah/mef/beverages/kopi o.png",
    desc: "Strong black coffee with bold, roasted flavor, served hot or iced.",
    category: "beverages"
  },
  {
    id: "kh9",
    name: "Kuih Karas (Kuih Jala)",
    image: "elements/image/images-kedah/mef/snacks/kuih karas.png",
    desc: "Crispy lacy snack made from rice flour and sugar.",
    category: "snacks"
  },
  {
    id: "kh10",
    name: "Kuih Peneram",
    image: "elements/image/images-kedah/mef/snacks/kuih peneram.png",
    desc: "Deep-fried brown sugar dough rings with a chewy inside and crispy crust.",
    category: "snacks"
  },
  {
    id: "kh11",
    name: "Kuih Dangai",
    image: "elements/image/images-kedah/mef/snacks/kuih dangai.png",
    desc: "Toasted glutinous rice cake filled with grated coconut.",
    category: "snacks"
  },
  {
    id: "kh12",
    name: "Apam Lenggang",
    image: "elements/image/images-kedah/mef/snacks/apam lenggang.png",
    desc: "Soft folded pancake filled with grated coconut and palm sugar.",
    category: "snacks"
  },
  {
    id: "kh13",
    name: "Ikan Pekasam Kedah",
    image: "elements/image/images-kedah/mef/sides/ikan pekasam.png",
    desc: "Fermented freshwater fish, fried until crispy, a Kedah specialty.",
    category: "sides"
  },
  {
    id: "kh14",
    name: "Sambal Gesek",
    image: "elements/image/images-kedah/mef/sides/sambal gesek.png",
    desc: "Fiery chili paste pounded by hand with shrimp paste, lime, and salt. Served fresh with rice and ulam.",
    category: "sides"
  },
  {
    id: "kh15",
    name: "Kerabu",
    image: "elements/image/images-kedah/mef/sides/kerabu.png",
    desc: "Herb-loaded salad with lime, chilies, and fish sauce.",
    category: "sides"
  },
  {
    id: "kh16",
    name: "Acar",
    image: "elements/image/images-kedah/mef/sides/acar.png",
    desc: "Pickled vegetables with turmeric and peanuts.",
    category: "sides"
  },
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






// --- Section 5 ---
(() => {
  // ====== SPEED KNOBS ======
  const ROTATE_MS = 2000;  // auto-rotate interval (ms)
  const PAUSE_MS  = 3000;  // pause after user action (ms)

  // ====== DOM ======
  const carousel = document.getElementById('commentCarousel');
  const card     = document.getElementById('commentCard');
  const openBtn  = document.getElementById('openComment');
  const form     = document.getElementById('commentForm');
  const cancel   = document.getElementById('cancelComment');
  const send     = document.getElementById('sendComment');
  const input    = document.getElementById('commentInput');
  if (!carousel || !card) return;

  const btnNext  = document.getElementById('nextComment');
  const btnPrev  = document.getElementById('prevComment');

  // ====== CONSTS / STORAGE ======
  const DEFAULT_AVATAR = 'elements/image/images-kedah/avatars/unknownuser.png';
  const LS_COMMENTS = 'mi_comments_v1';
  const LS_LIKES    = 'mi_likes_v1';

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
    { id: 'c_teo',          name: 'Teo QiYang',       verified: true,  text: 'I think Kopi O Ais is the best beverage in Ipoh!', likes: 999, avatar: 'elements/image/images-kedah/avatars/wyz.png' },
    { id: 'c_taylor_swift', name: 'Taylor Swift',     verified: true, text: 'Laksa Kedah hits different after a rainy day. So good!', likes: 320, avatar: 'elements/image/images-kedah/avatars/ts.png' },
    { id: 'c_the_rock',     name: 'The Rock',         verified: true, text: 'Street satay by the river, nothing beats that smoky aroma.', likes: 210, avatar: 'elements/image/images-kedah/avatars/tr.png' },
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
    const heart    = card.querySelector('.heart');
    const countEl  = card.querySelector('.like-count');
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
  openBtn.addEventListener('click', () => { form.hidden = false; input.focus(); paused = true; stopAuto(); });
  cancel.addEventListener('click', () => { input.value = ''; form.hidden = true; paused = false; startAuto(); });
  send.addEventListener('click', () => {
    const text = (input.value || '').trim();
    if (!text) { input.focus(); input.placeholder = "Comment can't be empty"; return; }

    const id = 'c_user_' + Date.now();
    const newComment = { id, name: 'UnknownUser', verified: false, text, likes: 0, avatar: DEFAULT_AVATAR };

    const stored = loadUserComments(); stored.push(newComment); saveUserComments(stored);
    comments.push(newComment); i = comments.length - 1; render();

    input.value = ''; form.hidden = true; paused = false; startAuto();
  });

  // ====== INIT ======
  render();
  startAuto();
})();
