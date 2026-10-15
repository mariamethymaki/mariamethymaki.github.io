/* The work "ideal reader wanted": the text about the book fills the space above lOgos and cAsa mIa s,
   from the top of in nOmine DEI down to the two smaller books, so that text, books and the titles line
   together form a rectangle that closes with in nOmine DEI. The type size is chosen so that the text fits that space. */
(function () {
    var box = document.querySelector('.ir-text');
    if (!box) { return; }
    function fit() {
        box.classList.remove('ir-text-below');
        if (getComputedStyle(box).position !== 'absolute') { box.style.fontSize = ''; box.style.lineHeight = ''; return; }
        var size = 14;
        do {
            box.style.fontSize = size + 'px';
            box.style.lineHeight = (size * 1.4) + 'px';
            size -= 0.25;
        } while (box.scrollHeight > box.clientHeight + 1 && size >= 8);
        /* screens too small for the text even at 8px: the text goes under the books instead */
        if (box.scrollHeight > box.clientHeight + 1) {
            box.classList.add('ir-text-below'); box.style.fontSize = ''; box.style.lineHeight = ''; return;
        }
        /* then open up the line spacing until the text reaches the bottom of the space */
        var lh = parseFloat(box.style.lineHeight);
        while (box.scrollHeight <= box.clientHeight && lh < 40) { lh += 0.1; box.style.lineHeight = lh + 'px'; }
        if (box.scrollHeight > box.clientHeight) { box.style.lineHeight = (lh - 0.1) + 'px'; }
    }
    var t;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(fit, 60); });
    window.addEventListener('load', fit);
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(fit); }
    fit();
    /* again a little later, once the type and the books have settled */
    setTimeout(fit, 500);
    setTimeout(fit, 1500);
})();
