/* The work "ideal reader wanted": the text about the book flows through the four empty areas around lOgos and cAsa mIa s
   (as Maria drew them): 1. the band above lOgos, as wide as lOgos and cAsa mIa s together;
   2. above cAsa mIa s; 3. below cAsa mIa s; 4. the band below lOgos, down to where the titles line under in nOmine DEI ends.
   Together with the books they form a rectangle that closes with in nOmine DEI.
   The type size is the largest at which the whole text fits; on screens where it does not fit even at 8px
   (and on phones) the text is shown as plain text under the books. */
(function () {
    var wrap = document.querySelector('.ir-wrap');
    var src = document.querySelector('.ir-text-src');
    if (!wrap || !src) { return; }
    var PAD = 10, MIN = 8, MAX = 16;

    /* the text as paragraphs of words (a word may carry markup such as <i>book</i>) */
    /* one continuous text, without paragraphs (so that the type can be a little larger) */
    var paras = [[].map.call(src.querySelectorAll('p'), function (p) { return p.innerHTML.trim(); }).join(' ').split(/\s+/)];

    var boxes = [1, 2, 3, 4].map(function (n) {
        var b = document.createElement('div');
        b.className = 'ir-text ir-text-' + n;
        wrap.appendChild(b);
        return b;
    });
    var below = document.createElement('div');
    below.className = 'ir-text-below';
    below.innerHTML = src.innerHTML;
    /* outside the wrap, so that it never changes the width of the wrap (and the position of the books) */
    wrap.parentNode.insertBefore(below, wrap.nextSibling);

    /* "+ amen" (as on the amen page) under the books: the text appears only when it is opened */
    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'ir-toggle';
    toggle.innerHTML = '<span class="ir-toggle-sign">+</span> amen';
    toggle.setAttribute('aria-expanded', 'false');
    wrap.appendChild(toggle);   /* placed at the end of the text, far right, in layout() */
    toggle.addEventListener('click', function () {
        var open = !document.body.classList.contains('ir-open');
        document.body.classList.toggle('ir-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.firstChild.textContent = open ? '−' : '+';
    });

    function rel(el) {
        var r = el.getBoundingClientRect(), w = wrap.getBoundingClientRect();
        return { l: r.left - w.left, t: r.top - w.top, r: r.right - w.left, b: r.bottom - w.top };
    }
    function place(b, l, t, r, bot) {
        b.style.left = l + 'px'; b.style.top = t + 'px';
        b.style.width = Math.max(0, r - l) + 'px'; b.style.height = Math.max(0, bot - t) + 'px';
    }

    /* flow all the words through the four boxes at this size; true if everything fits */
    var G = null;   /* the positions of the books, measured in layout() */

    /* all the lines lie on one grid that starts at the top of in nOmine DEI and ends at the end of the titles line,
       so the space between the lines is the same everywhere, also where the text goes on from one area to the next.
       k = number of grid lines; each area takes whole lines */
    function placeOnGrid(k) {
        var lh = (G.bottom - G.top) / k;
        function line(y, up) { var n = (y - G.top) / lh; return Math.max(0, Math.min(k, up ? Math.ceil(n - 0.001) : Math.floor(n + 0.001))); }
        var n1 = line(G.L.t - PAD, false);          /* 1: above lOgos, across both books */
        var n2 = line(G.C.t - PAD, false);          /* 2: above cAsa mIa s, right after 1 */
        var n3 = line(G.C.b + PAD, true);           /* 3: below cAsa mIa s */
        var n4 = Math.max(n3, line(G.L.b + PAD, true));   /* 4: below lOgos, to the end */
        function y(n) { return G.top + n * lh; }
        place(boxes[0], G.left, y(0), G.right, y(n1));
        place(boxes[1], G.C.l, y(n1), G.right, y(Math.max(n1, n2)));
        place(boxes[2], G.C.l, y(n3), G.right, y(n4));
        place(boxes[3], G.left, y(n4), G.right, y(k));
        return lh;
    }

    /* flow all the words through the four areas at this size and number of grid lines; true if everything fits */
    function flow(size, k) {
        var lh = placeOnGrid(k);
        boxes.forEach(function (b) { b.innerHTML = ''; b.style.fontSize = size + 'px'; b.style.lineHeight = lh + 'px'; });
        var words = paras[0], wi = 0;
        for (var bi = 0; bi < boxes.length && wi < words.length; bi++) {
            var box = boxes[bi], p = document.createElement('p'), kept = [];
            if (box.clientHeight < lh - 0.5) { continue; }
            box.appendChild(p);
            while (wi < words.length) {
                kept.push(words[wi]);
                p.innerHTML = kept.join(' ');
                if (box.scrollHeight > box.clientHeight + 0.5) {
                    kept.pop();
                    p.innerHTML = kept.join(' ');
                    if (!kept.length) { box.removeChild(p); } else { p.classList.add('cont'); }   /* goes on in the next area: justify its last line too */
                    break;
                }
                wi++;
            }
        }
        return wi >= words.length;
    }
    /* the fewest grid lines (= the most open line spacing, up to 1.7) at which the text fits at this size, or 0 */
    function linesFor(size) {
        var H = G.bottom - G.top;
        var kMax = Math.floor(H / (size * 1.35)), kMin = Math.ceil(H / (size * 1.7));
        for (var k = kMin; k <= kMax; k++) { if (flow(size, k)) { return k; } }
        return 0;
    }

    function layout() {
        var narrow = window.matchMedia('(max-width: 767px)').matches;
        var cells = wrap.querySelectorAll('.phen-cell');
        function plain() { wrap.classList.remove('ir-text-fits'); below.style.display = ''; }
        if (narrow || cells.length < 3) { plain(); return; }
        /* the boxes must be shown to be measured; the plain text hidden */
        wrap.classList.add('ir-text-fits'); below.style.display = 'none';
        var L = rel(cells[0]), C = rel(cells[1]), N = rel(cells[2]);
        var cap = wrap.querySelector('.ir-caption');
        G = { L: L, C: C, left: L.l, right: C.r, top: N.t, bottom: cap ? rel(cap).b : N.b };
        /* the last line of the space is kept for "+ amen", at the end of the text, far right */
        var TH = toggle.offsetHeight || 36;
        toggle.style.left = (G.right - toggle.offsetWidth) + 'px';
        toggle.style.top = (G.bottom - TH) + 'px';
        G.bottom -= TH + 4;
        /* the largest size (in quarter pixels) at which everything fits */
        var lo = MIN * 4, hi = MAX * 4, best = 0, bestK = 0;
        while (lo <= hi) {
            var mid = (lo + hi) >> 1, k = linesFor(mid / 4);
            if (k) { best = mid; bestK = k; lo = mid + 1; } else { hi = mid - 1; }
        }
        if (!best) { plain(); return; }
        flow(best / 4, bestK);
        /* "+ amen" in the type of the text, as a part of it */
        toggle.style.fontSize = boxes[0].style.fontSize; toggle.style.lineHeight = boxes[0].style.lineHeight;
        toggle.style.left = (G.right - toggle.offsetWidth) + 'px';
    }

    var t;
    function later() { clearTimeout(t); t = setTimeout(layout, 80); }
    window.addEventListener('resize', later);
    /* the column also changes width without a window resize (e.g. when the scroll bar appears) */
    var lastW = 0;
    if (window.ResizeObserver) {
        /* and the books change size with the height of the window */
        new ResizeObserver(function () {
            var r = wrap.querySelector('.ir-grid').getBoundingClientRect(), key = Math.round(r.width) + 'x' + Math.round(r.height) + '/' + wrap.parentNode.clientWidth;
            if (key !== lastW) { lastW = key; later(); }
        }).observe(wrap.querySelector('.ir-grid'));
    }
    window.addEventListener('load', layout);
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(layout); }
    layout();
    setTimeout(layout, 500);
    setTimeout(layout, 1500);
})();
