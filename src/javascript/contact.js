
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
