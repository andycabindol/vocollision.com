/**
 * Keep award marquee image alt text after Framer hydration.
 */
(function () {
  var ALTS = {
    'EZAGVz1Ef29xCQ0PItdYhn2fUs4.png': 'ICCA Quarterfinals Outstanding Arrangement 2024',
    'xZiRXt2oV0Uec9KDDqwcnCYCpsM.png': 'ICCA Quarterfinals Outstanding Choreography 2024',
    'K5MPXRzwzQEWEiTMwSLkQt1ztQ.png': 'ICCA Quarterfinals Outstanding Vocal Percussion 2024',
    'YiIw5n4cAgiihYl5CfAVUVeWbHo.png': 'ICCA Quarterfinals Quarterfinal Champions 2024',
    'eKkUOcqasQQyZ17vhwf22d6zDDE.png': 'ICCA Semifinals Outstanding Choreography 2024',
    'aiZFMdArbS8A14ol0SD761rdInc.png': 'ICCA Quarterfinals Outstanding Vocal Percussion 2023',
    'AOmQDdGAfJ7qa3Rb7mneMAZoVi0.png': 'ICCA Quarterfinals Quarterfinal Second Place 2023',
    'zjqp2AzQ1YfxfATnPG4zGciVorw.png': 'ICCA Semifinals Semifinal Fourth Place 2024',
    'y9S4hC6ieeiEh5rA45PDng4w.png': 'ICCA Quarterfinals Quarterfinal Second Place 2025',
    'o6genOkElKZ3FzuVftULDV0K0.png': 'ICCA Quarterfinals Outstanding Vocal Percussion 2025',
    'XNIyAQZIBurIgQj6ZY22PJZwMg.png': 'ICCA Quarterfinals Outstanding Arrangement 2025',
    'iv1LKjwiANKeqCD7XoK4j4XM.png': 'ICCA Quarterfinals Outstanding Video 2021',
    'OOIDUHnL7U4v4pwR5zZ4gyDGaHk.png': 'ICCA Quarterfinals Quarterfinal Champions 2021',
    'jrjaNjnlDY5HGaiTsp2S9CzmFs.png': 'ICCA Quarterfinals Outstanding Arrangement 2021',
  };

  function fileName(src) {
    if (!src) return '';
    return src.split('?')[0].split('/').pop();
  }

  function applyAlts() {
    document.querySelectorAll('img[src*="/assets/images/"]').forEach(function (img) {
      var name = fileName(img.getAttribute('src'));
      var alt = ALTS[name];
      if (alt && img.getAttribute('alt') !== alt) {
        img.setAttribute('alt', alt);
      }
    });
  }

  var observer = new MutationObserver(applyAlts);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAlts, { once: true });
  } else {
    applyAlts();
  }
}());
