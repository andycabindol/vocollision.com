/**
 * Retire completed audition calls while preserving Framer's responsive card
 * layout after hydration.
 */
(function () {
  function normalizedText(element) {
    return (element.textContent || "").replace(/\s+/g, " ").trim();
  }

  function updateHome() {
    if (location.pathname !== "/" && location.pathname !== "/index.html") return;

    var textNodes = document.querySelectorAll("p, span, div");
    for (var i = 0; i < textNodes.length; i++) {
      if (normalizedText(textNodes[i]) !== "Now accepting auditions!") continue;

      var chip = textNodes[i].closest('a[href="/audition/"]');
      if (chip) chip.style.setProperty("display", "none", "important");
    }
  }

  function updateAuditionPage() {
    if (location.pathname !== "/audition/" && location.pathname !== "/audition/index.html") return;

    var virtualCard = document.querySelector('[data-framer-name="Audition Card 1"]');
    var comingSoonCard = document.querySelector('[data-framer-name="Audition Card 2"]');
    if (!virtualCard || !comingSoonCard || virtualCard.dataset.vocoStatusUpdated) return;

    // Reuse the existing Coming soon card markup so it retains every responsive
    // Framer style while removing the virtual-audition form and instructions.
    virtualCard.replaceChildren(comingSoonCard.firstElementChild.cloneNode(true));
    virtualCard.dataset.vocoStatusUpdated = "true";
  }

  function update() {
    updateHome();
    updateAuditionPage();
  }

  function start() {
    update();
    var queued = false;
    new MutationObserver(function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () {
        queued = false;
        update();
      });
    }).observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
