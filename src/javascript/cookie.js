/* =========================
   Cookie helpers
   ========================= */
function setCookie(name, value, days = 365) {
  const exp = new Date(Date.now() + days*24*60*60*1000).toUTCString();
  document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) +
    "; path=/; expires=" + exp;
}
function getCookie(name) {
  return document.cookie.split("; ").reduce((acc, cur) => {
    const [k, v] = cur.split("=");
    return k === encodeURIComponent(name) ? decodeURIComponent(v) : acc;
  }, null);
}
function eraseCookie(name) {
  document.cookie = encodeURIComponent(name) + "=; Max-Age=0; path=/";
}

/* =========================
   Consent logic
   ========================= */
// cookie_consent stores: "all" or "necessary"
function getConsent() { return getCookie("cookie_consent"); }
function userConsentedAll() { return getConsent() === "all"; }
function ensureBanner() {
  const banner = document.getElementById("cookieBanner");
  if (!banner) return;
  if (!getConsent()) banner.hidden = false; // show if not set
}

function acceptAll() {
  setCookie("cookie_consent", "all", 365);
  hideBanner();
  // run functional initializers now that consent is granted
  initFunctionalCookies();
}

function acceptNecessaryOnly() {
  setCookie("cookie_consent", "necessary", 365);
  hideBanner();
}

function hideBanner() {
  const banner = document.getElementById("cookieBanner");
  if (banner) banner.hidden = true;
}

/* =========================
   Functional features (only with 'all')
   ========================= */

// 1) currency_pref: remember #currencySelect (if present)
function initCurrencyPref() {
  const sel = document.getElementById("currencySelect");
  if (!sel) return;

  // load
  const saved = getCookie("currency_pref");
  if (saved) {
    const opt = [...sel.options].find(o => o.value === saved);
    if (opt) sel.value = saved;
  }

  // save
  sel.addEventListener("change", () => {
    if (userConsentedAll()) setCookie("currency_pref", sel.value, 365);
  }, { passive: true });
}

// 2) last_state_tab: remember last visible .state section (by id)
//    Your sections already use: <section class="state" id="perak"> etc.
function initLastStateTracker() {
  const sections = document.querySelectorAll("section.state[id]");
  if (!sections.length) return;

  // restore on load (scroll to last state if on same page)
  const last = getCookie("last_state_tab");
  if (last) {
    const el = document.getElementById(last);
    // only auto-scroll if it's on-screen page and not a disruptive route
    if (el && location.hash !== "#no-scroll") {
      el.scrollIntoView({ behavior: "instant", block: "start" });
    }
  }

  // observe visibility to update cookie
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting && en.intersectionRatio >= 0.5) {
        const id = en.target.id;
        if (userConsentedAll() && id) setCookie("last_state_tab", id, 30);
      }
    });
  }, { threshold: [0.5] });

  sections.forEach(s => io.observe(s));
}

// 3) last_page: remember last visited page; offer resume on landing
function initLastPage() {
  // save on exit
  window.addEventListener("beforeunload", () => {
    if (userConsentedAll()) {
      setCookie("last_page", window.location.pathname, 30);
    }
  });

  // Optionally: on your landing page only, prompt to resume
  // (If this file runs on all pages, guard by checking a data-attr or filename)
  const isLanding = /(^|\/)(index\.html)?$/.test(window.location.pathname);
  if (isLanding) {
    const last = getCookie("last_page");
    if (last && last !== window.location.pathname) {
      // polite prompt
      setTimeout(() => {
        const go = confirm("Continue where you left off?");
        if (go) window.location.href = last;
      }, 300);
    }
  }
}

// Bundle functional initializers
function initFunctionalCookies() {
  initCurrencyPref();
  initLastStateTracker();
  initLastPage();
}

/* =========================
   Wire up banner + init
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  // Banner buttons
  const btnAll = document.getElementById("cookieAcceptAll");
  const btnNecessary = document.getElementById("cookieNecessaryOnly");
  btnAll && btnAll.addEventListener("click", acceptAll);
  btnNecessary && btnNecessary.addEventListener("click", acceptNecessaryOnly);

  // Show banner if no choice yet
  ensureBanner();

  // If consent was already "all", run functional features
  if (userConsentedAll()) {
    initFunctionalCookies();
  }
});
