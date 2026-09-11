/**
 * Replaces the exported Framer placeholder with the active audition details,
 * including after Framer client-side navigation.
 */
(function () {
  var contentHtml = [
    '<section>',
    '<h5>Virtual Auditions</h5>',
    '<p class="voco-audition-deadline">Now accepting submissions until Friday, Sept 18 at 11:59 pm!</p>',
    '<p>Record a video of yourself singing a verse and a chorus of any song without accompaniment that showcases your vocal talents and range (preferably no musical theater or classical)! If you know how to beatbox, feel free to include a sample of your skills in your video too!</p>',
    '<a class="voco-audition-submit" href="https://forms.gle/XXbe4KQti18GCcik7" target="_blank" rel="noopener">Submit your video</a>',
    '</section>',
    '<section>',
    '<h5>In-Person Auditions</h5>',
    '<p>Come prepared to sing a verse and a chorus of any song without accompaniment (preferably no musical theater or classical), and/or demonstrate your beatboxing skills!</p>',
    '<p>Drop in during one of these days:</p>',
    '<div class="voco-audition-dates">',
    '<div class="voco-audition-date"><h6>Friday, Sept 18</h6><p>6:30pm – 8:30pm EST</p><p>Kimmel Center for University Life, Room 904</p></div>',
    '<div class="voco-audition-date"><h6>Saturday, Sept 19</h6><p>2:00pm – 4:00pm EST</p><p>Kimmel Center for University Life, Room 904</p></div>',
    '</div>',
    '</section>',
  ].join('');

  function renderAuditionInfo() {
    var card = document.querySelector('[data-framer-name="Audition Card 2"]');
    if (!card) return;

    card.querySelectorAll('.framer-1pbflrj h4, .framer-1mjktxb h6').forEach(function (heading) {
      if (heading.textContent !== 'Audition Info') {
        heading.textContent = 'Audition Info';
      }
    });

    var content = card.querySelector('.framer-198lci3');
    if (!content || content.querySelector('[href="https://forms.gle/XXbe4KQti18GCcik7"]')) return;

    content.classList.add('voco-audition-info');
    content.innerHTML = contentHtml;
  }

  // Framer can replace the server-rendered card while it hydrates. Observe the
  // page so the active audition content is restored after that replacement.
  var observer = new MutationObserver(renderAuditionInfo);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderAuditionInfo, { once: true });
  } else {
    renderAuditionInfo();
  }
}());
