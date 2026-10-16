/* Style of the poems: no spaces between the words, and the stressed vowel (both letters of a stressed diphthong)
   written in capitals instead of the accent: "τραβάω γραμμές" -> "τραβΑωγραμμΕς". Done when the text is shown. */
var STRESSED = { 'ά': 'Α', 'έ': 'Ε', 'ή': 'Η', 'ί': 'Ι', 'ό': 'Ο', 'ύ': 'Υ', 'ώ': 'Ω', 'ΐ': 'Ι', 'ΰ': 'Υ' };
function stressCaps(word) {
    /* stressed diphthongs: αί εί οί υί αύ εύ ηύ ού -> both letters */
    word = word.replace(/([αεουη])([ίύ])/g, function (m, a, b) {
        var ok = (b === 'ί' && 'αεου'.indexOf(a) >= 0) || (b === 'ύ' && 'αεηο'.indexOf(a) >= 0);
        return ok ? a.toUpperCase() + STRESSED[b] : m;
    });
    return word.replace(/[άέήίόύώΐΰ]/g, function (c) { return STRESSED[c]; });
}
function poemHtml(html) {
    var box = $('<div></div>').html(html);
    (function walk(node) {
        node.contents().each(function () {
            if (this.nodeType === 3) {
                this.nodeValue = this.nodeValue.split(/\s+/).filter(Boolean).map(stressCaps).join('');
            } else if (this.nodeType === 1) { walk($(this)); }
        });
    })(box);
    return box.html();
}

$(window).ready(function() {
    optimalWidth = $('.nominedei-container').width();
    windowHeight = $(window).height() - $('.topmenu').height() - $('.footer').height() - 100;
    containerWidth = $('.nominedei-container').width();
    containerHeight = $('.nominedei-container').height();
    /* phones: one page at a time, filling the width of the screen */
    var narrow = window.matchMedia('(max-width: 767px)').matches;
    var across = narrow ? 1 : 2;
    function narrowView(n, total) {
        var left = (n === 1) ? 0 : (n % 2 === 0 ? n : n - 1);
        return [left, left === 0 ? 1 : (left + 1 <= total ? left + 1 : 0)];
    }
    optimalHeight = Math.round((optimalWidth/across)*1938/1200);

    if (windowHeight < optimalHeight)
    {
        optimalHeight = windowHeight;
        optimalWidth = Math.round((optimalHeight*1200*across/1938));
    }
    $('#nominedei').css("width", optimalWidth+"px").css("height", optimalHeight+"px");
    if (!narrow) { $('#workdetails').css("height", (optimalHeight) + "px"); }

    /* remember the open spread across refreshes: #p=<left page> in the address;
       logos.html?page=N (link from Anaglypto) has priority */
    var startPage = 1;
    var savedPage = /^#p=(\d+)$/.exec(window.location.hash);
    if (savedPage) {
        var saved = parseInt(savedPage[1], 10);
        if (saved >= 2 && (narrow || saved % 2 === 0) && saved <= $('#nominedei').children().length) { startPage = saved; }
    }

    $('#nominedei').turn({
        page: startPage,
        display: narrow ? 'single' : 'double',
        acceleration: false,
        gradients: !$.isTouch,
        elevation:50,
        when: {
            turned: function(e, page) {
                currentView = $(this).turn('view');
                var hashPage = currentView[0];
                if (narrow) { currentView = narrowView(page, $(this).turn('pages')); hashPage = page > 1 ? page : 0; }
                if (window.history && history.replaceState) {
                    history.replaceState(null, '', hashPage ? '#p=' + hashPage : window.location.pathname + window.location.search);
                }
                pageId = '#page' + currentView[0]
                description = "";
                if (currentView[0] != 0 && currentView[1] != 0)
                    description += '<div class="pages-line">Pages: ' + (currentView[0]-1) + '-' + (currentView[1]-1) + '</div><br/>';
                if ($(pageId).length)
                    description += (currentView[0] != 0) ? '<div class="page-text">' + poemHtml($(pageId).html()) + '</div>' : $(pageId).html();
                if (description.replace(/\s+/g, '') != '')
                    description = '<div class="cover-text">' + description.replace(/(\s|<br\s*\/?>)+$/gi, '') + '</div>';
                $('#workdetails').html(description);
            }
        }
    });

    $('#workdetails').mousewheel(function(event, delta, deltaX, deltaY) {
      var scrollTop = $(this).scrollTop();
      $(this).scrollTop(scrollTop-30*Math.round(delta));
    });

});

$(window).bind('keydown', function(e){
  if (e.keyCode==37)
      $('#nominedei').turn('previous');
  else if (e.keyCode==39)
      $('#nominedei').turn('next');
});