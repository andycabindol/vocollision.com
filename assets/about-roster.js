/** Render one responsive roster with board members before regular members. */
(function () {
  var ROSTER_ORDER = [
    "Alan Tong", "Liz Manalo", "Sam Morelos", "Julia Heyworth",
    "Wrenn Cai", "Kaelyn Matsushita", "Leo Cheng", "Katherine Shi",
    "Sophie Glenn", "Anthony Zhou", "Lori Phun", "Addison Kyrychenko",
    "Tanvi Heart", "Maya Bhide"
  ];

  function buildRoster() {
    var section = document.querySelector('[data-framer-name="Team Section"]');
    var source = document.querySelector('.framer-rdftys');
    if (!section || !source || section.querySelector('.voco-roster-grid')) return;

    var cards = source.querySelectorAll('a[data-framer-name="Tablet"]');
    var contentByName = {};
    for (var i = 0; i < cards.length; i++) {
      var heading = cards[i].querySelector('h6');
      if (heading) contentByName[heading.textContent.trim()] = cards[i].innerHTML;
    }
    if (Object.keys(contentByName).length !== ROSTER_ORDER.length) return;

    contentByName['Katherine Shi'] = contentByName['Katherine Shi'].replace('Treasurer | Soprano', 'Soprano');

    var grid = document.createElement('div');
    grid.className = 'voco-roster-grid';
    for (var j = 0; j < ROSTER_ORDER.length; j++) {
      var card = cards[0].cloneNode(false);
      card.classList.add('voco-roster-card');
      card.removeAttribute('data-framer-name');
      card.innerHTML = contentByName[ROSTER_ORDER[j]];
      grid.appendChild(card);
    }

    source.classList.add('voco-roster-source');
    var mobileSource = document.querySelector('.framer-1bmjbq7');
    if (mobileSource) mobileSource.classList.add('voco-roster-source');
    source.insertAdjacentElement('afterend', grid);
  }

  function start() {
    buildRoster();
    new MutationObserver(buildRoster).observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
