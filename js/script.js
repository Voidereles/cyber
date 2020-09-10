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



    // let mapDiv = document.getElementById("map");
    // let contactForm = document.getElementById("contactForm")

    // // This handler will be executed only once when the cursor
    // // moves over the unordered list
    // mapDiv.addEventListener("mouseenter", function () {
    //     // highlight the mouseenter target
    //     contactForm.style.opacity = 0;

    // });

    // mapDiv.addEventListener("mouseout", function () {
    //     // highlight the mouseenter target
    //     contactForm.style.opacity = 1;

    // });

    // $(function () {
    //     $('.map').hover(function () {
    //         $('.contact__form-container').fadeTo(400, .05);
    //         console.log('hover map')
    //     }, function () {
    //         $('.contact__form-container').fadeTo(400, 1);
    //         console.log('unhover map')
    //     });
    // });
})