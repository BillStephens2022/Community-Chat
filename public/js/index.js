const menu = document.querySelector("#mobile-menu");
const menuLinks = document.querySelector(".nav-menu");

menu.addEventListener("click", function() {
    menu.classList.toggle("is-active");
    menuLinks.classList.toggle("active");
})



// document.addEventListener("DOMContentLoaded", function(){
//     var element = document.getElementById("myCarousel");
//     var myCarousel = new bootstrap.Carousel(element);
// });

// carousel()