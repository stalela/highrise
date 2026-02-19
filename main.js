/**
 * Highrise Build Investments — main.js
 * Vanilla JS: hamburger, scroll-spy, intersection observer animations, count-up stats
 */

/* ═══════════════════════════════════════════════════════════
   HAMBURGER MENU
   ══════════════════════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  });

  // Close mobile menu when a link is clicked
  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      hamburger.focus();
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   SCROLL-SPY — active nav link
   ══════════════════════════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const spyObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${id}`
        );
      });
    }
  });
}, {
  rootMargin: '-50% 0px -50% 0px',
  threshold: 0,
});

sections.forEach(s => spyObserver.observe(s));

/* ═══════════════════════════════════════════════════════════
   SCROLL ANIMATIONS — [data-animate]
   ══════════════════════════════════════════════════════════ */
const animateObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      animateObserver.unobserve(entry.target);
    }
  });
}, {
  rootMargin: '0px 0px -80px 0px',
  threshold: 0.07,
});

document.querySelectorAll('[data-animate]').forEach((el, i) => {
  // Stagger children within the same parent grid
  el.style.transitionDelay = `${i * 0.04}s`;
  animateObserver.observe(el);
});

/* ═══════════════════════════════════════════════════════════
   COUNT-UP — stats section
   ══════════════════════════════════════════════════════════ */
function animateCount(el) {
  const target  = parseInt(el.getAttribute('data-target'), 10);
  const suffix  = el.getAttribute('data-suffix') || '';
  const duration = 1800; // ms
  const startTime = performance.now();

  function tick(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);
    el.textContent = (target >= 1000)
      ? value.toLocaleString() + suffix
      : value + suffix;

    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const statNumbers = document.querySelectorAll('.stat-number[data-target]');

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      statsObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.6,
});

statNumbers.forEach(el => statsObserver.observe(el));

/* ═══════════════════════════════════════════════════════════
   NAVBAR SCROLL STATE — darken on scroll
   ══════════════════════════════════════════════════════════ */
const navbar = document.querySelector('.navbar');

if (navbar) {
  const onScroll = () => {
    navbar.style.background = window.scrollY > 30
      ? 'rgba(6,6,10,0.97)'
      : 'rgba(6,6,10,0.88)';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
