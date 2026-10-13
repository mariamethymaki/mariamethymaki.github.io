/* The work "ideal reader wanted": the line with the three titles under the books.
   The text is split into two lines of about the same length (at the space that balances them best),
   and each line is spaced out letter by letter to the full width, so both lines have the same length.
   If the two halves do not fit (narrow screens), the text stays as normal justified text.
   Each title (with its year) is a link to the work; the titles are separated by " - ". */
(function () {
    var cap = document.querySelector('.ir-caption');
    if (!cap) { return; }
    var full = cap.textContent.trim();
    var parts = window.location.pathname.split('/').filter(Boolean);
    var lang = (parts[0] === 'el' || parts[0] === 'it') ? '/' + parts[0] : '';
    var pages = ['logos.html', 'casamias.html', 'nominedei.html'];
    /* the three titles: [start, end) in the text and the page of the work */
    var segs = [], from = 0;
    full.split(' - ').forEach(function (s, k) {
        segs.push({ a: from, b: from + s.length, href: lang + '/' + pages[k] });
        from += s.length + 3;
    });

    /* fill el with the text from start to end, the parts of titles as links */
    function fill(el, start, end) {
        var pos = start;
        segs.forEach(function (sg) {
            var a = Math.max(sg.a, start), b = Math.min(sg.b, end);
            if (b <= a) { return; }
            if (a > pos) { el.appendChild(document.createTextNode(full.slice(pos, a))); }
            var link = document.createElement('a');
            link.href = sg.href;
            link.textContent = full.slice(a, b);
            el.appendChild(link);
            pos = b;
        });
        if (pos < end) { el.appendChild(document.createTextNode(full.slice(pos, end))); }
    }

    function fit() {
        cap.textContent = '';
        var probe = document.createElement('span');
        probe.style.whiteSpace = 'nowrap';
        cap.appendChild(probe);
        function width(s) { probe.textContent = s; return probe.getBoundingClientRect().width; }
        var W = cap.getBoundingClientRect().width;
        var best = -1, bestDiff = Infinity, w1, w2;
        for (var i = full.indexOf(' '); i !== -1; i = full.indexOf(' ', i + 1)) {
            if (full.charAt(i - 1) === '-' || full.charAt(i + 1) === '-') { continue; } /* never break next to the dash */
            var a = width(full.slice(0, i)), b = width(full.slice(i + 1));
            if (Math.abs(a - b) < bestDiff) { bestDiff = Math.abs(a - b); best = i; w1 = a; w2 = b; }
        }
        cap.textContent = '';
        if (best < 0 || w1 > W || w2 > W) { fill(cap, 0, full.length); return; }
        [[0, best], [best + 1, full.length]].forEach(function (r, k) {
            var s = full.slice(r[0], r[1]);
            var line = document.createElement('span');
            line.className = 'ir-line';
            fill(line, r[0], r[1]);
            var extra = W - (k ? w2 : w1), n = s.length;
            if (n > 1 && extra > 0) {
                var ls = extra / (n - 1);
                line.style.letterSpacing = ls + 'px';
                line.style.marginRight = -ls + 'px';
            }
            cap.appendChild(line);
        });
    }

    var t;
    function later() { clearTimeout(t); t = setTimeout(fit, 60); }
    window.addEventListener('resize', later);
    window.addEventListener('load', fit);
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(fit); }
    fit();
})();
