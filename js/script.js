// ==========================================================
// Marrow Ministries — Mobile navigation toggle
// ==========================================================
document.addEventListener('DOMContentLoaded', function () {
  var toggles = document.querySelectorAll('.hamburger'); /* was a single
    getElementById lookup — switched to a class-based query so both the
    header's and footer's hamburger buttons can independently open/close
    the same shared mobile nav panel */
  var mobileNav = document.getElementById('mobileNav');

  if (!toggles.length || !mobileNav) return;

  toggles.forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('is-open');
      toggles.forEach(function (t) {
        t.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });
  });

  // Close mobile menu when a link is clicked
  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileNav.classList.remove('is-open');
      toggles.forEach(function (t) {
        t.setAttribute('aria-expanded', 'false');
      });
    });
  });
});

// ==========================================================
// PDF-style whole-page proportional scaling
//
// The page is built fixed-width at 1300px (the PSD's exact design width).
// Instead of individual elements reflowing/resizing at different rates
// (which caused things to drift out of alignment relative to each other),
// the entire #scale-inner block scales as one rigid unit — exactly like
// zooming a PDF. Every element's position/size relative to every other
// element stays mathematically identical at any zoom level.
//
// Below MOBILE_BREAKPOINT, scaling is disabled entirely and the
// mobile-specific CSS (written separately for that range) takes over.
// ==========================================================
(function () {
  var DESIGN_WIDTH = 1300;
  var MOBILE_BREAKPOINT = 744; /* official cutoff — matches the smallest current
    tablet (iPad mini, 744px CSS width). At exactly 744px, scaling stays
    active (744 < 744 is false); at 743px and below, mobile CSS takes over.
    CSS media queries use max-width:743px to stay perfectly in sync with
    this JS threshold — previously there was a mismatch (JS used 768 with
    "<", CSS used max-width:768px which is inclusive), causing a broken
    hybrid state exactly at 768px where both systems partially applied. */

  var outer = document.getElementById('scale-outer');
  var inner = document.getElementById('scale-inner');

  if (!outer || !inner) return;

  function updateScale() {
    var vw = window.innerWidth;

    if (vw < MOBILE_BREAKPOINT) {
      // Hand off to the mobile-specific CSS — no transform scaling below this point.
      inner.style.transform = '';
      inner.style.width = '';
      outer.style.height = '';
      return;
    }

    // Reset to natural (unscaled) size to measure true content height.
    inner.style.transform = 'none';
    inner.style.width = DESIGN_WIDTH + 'px';
    var naturalHeight = inner.offsetHeight;

    var scale = vw / DESIGN_WIDTH;
    inner.style.transform = 'translateX(-50%) scale(' + scale + ')';

    // Keep the outer wrapper's height in sync with the visually scaled
    // result, so the page doesn't leave blank space (scaled down) or
    // clip content (scaled up).
    outer.style.height = (naturalHeight * scale) + 'px';
  }

  window.addEventListener('resize', updateScale);
  window.addEventListener('load', updateScale);
  // Run immediately too, in case DOM is already parsed by the time this runs.
  updateScale();
})();
