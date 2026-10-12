$(window).ready(function() {
    optimalWidth = $('.tetradio-container').width();
    windowHeight = $(window).height() - $('.topmenu').height() - $('.footer').height() - 100;
    containerWidth = $('.tetradio-container').width();
    containerHeight = $('.tetradio-container').height();
    /* phones: one page at a time, filling the width of the screen */
    var narrow = window.matchMedia('(max-width: 767px)').matches;
    var across = narrow ? 1 : 2;
    function narrowView(n, total) {
        var left = (n === 1) ? 0 : (n % 2 === 0 ? n : n - 1);
        return [left, left === 0 ? 1 : (left + 1 <= total ? left + 1 : 0)];
    }
    optimalHeight = Math.round((optimalWidth/across)*1418/1000);

    if (windowHeight < optimalHeight)
    {
        optimalHeight = windowHeight;
        optimalWidth = Math.round((optimalHeight*1000*across/1418));
    }
    $('#tetradio').css("width", optimalWidth+"px").css("height", optimalHeight+"px");
    if (!narrow) { $('#workdetails').css("height", (optimalHeight) + "px"); }

    function showDescription() {
        currentView = $('#tetradio').turn('view');
        var hashPage = currentView[0];
        if (narrow) {
            var np = $('#tetradio').turn('page');
            currentView = narrowView(np, $('#tetradio').turn('pages'));
            hashPage = np > 1 ? np : 0;
        }
        if (window.history && history.replaceState) {
            history.replaceState(null, '', hashPage ? '#p=' + hashPage : window.location.pathname + window.location.search);
        }
        pageId = '#page' + currentView[0]
        description = "";
        if (currentView[0] == 0)
            description = $('#default-description').html() + "<br/><br/>";

        if (currentView[0] != 0 && currentView[1] != 0)
            description += "Pages: " + (currentView[0]-1) + "-" + (currentView[1]-1);
        description += "<br/><br/>"
        if ($(pageId).length)
            description += $(pageId).html();
        if (description.replace(/\s+/g, '') != '')
            description = '<div class="cover-text">' + description.replace(/(\s|<br\s*\/?>)+$/gi, '') +
                (window.AnaglyptoLogos ? AnaglyptoLogos.linkHtml(currentView[0]) : '') + '</div>';
        $('.tetradio-description').html(description);
    }

    /* remember the open spread across refreshes: #p=<left page> in the address;
       logos.html?page=N (link from Anaglypto) has priority */
    var startPage = 1;
    var savedPage = /^#p=(\d+)$/.exec(window.location.hash);
    if (savedPage) {
        var saved = parseInt(savedPage[1], 10);
        if (saved >= 2 && (narrow || saved % 2 === 0) && saved <= $('#tetradio').children().length) { startPage = saved; }
    }
    var deepLink = /[?&]page=(\d+)/.exec(window.location.search);
    if (deepLink) {
        var wanted = parseInt(deepLink[1], 10);
        if (wanted % 2) { wanted--; }
        if (wanted >= 2 && wanted <= $('#tetradio').children().length) { startPage = wanted; }
    }

    $('#tetradio').turn({
        page: startPage,
        display: narrow ? 'single' : 'double',
        acceleration: false,
        gradients: !$.isTouch,
        elevation:50,
        when: {
            turned: function(e, page) {
                showDescription();
            }
        }
    });

    showDescription();

    $('#workdetails').mousewheel(function(event, delta, deltaX, deltaY) {
        var scrollTop = $(this).scrollTop();
        $(this).scrollTop(scrollTop-30*Math.round(delta));
    });

});

$(window).bind('keydown', function(e){
    if (e.keyCode==37)
        $('#tetradio').turn('previous');
    else if (e.keyCode==39)
        $('#tetradio').turn('next');
});