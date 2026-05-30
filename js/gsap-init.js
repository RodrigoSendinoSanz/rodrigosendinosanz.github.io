/* =========================================================
   GSAP INIT — logo draw, reveals, horizontal scroll
   ========================================================= */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- LOGO DRAWING ---------------- */
  function drawLogo() {
    var paths = document.querySelectorAll(".logo-svg .st0");
    if (!paths.length) return;

    if (typeof window.gsap === "undefined" || prefersReduced) {
      paths.forEach(function (p) {
        p.style.fill = "var(--fg)";
        p.style.strokeDashoffset = "0";
      });
      return;
    }

    paths.forEach(function (p) {
      var len = p.getTotalLength();
      window.gsap.set(p, {
        strokeDasharray: len,
        strokeDashoffset: len,
        fill: "transparent",
      });
    });

    var tl = window.gsap.timeline();
    tl.to(".logo-svg .st0", {
      strokeDashoffset: 0,
      duration: 1.6,
      ease: "power2.inOut",
      stagger: 0.18,
    }).to(
      ".logo-svg .st0",
      {
        fill: "var(--fg)",
        duration: 0.6,
        stagger: 0.1,
      },
      "-=0.5"
    );
  }

  /* ---------------- BANNER TITLE INTRO ---------------- */
  function bannerIntro() {
    if (typeof window.gsap === "undefined" || prefersReduced) return;
    window.gsap.from(".banner-title .line", {
      yPercent: 110,
      opacity: 0,
      duration: 1,
      ease: "power4.out",
      stagger: 0.12,
      delay: 0.2,
    });
    window.gsap.from(".banner-meta, .banner-sub, .banner-actions, .social", {
      y: 24,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.1,
      delay: 0.6,
    });
  }

  /* ---------------- SCROLL REVEALS ---------------- */
  function reveals() {
    if (typeof window.gsap === "undefined" || !window.ScrollTrigger || prefersReduced) return;

    var groups = document.querySelectorAll(
      ".section-head, .featured-card, .bento-cell, .tl-item, .contact-form, .site-footer"
    );
    groups.forEach(function (el) {
      el.classList.add("fx-hidden");
      window.gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
        },
        onStart: function () {
          el.classList.remove("fx-hidden");
        },
      });
    });
  }

  /* ---------------- HORIZONTAL SCROLL (PROJECTS) ---------------- */
  function horizontal() {
    if (typeof window.gsap === "undefined" || !window.ScrollTrigger || prefersReduced) return;
    if (window.matchMedia("(max-width: 768px)").matches) return;

    var track = document.getElementById("projectTrack");
    var pin = document.querySelector(".project-pin");
    if (!track || !pin) return;

    var getScrollAmount = function () {
      return track.scrollWidth - window.innerWidth;
    };

    window.gsap.to(track, {
      x: function () {
        return -getScrollAmount();
      },
      ease: "none",
      scrollTrigger: {
        trigger: pin,
        start: "top top",
        end: function () {
          return "+=" + getScrollAmount();
        },
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });
  }

  function init() {
    drawLogo();
    bannerIntro();
    reveals();
    horizontal();
    if (window.ScrollTrigger) {
      // refresh after images / fonts settle
      window.addEventListener("load", function () {
        window.ScrollTrigger.refresh();
      });
      setTimeout(function () {
        window.ScrollTrigger.refresh();
      }, 800);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
