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
            img: 'elements/image/images-kelantan/background/kelantan_map.png',
            text: "Kelantan, located in the northeastern region of Peninsular Malaysia, is often regarded as one of the country’s most culturally distinctive states. The state is well known for its strong adherence to traditional Malay customs and Islamic values, which has shaped many aspects of daily life, governance, and social practices. While outsiders sometimes perceive Kelantan as conservative, citing features such as gender-segregated seating in certain public settings, stricter regulations on entertainment, and modest dress codes, the state is also deeply respected for preserving its cultural and religious heritage."
        },
        {
            img: 'elements/image/images-kelantan/background/kelantan_bahasa.jpg',
            text: "Kelantanese Malay, a unique dialect, is widely spoken across the state, adding further richness to its identity. However, visitors occasionally note infrastructural challenges such as limited modern entertainment options (for example, cinemas are absent in some districts) and concerns about water cleanliness. Despite these perceptions, Kelantan remains a place of vibrant traditions, warmth, and hospitality."
        },
        {
            img: 'elements/image/images-kelantan/background/kelantan_warisan.png',
            text: "Kelantan, known as the “Cradle of Malay Culture”, is rich in warisan (heritage) such as Wayang Kulit, Mak Yong (UNESCO-recognized dance-drama), Dikir Barat, and traditional songket weaving. Despite modernization, the state remains a vital custodian of Malaysia’s cultural identity through its arts, crafts, and performances."
        },
        {
            img: 'elements/image/images-kelantan/background/kelantan_floatmarket.jpg',
            text: "The Kelantan Floating Market, located along the river in Kota Bharu, offers a unique shopping experience where traders sell local food, fruits, and handicrafts directly from boats. It reflects the state’s close cultural ties with Thailand and has become both a community hub and a popular tourist attraction."
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
            title: "Wat Photivihan (Sleeping Buddha Temple)",
            summary:
                "Wat Photivihan, located in Tumpat, Kelantan, is one of Malaysia’s most iconic Buddhist temples. It is renowned for housing one of Southeast Asia’s largest reclining Buddha statues, stretching 40 meters in length, which symbolizes peace and enlightenment. Surrounded by prayer halls and smaller shrines, the temple offers visitors a glimpse of Kelantan’s Thai-Buddhist heritage and a tranquil escape from the bustle of the city.",
            img: "elements/image/images-kelantan/mustgoplace/sleepingbuddha.jpg",
            do: [
                "Admire the massive reclining Buddha statue",
                "Explore the temple grounds and smaller shrines",
                "Learn about Thai-Buddhist culture in Kelantan"
            ],
            "eat": ["Try local Kelantanese delicacies such as nasi kerabu or nasi berlauk"],
            "tips": ["Sample Thai-influenced dishes available around Tumpat"]
        },
        {
            title: "Pantai Suri Floating Market",
            summary:
                "Pantai Suri Floating Market, located near Kota Bharu, is the first and most famous floating market in Kelantan. Every weekend, local traders sell fresh produce, traditional snacks, and handicrafts from small boats along the river, creating a vibrant atmosphere that reflects Kelantan’s close cultural ties with southern Thailand. It’s a lively destination that combines shopping, food, and cultural experience in one unique setting.",
            img: "elements/image/images-kelantan/mustgoplace/floating market.jpg",
            do: [
                "Shop for fresh fruits, vegetables, and local crafts from boats",
                "Take photos of the colorful riverside scene",
                "Experience the community vibe and interact with friendly locals"
            ],
            eat: ["Enjoy Kelantan specialties like nasi kerabu, nasi dagang, and kuih akok"],
            tips: ["Arrive early for the best selection and cooler weather"]
        },
        {
            title: "Pantai Cahaya Bulan",
            summary: "Pantai Cahaya Bulan, formerly known as Pantai Cinta Berahi or “Beach of Passionate Love,” is one of Kelantan’s most popular coastal attractions. Stretching for about 1.2 kilometers along the South China Sea, the beach is well known for its scenic views, relaxing atmosphere, and vibrant local stalls selling snacks and handicrafts. It is a favorite weekend spot for both locals and tourists.",
            img: "elements/image/images-kelantan/mustgoplace/pcb.jpg",
            do: [
                "Stroll along the sandy beach and enjoy the sea breeze",
                "Shop for batik, handicrafts, and kites from nearby stalls",
                "Fly traditional wau (moon kites) or enjoy seaside photography"
            ],
            eat: ["Savor grilled seafood from beachside vendors"],
            tips: ["Swimming is not recommended due to strong waves"]
        },
        {
            title: "Sitting Buddha Temple (Wat Machimmaram)",
            summary:
                "Wat Machimmaram, located in Tumpat, Kelantan, is home to one of the largest sitting Buddha statues in Southeast Asia, standing at nearly 30 meters tall. The temple showcases Thai-Buddhist architectural influences and offers visitors a peaceful environment for reflection and cultural appreciation. It is a significant spiritual site as well as a striking landmark for those exploring Kelantan’s religious heritage.",
            img: "elements/image/images-kelantan/mustgoplace/sittingbuddha.jpg",
            do: [
                "Admire the towering Sitting Buddha statue up close",
                "Explore the temple grounds and surrounding shrines",
                "Learn about Buddhist rituals and Thai-inspired architecture"
            ],
            eat: ["Try Thai-style snacks and desserts available in nearby Tumpat"],
            tips: ["Wear modest clothing when visiting religious sites"]
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
                name: "Nasi Kerabu",
                img: "elements/image/images-kelantan/musteatfood/nasikerabu.jpg",
                desc: "Fragrant herb rice often naturally blue from butterfly pea—served with fresh ulam (herbs and vegetables), salted egg, keropok, toasted coconut (serunding/kerisik), budu (fermented anchovy sauce), and a choice of protein (fried chicken, grilled fish, or beef).",
                tags: ["Signature", "Halal", "Blue Rice", "Traditional"],
                ingredients: ["Rice (dyed with butterfly pea / bunga telang)", "Ulam (basil, mint)", "Serunding (toasted coconut)", "Budu or sambal", "Salted egg", "Keropok", "Ayam / Ikan / Daging", "Calamansi"],
                taste: "Herbaceous, fresh, lightly tangy and savory with umami from budu; crunchy textures from ulam and keropok.",
                origin: "A classic Kelantanese dish rooted in East Coast Malay culinary traditions, influenced by regional herbs and coastal flavors.",
                pair: "Iced tea (Teh O Ais Limau) or coconut water; side of ayam percik or grilled mackerel.",
                price: "RM 10",
                nutrition: ["~550 kcal", "20 g protein", "70 g carbs", "18 g fat"]
            },
            {
                name: "Kelantan Laksa",
                img: "elements/image/images-kelantan/musteatfood/kelantanlaksa.jpg",
                desc: "Kelantan Laksa is a rich and creamy noodle dish featuring thick rice noodles served with a coconut milk and fish-based gravy. Unlike other regional laksas, it is milder, with a subtle sweetness and aromatic herbs that reflect Kelantan’s coastal influences.",
                tags: ["Creamy", "Seafood", "Traditional", "Halal"],
                ingredients: ["Think rice noodles", "Coconut milk", "Mackerel / Sardine", "Chilies", "Onion", "Garlic", "Calamansi"],
                taste: "Creamy, savory, and mildly spicy with a hint of sweetness, balanced by fresh herbs and citrusy notes.",
                origin: "A Kelantanese specialty distinct from Penang or Johor laksa, deeply rooted in Malay coastal culinary traditions.",
                pair: "Teh O Panas (hot black tea) or iced lime juice for a refreshing balance.",
                price: "RM 4.00",
                nutrition: ["~520 kcal", "19 g protein", "64 g carbs", "16 g fat"]
            },
            {
                name: "Nasi Tumpang",
                img: "elements/image/images-kelantan/musteatfood/nasitumpang.jpg",
                desc: "Nasi Tumpang is a uniquely Kelantanese dish where rice and assorted side dishes are layered inside a banana leaf, shaped into a tall cone. Traditionally made for travelers and farmers, it combines flavors of curry, sambal, and serunding in one convenient package.",
                tags: ["Layered", "Savory", "Traditional", "Halal"],
                ingredients: ["White steamed rice", "Gulai ikan", "Spicy chili paste", "Omelette", "Banana leaf wrapping"],
                taste: "Savory, mildly spicy, aromatic, with layers of texture and flavor in every bite.",
                origin: "A heritage dish from Kelantan, originally created as a practical packed meal for farmers and travelers, symbolizing convenience and tradition.",
                pair: "Hot black coffee (Kopi O) or sweet teh tarik for a hearty breakfast combo.",
                price: "RM 3.00",
                nutrition: ["~600 kcal", "22 g protein", "80 g carbs", "20 g fat"]
            }
        ],
        beverages: [
            {
                name: "Teh Tarik Madu",
                img: "elements/image/images-kelantan/musteatfood/tehtarikmadu.jpg",
                desc: "Teh Tarik Madu is a Kelantanese twist on Malaysia’s iconic pulled tea, enriched with honey (madu) for added sweetness and aroma. The drink is “pulled” between two cups to create a frothy top, making it both delicious and visually appealing.",
                tags: ["Creamy", "Sweet", "Dessert Drink", "Halal"],
                ingredients: ["Black tea", "Condensed milk", "Honey"],
                taste: "Creamy, sweet, and smooth with a floral honey note, balanced by the robustness of black tea.",
                origin: "A Kelantan specialty drink, it elevates the classic teh tarik with natural honey, reflecting local taste preferences for richer, sweeter beverages.",
                pair: "Perfect with nasi lemak, roti canai, or Kelantanese kuih (traditional cakes)..",
                price: "RM 4.00",
                nutrition: ["~200 kcal", "4 g protein", "35 g carbs", "6 g fat"]
            },
            {
                name: "Local Carbonated Drink",
                img: "elements/image/images-kelantan/musteatfood/localcarbonateddrink.jpg",
                desc: "A nostalgic Kelantanese carbonated beverage, popular at local stalls and markets, offering a refreshing sweetness with a fizzy kick. Traditionally, some versions use fermented palm sap (nira) made into a soda, while bottled brands like Air Cap Badak remain a cultural favorite.",
                tags: ["Fizzy", "Sweet", "Refreshing", "Halal"],
                ingredients: ["Carbonated water", "Palm sugar syrup", "Palm sap", "Ice cubes"],
                taste: "Sweet, fizzy, and cooling, with notes of caramelized sugar or light herbal undertones depending on the variety.",
                origin: "A long-standing Kelantanese favorite, sold at night markets, roadside stalls, and festive occasions as a refreshing alternative to modern sodas.",
                pair: "Great with spicy Kelantanese dishes like nasi kerabu, nasi dagang, or grilled seafood.",
                price: "RM 2.00",
                nutrition: ["~150 kcal", "0 g protein", "38 g carbs", "0 g fat"]
            }
        ],
        snacks: [
            {
                name: "Buah Salak (Snake Fruit)",
                img: "elements/image/images-kelantan//musteatfood/buahsalak.png",
                desc: "Buah Salak, also known as snake fruit due to its reddish-brown scaly skin, is a tropical fruit enjoyed in Kelantan and neighboring regions. Its flesh is firm and crunchy, offering a sweet yet slightly tangy flavor that makes it a popular seasonal treat.",
                tags: ["Exotic", "Tropical", "Seasonal"],
                ingredients: ["-"],
                taste: "Sweet with a hint of acidity, crunchy texture similar to apple, with a dry finish.",
                origin: "Originally cultivated in Indonesia and southern Thailand, buah salak is also grown in Kelantan, where it is sold in markets as a local delicacy.",
                pair: "Eaten fresh as a snack, or enjoyed alongside tea or traditional kuih.",
                price: "RM 8.50 (1 kilogram)",
                nutrition: ["~80 kcal", "0.4 g protein", "22 g carbs", "0.4 g fat"]
            },
            {
                name: "Kuih Akok",
                img: "elements/image/images-kelantan/musteatfood/kuihakok.jpg",
                desc: "Kuih Akok is a beloved Kelantanese traditional dessert made from eggs, coconut milk, palm sugar, and flour, baked or grilled until golden brown. Known for its soft, custard-like texture and rich caramel flavor, it is often enjoyed as a tea-time snack.",
                tags: ["Sweet", "Traditional", "Dessert", "Halal"],
                ingredients: ["Eggs", "Coconut milk", "Palm sugar", "Rice flour", "Salt"],
                taste: "Sweet, creamy, and slightly smoky with a soft, melt-in-the-mouth texture.",
                origin: "Originating from Kelantan, kuih akok reflects the East Coast’s love for egg-rich, coconut-based desserts passed down through generations.",
                pair: "Perfect with hot teh tarik, kopi o, or Kelantanese herbal drinks.",
                price: "RM 2.50(3 pieces)",
                nutrition: ["~120 kcal", "3 g protein", "15 g carbs", "6 g fat"]
            }
        ],
        sides: [
            {
                name: "Lok Ching",
                img: "elements/image/images-kelantan/musteatfood/lokching.jpg",
                desc: "Lok Ching is a popular Kelantanese street snack consisting of skewered meatballs, fish balls, or sausages grilled over hot coals. Served with a choice of sweet chili, peanut, or spicy dipping sauces, it is a favorite among locals, especially at night markets and fairs.",
                tags: ["Street Food", "Grilled", "Savoury"],
                ingredients: ["Meat / Fish", "Chili sauce"],
                taste: "Smoky, savory, and slightly chewy with a satisfying balance of sweet and spicy from the dipping sauces.",
                origin: "A beloved street food in Kelantan, influenced by Thai night market culture, making it both affordable and widely accessible.",
                pair: "Perfect with iced drinks like teh o ais limau or a local carbonated soda.",
                price: "RM 1.00 (1 stick)",
                nutrition: ["~90 kcal", "4 g protein", "6 g carbs", "5 g fat"]
            },
        ],
    };

    const CAT_BG = {
        main: "elements/image/images-kelantan/food bg.png",
        beverages: "elements/image/images-kelantan/beverage bg.png",
        sides: "elements/image/images-kelantan/side bg.png",
        snacks: "elements/image/images-kelantan/snack bg.png",
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
// === Kelantan.js ===
// Handles rendering Kelantan foods + favourites integration

// Must match favourite.js
const FAV_KEY = "favouriteFoods";

// === FOOD DATA ===
const foodItems = [
    {
        id: "kn1",
        name: "Nasi Kerabu",
        image: "elements/image/images-kelantan/musteatfood/nasikerabu.jpg",
        desc: "Fragrant herb rice often naturally blue from butterfly pea served with fresh ulam, salted egg, keropok, toasted coconut, budu, and a choice of protein.",
        category: "main-dishes"
    },
    {
        id: "kn2",
        name: "Kelantan Laksa",
        image: "elements/image/images-kelantan/musteatfood/kelantanlaksa.jpg",
        desc: "Rich and creamy noodle dish featuring thick rice noodles served with a coconut milk and fish-based gravy.",
        category: "main-dishes"
    },
    {
        id: "kn3",
        name: "Nasi Tumpang",
        image: "elements/image/images-kelantan/musteatfood/nasitumpang.jpg",
        desc: "Uniquely Kelantanese dish where rice and assorted side dishes are layered inside a banana leaf, shaped into a tall cone.",
        category: "main-dishes"
    },
    {
        id: "kn4",
        name: "Teh Tarik Madul",
        image: "elements/image/images-kelantan/musteatfood/tehtarikmadu.jpg",
        desc: "Kelantanese twist on Malaysia’s iconic pulled tea, enriched with honey for added sweetness and aroma.",
        category: "beverages"
    },
    {
        id: "kn5",
        name: "Local Carbonated Drink",
        image: "elements/image/images-kelantan/musteatfood/localcarbonateddrink.jpg",
        desc: "A nostalgic Kelantanese carbonated beverage, popular at local stalls and markets, offering a refreshing sweetness with a fizzy kick.",
        category: "beverages"
    },
    {
        id: "kn6",
        name: "Buah Salak (Snake Fruit)",
        image: "elements/image/images-kelantan//musteatfood/buahsalak.png",
        desc: "Known as snake fruit, well-known of its firm and crunchy flesh, offering a sweet yet slightly tangy flavor that makes it a popular seasonal treat.",
        category: "snacks"
    },
    {
        id: "kn7",
        name: "Kuih Akok",
        image: "elements/image/images-kelantan/musteatfood/kuihakok.jpg",
        desc: "Kelantanese traditional dessert known for its soft, custard-like texture and rich caramel flavor, it is often enjoyed as a tea-time snack.",
        category: "snacks"
    },
    {
        id: "kn8",
        name: "Lok Ching",
        image: "elements/image/images-kelantan/musteatfood/lokching.jpg",
        desc: "Kelantanese street snack served with a choice of sweet chili, peanut, or spicy dipping sauces, it is a favorite among locals, especially at night markets and fairs.",
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
    const DEFAULT_AVATAR = 'elements/image/images-kelantan/avatars/unknownuser.png';
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
        { id: 'c_teo', name: 'Teo QiYang', verified: true, text: 'Nothing beats a bowl of Asam Laksa at Air Itam Market on a hot afternoon. The tangy broth? Absolute fire!', likes: 999, avatar: 'elements/image/images-kelantan/wyz.png' },
        { id: 'c_taylor_swift', name: 'Taylor Swift', verified: true, text: 'Tried Char Kway Teow at Gurney Drive — smoky, savory, and so delicious I might write a song about it.', likes: 320, avatar: 'elements/image/images-kelantan/ts.png' },
        { id: 'c_the_rock', name: 'The Rock', verified: true, text: 'Roti Canai with dhal at a mamak stall at 2AM? That’s what I call a victory meal. Strong. Simple. Perfect.', likes: 210, avatar: 'elements/image/images-kelantan/tr.png' },
        { id: 'c_bailu', name: 'Chong Win Nie', verified: true, text: 'Kelantan is full of authentic flavors with living heritage.', likes: 999, avatar: 'elements/image/images-kelantan/bl.png' }
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