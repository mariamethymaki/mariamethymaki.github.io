$(window).ready(function() {
    optimalWidth = $('.apokalypsi-container').width();
    windowHeight = $(window).height() - $('.topmenu').height() - $('.footer').height() - 100;
    containerWidth = $('.apokalypsi-container').width();
    containerHeight = $('.apokalypsi-container').height();
    /* phones: one page at a time, filling the width of the screen */
    var narrow = window.matchMedia('(max-width: 767px)').matches;
    var across = narrow ? 1 : 2;
    function narrowView(n, total) {
        var left = (n === 1) ? 0 : (n % 2 === 0 ? n : n - 1);
        return [left, left === 0 ? 1 : (left + 1 <= total ? left + 1 : 0)];
    }
    optimalHeight = Math.round((optimalWidth/across)*550/380);

    if (windowHeight < optimalHeight)
    {
        optimalHeight = windowHeight;
        optimalWidth = Math.round((optimalHeight*380*across/550));
    }
    $('#apokalypsi').css("width", optimalWidth+"px").css("height", optimalHeight+"px");
    if (!narrow) { $('#workdetails').css("height", (optimalHeight) + "px"); }

    /* remember the open spread across refreshes: #p=<left page> in the address;
       logos.html?page=N (link from Anaglypto) has priority */
    var startPage = 1;
    var savedPage = /^#p=(\d+)$/.exec(window.location.hash);
    if (savedPage) {
        var saved = parseInt(savedPage[1], 10);
        if (saved >= 2 && (narrow || saved % 2 === 0) && saved <= $('#apokalypsi').children().length) { startPage = saved; }
    }

    $('#apokalypsi').turn({
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
