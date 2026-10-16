/* for All that Are not: the framed pictures of the wall, one after the other,
   standing on the text line and left-aligned with it, keeping their sizes
   relative to each other.
   The stage is a quarter of the width and height of the in nOmine DEI book. */
(function () {
    var FRAMES = [
        [332, 217], [127, 163], [126, 190], [124, 159], [124, 184], [178, 247],
        [228, 300], [107, 147], [278, 226], [175, 201], [230, 303], [162, 224],
        [382, 301], [134, 166], [275, 188], [131, 165], [140, 199], [147, 204],
        [134, 188], [382, 287], [180, 199], [115, 205], [246, 403]
    ];
    var DIR = '/media/images/forallthatarenot/';
    var STEP = 3000;

    var stage = document.getElementById('fatan-stage');
    if (!stage) { return; }
    var box = stage.querySelector('.fatan-box');
    var wrap = stage.querySelector('.fatan-wrap');
    var imgs = FRAMES.map(function (f, i) {
        var img = document.createElement('img');
        img.src = DIR + (i < 9 ? '0' : '') + (i + 1) + '.jpg';
        img.alt = '';
        box.appendChild(img);
        return img;
    });

    var maxW = Math.max.apply(null, FRAMES.map(function (f) { return f[0]; }));
    var maxH = Math.max.apply(null, FRAMES.map(function (f) { return f[1]; }));

    /* same rule as the in nOmine DEI book (js/nominedei-flipbook.js) */
    function layout() {
        var colW = stage.clientWidth;
        var narrow = window.matchMedia('(max-width: 767px)').matches;
        var across = narrow ? 1 : 2;
        var topH = document.querySelector('.topmenu').offsetHeight;
        var footH = document.querySelector('.footer').offsetHeight;
        var winH = window.innerHeight - topH - footH - 100;
        var bookW = colW;
        var bookH = Math.round((bookW / across) * 1938 / 1200);
        if (winH < bookH) {
            bookH = winH;
            bookW = Math.round(bookH * 1200 * across / 1938);
        }
        var w = bookW / 4, h = bookH / 4;
        var scale = Math.min(w / maxW, h / maxH);
        box.style.width = Math.round(w) + 'px';
        box.style.height = Math.round(h) + 'px';
        stage.style.height = (narrow ? Math.round(h) + 70 : bookH) + 'px';
        imgs.forEach(function (img, i) {
            img.style.width = Math.round(FRAMES[i][0] * scale) + 'px';
            img.style.height = Math.round(FRAMES[i][1] * scale) + 'px';
        });
        /* the sentence stays on one line: on narrow screens make the letters smaller until it fits */
        var cap = stage.querySelector('.fatan-caption');
        if (cap) {
            cap.style.fontSize = '';
            var room = stage.clientWidth - 24;
            if (cap.scrollWidth > room) {
                var size = parseFloat(getComputedStyle(cap).fontSize);
                cap.style.fontSize = (Math.floor(size * room / cap.scrollWidth * 10) / 10) + 'px';
            }
        }
        /* wide screens: the sentence is level with the title of the work in the side menu */
        var title = document.querySelector('.nav-sidemenu li[data-pages="forallthatarenot.html"] > a');
        stage.style.alignItems = '';
        stage.style.paddingTop = '';
        if (!narrow && cap && title) {
            var range = document.createRange();
            range.selectNodeContents(title);
            var t = range.getBoundingClientRect(), c = cap.getBoundingClientRect(), st = stage.getBoundingClientRect();
            var titleMid = (t.top + t.bottom) / 2;
            var top = titleMid - st.top - (c.bottom - wrap.getBoundingClientRect().top) + c.height / 2;
            if (top >= 0) {
                stage.style.alignItems = 'flex-start';
                stage.style.paddingTop = Math.round(top) + 'px';
            }
        }
    }

    var cur = 0;
    imgs[0].classList.add('on');
    layout();
    window.addEventListener('resize', layout);
    window.addEventListener('load', layout);   /* after the fonts, the menu may move */
    setInterval(function () {
        imgs[cur].classList.remove('on');
        cur = (cur + 1) % imgs.length;
        imgs[cur].classList.add('on');
    }, STEP);
})();
