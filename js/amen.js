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
        if (narrow) { w = avail; h = Math.round(w * 1938 / 1200); }
        else if (2 * w + 40 > avail) { w = Math.floor((avail - 40) / 2); h = Math.round(w * 1938 / 1200); }
        wrap.style.setProperty('--pw', w + 'px');
        wrap.style.setProperty('--ph', h + 'px');
    }
    size();
    window.addEventListener('resize', size);

    var imgs = show.querySelectorAll('img'), front = 0, last = null;
    function step() {
        var b, i;
        do {
            /* two times out of three one of the four handmade notebooks, otherwise one of the phenOmena books */
            var hand = Math.random() < 2 / 3 || books.length === HANDMADE;
            b = hand ? books[Math.floor(Math.random() * HANDMADE)]
                     : books[HANDMADE + Math.floor(Math.random() * (books.length - HANDMADE))];
            /* the handmade notebooks without their first and last page (the covers) */
            i = hand ? 1 + Math.floor(Math.random() * (b.pages - 2)) : Math.floor(Math.random() * b.pages);
        } while (b.src(i) === last);
        last = b.src(i);
        var pre = new Image();
        pre.onload = function () {
            var next = imgs[1 - front];
            next.src = pre.src;
            next.classList.add('on');
            imgs[front].classList.remove('on');
            front = 1 - front;
            show.href = lang + b.href + spreadHash(b.page(i));
        };
        pre.onerror = step;
        pre.src = last;
    }
    step();
    var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!still) { setInterval(step, 3500); }
})();
