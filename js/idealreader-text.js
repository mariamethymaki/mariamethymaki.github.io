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

    function rel(el) {
        var r = el.getBoundingClientRect(), w = wrap.getBoundingClientRect();
        return { l: r.left - w.left, t: r.top - w.top, r: r.right - w.left, b: r.bottom - w.top };
    }
    function place(b, l, t, r, bot) {
        b.style.left = l + 'px'; b.style.top = t + 'px';
        b.style.width = Math.max(0, r - l) + 'px'; b.style.height = Math.max(0, bot - t) + 'px';
    }

    /* flow all the words through the four boxes at this size; true if everything fits */
    function flow(size, lh) {
        lh = lh || size * 1.4;
        boxes.forEach(function (b) { b.innerHTML = ''; b.style.fontSize = size + 'px'; b.style.lineHeight = lh + 'px'; });
        var bi = 0, box = boxes[0];
        for (var pi = 0; pi < paras.length; pi++) {
            var words = paras[pi], wi = 0;
            while (wi < words.length) {
                if (!box) { return false; }
                var p = document.createElement('p'), kept = [];
                if (wi > 0) { p.className = 'cont-from'; }
                box.appendChild(p);
                while (wi < words.length) {
                    kept.push(words[wi]);
                    p.innerHTML = kept.join(' ');
                    if (box.scrollHeight > box.clientHeight + 0.5) {
                        kept.pop();
                        p.innerHTML = kept.join(' ');
                        if (!kept.length) { box.removeChild(p); }
                        else { p.classList.add('cont'); }      /* the paragraph goes on in the next box: justify its last line too */
                        bi++; box = boxes[bi];
                        break;
                    }
                    wi++;
                }
            }
        }
        return true;
    }

    function lastBottom() {
        var ps = boxes[3].querySelectorAll('p');
        return ps.length ? ps[ps.length - 1].getBoundingClientRect().bottom : 0;
    }

    function layout() {
        var narrow = window.matchMedia('(max-width: 767px)').matches;
        var cells = wrap.querySelectorAll('.phen-cell');
        function plain() { wrap.classList.remove('ir-text-fits'); below.style.display = ''; }
        if (narrow || cells.length < 3) { plain(); return; }
        /* the boxes must be shown to be measured; the plain text hidden */
        wrap.classList.add('ir-text-fits'); below.style.display = 'none';
        var L = rel(cells[0]), C = rel(cells[1]), N = rel(cells[2]);
        var cap = wrap.querySelector('.ir-caption'), bottom = cap ? rel(cap).b : N.b;
        var left = L.l, right = C.r;
        /* 1 and 2 run on without a gap, as do 3 and 4; the text fills everything from the top of in nOmine DEI to the end of the titles line under it */
        place(boxes[0], left, N.t, right, L.t - PAD);
        place(boxes[1], C.l, L.t - PAD, right, C.t - PAD);
        place(boxes[2], C.l, C.b + PAD, right, L.b + PAD);
        place(boxes[3], left, L.b + PAD, right, bottom);
        /* the largest size (in quarter pixels) at which everything fits */
        var lo = MIN * 4, hi = MAX * 4, best = 0;
        while (lo <= hi) {
            var mid = (lo + hi) >> 1;
            if (flow(mid / 4)) { best = mid; lo = mid + 1; } else { hi = mid - 1; }
        }
        if (!best) { plain(); return; }
        /* then open up the line spacing a little, so that the last line ends level with the end of the titles line */
        var size = best / 4, lh = size * 1.4;
        while (lh < size * 1.7 && flow(size, lh + 0.05) && lastBottom() <= boxes[3].getBoundingClientRect().bottom + 0.5) { lh += 0.05; }
        flow(size, lh);
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
