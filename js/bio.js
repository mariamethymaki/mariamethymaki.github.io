/* Bio: the text "instead of a CV" and page 55 of in nOmine DEI, in the proportions of the amen page:
   the picture is the size of one page of in nOmine DEI (1200 x 1938, as tall as the screen allows),
   and the text starts at the top of the picture and ends at its bottom (made as narrow as needed). */
(function () {
    var wrap = document.querySelector('.bio-wrap');
    if (!wrap) { return; }
    var text = wrap.querySelector('.amen-text');

    function fitText(w, h) {
        text.style.width = ''; text.style.flexBasis = ''; text.style.fontSize = ''; text.style.lineHeight = '';
        if (!w) { return; }
        var fs = parseFloat(getComputedStyle(text).fontSize);
        function setW(x) { text.style.width = x + 'px'; text.style.flexBasis = x + 'px'; }
        setW(w);
        while (text.scrollHeight > h && fs > 9) { fs -= 0.25; text.style.fontSize = fs + 'px'; }
        var lo = Math.round(w * 0.4), hi = w;
        while (lo < hi) { var mid = (lo + hi) >> 1; setW(mid); if (text.scrollHeight <= h) { hi = mid; } else { lo = mid + 1; } }
        setW(lo);
        var lh = parseFloat(getComputedStyle(text).lineHeight);
        while (text.scrollHeight < h - 0.5 && lh < fs * 2) { lh += 0.05; text.style.lineHeight = lh + 'px'; if (text.scrollHeight > h) { lh -= 0.05; text.style.lineHeight = lh + 'px'; break; } }
    }

    function size() {
        var narrow = window.matchMedia('(max-width: 767px)').matches;
        var top = document.querySelector('.topmenu'), foot = document.querySelector('.footer');
        function ch(el) { if (!el) { return 0; } var s = getComputedStyle(el); return el.clientHeight - parseFloat(s.paddingTop) - parseFloat(s.paddingBottom); }
        var h = window.innerHeight - ch(top) - ch(foot) - 100;
        var w = Math.round(h * 1200 / 1938);
        var avail = wrap.parentNode.clientWidth;
        if (narrow) { w = avail; h = Math.round(w * 1938 / 1200); }
        else if (2 * w + 40 > avail) { w = Math.floor((avail - 40) / 2); h = Math.round(w * 1938 / 1200); }
        wrap.style.setProperty('--pw', w + 'px');
        wrap.style.setProperty('--ph', h + 'px');
        fitText(narrow ? 0 : w, h);
    }
    size();
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(size); }
    window.addEventListener('load', size);
    window.addEventListener('resize', size);
})();
