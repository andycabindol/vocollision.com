/** Keep the roster order and officer titles consistent across Framer breakpoints. */
(function () {
  function cardsFor(name) {
    var headings = document.querySelectorAll("h6");
    var cards = [];
    for (var i = 0; i < headings.length; i++) {
      if ((headings[i].textContent || "").trim() !== name) continue;
      var card = headings[i].closest("a");
      if (card) cards.push(card);
    }
    return cards;
  }

  function update() {
    var katherineCards = cardsFor("Katherine Shi");
    var juliaCards = cardsFor("Julia Heyworth");
    var count = Math.min(katherineCards.length, juliaCards.length);

    for (var i = 0; i < count; i++) {
      var katherineCard = katherineCards[i];
      var juliaCard = juliaCards[i];
      if (katherineCard.dataset.vocoRosterUpdated || juliaCard.dataset.vocoRosterUpdated) continue;

      var katherineContent = katherineCard.innerHTML;
      katherineCard.innerHTML = juliaCard.innerHTML;
      juliaCard.innerHTML = katherineContent;
      katherineCard.dataset.vocoRosterUpdated = "true";
      juliaCard.dataset.vocoRosterUpdated = "true";
    }

    var updatedKatherineCards = cardsFor("Katherine Shi");
    for (var j = 0; j < updatedKatherineCards.length; j++) {
      var role = updatedKatherineCards[j].querySelector(".framer-ab4qsv p");
      if (role) role.textContent = "Soprano";
    }
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
