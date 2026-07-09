/* =========================================================
   GSAP INIT — SVG logo draw, scroll reveals, horizontal track
   ========================================================= */
(function () {
  "use strict";

  if (typeof window.gsap === "undefined") return;

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- SVG LOGO DRAW ---------------- */
  function initBannerLogoDraw() {
    var paths = Array.from(
      document.querySelectorAll(
        ".brand-mark .logo-svg .svg-elem-1, " +
          ".brand-mark .logo-svg .svg-elem-2, " +
          ".brand-mark .logo-svg .svg-elem-3, " +
          ".banner-logo-inner .banner-logo-svg .svg-elem-1, " +
          ".banner-logo-inner .banner-logo-svg .svg-elem-2, " +
          ".banner-logo-inner .banner-logo-svg .svg-elem-3, " +
          ".banner-logo-svg-border .svg-border-elem-1, " +
          ".banner-logo-svg-border .svg-border-elem-2, " +
          ".banner-logo-svg-border .svg-border-elem-3"
      )
    );

    if (!paths.length) return;
    if (document.documentElement.getAttribute("data-logo-draw-animated") === "true") return;

    document.documentElement.setAttribute("data-logo-draw-animated", "true");

    if (!prefersReduced) {
      var bannerLogoSvgs = document.querySelectorAll(".banner-logo-inner .banner-logo-svg, .banner-logo-svg-border");
      bannerLogoSvgs.forEach(function (svg) {
        gsap.set(svg, { opacity: 0 });
      });

      paths.forEach(function (path) {
        var len = path.getTotalLength ? path.getTotalLength() : 2000;
        gsap.set(path, {
          strokeDasharray: len,
          strokeDashoffset: len,
          fill: "transparent",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        });
      });

      var tl = gsap.timeline({ delay: 0.15 });

      tl.to(bannerLogoSvgs, {
        opacity: 1,
        duration: 5,
        ease: "power2.out",
        stagger: 0.25,
      });

      paths.forEach(function (path, i) {
        var len = path.getTotalLength ? path.getTotalLength() : 2000;
        tl.to(
          path,
          {
            strokeDashoffset: 0,
            duration: 1.05,
            ease: "power2.inOut",
          },
          i * 0.18
        );
      });

      tl.to(
        paths,
        {
          fill: "var(--fg)",
          duration: 0.5,
          ease: "power1.in",
          stagger: 0.08,
        },
        "-=0.3"
      );
    } else {
      paths.forEach(function (path) {
        gsap.set(path, { strokeDashoffset: 0, fill: "var(--fg)" });
      });
    }
  }

  window.requestAnimationFrame(function () {
    window.setTimeout(initBannerLogoDraw, 60);
  });

  window.initBannerLogoDraw = initBannerLogoDraw;

  /* ---------------- SCROLL REVEALS ---------------- */
  if (ScrollTrigger && !prefersReduced) {
    document.querySelectorAll(".fx-hidden").forEach(function (el) {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    });

    /* Stagger bento cells */
    document.querySelectorAll(".bento").forEach(function (grid) {
      var cells = grid.querySelectorAll(".bento-cell");
      gsap.from(cells, {
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: grid,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });

    /* Timeline items */
    document.querySelectorAll(".tl-item").forEach(function (item, i) {
      gsap.from(item, {
        opacity: 0,
        x: -24,
        duration: 0.55,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    });
  }

  /* ---------------- HORIZONTAL PROJECTS TRACK ---------------- */
  var isTouch =
    window.matchMedia("(hover: none)").matches ||
    window.matchMedia("(max-width: 768px)").matches;

  if (!isTouch && ScrollTrigger && !prefersReduced) {
    var track = document.getElementById("projectTrack");
    if (track) {
      var cards = track.querySelectorAll(".work-card");
      var totalCards = cards.length;

      /* Wait for layout to settle */
      ScrollTrigger.refresh();

      var getScrollAmount = function () {
        var trackW = track.scrollWidth;
        var viewW = track.parentElement.offsetWidth;
        return -(trackW - viewW);
      };

      gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: ".project-pin",
          start: "top top",
          end: function () {
            return "+=" + Math.abs(getScrollAmount());
          },
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }
  }

  /* ---------------- BANNER TITLE STAGGER ---------------- */
  if (!prefersReduced) {
    var lines = document.querySelectorAll(".banner-title .line");
    if (lines.length) {
      gsap.from(lines, {
        opacity: 0,
        y: 60,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.1,
      });
    }

    var bannerMeta = document.querySelectorAll(".banner-meta .tag");
    if (bannerMeta.length) {
      gsap.from(bannerMeta, {
        opacity: 0,
        y: -12,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.5,
      });
    }

    var bannerSub = document.querySelector(".banner-sub");
    if (bannerSub) {
      gsap.from(bannerSub, { opacity: 0, y: 20, duration: 0.6, ease: "power2.out", delay: 0.7 });
    }

    var bannerActions = document.querySelector(".banner-actions");
    if (bannerActions) {
      gsap.from(bannerActions, { opacity: 0, y: 16, duration: 0.5, ease: "power2.out", delay: 0.9 });
    }
  }
})();
