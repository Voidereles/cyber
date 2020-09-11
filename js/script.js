new WOW().init();
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
    autoplay: true,
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

$('.news__carousel').owlCarousel({
    loop: true,
    dots: true,
    lazyLoad: true,
    margin: 25,
    responsiveClass: true,
    autoplay: true,
    autoplayHoverPause: true,
    responsive: {
        0: {
            items: 1,
            margin: 15,
            nav: true
        },
        600: {
            items: 2,
            nav: false
        },
        1000: {
            items: 4,
            nav: false,
        },
        1900: {
            items: 5,
            nav: true,
        }
    }
});







$(document).ready(function () {

    $('.nav-toggle').click(function () {
        $('.header__nav').toggleClass('header__nav--entered');
        $('.nav-toggle').toggleClass('nav-toggle--entered');
    })


})