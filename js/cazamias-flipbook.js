$(window).ready(function() {
    optimalWidth = $('.nominedei-container').width();
    windowHeight = $(window).height() - $('.topmenu').height() - $('.footer').height() - 100;
    containerWidth = $('.nominedei-container').width();
    containerHeight = $('.nominedei-container').height();
    optimalHeight = Math.round((optimalWidth/2)*1410/1000);

    if (windowHeight < optimalHeight)
    {
        optimalHeight = windowHeight;
        optimalWidth = Math.round((optimalHeight*1000*2/1410));
    }
    $('#cazamias').css("width", optimalWidth+"px").css("height", optimalHeight+"px");
    $('#workdetails').css("height", (optimalHeight) + "px");

    $('#cazamias').turn({
        display: 'double',
        acceleration: false,
        gradients: !$.isTouch,
        elevation:50,
        when: {
            turned: function(e, page) {
                currentView = $(this).turn('view');
                pageId = '#page' + currentView[0]
                description = "";
                if (currentView[0] != 0 && currentView[1] != 0)
                    description += '<div class="pages-line">Pages : ' + (currentView[0]-1) + '-' + (currentView[1]-1) + '</div><br/>';
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
      $('#cazamias').turn('previous');
  else if (e.keyCode==39)
      $('#cazamias').turn('next');
});