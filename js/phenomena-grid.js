/* Grid of the books: every cell shows a random slideshow of pages of its book; a click opens the book */
(function () {
    var books = window.PHENOMENA_BOOKS || [];
    var grid = document.getElementById('phenGrid');
    if (!grid) { return; }
    var parts = window.location.pathname.split('/').filter(Boolean);
    var lang = (parts[0] === 'el' || parts[0] === 'it') ? '/' + parts[0] : '';
    var label = { '': 'Book', '/el': 'Βιβλίο', '/it': 'Libro' }[lang];
    var base = '/media/images/phenomena/';
    var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function pad2(n) { return (n < 10 ? '0' : '') + n; }

    function slideshow(cell, b) {
        var imgs = cell.querySelectorAll('img');
        var front = 0, current = -1;
        function schedule() { if (!still) { setTimeout(step, 2500 + Math.random() * 2500); } }
        function step() {
            var k;
            do { k = Math.floor(Math.random() * b.thumbs); } while (k === current && b.thumbs > 1);
            var pre = new Image();
            pre.onload = function () {
                var next = imgs[1 - front];
                next.src = pre.src;
                next.classList.add('on');
                imgs[front].classList.remove('on');
                front = 1 - front;
                current = k;
                schedule();
            };
            pre.onerror = schedule;
            pre.src = base + b.slug + '/t/' + pad2(k) + '.jpg';
        }
        setTimeout(step, Math.random() * 1500);
    }

    books.forEach(function (b, i) {
        var a = document.createElement('a');
        a.className = 'phen-cell';
        a.href = lang + '/phenomena-book.html?b=' + b.slug;
        a.setAttribute('aria-label', label + ' ' + (i + 1));
        a.style.setProperty('--r', b.ratio);
        a.innerHTML = '<img alt=""><img alt="">';
        grid.appendChild(a);
        slideshow(a, b);
    });
})();
