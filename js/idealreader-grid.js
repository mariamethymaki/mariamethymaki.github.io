/* The work "ideal reader wanted": a grid of the three books (in nomine Dei, Logos, CasaMIaS).
   Every few seconds the same page number is shown from the three books, one after the other, like three slideshows.
   A click opens the book at the spread that is shown. */
(function () {
    var pages = window.IDEAL_READER_PAGES || [];
    var grid = document.getElementById('irGrid');
    if (!grid || !pages.length) { return; }
    var parts = window.location.pathname.split('/').filter(Boolean);
    var lang = (parts[0] === 'el' || parts[0] === 'it') ? '/' + parts[0] : '';
    var labels = {
        '': { logos: 'Logos', casamias: 'CasaMIaS', nominedei: 'In nomine Dei' },
        '/el': { logos: 'Λόγος', casamias: 'CasaMIaS', nominedei: 'Για όνομα του Θεού' },
        '/it': { logos: 'Logos', casamias: 'CasaMIaS', nominedei: 'In nomine Dei' }
    }[lang];
    /* order: Logos / CasaMIaS / In nomine Dei; scale = real height of the book (30, 21, 43 cm) relative to the tallest; centred on each other */
    var books = [
        { key: 'logos', ratio: 1000 / 1418, href: '/logos.html', scale: 30 / 43 },
        { key: 'casamias', ratio: 1000 / 1410, href: '/casamias.html', scale: 21 / 43 },
        { key: 'nominedei', ratio: 1200 / 1938, href: '/nominedei.html', scale: 1 }
    ];
    var base = '/media/images/idealreader/';
    var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var STAGGER = 280, EVERY = 3500;

    function pad3(n) { return (n < 10 ? '00' : n < 100 ? '0' : '') + n; }
    /* the flipbooks open on the spread whose left page is even; page number n of the book = image n-1 */
    function spreadHash(p) { var n = p + 1, left = n % 2 === 0 ? n : n - 1; return left >= 2 ? '#p=' + left : ''; }

    var cells = books.map(function (b, i) {
        var a = document.createElement('a');
        a.className = 'phen-cell';
        a.href = lang + b.href;
        a.setAttribute('aria-label', labels[b.key]);
        a.style.height = 'calc(var(--h) * ' + b.scale + ')';
        a.style.setProperty('--r', b.ratio);
        a.innerHTML = '<img alt=""><img alt="">';
        grid.appendChild(a);
        return { el: a, imgs: a.querySelectorAll('img'), front: 0, b: b };
    });

    function show(c, p) {
        var pre = new Image();
        pre.onload = function () {
            var next = c.imgs[1 - c.front];
            next.src = pre.src;
            next.classList.add('on');
            c.imgs[c.front].classList.remove('on');
            c.front = 1 - c.front;
            c.el.href = lang + c.b.href + spreadHash(c.b.own ? c.b.own(p) : p);
        };
        pre.src = base + c.b.key + '/' + pad3(p) + '.jpg';
    }

    var current = -1;
    function step() {
        var p;
        do { p = pages[Math.floor(Math.random() * pages.length)]; } while (p === current && pages.length > 1);
        current = p;
        cells.forEach(function (c, i) { setTimeout(function () { show(c, p); }, i * STAGGER); });
    }
    step();
    if (!still) { setInterval(step, EVERY); }
})();
