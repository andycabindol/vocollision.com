/** Keep executive-board members ahead of the regular-member roster. */
(function () {
  var ROSTER_ORDER = [
    "Alan Tong",
    "Liz Manalo",
    "Sam Morelos",
    "Julia Heyworth",
    "Wrenn Cai",
    "Kaelyn Matsushita",
    "Leo Cheng",
    "Katherine Shi",
    "Sophie Glenn",
    "Anthony Zhou",
    "Lori Phun",
    "Addison Kyrychenko",
    "Tanvi Heart",
    "Maya Bhide"
  ];

  function visibleRosterCards() {
    var headings = document.querySelectorAll("h6");
    var cards = [];
    for (var i = 0; i < headings.length; i++) {
      var card = headings[i].closest("a");
      if (!card || !card.getClientRects().length || cards.indexOf(card) !== -1) continue;
      cards.push(card);
    }
    return cards;
  }

  function update() {
    var cards = visibleRosterCards();
    if (cards.length !== ROSTER_ORDER.length || cards[0].dataset.vocoRosterUpdated) return;

    var contentByName = {};
    for (var i = 0; i < cards.length; i++) {
      var heading = cards[i].querySelector("h6");
      if (heading) contentByName[heading.textContent.trim()] = cards[i].innerHTML;
    }
    if (Object.keys(contentByName).length !== ROSTER_ORDER.length) return;

    // Katherine is now a regular member; Julia holds the Treasurer position.
    contentByName["Katherine Shi"] = contentByName["Katherine Shi"].replace("Treasurer | Soprano", "Soprano");

    for (var j = 0; j < cards.length; j++) {
      cards[j].innerHTML = contentByName[ROSTER_ORDER[j]];
      cards[j].dataset.vocoRosterUpdated = "true";
    }
  }

  function start() {
    update();
    addEventListener("resize", update);
    new MutationObserver(update).observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
