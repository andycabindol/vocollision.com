/** Render one responsive roster with board members before regular members. */
(function () {
  var ROSTER_ORDER = [
    "Alan Tong", "Liz Manalo", "Sam Morelos", "Julia Heyworth",
    "Wrenn Cai", "Kaelyn Matsushita", "Leo Cheng", "Katherine Shi",
    "Sophie Glenn", "Anthony Zhou", "Lori Phun", "Addison Kyrychenko",
    "Tanvi Heart", "Maya Bhide"
  ];
  var MAYA_CONTENT = '<div class="framer-1037t74" data-framer-name="Container" style="background-color:rgb(255, 255, 255)"><div class="framer-1q21iil" data-framer-name="image" style="filter:grayscale(1);-webkit-filter:grayscale(1)"><div style="position:absolute;border-radius:inherit;corner-shape:inherit;top:0;right:0;bottom:0;left:0" data-framer-background-image-wrapper="true"><img decoding="async" loading="lazy" width="992" height="992" src="/assets/images/CwHWLPLN5FsTXjliQnNkEg3x5UM.jpg" alt style="display:block;width:100%;height:100%;border-radius:inherit;corner-shape:inherit;object-position:center;object-fit:cover"></div></div></div><div class="framer-1t2efyj" data-framer-name="Content" style="background-color:var(--token-95ea0e97-bb7c-4b5b-8606-d234b450a66f, rgb(20, 23, 24))"><div class="framer-1o7ywjr" data-framer-component-type="RichTextContainer"><h6 class="framer-text framer-styles-preset-djryrw" data-styles-preset="QROBgfBRL">Maya Bhide</h6></div><div class="framer-ab4qsv" data-framer-component-type="RichTextContainer"><p class="framer-text framer-styles-preset-7we164" data-styles-preset="E8rJgHD2R">Soprano</p></div></div>';

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
    var cardsByName = {};
    for (var i = 0; i < cards.length; i++) {
      var heading = cards[i].querySelector('h6');
      if (heading) {
        var name = heading.textContent.trim();
        contentByName[name] = cards[i].innerHTML;
        cardsByName[name] = cards[i];
      }
    }

    if (!contentByName['Maya Bhide']) contentByName['Maya Bhide'] = MAYA_CONTENT;
    var order = ROSTER_ORDER.filter(function (name) { return !!contentByName[name]; });
    if (Object.keys(contentByName).length !== order.length) return;

    contentByName['Katherine Shi'] = contentByName['Katherine Shi'].replace('Treasurer | Soprano', 'Soprano');

    var grid = document.createElement('div');
    grid.className = 'voco-roster-grid';
    for (var j = 0; j < order.length; j++) {
      var template = cardsByName[order[j]] || cards[0];
      var card = template.cloneNode(false);
      card.classList.add('voco-roster-card');
      card.removeAttribute('data-framer-name');
      if (!cardsByName[order[j]]) card.removeAttribute('href');
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
