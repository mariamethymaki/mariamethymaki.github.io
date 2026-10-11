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
    $('#casamias').css("width", optimalWidth+"px").css("height", optimalHeight+"px");
    $('#workdetails').css("height", (optimalHeight) + "px");

    /* remember the open spread across refreshes: #p=<left page> in the address;
       logos.html?page=N (link from Anaglypto) has priority */
    var startPage = 1;
    var savedPage = /^#p=(\d+)$/.exec(window.location.hash);
    if (savedPage) {
        var saved = parseInt(savedPage[1], 10);
        if (saved >= 2 && saved % 2 === 0 && saved <= $('#casamias').children().length) { startPage = saved; }
    }

    $('#casamias').turn({
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