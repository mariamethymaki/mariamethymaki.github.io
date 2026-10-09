$(window).ready(function() {
    optimalWidth = $('.apokalypsi-container').width();
    windowHeight = $(window).height() - $('.topmenu').height() - $('.footer').height() - 100;
    containerWidth = $('.apokalypsi-container').width();
    containerHeight = $('.apokalypsi-container').height();
    optimalHeight = Math.round((optimalWidth/2)*550/380);

    if (windowHeight < optimalHeight)
    {
        optimalHeight = windowHeight;
        optimalWidth = Math.round((optimalHeight*380*2/550));
    }
    $('#apokalypsi').css("width", optimalWidth+"px").css("height", optimalHeight+"px");
    $('#workdetails').css("height", (optimalHeight) + "px");

    /* remember the open spread across refreshes: #p=<left page> in the address;
       logos.html?page=N (link from Anaglypto) has priority */
    var startPage = 1;
    var savedPage = /^#p=(\d+)$/.exec(window.location.hash);
    if (savedPage) {
        var saved = parseInt(savedPage[1], 10);
        if (saved >= 2 && saved % 2 === 0 && saved <= $('#apokalypsi').children().length) { startPage = saved; }
    }

    $('#apokalypsi').turn({
        page: startPage,
        display: 'double',
        acceleration: false,
        gradients: !$.isTouch,
        elevation:50,
        when: {
            turned: function(e, page) {
                currentView = $(this).turn('view');
                if (window.history && history.replaceState) {
                    history.replaceState(null, '', currentView[0] ? '#p=' + currentView[0] : window.location.pathname + window.location.search);
                }
                if (currentView[0] == 0)
                    pageId = '#page0'
                else
                    pageId = '#page' + (currentView[0]-1)

                description = "";

                if ($(pageId).length)
                    description += $(pageId).html();
                description += "<br/><br/>";
                if(currentView[1] != 0)
                    description += $('#default-reference').html();
                if (currentView[0] == 0)
                    description = '<div class="cover-text">' + description.replace(/(\s|<br\s*\/?>)+$/gi, '') + '</div>';
                $('.apokalypsi-description').html(description);
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
        $('#apokalypsi').turn('previous');
    else if (e.keyCode==39)
        $('#apokalypsi').turn('next');
});
