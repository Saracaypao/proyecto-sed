document.addEventListener('DOMContentLoaded', function () {
    const images = [
        './assets/imagen3.jpg',
        './assets/imagen4.jpg',
        './assets/imagen5.jpg',
        './assets/imagen6.jpg',
        './assets/imagen8.jpg'
    ];
    
    const carouselItems = document.querySelectorAll('.carousel-item img');
    let currentIndex = 0;

    function updateCarouselImages() {
        carouselItems.forEach((item, index) => {
            item.src = images[(currentIndex + index) % images.length];
        });
        currentIndex = (currentIndex + 1) % images.length;
    }
    
    // actualiza la primera imagen al cargar la página
    updateCarouselImages();

    // cambia las imágenes cada 5 segundos
    setInterval(updateCarouselImages, 3000);
});
