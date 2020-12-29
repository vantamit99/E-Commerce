const carousel = function() {
    $('.carousel .owl-carousel').owlCarousel({
        loop:true,
        nav:true,
        items: 1
    });
    $('.productDetails .owl-carousel').owlCarousel({
        loop: false,
        nav: false,
        margin: 10,
        items: 4
    });
};
export default carousel;