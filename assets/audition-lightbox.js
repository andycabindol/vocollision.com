/**
 * Lightbox for audition gallery photos.
 * Uses document delegation so it survives Framer hydration remounts.
 */
(function () {
  var overlay = null;
  var imgEl = null;

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

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    overlay.querySelector(".voco-lightbox-close").addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      close();
    });
    imgEl.addEventListener("click", function (e) {
      e.stopPropagation();
    });
    return overlay;
  }

  function open(src) {
    if (!src) return;
    ensureOverlay();
    imgEl.src = src;
    overlay.removeAttribute("hidden");
    overlay.classList.add("is-open");
    document.documentElement.classList.add("voco-lightbox-open");
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove("is-open");
    overlay.setAttribute("hidden", "");
    document.documentElement.classList.remove("voco-lightbox-open");
    imgEl.removeAttribute("src");
  }

  document.addEventListener(
    "click",
    function (e) {
      var img = galleryImgFromEvent(e);
      if (!img) return;
      e.preventDefault();
      e.stopPropagation();
      open(bestSrc(img));
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
