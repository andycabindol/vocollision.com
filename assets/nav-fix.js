/**
 * Keep internal Framer links on vocollision.com.
 *
 * Framer emits relative hrefs like "./about". On GitHub Pages the URL is
 * /audition/, so the browser resolves that to /audition/about.
 *
 * Do not rewrite the DOM during hydration — that fights React, freezes
 * appear animations, and leaves the page blank after the first flash.
 */
(function () {
  var PAGES = {
    "/": "/",
    "/about": "/about/",
    "/audition": "/audition/",
    "/contact": "/contact/",
    "/nyc-acapella": "/nyc-acapella/",
    "/spaceset": "/spaceset/",
  };

  function stripSlash(path) {
    return (path || "/").replace(/\/+$/, "") || "/";
  }

  function canonicalPath(path) {
    var clean = stripSlash(path);
    if (Object.prototype.hasOwnProperty.call(PAGES, clean)) return PAGES[clean];
    var parts = clean.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    var last = "/" + parts[parts.length - 1];
    if (last !== "/" && Object.prototype.hasOwnProperty.call(PAGES, last)) {
      return PAGES[last];
    }
    return null;
  }

  function resolve(href) {
    if (!href || href.charAt(0) === "#") return null;
    try {
      var u = new URL(href, location.href);
      if (u.origin !== location.origin) return null;
      var next = canonicalPath(u.pathname);
      return next ? next + u.search + u.hash : null;
    } catch (e) {
      return null;
    }
  }

  function currentUrl() {
    return location.pathname + location.search + location.hash;
  }

  // /audition/about → /about/ (and the same for other nested mistakes)
  var nested = canonicalPath(location.pathname);
  if (nested) {
    var here = stripSlash(location.pathname) === "/" ? "/" : stripSlash(location.pathname) + "/";
    if (here !== "/" && here !== nested) {
      location.replace(nested + location.search + location.hash);
      return;
    }
  }

  document.addEventListener(
    "click",
    function (e) {
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
      if (!a) return;
      var next = resolve(a.getAttribute("href"));
      if (!next || next === currentUrl()) return;
      e.preventDefault();
      e.stopPropagation();
      location.assign(next);
    },
    true
  );
})();
