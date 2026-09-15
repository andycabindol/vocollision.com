/**
 * Updates Framer audition card copy in place (keeps Framer styling),
 * including after Framer client-side navigation.
 */
(function () {
  var FORM_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLSe8hjf2PgHeoViPu4oPOsEP8uuXgSYlgqjXSpSpg7ZabFPHOQ/viewform';

  var VIRTUAL_TITLE = 'Virtual Auditions';
  var IN_PERSON_TITLE = 'In-Person Auditions';
  var DEADLINE = 'Now accepting submissions until Friday, Sept 18 at 11:59 pm!';

  var virtualBodyHtml =
    '<p style="--framer-line-height:26px;--framer-text-color:rgb(255, 255, 255)" class="framer-text">' +
    'Record a video of yourself singing a verse and a chorus of any song without accompaniment that showcases your vocal talents and range (preferably no musical theater or classical)! If you know how to beatbox, feel free to include a sample of your skills in your video too!' +
    '</p>';

  var inPersonBodyHtml = [
    '<p style="--framer-line-height:26px;--framer-text-color:rgb(255, 255, 255)" class="framer-text">Come prepared to sing a verse and a chorus of any song without accompaniment (preferably no musical theater or classical), and/or demonstrate your beatboxing skills!</p>',
    '<p style="--framer-line-height:26px;--framer-text-color:rgb(255, 255, 255)" class="framer-text">Drop in during one of these days:</p>',
    '<div class="voco-audition-dates">',
    '<div class="voco-audition-date">',
    '<p class="voco-audition-date-day">Friday, Sept 18</p>',
    '<p class="voco-audition-date-time">6:30pm – 8:30pm EST</p>',
    '<p class="voco-audition-date-place">Kimmel Center for University Life, Room 904</p>',
    '</div>',
    '<div class="voco-audition-date">',
    '<p class="voco-audition-date-day">Saturday, Sept 19</p>',
    '<p class="voco-audition-date-time">2:00pm – 4:00pm EST</p>',
    '<p class="voco-audition-date-place">Kimmel Center for University Life, Room 904</p>',
    '</div>',
    '</div>',
  ].join('');

  function setText(el, text) {
    if (el && el.textContent !== text) el.textContent = text;
  }

  function setHeadings(card, title) {
    card.querySelectorAll('.framer-1pbflrj h4, .framer-1mjktxb h6').forEach(function (heading) {
      setText(heading, title);
    });
  }

  function fillBody(card, html, marker) {
    var content = card.querySelector('.framer-198lci3');
    if (!content || content.getAttribute('data-voco-filled') === marker) return;
    content.setAttribute('data-voco-filled', marker);
    content.innerHTML = html;
  }

  function updateVirtualCard(card) {
    setHeadings(card, VIRTUAL_TITLE);
    setText(card.querySelector('.framer-1vvheg3 p'), DEADLINE);
    setText(card.querySelector('.framer-i4q2ao p'), 'Now accepting auditions!');
    fillBody(card, virtualBodyHtml, 'virtual');

    card.querySelectorAll('a.framer-h5sli').forEach(function (link) {
      if (link.getAttribute('href') !== FORM_URL) {
        link.setAttribute('href', FORM_URL);
      }
      var label = link.querySelector('p');
      setText(label, 'Submit your video');
    });
  }

  function updateInPersonCard(card) {
    setHeadings(card, IN_PERSON_TITLE);
    fillBody(card, inPersonBodyHtml, 'in-person-dates');
  }

  function renderAuditionInfo() {
    var virtualCard = document.querySelector('[data-framer-name="Audition Card 1"]');
    var inPersonCard = document.querySelector('[data-framer-name="Audition Card 2"]');
    if (virtualCard) updateVirtualCard(virtualCard);
    if (inPersonCard) updateInPersonCard(inPersonCard);
  }

  var observer = new MutationObserver(renderAuditionInfo);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderAuditionInfo, { once: true });
  } else {
    renderAuditionInfo();
  }
}());
