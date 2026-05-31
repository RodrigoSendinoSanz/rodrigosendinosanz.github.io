/* =========================================================
   MAIN — cursor, debug mode, particles, glitch, nav, audio,
           theme toggle, pixel background
   ========================================================= */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isFinePointer = window.matchMedia("(min-width: 1025px) and (pointer: fine)").matches;

  /* ---------------- PIXEL BACKGROUND CANVAS ---------------- */
  (function () {
    var bgCanvas = document.querySelector(".bg-canvas");
    if (!bgCanvas) return;
    var bgCtx = bgCanvas.getContext("2d");
    var CELL = 20;
    var cols, rows;
    var mouseX = -999, mouseY = -999;
    var RADIUS = 130;

    function sizeGrid() {
      bgCanvas.width = window.innerWidth;
      bgCanvas.height = window.innerHeight;
      cols = Math.ceil(bgCanvas.width / CELL) + 1;
      rows = Math.ceil(bgCanvas.height / CELL) + 1;
    }
    sizeGrid();
    window.addEventListener("resize", sizeGrid);

    document.addEventListener("mousemove", function (e) { mouseX = e.clientX; mouseY = e.clientY; });
    document.addEventListener("touchmove", function (e) {
      mouseX = e.touches[0].clientX; mouseY = e.touches[0].clientY;
    }, { passive: true });

    function drawGrid() {
      bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      var isDebug = document.body.classList.contains("debug");
      var isLight = document.documentElement.classList.contains("light");

      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          var x = c * CELL;
          var y = r * CELL;

          /* base grid dot */
          bgCtx.fillStyle = isLight ? "rgba(29,29,27,0.1)" : "rgba(243,243,236,0.055)";
          bgCtx.fillRect(x, y, 1, 1);

          /* cursor glow */
          var dx = x - mouseX;
          var dy = y - mouseY;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < RADIUS) {
            var intensity = (1 - dist / RADIUS);
            var alpha = intensity * 0.6;
            if (isDebug) {
              bgCtx.fillStyle = "rgba(37,255,140," + alpha + ")";
            } else if (isLight) {
              bgCtx.fillStyle = "rgba(214,72,0," + (alpha * 0.7) + ")";
            } else {
              bgCtx.fillStyle = "rgba(255,91,4," + (alpha * 0.55) + ")";
            }
            bgCtx.fillRect(x - 1, y - 1, 3, 3);
          }
        }
      }
      requestAnimationFrame(drawGrid);
    }
    requestAnimationFrame(drawGrid);
  })();

  /* ---------------- THEME TOGGLE ---------------- */
  var themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var isLight = document.documentElement.classList.toggle("light");
      localStorage.setItem("rss-theme", isLight ? "light" : "dark");
    });
  }

  /* ---------------- MOBILE NAV ---------------- */
  var navToggle = document.getElementById("navToggle");
  var siteNav = document.getElementById("siteNav");
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var open = siteNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    siteNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        siteNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------- ACTIVE NAV ON SCROLL ---------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".site-nav a"));
  var sections = navLinks
    .map(function (l) {
      return document.querySelector(l.getAttribute("href"));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var id = e.target.getAttribute("id");
            navLinks.forEach(function (l) {
              l.classList.toggle("active", l.getAttribute("href") === "#" + id);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) {
      io.observe(s);
    });
  }

  /* ---------------- CUSTOM CURSOR ---------------- */
  var cursor = document.querySelector(".cursor");
  var coordsEl = document.querySelector(".dbg-coords");
  var guideX = document.querySelector(".dbg-guide-x");
  var guideY = document.querySelector(".dbg-guide-y");
  var ruler = document.querySelector(".cursor-ruler");

  var mx = window.innerWidth / 2,
    my = window.innerHeight / 2;
  var cx = mx,
    cy = my;

  if (isFinePointer && cursor) {
    var raf = function () {
      cx += (mx - cx) * 0.2;
      cy += (my - cy) * 0.2;
      cursor.style.transform = "translate(" + cx + "px," + cy + "px)";
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    document.addEventListener("mousemove", function (e) {
      mx = e.clientX;
      my = e.clientY;
      if (document.body.classList.contains("debug")) {
        if (guideX) guideX.style.transform = "translateY(" + e.clientY + "px)";
        if (guideY) guideY.style.transform = "translateX(" + e.clientX + "px)";
        if (coordsEl) {
          coordsEl.style.transform = "translate(" + (e.clientX + 14) + "px," + (e.clientY + 14) + "px)";
          coordsEl.textContent = "X:" + e.clientX + " Y:" + e.clientY;
        }
        if (ruler) ruler.textContent = e.clientX + "," + e.clientY + "px";
      }
    });

    document.querySelectorAll("a, button, input, textarea, [data-fx]").forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        cursor.classList.add("is-hover");
      });
      el.addEventListener("mouseleave", function () {
        cursor.classList.remove("is-hover");
      });
    });
  } else {
    document.body.classList.add("no-cursor");
  }

  /* ---------------- WEB AUDIO CLICK ---------------- */
  var audioCtx = null;
  function clickSound() {
    if (prefersReduced) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var t = audioCtx.currentTime;
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(220, t + 0.05);
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.09);
    } catch (err) {
      /* no-op */
    }
  }

  /* ---------------- DEBUG MODE TOGGLE ---------------- */
  var debugToggle = document.getElementById("debugToggle");
  if (debugToggle) {
    debugToggle.addEventListener("click", function () {
      var on = document.body.classList.toggle("debug");
      debugToggle.setAttribute("aria-pressed", on ? "true" : "false");
      var stateEl = debugToggle.querySelector("[data-state]");
      if (stateEl) stateEl.textContent = on ? "ON" : "OFF";
      clickSound();
      if (on) mountDebugTags();
      else clearDebugTags();
    });
  }

  var debugTags = [];
  function mountDebugTags() {
    clearDebugTags();
    var labels = ["Render: GPU", "FPS: 60", "GSAP: Active", "Layout: Bento", "Layer: z-index", "Paint: ✓"];
    document.querySelectorAll("[data-section]").forEach(function (sec, i) {
      var tag = document.createElement("span");
      tag.className = "dbg-tag";
      tag.textContent =
        "§" + sec.getAttribute("data-section") + " · " + labels[i % labels.length];
      sec.style.position = "relative";
      tag.style.top = "84px";
      tag.style.right = "20px";
      tag.style.left = "auto";
      sec.appendChild(tag);
      debugTags.push(tag);
    });
  }
  function clearDebugTags() {
    debugTags.forEach(function (t) {
      if (t.parentNode) t.parentNode.removeChild(t);
    });
    debugTags = [];
  }

  /* ---------------- PIXEL PARTICLE EXPLOSION ---------------- */
  var canvas = document.querySelector(".fx-canvas");
  var ctx = canvas ? canvas.getContext("2d") : null;
  var particles = [];

  function sizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  sizeCanvas();
  window.addEventListener("resize", sizeCanvas);

  function burst(x, y) {
    if (!ctx || prefersReduced) return;
    var debug = document.body.classList.contains("debug");
    var n = 18;
    for (var i = 0; i < n; i++) {
      var ang = (Math.PI * 2 * i) / n + Math.random() * 0.4;
      var sp = 2 + Math.random() * 5;
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp,
        life: 1,
        size: 3 + Math.floor(Math.random() * 4),
        color: debug ? "#25ff8c" : Math.random() > 0.5 ? "#ff5b04" : "#f3f3ec",
      });
    }
  }

  function loopParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12;
      p.life -= 0.03;
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x | 0, p.y | 0, p.size, p.size);
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(loopParticles);
  }
  requestAnimationFrame(loopParticles);

  document.addEventListener(
    "click",
    function (e) {
      var interactive = e.target.closest("a, button, input[type=submit], .bento-cell, .work-card, [data-fx]");
      if (interactive) {
        burst(e.clientX, e.clientY);
        clickSound();
      }
    },
    true
  );

  /* ---------------- GLITCH HOVER ON TITLES ---------------- */
  document.querySelectorAll("[data-glitch]").forEach(function (el) {
    var timer = null;
    el.addEventListener("mouseenter", function () {
      if (prefersReduced) return;
      el.classList.add("glitching");
      clearTimeout(timer);
      timer = setTimeout(function () {
        el.classList.remove("glitching");
      }, 420);
    });
  });

  /* ---------------- BUTTON TEXT SCRAMBLE ---------------- */
  var chars = "!<>-_\\/[]{}=+*^?#01";
  document.querySelectorAll("[data-fx] .btn-label").forEach(function (label) {
    var original = label.textContent;
    var btn = label.closest("[data-fx]");
    var frame = null;
    btn.addEventListener("mouseenter", function () {
      if (prefersReduced) return;
      var iteration = 0;
      cancelAnimationFrame(frame);
      var run = function () {
        label.textContent = original
          .split("")
          .map(function (ch, idx) {
            if (ch === " ") return " ";
            if (idx < iteration) return original[idx];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
        iteration += 1 / 2;
        if (iteration < original.length) {
          frame = requestAnimationFrame(run);
        } else {
          label.textContent = original;
        }
      };
      run();
    });
    btn.addEventListener("mouseleave", function () {
      cancelAnimationFrame(frame);
      label.textContent = original;
    });
  });
})();
