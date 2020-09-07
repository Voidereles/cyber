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

$('.refer__carousel').owlCarousel({
    loop: true,
    dots: true,
    lazyLoad: true,
    margin: 15,
    responsiveClass: true,
    autoplay: false,
    autoplayHoverPause: true,
    responsive: {
        0: {
            items: 2,
            nav: true
        },
        600: {
            items: 3,
            margin: 20,
            nav: false
        },
        1000: {
            items: 4,
            margin: 20,
            nav: false,
        },
        1400: {
            items: 5,
            nav: true,
            loop: false
        }
    }
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