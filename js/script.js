$('.about__carousel').owlCarousel({
    loop: true,
    dots: true,
    lazyLoad: true,
    margin: 5,
    responsiveClass: true,
    autoplay: true,
    autoplayHoverPause: true,
    items: 1
});


const $window = $(window);
const referDiv = $(".refer__animation-container")
let animationEnded = false;

function isScrolledIntoView(elem, $window) {
    let docViewTop = $window.scrollTop();
    let docViewBottom = docViewTop + $window.height();

    let elemTop = elem.offset().top;
    let elemBottom = elemTop;

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

$(document).ready(function () {
    new WOW().init();

    if (isScrolledIntoView(referDiv, $window) && animationEnded == false) {
        referDiv.addClass("refer__animation-container--animated")
        console.log("now you see me2");
        animationEnded = true;
    }

})

$(document).on("scroll", function () {
    if (isScrolledIntoView(referDiv, $window) && animationEnded == false) {
        referDiv.addClass("refer__animation-container--animated")
        console.log("now you see me");
        animationEnded = true;
    }
});