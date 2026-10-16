$(window).ready(function() {
    optimalWidth = $('.nominedei-container').width();
    windowHeight = $(window).height() - $('.topmenu').height() - $('.footer').height() - 100;
    containerWidth = $('.nominedei-container').width();
    containerHeight = $('.nominedei-container').height();
    /* phones: one page at a time, filling the width of the screen */
    var narrow = window.matchMedia('(max-width: 767px)').matches;
    var across = narrow ? 1 : 2;
    optimalHeight = Math.round((optimalWidth/across)*1410/1000);

    if (windowHeight < optimalHeight)
    {
        optimalHeight = windowHeight;
        optimalWidth = Math.round((optimalHeight*1000*across/1410));
    }
    $('#casamias').css("width", optimalWidth+"px").css("height", optimalHeight+"px");
    if (!narrow) { $('#workdetails').css("height", (optimalHeight) + "px"); }

    /* remember the open spread across refreshes: #p=<left page> in the address;
       logos.html?page=N (link from Anaglypto) has priority */
    var startPage = 1;
    var savedPage = /^#p=(\d+)$/.exec(window.location.hash);
    if (savedPage) {
        var saved = parseInt(savedPage[1], 10);
        if (saved >= 2 && (narrow || saved % 2 === 0) && saved <= $('#casamias').children().length) { startPage = saved; }
    }

    $('#casamias').turn({
        page: startPage,
        display: narrow ? 'single' : 'double',
        acceleration: false,
        gradients: !$.isTouch,
        elevation:50,
        when: {
            turned: function(e, page) {
                currentView = $(this).turn('view');
                if (narrow) {
                    /* one page on screen: show the description of the spread it belongs to (the left page is even) */
                    var n = page, left = (n === 1) ? 0 : (n % 2 === 0 ? n : n - 1);
                    var total = $(this).turn('pages');
                    currentView = [left, left === 0 ? 1 : (left + 1 <= total ? left + 1 : 0)];
                    if (window.history && history.replaceState) {
                        history.replaceState(null, '', n > 1 ? '#p=' + n : window.location.pathname + window.location.search);
                    }
                } else if (window.history && history.replaceState) {
                    history.replaceState(null, '', currentView[0] ? '#p=' + currentView[0] : window.location.pathname + window.location.search);
                }
                pageId = '#page' + currentView[0]
                description = "";
                if (currentView[0] != 0 && currentView[1] != 0)
                    description += '<div class="pages-line">Pages: ' + (currentView[0]-1) + '-' + (currentView[1]-1) + '</div>';
                if ($(pageId).length)
                    description += $(pageId).html();
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
      $('#casamias').turn('previous');
  else if (e.keyCode==39)
      $('#casamias').turn('next');
});