/* The work "amen": on the left a slideshow of pages from all the books of all the works
   (lOgos, in nOmine DEI, cAsa mIa s, apocAlypsis and the books of saturAted phenOmena facAdes), in random order;
   on the right the text. Each of the two is the size of one page of in nOmine DEI.
   A click on the slideshow opens the book at the spread that is shown. */
(function () {
    var show = document.getElementById('amenShow');
    var wrap = document.querySelector('.amen-wrap');
    if (!show || !wrap) { return; }
    var parts = window.location.pathname.split('/').filter(Boolean);
    var lang = (parts[0] === 'el' || parts[0] === 'it') ? '/' + parts[0] : '';

    function pad(n, w) { var s = String(n); while (s.length < w) { s = '0' + s; } return s; }
    /* every book: how many images, the file of image i (0-based), the page of the book */
    var books = [
        { pages: 124, src: function (i) { return '/media/images/tetradio/' + pad(i, 2) + '.jpg'; }, href: '/logos.html', page: function (i) { return i + 1; } },
        { pages: 124, src: function (i) { return '/media/images/nominedei/' + pad(i, 3) + '.jpg'; }, href: '/nominedei.html', page: function (i) { return i + 1; } },
        { pages: 124, src: function (i) { return '/media/images/casamias/' + pad(i, 3) + '.jpg'; }, href: '/casamias.html', page: function (i) { return i + 1; } },
        { pages: 106, src: function (i) { return '/media/images/apokalypsi/' + pad(i, 3) + '.jpg'; }, href: '/revelation.html', page: function (i) { return i + 1; } }
    ];
    var HANDMADE = books.length;   /* the handmade notebooks come first in the list */
    (window.PHENOMENA_BOOKS || []).forEach(function (b) {
        books.push({ pages: b.pages, src: function (i) { return '/media/images/phenomena/' + b.slug + '/' + pad(i + 1, 3) + '.jpg'; },
                     href: '/phenomena-book.html?b=' + b.slug, page: function (i) { return i + 1; } });
    });
    /* the flipbooks open on the spread whose left page is even */
    function spreadHash(n) { var left = n % 2 === 0 ? n : n - 1; return left >= 2 ? '#p=' + left : ''; }

    /* size: one page of in nOmine DEI (1200 x 1938), as tall as the screen allows, like the in nOmine DEI viewer */
    function size() {
        var narrow = window.matchMedia('(max-width: 767px)').matches;
        var top = document.querySelector('.topmenu'), foot = document.querySelector('.footer');
        /* the content height (without padding), as jQuery .height() in the in nOmine DEI viewer */
        function ch(el) { if (!el) { return 0; } var s = getComputedStyle(el); return el.clientHeight - parseFloat(s.paddingTop) - parseFloat(s.paddingBottom); }
        var h = window.innerHeight - ch(top) - ch(foot) - 100;
        var w = Math.round(h * 1200 / 1938);
        var avail = wrap.parentNode.clientWidth;
        /* the book is open: two pages side by side; the text beside it is at most one page wide */
        if (narrow) { w = Math.floor(avail / 2); h = Math.round(w * 1938 / 1200); }
        else if (3 * w + 40 > avail) { w = Math.floor((avail - 40) / 3); h = Math.round(w * 1938 / 1200); }
        wrap.style.setProperty('--pw', w + 'px');
        wrap.style.setProperty('--ph', h + 'px');
        fitText(narrow ? 0 : w, h);
    }

    /* the text starts at the top of the picture and ends at its bottom: it is made as narrow as needed
       (never wider than a page) so that it is as tall as the picture; the last bit is taken up by the line spacing.
       If it is taller than the picture even at the full width, the type gets smaller. */
    var text = wrap.querySelector('.amen-text');
    function fitText(w, h) {
        if (!text) { return; }
        text.style.width = ''; text.style.flexBasis = ''; text.style.fontSize = ''; text.style.lineHeight = '';
        wrap.style.removeProperty('--tw');
        if (!w) { return; }
        var fs = parseFloat(getComputedStyle(text).fontSize);
        function setW(x) { text.style.width = x + 'px'; text.style.flexBasis = x + 'px'; }
        setW(w);
        while (text.scrollHeight > h && fs > 9) { fs -= 0.25; text.style.fontSize = fs + 'px'; }
        /* the narrowest width at which the text is not taller than the picture */
        var lo = Math.round(w * 0.4), hi = w;
        while (lo < hi) { var mid = (lo + hi) >> 1; setW(mid); if (text.scrollHeight <= h) { hi = mid; } else { lo = mid + 1; } }
        setW(lo);
        wrap.style.setProperty('--tw', lo + 'px');   /* the elevation below is as wide as picture + text */
        /* then open the line spacing until the last line ends at the bottom of the picture */
        var lh = parseFloat(getComputedStyle(text).lineHeight);
        while (text.scrollHeight < h - 0.5 && lh < fs * 2) { lh += 0.05; text.style.lineHeight = lh + 'px'; if (text.scrollHeight > h) { lh -= 0.05; text.style.lineHeight = lh + 'px'; break; } }
    }
    size();
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(size); }
    window.addEventListener('load', size);
    window.addEventListener('resize', size);

    /* the slideshow is an open book: a random spread of a random book; every 2 seconds the right page turns over
       and the next random spread appears (two times out of three from the handmade notebooks, never their covers) */
    show.innerHTML = '<img class="pg-left" alt=""><img class="pg-right" alt="">' +
        '<div class="leaf"><img class="leaf-front" alt=""><img class="leaf-back" alt=""></div>';
    var L = show.querySelector('.pg-left'), R = show.querySelector('.pg-right'), leaf = show.querySelector('.leaf'),
        LF = show.querySelector('.leaf-front'), LB = show.querySelector('.leaf-back');
    var last = null, busy = false;
    function pick() {
        var b, n;
        do {
            var hand = Math.random() < 2 / 3 || books.length === HANDMADE;
            b = hand ? books[Math.floor(Math.random() * HANDMADE)]
                     : books[HANDMADE + Math.floor(Math.random() * (books.length - HANDMADE))];
            /* left page number n is even (as in the flipbooks); images n-1 and n */
            var lo = 2, hi = hand ? b.pages - 2 : b.pages - 1;
            n = lo + 2 * Math.floor(Math.random() * Math.floor((hi - lo) / 2 + 1));
        } while (b.src(n - 1) + n === last);
        last = b.src(n - 1) + n;
        return { b: b, left: b.src(n - 1), right: b.src(n), href: lang + b.href + '#p=' + n };
    }
    function load(srcs, done) {
        var k = srcs.length;
        srcs.forEach(function (s) { var im = new Image(); im.onload = im.onerror = function () { if (--k === 0) { done(); } }; im.src = s; });
    }
    function first() {
        var s = pick();
        load([s.left, s.right], function () { L.src = s.left; R.src = s.right; show.href = s.href; show.classList.add('ready'); });
    }
    function turn() {
        if (busy) { return; }
        busy = true;
        var s = pick();
        load([s.left, s.right], function () {
            LF.src = R.src;          /* the page that turns: the current right page ... */
            LB.src = s.left;         /* ... with the new left page on its back */
            R.src = s.right;         /* under it, the new right page */
            leaf.classList.remove('turned');
            leaf.style.display = 'block';
            void leaf.offsetWidth;
            leaf.classList.add('turned');
            setTimeout(function () {
                L.src = s.left; show.href = s.href;
                leaf.style.display = 'none'; leaf.classList.remove('turned');
                busy = false;
            }, 900);
        });
    }
    first();
    var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!still) { setInterval(turn, 2000); }
})();
