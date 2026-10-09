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

    $('#tetradio').turn({
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

    /* logos.html?page=N opens the book on the spread whose left page is N */
    var deepLink = /[?&]page=(\d+)/.exec(window.location.search);
    if (deepLink) {
        var startPage = parseInt(deepLink[1], 10);
        if (startPage % 2) { startPage--; }
        if (startPage >= 2 && startPage <= 122) { $('#tetradio').turn('page', startPage); showDescription(); }
    }

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