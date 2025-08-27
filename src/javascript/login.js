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

/* =========================
   Keys & helpers
   ========================= */
const USERS_KEY = "users_v1";         // { username: {password, email, picture, provider:"local"} }
const CURRENT_USER_KEY = "user";      // current session profile (localStorage)

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; }
  catch { return {}; }
}
function saveUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

// Cookie: remember for 3 days automatically
function setCookie(name, value, days = 3) {
  const exp = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + "; path=/; expires=" + exp;
}
function getCookie(name) {
  return document.cookie.split("; ").reduce((acc, cur) => {
    const [k, v] = cur.split("="); return k === encodeURIComponent(name) ? decodeURIComponent(v) : acc;
  }, null);
}
function eraseCookie(name) {
  document.cookie = encodeURIComponent(name) + "=; Max-Age=0; path=/";
}

/* =========================
   Local login
   ========================= */
const loginForm = document.getElementById("loginForm");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  loginError.style.display = "none";

  const users = getUsers();
  const u = loginUsername.value.trim();
  const p = loginPassword.value;

  if (!users[u] || users[u].password !== p) {
    loginError.style.display = "block";
    return;
  }

  const profile = { name: u, email: users[u].email || "", pic: users[u].picture || "", provider: "local" };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
  setCookie("remember_user", u, 3);  // always remember for 3 days
  showProfile(profile);
  loginForm.reset();
});

/* =========================
   Signup modal
   ========================= */
const modal = document.getElementById("signupModal");
const openSignup = document.getElementById("openSignup");
const closeSignup = document.getElementById("closeSignup");
openSignup.addEventListener("click", () => modal.classList.add("open"));
closeSignup.addEventListener("click", () => modal.classList.remove("open"));
modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("open"); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") modal.classList.remove("open"); });

const signupForm = document.getElementById("signupForm");
const suUsername = document.getElementById("suUsername");
const suEmail = document.getElementById("suEmail");
const suPassword = document.getElementById("suPassword");
const suPassword2 = document.getElementById("suPassword2");
const signupError = document.getElementById("signupError");
const signupOk = document.getElementById("signupOk");

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  signupError.style.display = "none"; signupOk.style.display = "none";

  const username = suUsername.value.trim();
  const email = suEmail.value.trim();
  const pass = suPassword.value;
  const pass2 = suPassword2.value;

  if (!username) return showSignupError("Username is required.");
  if (pass.length < 6) return showSignupError("Password must be at least 6 characters.");
  if (pass !== pass2) return showSignupError("Passwords do not match.");

  const users = getUsers();
  if (users[username]) return showSignupError("Username already exists.");

  users[username] = { password: pass, email, picture: "", provider: "local" };
  saveUsers(users);

  signupOk.style.display = "block";
  signupForm.reset();
  // close modal after a short delay
  setTimeout(() => modal.classList.remove("open"), 900);
});

function showSignupError(msg) {
  signupError.textContent = msg;
  signupError.style.display = "block";
}

/* =========================
   Google Sign-In
   ========================= */
function handleCredentialResponse(response) {
  const data = parseJwt(response.credential);
  const user = { name: data.name, email: data.email, pic: data.picture, provider: "google" };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  setCookie("remember_user", user.email || user.name, 3);  // always 3 days
  showProfile(user);
}
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  ).join(''));
  return JSON.parse(jsonPayload);
}

/* =========================
   Profile + Auto login
   ========================= */
function showProfile(user) {
  const box = document.getElementById("profile");
  box.style.display = "block";
  document.getElementById("avatar").src =
    user.pic || "https://ui-avatars.com/api/?background=DD5471&color=fff&name=" + encodeURIComponent(user.name?.[0] || "U");
  document.getElementById("welcome").textContent = "Hi, " + (user.name || "User");
  document.getElementById("email").textContent = user.email || "";
}

window.addEventListener("load", () => {
  // session first
  const s = localStorage.getItem(CURRENT_USER_KEY);
  if (s) { showProfile(JSON.parse(s)); return; }

  // else cookie (3 days)
  const remembered = getCookie("remember_user");
  if (remembered) {
    const users = getUsers();
    if (users[remembered]) {
      const found = users[remembered];
      const profile = { name: remembered, email: found.email || "", pic: found.picture || "", provider: "local" };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
      showProfile(profile);
    } else {
      // could be a previous Google login; just show name/email stored earlier if any
      // (if not found, do nothing; user can sign in again)
    }
  }
});

function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
  eraseCookie("remember_user");
  location.reload();
}
window.logout = logout; // expose for button