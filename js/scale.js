// ==========================================================
// Marrow Ministries — Whole-page "PDF-style" scaling
// ==========================================================
// #scale-inner is built at a fixed 1300px design width (see styles.css)
// and needs to be scaled as a single rigid unit so every element's
// position stays mathematically identical at any zoom level. This script:
//   1. Computes a scale factor from the current viewport width
//   2. Applies transform: translateX(-50%) scale(factor) to #scale-inner
//   3. Keeps #scale-outer's height in sync with the scaled content height,
//      since #scale-inner is position:absolute and wouldn't otherwise
//      contribute any height to the page (which is why the page appeared
//      completely blank without this script running).
// Below 744px, styles.css's own media query takes over entirely (mobile
// layout), so this script backs off and clears any inline styles it set.

(function () {
  var DESIGN_WIDTH = 1300;
  var MOBILE_BREAKPOINT = 743;

  var outer = document.getElementById('scale-outer');
  var inner = document.getElementById('scale-inner');
  if (!outer || !inner) return;

  function applyScale() {
    var viewportWidth = window.innerWidth;

    if (viewportWidth <= MOBILE_BREAKPOINT) {
      // Mobile: let styles.css's own media query handle everything.
      inner.style.transform = '';
      outer.style.height = '';
      return;
    }

    var scale = viewportWidth / DESIGN_WIDTH;
    inner.style.transform = 'translateX(-50%) scale(' + scale + ')';

    var naturalHeight = inner.offsetHeight;
    outer.style.height = (naturalHeight * scale) + 'px';
  }

  // Recalculate on window resize...
  window.addEventListener('resize', applyScale);

  // ...and whenever #scale-inner's own content changes size (e.g. once
  // content-loader.js finishes populating sermons/resources/bio text,
  // or images finish loading and shift the layout height).
  if (window.ResizeObserver) {
    var ro = new ResizeObserver(applyScale);
    ro.observe(inner);
  } else {
    // Fallback for older browsers without ResizeObserver support.
    window.addEventListener('load', applyScale);
    setTimeout(applyScale, 500);
    setTimeout(applyScale, 1500);
  }

  document.addEventListener('DOMContentLoaded', applyScale);
  applyScale();
})();
