/*
 * Anaglypto page: the five panels light up when the pointer is over them and show the
 * texts of Logos that are written on them (links open the book on the right spread).
 * ?text=<id> or ?panel=<n> in the URL pre-selects a text or a panel.
 */
(function () {
    var D = window.AnaglyptoLogos;
    var container = document.querySelector('.anaglypto-image-container');
    var img = document.getElementById('anaglypto-image');
    var holder = document.querySelector('.anaglypto-container');
    if (!D || !container || !img || !holder) { return; }

    var S = D.strings;
    var HINT = {
        en: 'Move over the work: the panels carry texts that appear in lOgos. Click a panel to keep it.',
        el: 'Περνώντας πάνω από το έργο βλέπεις ποια κείμενα του λΟγου είναι γραμμένα σε κάθε πάνελ. Κάνε κλικ σε ένα πάνελ για να μείνει.',
        it: 'Passa sull’opera: i pannelli portano testi che compaiono in lOgos. Clicca su un pannello per fissarlo.'
    }[D.lang];
    var OPEN = { en: 'Logos, pp.', el: 'Logos, σελ.', it: 'Logos, pp.' }[D.lang];

    var highlights = D.panels.map(function (p) {
        var el = document.createElement('div');
        el.className = 'anaglypto-hl';
        el.style.left = p.left + '%';
        el.style.width = (p.right - p.left) + '%';
        container.appendChild(el);
        return el;
    });

    var info = document.createElement('div');
    info.className = 'anaglypto-panel-info';
    info.setAttribute('aria-live', 'polite');
    holder.appendChild(info);

    var pinned = null;   // { type: 'panel', n } | { type: 'text', id }
    var hover = null;    // panel number under the pointer

    function panelButtons(active) {
        var html = '<div class="anaglypto-panel-buttons">';
        D.panels.forEach(function (p, i) {
            var n = i + 1;
            html += '<button type="button" data-panel="' + n + '" aria-pressed="' +
                (active === n ? 'true' : 'false') + '" aria-label="' + S.panel + ' ' + n + '">' + n + '</button>';
        });
        return html + '</div>';
    }

    function textItem(t) {
        return '<li><a href="' + D.logosUrl(t.spread) + '">' + D.name(t) +
            ' <span>' + OPEN + ' ' + D.pages(t.spread) + ' →</span></a></li>';
    }

    function render() {
        var state = hover ? { type: 'panel', n: hover } : pinned;
        var lit = [];
        var html = '';
        var active = null;
        if (!state) {
            html = '<p class="hint">' + HINT + '</p>';
        } else if (state.type === 'panel') {
            lit = [state.n];
            active = state.n;
            html = '<strong>' + S.panel + ' ' + state.n + '</strong><ul>' +
                D.inPanel(state.n).map(textItem).join('') + '</ul>';
        } else {
            var t = D.byId[state.id];
            if (t) {
                lit = t.panels.slice();
                html = '<strong>' + D.name(t) + '</strong> — ' + D.panelLabel(t.panels) +
                    '<ul>' + textItem(t) + '</ul>';
            } else {
                html = '<p class="hint">' + HINT + '</p>';
            }
        }
        if (pinned && pinned.type === 'panel' && !hover) { active = pinned.n; }
        highlights.forEach(function (el, i) { el.classList.toggle('on', lit.indexOf(i + 1) !== -1); });
        info.innerHTML = html + panelButtons(active);
    }

    function panelAt(e) {
        var r = img.getBoundingClientRect();
        if (!r.width) { return null; }
        var x = (e.clientX - r.left) / r.width * 100;
        var y = (e.clientY - r.top) / r.height * 100;
        if (y < 9 || y > 89) { return null; }
        for (var i = 0; i < D.panels.length; i++) {
            if (x >= D.panels[i].left && x <= D.panels[i].right) { return i + 1; }
        }
        return null;
    }

    container.addEventListener('mousemove', function (e) {
        var n = panelAt(e);
        if (n !== hover) { hover = n; render(); }
    });
    container.addEventListener('mouseleave', function () {
        if (hover !== null) { hover = null; render(); }
    });
    container.addEventListener('click', function (e) {
        var n = panelAt(e);
        if (!n) { return; }
        pinned = (pinned && pinned.type === 'panel' && pinned.n === n) ? null : { type: 'panel', n: n };
        hover = n;
        render();
    });
    info.addEventListener('click', function (e) {
        var b = e.target.closest ? e.target.closest('button[data-panel]') : null;
        if (!b) { return; }
        var n = parseInt(b.getAttribute('data-panel'), 10);
        pinned = (pinned && pinned.type === 'panel' && pinned.n === n) ? null : { type: 'panel', n: n };
        hover = null;
        render();
    });

    var q = window.location.search;
    var m = /[?&]text=([a-z0-9]+)/i.exec(q);
    var p = /[?&]panel=([1-5])\b/.exec(q);
    if (m && D.byId[m[1]]) { pinned = { type: 'text', id: m[1] }; }
    else if (p) { pinned = { type: 'panel', n: parseInt(p[1], 10) }; }
    render();
})();
