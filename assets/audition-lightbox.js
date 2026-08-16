/**
 * Lightbox for audition gallery photos.
 * The clicked photo FLIP-scales into the viewer and back on close.
 */
(function () {
  var overlay = null;
  var imgEl = null;
  var closeBtn = null;
  var sourceImg = null;
  var busy = false;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EASE = "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)";

  function inGallery(node) {
    if (!node || !node.closest) return null;
    var section = node.closest('.framer-8779ag, [data-framer-name="Content Section "]');
    if (!section) return null;
    if (node.closest('[data-framer-name="Footer Section"], [data-framer-name="CTA Section"], [data-framer-name="Navigation Section"]')) {
      return null;
    }
    return section;
  }

  function galleryImgFromEvent(e) {
    var t = e.target;
    if (!t || !t.closest) return null;
    if (!inGallery(t)) return null;
    if (t.tagName === "IMG") return t;
    var wrap = t.closest("[data-framer-background-image-wrapper]");
    return wrap ? wrap.querySelector("img") : null;
  }

  function bestSrc(img) {
    if (!img) return "";
    var src = img.currentSrc || img.getAttribute("src") || "";
    return src.split("?")[0];
  }

  function invertFrom(sourceRect, destRect) {
    var dx =
      sourceRect.left + sourceRect.width / 2 - (destRect.left + destRect.width / 2);
    var dy =
      sourceRect.top + sourceRect.height / 2 - (destRect.top + destRect.height / 2);
    var sx = sourceRect.width / Math.max(destRect.width, 1);
    var sy = sourceRect.height / Math.max(destRect.height, 1);
    return "translate(" + dx + "px, " + dy + "px) scale(" + sx + ", " + sy + ")";
  }

  function whenImageReady(img, cb) {
    if (img.complete && img.naturalWidth) {
      cb();
      return;
    }
    img.addEventListener("load", cb, { once: true });
    img.addEventListener("error", cb, { once: true });
  }

  function ensureOverlay() {
    if (overlay && document.body.contains(overlay)) return overlay;
    overlay = document.createElement("div");
    overlay.className = "voco-lightbox";
    overlay.setAttribute("hidden", "");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Photo");
    overlay.innerHTML =
      '<button type="button" class="voco-lightbox-close" aria-label="Close">&times;</button>' +
      '<img class="voco-lightbox-image" alt="">';
    document.body.appendChild(overlay);
    imgEl = overlay.querySelector(".voco-lightbox-image");
    closeBtn = overlay.querySelector(".voco-lightbox-close");

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    closeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      close();
    });
    imgEl.addEventListener("click", function (e) {
      e.stopPropagation();
    });
    return overlay;
  }

  function hideSource(img, hide) {
    if (!img) return;
    var tile = img.closest("[data-framer-background-image-wrapper]") || img;
    if (hide) tile.classList.add("voco-lightbox-source");
    else tile.classList.remove("voco-lightbox-source");
  }

  function open(img) {
    if (!img || busy) return;
    var src = bestSrc(img);
    if (!src) return;

    ensureOverlay();
    busy = true;
    sourceImg = img;
    var sourceRect = img.getBoundingClientRect();

    imgEl.style.transition = "none";
    imgEl.style.transform = "none";
    imgEl.src = src;

    function start() {
      overlay.removeAttribute("hidden");
      document.documentElement.classList.add("voco-lightbox-open");
      hideSource(img, true);

      if (reduceMotion) {
        overlay.classList.add("is-open");
        busy = false;
        return;
      }

      var destRect = imgEl.getBoundingClientRect();
      imgEl.style.transition = "none";
      imgEl.style.transform = invertFrom(sourceRect, destRect);
      overlay.classList.remove("is-open");
      overlay.offsetHeight;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          overlay.classList.add("is-open");
          imgEl.style.transition = EASE;
          imgEl.style.transform = "none";
        });
      });
      imgEl.addEventListener(
        "transitionend",
        function (e) {
          if (e.propertyName === "transform") busy = false;
        },
        { once: true }
      );
      setTimeout(function () {
        busy = false;
      }, 520);
    }

    whenImageReady(imgEl, start);
  }

  function close() {
    if (!overlay || overlay.hasAttribute("hidden") || busy) return;
    busy = true;

    var done = false;
    function finish() {
      if (done) return;
      done = true;
      overlay.classList.remove("is-open");
      overlay.setAttribute("hidden", "");
      document.documentElement.classList.remove("voco-lightbox-open");
      hideSource(sourceImg, false);
      imgEl.style.transition = "none";
      imgEl.style.transform = "none";
      imgEl.removeAttribute("src");
      sourceImg = null;
      busy = false;
    }

    if (reduceMotion || !sourceImg || !document.body.contains(sourceImg)) {
      finish();
      return;
    }

    var sourceRect = sourceImg.getBoundingClientRect();
    var destRect = imgEl.getBoundingClientRect();
    overlay.classList.remove("is-open");
    imgEl.style.transition = EASE;
    imgEl.style.transform = invertFrom(sourceRect, destRect);
    imgEl.addEventListener(
      "transitionend",
      function (e) {
        if (e.propertyName === "transform") finish();
      },
      { once: true }
    );
    setTimeout(finish, 520);
  }

  document.addEventListener(
    "click",
    function (e) {
      var img = galleryImgFromEvent(e);
      if (!img) return;
      e.preventDefault();
      e.stopPropagation();
      open(img);
    },
    true
  );

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureOverlay);
  } else {
    ensureOverlay();
  }
})();
