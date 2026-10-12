/*
 * Link between the Anaglypto work and the book Logos.
 * The texts of Logos are written on the five panels of Anaglypto.
 *
 * panels: horizontal extent of each panel, in % of the width of
 *         media/images/anaglypto/anaglyph_color.jpg (left to right).
 * texts:  spread = id of the Logos spread (page<spread> in logos.html, left page of the open book)
 *         panels = panels of Anaglypto where the text is written
 *         sure   = false when the match is still provisional (to be confirmed by the artist)
 */
(function () {
    var lang = (document.documentElement.lang || 'en').slice(0, 2);
    if (lang !== 'el' && lang !== 'it') { lang = 'en'; }
    var prefix = lang === 'en' ? '' : '/' + lang;

    var panels = [
        { left: 4.3, right: 21.1 },
        { left: 23.8, right: 42.3 },
        { left: 42.5, right: 62.0 },
        { left: 62.0, right: 78.1 },
        { left: 78.1, right: 96.3 }
    ];

    var texts = [
        { id: 'hermes', spread: 4, panels: [3], sure: true,
          name: { en: 'Hermes Trismegistus', el: 'Ερμής ο Τρισμέγιστος', it: 'Ermete Trismegisto' } },
        { id: 'matthew7', spread: 22, panels: [5], sure: true,
          name: { en: 'Matthew 7', el: 'Κατά Ματθαίον 7', it: 'Matteo 7' } },
        { id: 'apollonius', spread: 40, panels: [4], sure: false,
          name: { en: 'Apollonius of Tyana', el: 'Απολλώνιος ο Τυανεύς', it: 'Apollonio di Tiana' } },
        { id: 'songofsongs', spread: 50, panels: [1], sure: false,
          name: { en: 'Song of Songs', el: 'Άσμα Ασμάτων', it: 'Cantico dei Cantici' } },
        { id: 'rilke', spread: 58, panels: [2], sure: true,
          name: { en: 'Rilke, Duino Elegies', el: 'Ρίλκε, Ελεγείες του Ντουίνο', it: 'Rilke, Elegie duinesi' } },
        { id: 'matthew6', spread: 62, panels: [4, 5], sure: false,
          name: { en: 'Matthew 6', el: 'Κατά Ματθαίον 6', it: 'Matteo 6' } },
        { id: 'eliot', spread: 64, panels: [1, 2], sure: true,
          name: { en: 'T.S. Eliot, Burnt Norton', el: 'Τ.Σ. Έλιοτ, Burnt Norton', it: 'T.S. Eliot, Burnt Norton' } },
        { id: 'hesiod', spread: 68, panels: [1], sure: true,
          name: { en: 'Hesiod, Theogony', el: 'Ησίοδος, Θεογονία', it: 'Esiodo, Teogonia' } },
        { id: 'alcman', spread: 88, panels: [5], sure: true,
          name: { en: 'Alcman', el: 'Αλκμάν', it: 'Alcmane' } },
        { id: 'corinthians13', spread: 90, panels: [1], sure: true,
          name: { en: '1 Corinthians 13', el: 'Α΄ Κορινθίους 13', it: '1 Corinzi 13' } },
        { id: 'einstein', spread: 92, panels: [2], sure: true,
          name: { en: 'Albert Einstein', el: 'Άλμπερτ Αϊνστάιν', it: 'Albert Einstein' } },
        { id: 'leucippus', spread: 106, panels: [2, 3], sure: true,
          name: { en: 'Leucippus and Democritus', el: 'Λεύκιππος και Δημόκριτος', it: 'Leucippo e Democrito' } }
    ];

    var S = {
        en: { panel: 'Panel', panels: 'panels', written: 'Written on anAglypto', logos: 'lOgos, pp.' },
        el: { panel: 'Πάνελ', panels: 'πάνελ', written: 'Γραμμένο στο ανΑγλυπτο', logos: 'λΟγος, σελ.' },
        it: { panel: 'Pannello', panels: 'pannelli', written: 'Scritto su anAglypto', logos: 'lOgos, pp.' }
    }[lang];

    var bySpread = {}, byId = {};
    texts.forEach(function (t) { bySpread[t.spread] = t; byId[t.id] = t; });

    function pages(spread) { return (spread - 1) + '–' + spread; }

    window.AnaglyptoLogos = {
        lang: lang,
        prefix: prefix,
        strings: S,
        panels: panels,
        texts: texts,
        bySpread: bySpread,
        byId: byId,
        name: function (t) { return t.name[lang]; },
        pages: pages,
        logosUrl: function (spread) { return prefix + '/logos.html?page=' + spread; },
        anaglyptoUrl: function (id) { return prefix + '/anaglypto.html?text=' + id; },
        inPanel: function (n) {
            return texts.filter(function (t) { return t.panels.indexOf(n) !== -1; });
        },
        panelLabel: function (list) {
            return (list.length > 1 ? S.panels : S.panel.toLowerCase()) + ' ' + list.join(', ');
        },
        /* HTML line shown under a Logos text, linking to the panels of Anaglypto */
        linkHtml: function (spread) {
            var t = bySpread[spread];
            if (!t) { return ''; }
            return '<div class="anaglypto-link"><a href="' + this.anaglyptoUrl(t.id) + '">' +
                S.written + ' — ' + this.panelLabel(t.panels) + ' →</a></div>';
        }
    };
})();
