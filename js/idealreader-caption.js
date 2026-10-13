/* The work "ideal reader wanted": the line with the three titles under the books is justified,
   and its last line is stretched to the same length as the first by spacing out its letters. */
(function () {
    var cap = document.querySelector('.ir-caption');
    if (!cap) { return; }
    var full = cap.textContent;

    function fit() {
        cap.textContent = full;
        var node = cap.firstChild;
        if (!node || !full.length) { return; }
        var range = document.createRange();
        function top(i) { range.setStart(node, i); range.setEnd(node, i + 1); return range.getBoundingClientRect().top; }
        var lastTop = top(full.length - 1);
        if (top(0) === lastTop) { return; }
        /* first character on the last line */
        var lo = 0, hi = full.length - 1;
        while (lo < hi) { var mid = (lo + hi) >> 1; if (top(mid) < lastTop - 1) { lo = mid + 1; } else { hi = mid; } }
        while (lo < full.length && full.charAt(lo) === ' ') { lo++; }
        var span = document.createElement('span');
        span.className = 'ir-last';
        span.textContent = full.slice(lo);
        node.textContent = full.slice(0, lo);
        cap.appendChild(span);
        var n = span.textContent.length;
        var extra = cap.getBoundingClientRect().right - span.getBoundingClientRect().right;
        if (n > 1 && extra > 0) {
            var ls = extra / (n - 1);
            span.style.letterSpacing = ls + 'px';
            span.style.marginRight = -ls + 'px';
        }
    }

    var t;
    function later() { clearTimeout(t); t = setTimeout(fit, 60); }
    window.addEventListener('resize', later);
    window.addEventListener('load', fit);
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(fit); }
    fit();
})();
