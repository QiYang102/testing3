
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



(function () {
  // --- Elements ---
  const $intro = document.getElementById('intro');
  const $startForm = document.getElementById('startForm');
  const $playerName = document.getElementById('playerName');

  const $quiz = document.getElementById('quiz');
  const $statePill = document.getElementById('statePill');
  const $qIndex = document.getElementById('qIndex');
  const $qText = document.getElementById('questionText');
  const $options = document.getElementById('options');
  const $ansForm = document.getElementById('answerForm');
  const $submit = document.getElementById('submitBtn');
  const $next = document.getElementById('nextBtn');
  const $feedback = document.getElementById('feedback');

  const $results = document.getElementById('results');
  const $finalName = document.getElementById('finalName');
  const $finalScore = document.getElementById('finalScore');
  const $finalTime = document.getElementById('finalTime');
  const $leaderboard = document.getElementById('leaderboard');
  const $playAgain = document.getElementById('playAgain');
  const $backHome = document.getElementById('backHome'); // may be in HTML

  const $timer = document.getElementById('timer');
  const $progressBar = document.getElementById('progressBar');

  // Confirmation modal
  const $readyOverlay = document.getElementById('readyOverlay');
  const $readyYes = document.getElementById('readyYes');
  const $readyCancel = document.getElementById('readyCancel');

  // Podium
  const $podium = document.getElementById('podium');

  // --- Simple SFX (no external files) ---
  const SFX = (() => {
    let ctx = null;
    function safeCtx() { if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)(); return ctx; }
    function tone(freq = 440, dur = 0.12, type = 'sine', vol = 0.2, when = 0) {
      const c = safeCtx(); const o = c.createOscillator(); const g = c.createGain();
      o.type = type; o.frequency.value = freq; g.gain.value = vol; o.connect(g); g.connect(c.destination);
      o.start(c.currentTime + when); o.stop(c.currentTime + when + dur);
    }
    function seq(notes, base = .22) { let t = 0; notes.forEach(n => { const [f, d, ty = 'sine', v = base, w = .02] = n; tone(f, d, ty, v, t); t += d + w; }); }
    return {
      click: () => tone(320, .06, 'triangle', .15),
      next: () => seq([[420, .07, 'square'], [560, .08, 'square']]),
      correct: () => seq([[600, .08], [760, .10], [900, .12]]),
      wrong: () => seq([[220, .12, 'sawtooth', .25], [180, .18, 'sawtooth', .22]]),
      finish: () => seq([[520, .10], [660, .12], [780, .14], [1040, .16]])
    };
  })();

  // --- State ---
  const DURATION = 10 * 60 * 1000; // 10 minutes
  const LB_KEY = 'makan_quiz_leaderboard';
  let startedAt = null, endAt = null, tickId = null;

  let name = '';
  let idx = 0;
  let score = 0;
  const TOTAL = 10;
  let answered = false;
  let finished = false;

  // --- Questions (10) ---
  const QUESTIONS = [
    {
      state: 'Kelantan', q: 'Which Kelantanese dish is known for blue-tinted rice from butterfly pea flowers (bunga telang)?',
      options: ['Nasi Dagang', 'Nasi Kerabu', 'Nasi Tumpang', 'Nasi Ulam'], answer: 1,
      explain: 'Nasi Kerabu rice is often dyed blue using bunga telang and served with ulam, serunding, and budu.'
    },
    {
      state: 'Kelantan', q: 'Mak Yong, a traditional performance with dance and drama, is widely associated with which state’s heritage?',
      options: ['Penang', 'Kelantan', 'Perak', 'Kedah'], answer: 1,
      explain: 'Mak Yong is part of Kelantan’s cultural heritage and is recognized by UNESCO.'
    },
    {
      state: 'Kelantan', q: 'Which Kelantan temple is famous for one of Southeast Asia’s largest reclining Buddha statues?',
      options: ['Wat Photivihan', 'Wat Chaiya Mangkalaram', 'Wat Matchimmaram', 'Wat Buppharam'], answer: 0,
      explain: 'Wat Photivihan in Tumpat houses a massive reclining Buddha and reflects Thai-Buddhist influences in Kelantan.'
    },
    {
      state: 'Kedah', q: 'Kedah’s popular laksa variation is typically called what?',
      options: ['Laksa Kedah (Laksa Utara)', 'Laksa Johor', 'Laksa Sarawak', 'Laksa Nyonya'], answer: 0,
      explain: 'Laksa Kedah (Laksa Utara) features a fish-based gravy with thick rice noodles.'
    },
    {
      state: 'Kedah', q: 'Which island district of Kedah is a major tourist destination known for beaches and geoforest parks?',
      options: ['Penang Island', 'Langkawi', 'Perhentian', 'Tioman'], answer: 1,
      explain: 'Langkawi (in Kedah) is famous for beaches, geoparks, and duty-free shopping.'
    },
    {
      state: 'Penang', q: 'Penang is often hailed as a food capital. Which iconic noodle dish features a shrimp-based broth and chili paste?',
      options: ['Char Kway Teow', 'Laksa Penang (Asam Laksa)', 'Hokkien Mee (Prawn Mee)', 'Curry Mee'], answer: 2,
      explain: 'Penang Hokkien Mee (Prawn Mee) uses a rich prawn-based broth; Asam Laksa is tamarind-based and sour.'
    },
    {
      state: 'Penang', q: 'George Town is renowned for what UNESCO designation?',
      options: ['UNESCO Global Geopark', 'UNESCO Biosphere Reserve', 'UNESCO World Heritage Site', 'UNESCO Intangible Heritage'], answer: 2,
      explain: 'George Town’s historic city centre is a UNESCO World Heritage Site recognized for multicultural architecture and living heritage.'
    },
    {
      state: 'Penang', q: 'Which stir-fried noodle dish with cockles and wok hei is strongly linked to Penang hawker culture?',
      options: ['Mee Rebus', 'Char Kway Teow', 'Mee Bandung', 'Mee Goreng Mamak'], answer: 1,
      explain: 'Char Kway Teow is a Penang signature, prized for smoky wok hei and a mix of eggs, chives, and cockles.'
    },
    {
      state: 'Perak', q: 'Ipoh in Perak is famous for its white coffee. What makes it distinct?',
      options: ['Brewed with coconut milk', 'Beans roasted with palm sugar, served with condensed milk', 'Coffee beans are unroasted', 'Made only with robusta beans'], answer: 1,
      explain: 'Ipoh white coffee uses beans roasted with palm-oil margarine and is typically served with condensed milk.'
    },
    {
      state: 'Perak', q: 'Kellie’s Castle near Batu Gajah is best described as…',
      options: ['A colonial-era unfinished mansion', 'An ancient Malay fort', 'A Buddhist temple complex', 'A royal mausoleum'], answer: 0,
      explain: 'Kellie’s Castle was an ambitious but unfinished mansion from the early 20th century, now a popular Perak attraction.'
    }
  ];

  // --- Helpers ---
  function formatTime(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return m + ':' + sec;
  }

  function updateTimerLabel(waiting = false) {
    if (waiting || !startedAt) { $timer.textContent = 'Ready'; return; }
    const now = Date.now();
    const left = Math.max(0, Math.ceil((endAt - now) / 1000));
    $timer.textContent = formatTime(left);
    const pct = Math.max(0, Math.min(100, ((DURATION - (endAt - now)) / DURATION) * 100));
    $progressBar.style.width = pct.toFixed(1) + '%';
    if (left <= 0) finish('Time up!');
  }

  function startCountdown() { startedAt = Date.now(); endAt = startedAt + DURATION; updateTimerLabel(); clearInterval(tickId); tickId = setInterval(updateTimerLabel, 250); }
  function stopCountdown() { clearInterval(tickId); tickId = null; }

  // Leaderboard utils
  function getBoard() { return JSON.parse(localStorage.getItem(LB_KEY) || '[]'); }
  function setBoard(list) { localStorage.setItem(LB_KEY, JSON.stringify(list.slice(0, 20))); }
  function seedBoardIfEmpty() {
    const list = getBoard(); if (list.length) return;
    const names = ['Aisyah', 'Ravi', 'Mei Lin', 'Hafiz', 'Siti', 'Arun', 'Farah', 'Jason', 'Nadia', 'Kumar', 'Wei Chong', 'Amira', 'Daniel', 'Priya'];
    const seeded = []; const now = Date.now();
    for (let i = 0; i < 10; i++) {
      const nm = names[Math.floor(Math.random() * names.length)];
      const score = Math.floor(Math.random() * 11);
      const timeLeft = Math.floor(Math.random() * (10 * 60));
      const date = new Date(now - Math.floor(Math.random() * 7 * 24 * 3600 * 1000)).toISOString();
      seeded.push({ name: nm, score, timeLeft, date });
    }
    seeded.sort((a, b) => (b.score - a.score) || (b.timeLeft - a.timeLeft) || (new Date(a.date) - new Date(b.date)));
    setBoard(seeded);
  }

  function renderBoard() {
    const list = getBoard();
    $leaderboard.innerHTML = '';
    if (!list.length) {
      $leaderboard.innerHTML = '<li>No entries yet — be the first!</li>';
      return;
    }
    list.forEach((row, i) => {
      const li = document.createElement('li');
      li.textContent = `${row.name} - ${row.score}/10 - ${formatTime(row.timeLeft)} left`;
      $leaderboard.appendChild(li);
    });
  }


  // Top 3 with elements/image/images-quiz
  function renderTop3() {
    const list = getBoard().slice(0, 3);
    $podium.innerHTML = '';
    const sources = ['elements/image/images-quiz/Top1.png', 'elements/image/images-quiz/Top2.png', 'elements/image/images-quiz/Top3.png'];
    const fallback = 'elements/image/images-quiz/Top.png'; // will be used if specific file missing

    for (let i = 0; i < 3; i++) {
      const row = list[i];
      const rank = i + 1;
      const card = document.createElement('div');
      card.className = `podium-card rank-${rank}` + (rank === 1 ? ' sparkle' : '');

      // Build img with onerror fallback
      const imgSrc = sources[i];
      const detail = row ? `${row.name} — ${row.score}/10 — ${formatTime(row.timeLeft)} left` : '—';

      card.innerHTML = `
        <img src="${imgSrc}" alt="Top ${rank}" class="podium-img" onerror="this.onerror=null;this.src='${fallback}';">
        <div class="podium-title">Top ${rank}</div>
        <span class="podium-detail">${detail}</span>
      `;
      $podium.appendChild(card);
    }
  }

  function saveResult(entry) {
    const list = getBoard();
    list.push(entry);
    list.sort((a, b) => (b.score - a.score) || (b.timeLeft - a.timeLeft) || (new Date(a.date) - new Date(b.date)));
    setBoard(list);
  }

  function setProgressByIndex() { const pct = (idx / QUESTIONS.length) * 100; $progressBar.style.width = pct.toFixed(1) + '%'; }
  function renderQuestion() {
    const q = QUESTIONS[idx];
    $statePill.textContent = q.state;
    $qIndex.textContent = (idx + 1);
    $qText.textContent = q.q;
    $options.innerHTML = '';

    q.options.forEach((opt, i) => {
      const id = 'opt' + i;
      const label = document.createElement('label');
      label.className = 'option';
      label.innerHTML = `<input type="radio" name="opt" id="${id}" value="${i}" required><span>${opt}</span>`;
      $options.appendChild(label);
    });

    $feedback.className = 'feedback';
    $feedback.innerHTML = '';
    answered = false;
    $submit.disabled = false;
    $next.disabled = true;
    setProgressByIndex();
  }

  function showFeedback(ok, explain) {
    $feedback.className = 'feedback show ' + (ok ? 'ok' : 'bad');
    $feedback.innerHTML = (ok ? '✅ Correct!' : '❌ Not correct.') + (explain ? `<div class="explain">${explain}</div>` : '');
    ok ? SFX.correct() : SFX.wrong();
  }

  function finish(reason = 'Completed') {
    if (finished) return;
    finished = true;
    stopCountdown();
    const timeLeftSec = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
    $quiz.classList.add('hidden');
    $results.classList.remove('hidden');
    $finalName.textContent = name;
    $finalScore.textContent = String(score);
    $finalTime.textContent = formatTime(timeLeftSec);

    saveResult({ name, score, timeLeft: timeLeftSec, date: new Date().toISOString(), reason });
    renderBoard();
    renderTop3();
    SFX.finish();
  }

  // --- Events ---
  $startForm.addEventListener('submit', (e) => {
    e.preventDefault();
    name = ($playerName.value || 'Player').trim() || 'Player';
    $readyOverlay.classList.remove('hidden');
    updateTimerLabel(true);
    SFX.click();
  });

  $readyYes.addEventListener('click', () => {
    $readyOverlay.classList.add('hidden');
    $intro.classList.add('hidden');
    $quiz.classList.remove('hidden');
    idx = 0; score = 0; finished = false;
    renderQuestion();
    startCountdown();
    SFX.next();
  });

  $readyCancel.addEventListener('click', () => {
    $readyOverlay.classList.add('hidden');
    updateTimerLabel(true);
  });

  $ansForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (answered) return;
    const sel = $ansForm.querySelector('input[name="opt"]:checked');
    if (!sel) { alert('Please choose an answer.'); return; }

    const pick = Number(sel.value);
    const q = QUESTIONS[idx];
    const ok = pick === q.answer;
    if (ok) score++;

    // Lock & mark
    $ansForm.querySelectorAll('label.option').forEach((l, i) => {
      if (i === q.answer) l.classList.add('correct');
      if (i === pick && i !== q.answer) l.classList.add('wrong');
      const input = l.querySelector('input'); if (input) input.disabled = true;
    });

    showFeedback(ok, q.explain);
    $submit.disabled = true;
    $next.disabled = false;
    answered = true;
  });

  $next.addEventListener('click', () => {
    if (!answered) { alert('Submit your answer first.'); return; }
    idx++;
    if (idx >= QUESTIONS.length) { finish('Completed'); return; }
    renderQuestion();
    SFX.next();
  });

  if ($playAgain) {
    $playAgain.addEventListener('click', () => {
      $results.classList.add('hidden');
      $intro.classList.remove('hidden');
      updateTimerLabel(true);
      SFX.click();
    });
  }

  if ($backHome) {
    $backHome.addEventListener('click', () => {
      SFX.click();
      try { window.location.href = 'index.html'; }
      catch { history.back(); }
    });
  }

  // --- Init ---
  seedBoardIfEmpty();
  renderBoard();
  renderTop3();           // show Top 3 (with elements/image/images-quiz) immediately
  updateTimerLabel(true); // "Ready" until user confirms
})();
