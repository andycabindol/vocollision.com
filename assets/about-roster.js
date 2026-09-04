/** Render one responsive roster with board members before regular members. */
(function () {
  var ROSTER_ORDER = [
    "Alan Tong", "Liz Manalo", "Sam Morelos", "Julia Heyworth",
    "Wrenn Cai", "Kaelyn Matsushita", "Leo Cheng", "Katherine Shi",
    "Sophie Glenn", "Anthony Zhou", "Lori Phun", "Addison Kyrychenko",
    "Tanvi Heart", "Maya Bhide"
  ];

  function rosterSource() {
    var aboutSource = document.querySelector('.framer-rdftys');
    if (aboutSource) {
      return {
        source: aboutSource,
        cards: aboutSource.querySelectorAll('a[data-framer-name="Tablet"]'),
        mobileSource: document.querySelector('.framer-1bmjbq7')
      };
    }

    var homeSource = document.querySelector('[data-framer-name="Team Section"] .framer-tien5h');
    if (homeSource) {
      return {
        source: homeSource,
        cards: homeSource.querySelectorAll('a[data-framer-name="Tablet"]'),
        mobileSource: null
      };
    }
    return null;
  }

  function buildRoster() {
    var section = document.querySelector('[data-framer-name="Team Section"]');
    var roster = rosterSource();
    if (!section || !roster || section.querySelector('.voco-roster-grid')) return;

    var source = roster.source;
    var cards = roster.cards;
    var contentByName = {};
    for (var i = 0; i < cards.length; i++) {
      var heading = cards[i].querySelector('h6');
      if (heading) contentByName[heading.textContent.trim()] = cards[i].innerHTML;
    }
    var order = ROSTER_ORDER.filter(function (name) { return !!contentByName[name]; });
    if (Object.keys(contentByName).length !== order.length) return;

    contentByName['Katherine Shi'] = contentByName['Katherine Shi'].replace('Treasurer | Soprano', 'Soprano');

    var grid = document.createElement('div');
    grid.className = 'voco-roster-grid';
    for (var j = 0; j < order.length; j++) {
      var card = cards[0].cloneNode(false);
      card.classList.add('voco-roster-card');
      card.removeAttribute('data-framer-name');
      card.innerHTML = contentByName[order[j]];
      grid.appendChild(card);
    }

    source.classList.add('voco-roster-source');
    if (roster.mobileSource) roster.mobileSource.classList.add('voco-roster-source');
    source.insertAdjacentElement('afterend', grid);
  }

  function start() {
    buildRoster();
    new MutationObserver(buildRoster).observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
