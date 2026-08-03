/**
 * Ensure "Audition" appears in the Framer site nav (desktop + mobile).
 * Survives Framer hydration by matching relative and absolute about hrefs
 * and re-injecting when React remounts strip the link.
 */
(function () {
  var HREF = "/audition/";
  var LABEL = "Audition";

  function normalizeHref(href) {
    if (!href) return "";
    try {
      var u = new URL(href, location.origin);
      return (u.pathname || "").replace(/\/+$/, "") || "/";
    } catch (e) {
      return href;
    }
  }

  function isAboutLink(el) {
    if (!el || el.tagName !== "A") return false;
    var path = normalizeHref(el.getAttribute("href"));
    if (path === "/about") return true;
    var text = (el.textContent || "").replace(/\s+/g, " ").trim();
    return text === "About";
  }

  function isAuditionLink(el) {
    if (!el || el.tagName !== "A") return false;
    return normalizeHref(el.getAttribute("href")) === "/audition";
  }

  function rowHasAudition(row) {
    if (!row) return false;
    var links = row.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
      if (isAuditionLink(links[i])) return true;
    }
    return false;
  }

  function cloneNavItem(aboutAnchor) {
    // Prefer Framer's per-link wrapper: div.framer-*-container
    var wrapper = aboutAnchor.parentElement;
    var node =
      wrapper &&
      wrapper.className &&
      String(wrapper.className).indexOf("container") !== -1
        ? wrapper
        : aboutAnchor;

    var clone = node.cloneNode(true);
    var link = clone.tagName === "A" ? clone : clone.querySelector("a");
    if (!link) return null;

    link.setAttribute("href", HREF);
    link.setAttribute("data-voco-audition-nav", "1");
    if (link.hasAttribute("data-framer-name")) {
      link.setAttribute("data-framer-name", "Audition");
    }

    var texts = clone.querySelectorAll("p, span");
    var replaced = false;
    for (var i = 0; i < texts.length; i++) {
      var el = texts[i];
      var t = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (el.children.length === 0 && /^(About|Home|Contact Us|Contact)$/i.test(t)) {
        el.textContent = LABEL;
        replaced = true;
      }
    }
    if (!replaced) {
      var p = clone.querySelector("p");
      if (p) p.textContent = LABEL;
      else if (link.childElementCount === 0) link.textContent = LABEL;
    }

    return { clone: clone, after: node };
  }

  function inject() {
    var anchors = document.querySelectorAll("a");
    for (var i = 0; i < anchors.length; i++) {
      var about = anchors[i];
      if (!isAboutLink(about)) continue;
      if (about.closest(".voco-seo-links")) continue;

      var wrapper = about.parentElement;
      var row = wrapper && wrapper.parentElement;
      if (!row) continue;
      if (rowHasAudition(row)) continue;

      // Only treat as header nav if siblings look like Home/Contact
      var siblingText = (row.textContent || "").replace(/\s+/g, " ");
      if (!/Home/i.test(siblingText) && !/Contact/i.test(siblingText)) continue;

      var built = cloneNavItem(about);
      if (!built) continue;

      var next = built.after.nextElementSibling;
      if (
        next &&
        ((next.querySelector && next.querySelector('a[data-voco-audition-nav="1"]')) ||
          isAuditionLink(next) ||
          (next.querySelector && isAuditionLink(next.querySelector("a"))))
      ) {
        continue;
      }

      built.after.insertAdjacentElement("afterend", built.clone);
    }
  }

  function start() {
    inject();
    var scheduled = false;
    var obs = new MutationObserver(function () {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(function () {
        scheduled = false;
        inject();
      });
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
  setTimeout(inject, 500);
  setTimeout(inject, 1500);
  setTimeout(inject, 3000);
  setTimeout(inject, 5000);
})();
