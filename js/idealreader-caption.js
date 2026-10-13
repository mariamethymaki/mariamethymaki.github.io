/* The work "ideal reader wanted": the line with the three titles under the books.
   The text is split into two lines of about the same length (at the space that balances them best),
   and each line is spaced out letter by letter to the full width, so both lines have the same length.
   If the two halves do not fit (narrow screens), the text stays as normal justified text. */
(function () {
    var cap = document.querySelector('.ir-caption');
    if (!cap) { return; }
    var full = cap.textContent.trim();

    function fit() {
        cap.textContent = '';
        var probe = document.createElement('span');
        probe.style.whiteSpace = 'nowrap';
        cap.appendChild(probe);
        function width(s) { probe.textContent = s; return probe.getBoundingClientRect().width; }
        var W = cap.getBoundingClientRect().width;
        var best = -1, bestDiff = Infinity, w1, w2;
        for (var i = full.indexOf(' '); i !== -1; i = full.indexOf(' ', i + 1)) {
            var a = width(full.slice(0, i)), b = width(full.slice(i + 1));
            if (Math.abs(a - b) < bestDiff) { bestDiff = Math.abs(a - b); best = i; w1 = a; w2 = b; }
        }
        cap.textContent = full;
        if (best < 0 || w1 > W || w2 > W) { return; }
        cap.textContent = '';
        [full.slice(0, best), full.slice(best + 1)].forEach(function (s, k) {
            var line = document.createElement('span');
            line.className = 'ir-line';
            line.textContent = s;
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
