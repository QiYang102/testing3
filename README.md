# Login Page System Summary

## 📌 Overview
This web page provides a simple login system with two methods:
1. **Local Account Login** (username + password)
2. **Google Sign-In** (via Google Identity Services API)

Users can also create accounts locally through a sign-up modal. After successful login, a profile preview with avatar, name, and email is displayed.

---

## 📂 Data Storage

### Local Storage (persists until cleared by the user/browser)
- **`users_v1`** → Stores all locally registered users.  
  Example structure:
  {
    "alex_tan": {
      "password": "mypassword",
      "email": "alex@example.com",
      "picture": "",
      "provider": "local"
    }
  }
- **`user`** → Stores the current session profile.  
  Example:
  {
    "name": "Alex Tan",
    "email": "alex@example.com",
    "pic": "https://someurl.com/avatar.jpg",
    "provider": "local"
  }

⚠️ Note: Passwords are stored in **plain text** here for demonstration purposes only (not secure in real-world use).

---

### Cookies
- **Name:** `remember_user`  
- **Value:**  
  - Local login → the username  
  - Google login → the email (or name if email missing)  
- **Lifetime:** 3 days from last login  
- **Purpose:** Enables “auto-login” if no session is found in localStorage.

---

## 🔄 Login / Logout Flow

### Local Login
- User enters username and password.  
- System validates against `users_v1`.  
- On success:
  - Stores current profile in `user` (localStorage).  
  - Sets `remember_user` cookie (3 days).  
  - Displays profile.

### Google Login
- Uses Google Identity Services API.  
- Decodes ID token (JWT) to extract `name`, `email`, `picture`.  
- On success:
  - Stores current profile in `user` (localStorage).  
  - Sets `remember_user` cookie (3 days).  
  - Displays profile.

### Auto Login (on page load)
- If `user` exists in localStorage → show profile immediately.  
- Else if `remember_user` cookie exists:
  - If it matches a local account in `users_v1`, rebuild profile and show it.  
  - If it was a Google login, user may need to log in again.

### Logout
- Removes `user` from localStorage.  
- Deletes `remember_user` cookie.  
- Reloads the page.

---

## 🎨 UI and Responsiveness
- Background image applied to the page:
  body {
    background-image: url("../elements/image/image 12.png");
    background-size: cover;
    background-position: center;
  }
- Side illustration (`image 10.png`) is hidden on small screens (≤ 768px):
  @media (max-width: 768px) {
    .container > img { display: none; }
  }

---

## 🔐 Security Notes
- This is a **front-end only demo** (no server/database).  
- **Passwords are stored in plain text** in localStorage → not secure.  
- For real applications:
  - Use a backend server and secure database.  
  - Hash passwords (e.g., bcrypt, argon2).  
  - Use httpOnly secure cookies or tokens.  
  - Verify Google ID tokens server-side.

---

## ✅ Assignment Relevance
- **External API used:** Google Identity Services (RESTful).  
- **Client-side storage used:** localStorage + cookies.  
- **Session handling:** Auto login for 3 days via cookie.  
- **Responsiveness:** Adapts layout for desktop and mobile.

---

## 📊 Login Flow Diagram

flowchart TD
    A[User opens Login Page] --> B{Session in localStorage?}
    B -- Yes --> C[Show profile immediately]
    B -- No --> D{remember_user cookie exists?}
    D -- Yes --> E[Rebuild profile from local account]
    D -- No --> F[User must log in]

    F --> G[Local Login Form]
    F --> H[Google Sign-In]

    G --> I[Validate credentials in users_v1]
    I -- Success --> J[Save profile in localStorage + set cookie (3 days)]
    J --> C

    H --> K[Decode JWT from Google]
    K --> L[Save profile in localStorage + set cookie (3 days)]
    L --> C

    C --> M[User sees profile panel]
    M --> N[Logout]
    N --> O[Clear localStorage + delete cookie]
