var descriptionElement = document.getElementById("carouselDescription");
var carouselElement = document.getElementById("copperworkCarousel");

const url = window.location.pathname;
var langURI = '';
if (url === '/it/copperwork.php') 
    langURI = 'it';
else if (url === '/el/copperwork.php')
    langURI = 'el';

    
carouselElement.addEventListener("slide.bs.carousel", function(event) {
    var activeSlideIndex = event.to; // get the index of the active slide

    switch(activeSlideIndex){
        case 0:
            if(langURI === '')
                descriptionElement.innerHTML = "<span>CopperWork01, Copper (90x180cm) 2015. <a href="+"/copperworkdetails.php"+">CopperWork in Detail</a></span>";
            else if(langURI === 'it')
                descriptionElement.innerHTML = "<span>Cuprum01, Rame (90x180cm) 2015. <a href="+"/it/copperworkdetails.php"+">CopperWork in Detail</a></span>";
            else if(langURI === 'el')
                descriptionElement.innerHTML = "<span>Χάλκινo01, Χαλκός (90x180εκ) 2015. <a href="+"/el/copperworkdetails.php"+">CopperWork in Detail</a></span>";
            break;
        case 1:
            if(langURI === '')
                descriptionElement.innerHTML = "<span>CopperWork02, Copper (90x90x270cm) 2015. <a href="+"/copperworkdetails.php"+">CopperWork in Detail</a></span>";
            else if(langURI === 'it')
                descriptionElement.innerHTML = "<span>Cuprum02, Rame (90x90x270cm) 2015. <a href="+"/it/copperworkdetails.php"+">CopperWork in Detail</a></span>";
            else if(langURI === 'el')
                descriptionElement.innerHTML = "<span>Χάλκινo02, Χαλκός (90x90x270εκ) 2015. <a href="+"/el/copperworkdetails.php"+">CopperWork in Detail</a></span>";
            break;
        case 2:
            if(langURI === '')
                descriptionElement.innerHTML = "<span>CopperWork03, Copper (60x60x180cm) 2015. <a href="+"/copperworkdetails.php"+">CopperWork in Detail</a></span>";
            else if(langURI === 'it')
                descriptionElement.innerHTML = "<span>Cuprum03, Rame (60x60x180cm) 2015. <a href="+"/it/copperworkdetails.php"+">CopperWork in Detail</a></span>";
            else if(langURI === 'el')
                descriptionElement.innerHTML = "<span>Χάλκινo03, Χαλκός (60x60x180εκ) 2015. <a href="+"/el/copperworkdetails.php"+">CopperWork in Detail</a></span>";
            break;
        case 3:
            if(langURI === '')
                descriptionElement.innerHTML = "<span>CopperWork04, Copper (180x180cm) 2015. <a href="+"/copperworkdetails.php"+">CopperWork in Detail</a></span>";
            else if(langURI === 'it')
                descriptionElement.innerHTML = "<span>Cuprum04, Rame (180x180cm) 2015. <a href="+"/it/copperworkdetails.php"+">CopperWork in Detail</a></span>";
            else if(langURI === 'el')
                descriptionElement.innerHTML = "<span>Χάλκινo04, Χαλκός (180x180εκ) 2015. <a href="+"/el/copperworkdetails.php"+">CopperWork in Detail</a></span>";
            break;
        default:
            descriptionElement.innerHTML = "";  
    };
});