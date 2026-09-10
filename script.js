```javascript
// ============================================================
// POCKETKEEPS
// HERO IMAGE SLIDER
// ============================================================

const heroImages = [
    "images/hero1.jpg",
    "images/hero2.jpg",
];

const heroPhoto = document.querySelector(".hero .photo");

let currentImage = 0;

if (heroPhoto && heroImages.length > 0) {

    // Primera imagen
    heroPhoto.innerHTML = "";
    heroPhoto.style.backgroundImage = `url("${heroImages[0]}")`;

    // Cambiar imagen cada 4 segundos
    setInterval(() => {

        currentImage++;

        if (currentImage >= heroImages.length) {
            currentImage = 0;
        }

        // Desvanecer
        heroPhoto.style.opacity = "0";

        setTimeout(() => {

            heroPhoto.style.backgroundImage =
                `url("${heroImages[currentImage]}")`;

            // Mostrar nueva imagen
            heroPhoto.style.opacity = "1";

        }, 400);

    }, 4000);
}


// ============================================================
// AÑO AUTOMÁTICO DEL FOOTER
// ============================================================

const year = document.querySelector(".year");

if (year) {
    year.textContent = new Date().getFullYear();
}


// ============================================================
// BOTÓN BACK TO TOP
// ============================================================

const topButton = document.querySelector(".top");

if (topButton) {

    addEventListener("scroll", () => {
        topButton.classList.toggle("show", scrollY > 500);
    });

    topButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

}


// ============================================================
// TOAST
// ============================================================

const toast = document.querySelector(".toast");


// ============================================================
// FUNCIÓN PARA MOSTRAR TOAST
// ============================================================

function show(message) {

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);
}


// ============================================================
// BOTONES ORDER
// ============================================================

document.querySelectorAll(".order").forEach(button => {

    button.addEventListener("click", () => {

        show(
            `"${button.dataset.item}" selected. We'll connect ordering and PayPal next.`
        );

    });

});


// ============================================================
// FORMULARIO DE COTIZACIÓN
// ============================================================

document.querySelector("#quoteForm")?.addEventListener("submit", event => {

    event.preventDefault();

    show("Quote request prepared. We'll connect the form to email next.");

    event.target.reset();

});


// ============================================================
// FORMULARIO DE CONTACTO
// ============================================================

document.querySelector("#contactForm")?.addEventListener("submit", event => {

    event.preventDefault();

    show("Message prepared. We'll connect the contact form to email next.");

    event.target.reset();

});
```
