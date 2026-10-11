var descriptionElement = document.getElementById("carouselDescription");
var carouselElement = document.getElementById("copperworkCarousel");

const url = window.location.pathname;
var langURI = '';
if (url.indexOf('/it/') === 0)
    langURI = 'it';
else if (url.indexOf('/el/') === 0)
    langURI = 'el';

    
carouselElement.addEventListener("slide.bs.carousel", function(event) {
    var activeSlideIndex = event.to; // get the index of the active slide

    switch(activeSlideIndex){
        case 0:
            if(langURI === '')
                descriptionElement.innerHTML = "<span>cUprum01, copper (90×180cm) 2015. <a href="+"/copperworkdetails.html"+">cUprum in detail</a></span>";
            else if(langURI === 'it')
                descriptionElement.innerHTML = "<span>cUprum01, rame (90×180cm) 2015. <a href="+"/it/copperworkdetails.html"+">cUprum in dettaglio</a></span>";
            else if(langURI === 'el')
                descriptionElement.innerHTML = "<span>χΑλκινο01, χαλκός (90×180εκ) 2015. <a href="+"/el/copperworkdetails.html"+">χΑλκινα: λεπτομέρειες</a></span>";
            break;
        case 1:
            if(langURI === '')
                descriptionElement.innerHTML = "<span>cUprum02, copper (90×90×270cm) 2015. <a href="+"/copperworkdetails.html"+">cUprum in detail</a></span>";
            else if(langURI === 'it')
                descriptionElement.innerHTML = "<span>cUprum02, rame (90×90×270cm) 2015. <a href="+"/it/copperworkdetails.html"+">cUprum in dettaglio</a></span>";
            else if(langURI === 'el')
                descriptionElement.innerHTML = "<span>χΑλκινο02, χαλκός (90×90×270εκ) 2015. <a href="+"/el/copperworkdetails.html"+">χΑλκινα: λεπτομέρειες</a></span>";
            break;
        case 2:
            if(langURI === '')
                descriptionElement.innerHTML = "<span>cUprum03, copper (60×60×180cm) 2015. <a href="+"/copperworkdetails.html"+">cUprum in detail</a></span>";
            else if(langURI === 'it')
                descriptionElement.innerHTML = "<span>cUprum03, rame (60×60×180cm) 2015. <a href="+"/it/copperworkdetails.html"+">cUprum in dettaglio</a></span>";
            else if(langURI === 'el')
                descriptionElement.innerHTML = "<span>χΑλκινο03, χαλκός (60×60×180εκ) 2015. <a href="+"/el/copperworkdetails.html"+">χΑλκινα: λεπτομέρειες</a></span>";
            break;
        case 3:
            if(langURI === '')
                descriptionElement.innerHTML = "<span>cUprum04, copper (180×180cm) 2015. <a href="+"/copperworkdetails.html"+">cUprum in detail</a></span>";
            else if(langURI === 'it')
                descriptionElement.innerHTML = "<span>cUprum04, rame (180×180cm) 2015. <a href="+"/it/copperworkdetails.html"+">cUprum in dettaglio</a></span>";
            else if(langURI === 'el')
                descriptionElement.innerHTML = "<span>χΑλκινο04, χαλκός (180×180εκ) 2015. <a href="+"/el/copperworkdetails.html"+">χΑλκινα: λεπτομέρειες</a></span>";
            break;
        default:
            descriptionElement.innerHTML = "";  
    };
});