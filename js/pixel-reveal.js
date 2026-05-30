/* =========================================================
   PIXEL REVEAL — Teletech-style canvas depixelation
   Desktop: hover restores HD. Touch: ScrollTrigger reveal.
   ========================================================= */
(function () {
  "use strict";

  var isTouch = window.matchMedia("(hover: none)").matches || window.matchMedia("(max-width: 768px)").matches;
  var hasGSAP = typeof window.gsap !== "undefined";

  document.querySelectorAll(".pixel-canvas").forEach(function (canvas) {
    var ctx = canvas.getContext("2d");
    var src = canvas.getAttribute("data-src");
    var alt = canvas.getAttribute("data-alt") || "Proyecto";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", alt);

    var img = new Image();
    img.crossOrigin = "anonymous";

    var loaded = false;
    var W = 0,
      H = 0;
    // progress: 0 = fully pixelated (5%), 1 = full resolution
    var progress = 0;

    function setupSize() {
      var rect = canvas.getBoundingClientRect();
      W = Math.max(rect.width, 1);
      H = Math.max(rect.height, 1);
      canvas.width = W;
      canvas.height = H;
    }

    function render(p) {
      if (!loaded) return;
      progress = Math.max(0, Math.min(1, p));
      // scale factor: from 0.05 (pixelated) up to 1
      var scale = 0.05 + progress * 0.95;
      var sw = Math.max(1, Math.round(W * scale));
      var sh = Math.max(1, Math.round(H * scale));

      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, W, H);
      // draw small then upscale to force pixelation
      ctx.drawImage(img, 0, 0, sw, sh);
      ctx.drawImage(canvas, 0, 0, sw, sh, 0, 0, W, H);

      // smoothing fully on only when near complete
      if (progress > 0.92) {
        ctx.imageSmoothingEnabled = true;
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(img, 0, 0, W, H);
      }
    }

    img.onload = function () {
      loaded = true;
      setupSize();
      render(0);

      if (isTouch) {
        // Touch: depixelate on scroll into center of viewport
        if (hasGSAP && window.ScrollTrigger) {
          var obj = { p: 0 };
          window.gsap.to(obj, {
            p: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: canvas,
              start: "top 85%",
              end: "center 55%",
              scrub: 0.6,
              onUpdate: function () {
                render(obj.p);
              },
            },
          });
        } else {
          // fallback IntersectionObserver tween
          var io = new IntersectionObserver(
            function (entries) {
              entries.forEach(function (e) {
                if (e.isIntersecting) {
                  var start = null;
                  var step = function (ts) {
                    if (!start) start = ts;
                    var t = Math.min((ts - start) / 700, 1);
                    render(t);
                    if (t < 1) requestAnimationFrame(step);
                  };
                  requestAnimationFrame(step);
                  io.unobserve(e.target);
                }
              });
            },
            { threshold: 0.5 }
          );
          io.observe(canvas);
        }
      } else {
        // Desktop: hover restores HD via GSAP tween
        var state = { p: 0 };
        var tweenTo = function (target) {
          if (hasGSAP) {
            window.gsap.to(state, {
              p: target,
              duration: 0.55,
              ease: "power2.out",
              overwrite: true,
              onUpdate: function () {
                render(state.p);
              },
            });
          } else {
            state.p = target;
            render(target);
          }
        };
        var card = canvas.closest(".work-card") || canvas;
        card.addEventListener("mouseenter", function () {
          tweenTo(1);
        });
        card.addEventListener("mouseleave", function () {
          tweenTo(0);
        });
      }
    };

    img.onerror = function () {
      ctx.fillStyle = "#16161a";
      ctx.fillRect(0, 0, canvas.width || 300, canvas.height || 220);
    };

    img.src = src;

    window.addEventListener("resize", function () {
      if (!loaded) return;
      setupSize();
      render(progress);
    });
  });
})();
