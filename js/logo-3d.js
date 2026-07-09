/* =========================================================
   LOGO 3D — Interactive mouse-tracking tilt effect
   Tracks mouse position across the banner and applies
   perspective rotateX/Y transforms for a premium 3D feel.
   ========================================================= */

(function () {
  "use strict";

  const container = document.getElementById("bannerLogo3d");
  if (!container) return;

  const inner = container.querySelector(".banner-logo-inner");
  if (!inner) return;

  const banner = document.getElementById("banner");

  if (window.initBannerLogoDraw) {
    window.initBannerLogoDraw();
  }

  // --- Configuration ---
  const MAX_TILT = 22;        // max degrees of rotation
  const SCALE_HOVER = 1.06;   // scale on hover
  const LERP_SPEED = 0.12;    // smoothing factor (lower = smoother)
  const RETURN_SPEED = 0.06;  // speed returning to center

  // --- State ---
  let targetRotX = 0;
  let targetRotY = 0;
  let currentRotX = 0;
  let currentRotY = 0;
  let isHovering = false;
  let animFrame = null;
  let idleTimeout = null;

  // Start with idle floating animation
  inner.classList.add("idle");

  // --- Lerp helper ---
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  // --- Animation loop ---
  function animate() {
    const speed = isHovering ? LERP_SPEED : RETURN_SPEED;

    currentRotX = lerp(currentRotX, targetRotX, speed);
    currentRotY = lerp(currentRotY, targetRotY, speed);

    // Compute dynamic shadow based on tilt
    const shadowX = -currentRotY * 0.8;
    const shadowY = currentRotX * 0.8;
    const shadowBlur = 40 + Math.abs(currentRotX) + Math.abs(currentRotY);

    const scale = isHovering ? SCALE_HOVER : 1;

    inner.style.transform =
      `rotateX(${currentRotX.toFixed(2)}deg) ` +
      `rotateY(${currentRotY.toFixed(2)}deg) ` +
      `scale3d(${scale}, ${scale}, 1)`;

    // Update the gradient overlay position to follow the light source
    const gradientAngle = Math.atan2(currentRotY, -currentRotX) * (180 / Math.PI) + 135;
    const gradientIntensity = Math.min(
      0.25,
      (Math.abs(currentRotX) + Math.abs(currentRotY)) / (MAX_TILT * 2) * 0.25
    );
    inner.style.setProperty("--grad-angle", gradientAngle.toFixed(0) + "deg");
    inner.style.setProperty("--grad-intensity", gradientIntensity.toFixed(3));

    // Keep animating while values haven't settled
    const delta = Math.abs(currentRotX - targetRotX) + Math.abs(currentRotY - targetRotY);
    if (delta > 0.05 || isHovering) {
      animFrame = requestAnimationFrame(animate);
    } else {
      animFrame = null;
      // Return completely to rest
      currentRotX = 0;
      currentRotY = 0;
      inner.style.transform = "";
    }
  }

  function startAnimating() {
    if (!animFrame) {
      animFrame = requestAnimationFrame(animate);
    }
  }

  // --- Mouse handlers ---
  // We listen to the entire banner so the logo reacts to mouse from a distance
  const trackArea = banner || container;

  trackArea.addEventListener("mousemove", function (e) {
    // Calculate mouse position relative to the logo container center
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalize to -1..1 range based on distance from logo center
    // Use the banner width/height as the range
    const areaRect = trackArea.getBoundingClientRect();
    const normX = (e.clientX - centerX) / (areaRect.width / 2);
    const normY = (e.clientY - centerY) / (areaRect.height / 2);

    // Clamp values
    const clampedX = Math.max(-1, Math.min(1, normX));
    const clampedY = Math.max(-1, Math.min(1, normY));

    // RotateY follows horizontal mouse, RotateX follows vertical (inverted)
    targetRotY = clampedX * MAX_TILT;
    targetRotX = -clampedY * MAX_TILT;

    // Stop idle animation when interacting
    inner.classList.remove("idle");
    clearTimeout(idleTimeout);

    if (!isHovering) {
      isHovering = true;
    }

    startAnimating();
  });

  trackArea.addEventListener("mouseleave", function () {
    isHovering = false;
    targetRotX = 0;
    targetRotY = 0;
    startAnimating();

    // Resume idle animation after a delay
    idleTimeout = setTimeout(function () {
      if (!isHovering) {
        inner.classList.add("idle");
      }
    }, 1500);
  });

  // Also handle direct hover for scale effect timing
  container.addEventListener("mouseenter", function () {
    inner.classList.remove("idle");
    clearTimeout(idleTimeout);
    isHovering = true;
    startAnimating();
  });

  container.addEventListener("mouseleave", function () {
    // Don't stop isHovering here — let the banner mouseleave handle it
    // This ensures the logo keeps tracking when mouse is in banner but not on logo
  });

  // --- Touch support for mobile ---
  let touchActive = false;

  container.addEventListener("touchstart", function (e) {
    touchActive = true;
    inner.classList.remove("idle");
    isHovering = true;
    handleTouch(e);
    startAnimating();
  }, { passive: true });

  container.addEventListener("touchmove", function (e) {
    if (touchActive) handleTouch(e);
  }, { passive: true });

  container.addEventListener("touchend", function () {
    touchActive = false;
    isHovering = false;
    targetRotX = 0;
    targetRotY = 0;
    startAnimating();

    idleTimeout = setTimeout(function () {
      inner.classList.add("idle");
    }, 1500);
  });

  function handleTouch(e) {
    if (!e.touches.length) return;
    const touch = e.touches[0];
    const rect = container.getBoundingClientRect();
    const normX = ((touch.clientX - rect.left) / rect.width - 0.5) * 2;
    const normY = ((touch.clientY - rect.top) / rect.height - 0.5) * 2;

    targetRotY = normX * MAX_TILT;
    targetRotX = -normY * MAX_TILT;
  }

  // --- Accessibility: respect prefers-reduced-motion ---
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (motionQuery.matches) {
    inner.classList.remove("idle");
    // Disable all motion
    trackArea.onmousemove = null;
    container.ontouchstart = null;
  }
  motionQuery.addEventListener("change", function (e) {
    if (e.matches) {
      inner.classList.remove("idle");
      inner.style.transform = "";
      inner.style.boxShadow = "";
    } else {
      inner.classList.add("idle");
    }
  });

})();
