/* logOria: the credit line at the end of the text, in the largest type at which it still fits on one line */
(function () {
    var c = document.querySelector('.vimeo-poem .vimeo-credit');
    if (!c) { return; }
    function fit() {
        var box = c.parentNode, s = getComputedStyle(box);
        var w = box.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight);
        var size = 13;
        c.style.fontSize = size + 'px';
        var r = document.createRange(); r.selectNodeContents(c);
        while (r.getBoundingClientRect().width > w && size > 7) { size -= 0.1; c.style.fontSize = size + 'px'; }
    }
    window.addEventListener('resize', fit);
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(fit); }
    fit();
})();
