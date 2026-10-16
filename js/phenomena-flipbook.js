/* Viewer of one book of "facades of saturated phenomena": phenomena-book.html?b=<slug>
   Pages are loaded only around the open spread (some books have hundreds of pages). */
$(window).ready(function () {
    var books = window.PHENOMENA_BOOKS || [];
    var m = /[?&]b=([\w-]+)/.exec(window.location.search);
    var book = null;
    books.forEach(function (b) { if (m && b.slug === m[1]) { book = b; } });
    var parts = window.location.pathname.split('/').filter(Boolean);
    var lang = (parts[0] === 'el' || parts[0] === 'it') ? '/' + parts[0] : '';
    if (!book) { window.location.replace(lang + '/phenomena.html'); return; }

    var $book = $('#phenbook');
    var base = '/media/images/phenomena/' + book.slug + '/';
    var single = book.ratio > 1.8 || window.matchMedia('(max-width: 767px)').matches;   /* very wide pages (slides) and phones: one page at a time */
    var total = single ? book.pages : book.pages + (book.pages % 2);   /* an empty last page keeps the spreads even */
    var imgs = [];
    function pad3(n) { return (n < 10 ? '00' : n < 100 ? '0' : '') + n; }
    for (var i = 1; i <= total; i++) {
        var img = $('<img class="w-100" alt="">');
        if (i <= book.pages) { img.attr('data-src', base + pad3(i) + '.jpg'); }
        imgs[i] = img;
        $('<div></div>').append(img).appendTo($book);
    }
    function loadAround(p) {
        for (var k = Math.max(1, p - 8); k <= Math.min(total, p + 9); k++) {
            var im = imgs[k];
            if (im.attr('data-src') && !im.attr('src')) { im.attr('src', im.attr('data-src')); }
        }
    }

    var optimalWidth = $('.phen-book-container').width();
    var windowHeight = $(window).height() - $('.topmenu').height() - $('.footer').height() - 100;
    var across = single ? 1 : 2;
    var optimalHeight = Math.round((optimalWidth / across) / book.ratio);
    if (windowHeight < optimalHeight) {
        optimalHeight = windowHeight;
        optimalWidth = Math.round(optimalHeight * across * book.ratio);
    }
    $book.css('width', optimalWidth + 'px').css('height', optimalHeight + 'px');

    /* remember the open spread across refreshes: #p=<left page> in the address */
    var startPage = 1;
    var saved = /^#p=(\d+)$/.exec(window.location.hash);
    if (saved) {
        var sp = parseInt(saved[1], 10);
        if (sp >= 2 && (single || sp % 2 === 0) && sp <= total) { startPage = sp; }
    }
    loadAround(startPage);

    $book.turn({
        page: startPage,
        display: single ? 'single' : 'double',
        acceleration: false,
        gradients: !$.isTouch,
        elevation: 50,
        when: {
            turning: function (e, page) { loadAround(page); },
            turned: function (e, page) {
                loadAround(page);
                var view = $(this).turn('view');
                if (window.history && history.replaceState) {
                    history.replaceState(null, '', view[0] ? '#p=' + view[0] : window.location.pathname + window.location.search);
                }
            }
        }
    });

    $(window).bind('keydown', function (e) {
        if (e.keyCode == 37) { $book.turn('previous'); }
        else if (e.keyCode == 39) { $book.turn('next'); }
    });
});
