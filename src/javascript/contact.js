
//Contact form Submission (with jQuery AJAX)
$(document).ready(function () {
  $('#contactForm').on('submit', function (e) {
    e.preventDefault();

    // Get values
    const name = $('#name').val().trim();
    const email = $('#email').val().trim();
    const subject = $('#subject').val();
    const message = $('#message').val().trim();

    // Validate
    if (!name || !email || !subject || !message) {
      $('#apiStatus').text('❌ Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      $('#apiStatus').text('❌ Please enter a valid email address.');
      return;
    }

    const $button = $(this).find('button');
    $button.prop('disabled', true);
    $('#apiStatus').text('⏳ Saving...');

    // Create submission object with timestamp
    const submission = {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString() // Save exact time
    };

    // Get existing submissions from localStorage
    let submissions = JSON.parse(localStorage.getItem('contactSubmissions')) || [];

    // Add new submission
    submissions.push(submission);

    // Save back to localStorage
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));

    // Simulate delay (like a real API)
    setTimeout(() => {
      $('#apiStatus').text('✅ Thank you! Your message was saved locally.');
      $('#contactForm')[0].reset();
      $button.prop('disabled', false);

      // Optional: Log to console
      console.log('💾 Saved to localStorage:', submission);
    }, 1000);
  });
});




// dropdown toggle
document.querySelectorAll('.menu-toggle').forEach((btn) => {
  btn.addEventListener('click', () => {
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

// close dropdown outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.menu')) {
    document.querySelectorAll('.menu.open').forEach(m => {
      m.classList.remove('open');
      const t = m.querySelector('.menu-toggle');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }
});

// Esc closes dropdown
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.menu.open').forEach(m => {
      m.classList.remove('open');
      const t = m.querySelector('.menu-toggle');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }
});

// highlight parent if child is active
document.querySelectorAll('.menu').forEach(menu => {
  const activeChild = menu.querySelector('.menu-list a.active');
  if (activeChild) {
    const toggleBtn = menu.querySelector('.menu-toggle');
    if (toggleBtn) toggleBtn.classList.add('active');
  }
});

// burger toggle
const burgerInput = document.getElementById("burger");
const nav = document.querySelector("nav");

burgerInput.addEventListener("change", () => {
  if (burgerInput.checked) {
    nav.classList.add("nav--open");
  } else {
    nav.classList.remove("nav--open");
  }
});

// active link highlight on click
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




const textarea = document.getElementById("message");
const hint = document.getElementById("messageHint");

// observe size changes
const resizeObserver = new ResizeObserver(entries => {
  for (let entry of entries) {
    const height = entry.target.clientHeight;
    if (height > 3000) { // threshold: 200px tall
      hint.style.display = "block";
      hint.textContent = "Wow, you’ve really got a lot to say 😆";
    } else {
      hint.style.display = "none";
    }
  }
});

resizeObserver.observe(textarea);



