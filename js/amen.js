/* The work "amen": two open books side by side, turned with turn.js like the flipbooks of the site:
   on the left the handmade notebooks (lOgos, in nOmine DEI, cAsa mIa s, apocAlypsis; never their covers), a page every 2.5 s;
   on the right the books of saturAted phenOmena facAdes, a page every 1.5 s. Each shows a random spread of a random book.
   A click on a book opens it at the spread that is shown. Under the books the text and the elevation, as wide as the two books. */
(function () {
    var wrap = document.querySelector('.amen-wrap');
    var shows = document.querySelectorAll('.amen-show');
    if (!wrap || shows.length < 2) { return; }
    var parts = window.location.pathname.split('/').filter(Boolean);
    var lang = (parts[0] === 'el' || parts[0] === 'it') ? '/' + parts[0] : '';
    var GAP = 24;   /* between the two books */

    function pad(n, w) { var s = String(n); while (s.length < w) { s = '0' + s; } return s; }
    /* every book: how many images and the file of image i (0-based); page number = i + 1 */
    var handmade = [
        { pages: 124, src: function (i) { return '/media/images/tetradio/' + pad(i, 2) + '.jpg'; }, href: '/logos.html' },
        { pages: 124, src: function (i) { return '/media/images/nominedei/' + pad(i, 3) + '.jpg'; }, href: '/nominedei.html' },
        { pages: 124, src: function (i) { return '/media/images/casamias/' + pad(i, 3) + '.jpg'; }, href: '/casamias.html' },
        { pages: 106, src: function (i) { return '/media/images/apokalypsi/' + pad(i, 3) + '.jpg'; }, href: '/revelation.html' }
    ];
    var phenomena = (window.PHENOMENA_BOOKS || []).map(function (b) {
        return { pages: b.pages, src: function (i) { return '/media/images/phenomena/' + b.slug + '/' + pad(i + 1, 3) + '.jpg'; },
                 href: '/phenomena-book.html?b=' + b.slug };
    });

    /* size: each page is one page of in nOmine DEI (1200 x 1938), as tall as the screen allows; four pages side by side */
    var books = [];
    function size() {
        var narrow = window.matchMedia('(max-width: 767px)').matches;
        var top = document.querySelector('.topmenu'), foot = document.querySelector('.footer');
        function ch(el) { if (!el) { return 0; } var s = getComputedStyle(el); return el.clientHeight - parseFloat(s.paddingTop) - parseFloat(s.paddingBottom); }
        var h = window.innerHeight - ch(top) - ch(foot) - 100;
        var w = Math.round(h * 1200 / 1938);
        /* the width beside the side menu (the column itself grows with its content, so it cannot be measured) */
        var menu = document.querySelector('.nav-sidemenu');
        var menuCol = menu ? menu.parentNode : null;
        var avail = narrow ? wrap.parentNode.clientWidth : document.documentElement.clientWidth - (menuCol ? menuCol.offsetWidth : 0) - 48;
        if (narrow) { w = Math.floor(avail / 2); h = Math.round(w * 1938 / 1200); }   /* phones: the books one under the other */
        else if (4 * w + GAP > avail) { w = Math.floor((avail - GAP) / 4); h = Math.round(w * 1938 / 1200); }
        wrap.style.setProperty('--pw', w + 'px');
        wrap.style.setProperty('--ph', h + 'px');
        wrap.style.setProperty('--bw', (narrow ? 2 * w : 4 * w + GAP) + 'px');
        books.forEach(function (b) { b.size(w, h); });
        fitText(narrow);
    }

    /* the text under the first book is as tall as the elevation under the second: the type gets smaller (or larger, up to 13px) */
    function fitText(narrow) {
        var text = wrap.querySelector('.amen-text'), opsi = wrap.querySelector('.amen-opsi');
        if (!text || !opsi) { return; }
        text.style.fontSize = ''; text.style.lineHeight = '';
        if (narrow) { return; }
        var H = opsi.offsetHeight, fs = 13;
        function set(x) { text.style.fontSize = x + 'px'; text.style.lineHeight = (x * 1.4) + 'px'; }
        set(fs);
        while (text.offsetHeight > H && fs > 6) { fs -= 0.1; set(fs); }
        var lh = fs * 1.4;
        while (text.offsetHeight < H - 0.5 && lh < fs * 2) { lh += 0.05; text.style.lineHeight = lh + 'px'; if (text.offsetHeight > H) { lh -= 0.05; text.style.lineHeight = lh + 'px'; break; } }
    }

    function load(srcs, done) {
        var k = srcs.length;
        srcs.forEach(function (s) { var im = new Image(); im.onload = im.onerror = function () { if (--k === 0) { done(); } }; im.src = s; });
    }
    function pageEl(src) {
        var d = document.createElement('div');
        d.className = 'amen-page';
        d.innerHTML = '<img alt="" src="' + src + '">';
        return d;
    }

    function Book(show, pool, skipCovers, every) {
        show.innerHTML = '<div class="amen-book"></div>';
        var $book = jQuery(show.firstChild), last = null, ready = false, busy = false, PW = 0, PH = 0, hrefs = {};
        function pick() {
            var b, n;
            do {
                b = pool[Math.floor(Math.random() * pool.length)];
                /* left page number n is even (as in the flipbooks); images n-1 and n */
                var lo = 2, hi = skipCovers ? b.pages - 2 : b.pages - 1;
                n = lo + 2 * Math.floor(Math.random() * Math.floor((hi - lo) / 2 + 1));
            } while (b.src(n - 1) + n === last);
            last = b.src(n - 1) + n;
            return { left: b.src(n - 1), right: b.src(n), href: lang + b.href + '#p=' + n };
        }
        function build(s) {
            if (ready) { $book.turn('destroy'); }
            $book.empty();
            $book.append(pageEl(s.left)).append(pageEl(s.left)).append(pageEl(s.right));   /* page 1 is never shown */
            hrefs = { 2: s.href };
            $book.turn({ page: 2, display: 'double', width: 2 * PW, height: PH, acceleration: false, gradients: true,
                         elevation: 50, duration: Math.min(900, every * 0.6),
                         when: { turned: function () { var v = $book.turn('view'); if (hrefs[v[0]]) { show.href = hrefs[v[0]]; } busy = false; } } });
            $book.turn('disable', true);   /* no turning by hand: a click opens the book */
            show.href = s.href;
            ready = true;
        }
        function turnPage() {
            if (!ready || busy) { return; }
            busy = true;
            var s = pick();
            load([s.left, s.right], function () {
                var n = $book.turn('pages');
                if (n > 120) { build(s); busy = false; return; }   /* start a fresh book now and then */
                $book.turn('addPage', pageEl(s.left), n + 1);
                $book.turn('addPage', pageEl(s.right), n + 2);
                hrefs[n + 1] = s.href;
                $book.turn('disable', false); $book.turn('next'); $book.turn('disable', true);
            });
        }
        this.size = function (w, h) { PW = w; PH = h; if (ready) { $book.turn('size', 2 * w, h); } };
        var s0 = pick();
        load([s0.left, s0.right], function () {
            var go = function () { if (PW) { build(s0); } else { setTimeout(go, 50); } };
            go();
        });
        var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!still) { setInterval(turnPage, every); }
    }

    if (window.jQuery && jQuery.fn.turn) {
        books.push(new Book(shows[0], handmade, true, 2500));
        books.push(new Book(shows[1], phenomena, false, 1500));
    }
    size();
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(size); }
    window.addEventListener('load', size);
    window.addEventListener('resize', size);
})();
