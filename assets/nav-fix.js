/**
 * Keep internal Framer links on vocollision.com.
 *
 * Framer emits relative hrefs like "./about". On GitHub Pages the URL is
 * /audition/, so the browser resolves that to /audition/about and the
 * client router then falls back to Home.
 */
(function () {
  var CANONICAL = {
    "/": "/",
    "/about": "/about/",
    "/audition": "/audition/",
    "/contact": "/contact/",
    "/nyc-acapella": "/nyc-acapella/",
    "/spaceset": "/spaceset/",
  };

  var LABELS = {
    home: "/",
    about: "/about/",
    audition: "/audition/",
    contact: "/contact/",
    "contact us": "/contact/",
  };

  function knownPath(path) {
    var clean = (path || "/").replace(/\/+$/, "") || "/";
    if (Object.prototype.hasOwnProperty.call(CANONICAL, clean)) {
      return CANONICAL[clean];
    }
    var parts = clean.split("/").filter(Boolean);
    if (!parts.length) return null;
    var last = "/" + parts[parts.length - 1];
    if (parts.length >= 2 && Object.prototype.hasOwnProperty.call(CANONICAL, last) && last !== "/") {
      return CANONICAL[last];
    }
    return null;
  }

  function canonicalFromHref(href) {
    if (!href || href.charAt(0) === "#") return null;
    try {
      var u = new URL(href, location.href);
      if (u.origin !== location.origin) return null;
      var next = knownPath(u.pathname);
      return next ? next + u.search + u.hash : null;
    } catch (e) {
      return null;
    }
  }

  function canonicalFromLink(a) {
    var fromHref = canonicalFromHref(a.getAttribute("href"));
    if (fromHref) return fromHref;
    var label = (a.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
    var fromLabel = LABELS[label];
    if (!fromLabel) return null;
    try {
      var u = new URL(a.getAttribute("href") || "/", location.href);
      if (u.origin !== location.origin) return null;
    } catch (e) {
      return null;
    }
    return fromLabel;
  }

  function samePage(next) {
    return next === location.pathname + location.search + location.hash;
  }

  function redirectNestedMistake() {
    var next = knownPath(location.pathname);
    if (!next) return;
    var current = (location.pathname.replace(/\/+$/, "") || "/") + "/";
    if (current === "/" || current === next) return;
    location.replace(next + location.search + location.hash);
  }

  function normalizeLinks() {
    var links = document.querySelectorAll("a[href]");
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var next = canonicalFromLink(a);
      if (next && a.getAttribute("href") !== next) a.setAttribute("href", next);
    }
  }

  function go(next, e) {
    if (!next || samePage(next)) return false;
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    location.assign(next);
    return true;
  }

  document.addEventListener(
    "click",
    function (e) {
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
      if (!a) return;
      go(canonicalFromLink(a), e);
    },
    true
  );

  redirectNestedMistake();

  function start() {
    normalizeLinks();
    var obs = new MutationObserver(function () {
      normalizeLinks();
    });
    obs.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["href"],
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
