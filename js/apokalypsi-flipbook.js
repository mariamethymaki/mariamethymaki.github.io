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

    $('#apokalypsi').turn({
        display: 'double',
        acceleration: false,
        gradients: !$.isTouch,
        elevation:50,
        when: {
            turned: function(e, page) {
                currentView = $(this).turn('view');
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
