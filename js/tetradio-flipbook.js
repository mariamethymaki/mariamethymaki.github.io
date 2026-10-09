$(window).ready(function() {
    optimalWidth = $('.tetradio-container').width();
    windowHeight = $(window).height() - $('.topmenu').height() - $('.footer').height() - 100;
    containerWidth = $('.tetradio-container').width();
    containerHeight = $('.tetradio-container').height();
    optimalHeight = Math.round((optimalWidth/2)*550/380);

    if (windowHeight < optimalHeight)
    {
        optimalHeight = windowHeight;
        optimalWidth = Math.round((optimalHeight*380*2/550));
    }
    $('#tetradio').css("width", optimalWidth+"px").css("height", optimalHeight+"px");
    $('#workdetails').css("height", (optimalHeight) + "px");

    function showDescription() {
        currentView = $('#tetradio').turn('view');
        if (window.history && history.replaceState) {
            history.replaceState(null, '', currentView[0] ? '#p=' + currentView[0] : window.location.pathname + window.location.search);
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
        if (saved >= 2 && saved % 2 === 0 && saved <= $('#tetradio').children().length) { startPage = saved; }
    }
    var deepLink = /[?&]page=(\d+)/.exec(window.location.search);
    if (deepLink) {
        var wanted = parseInt(deepLink[1], 10);
        if (wanted % 2) { wanted--; }
        if (wanted >= 2 && wanted <= $('#tetradio').children().length) { startPage = wanted; }
    }

    $('#tetradio').turn({
        page: startPage,
        display: 'double',
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