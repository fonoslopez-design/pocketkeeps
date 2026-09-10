```javascript
// ============================================================
// POCKETKEEPS
// HERO IMAGE SLIDER
// ============================================================

const heroImages = [
  "images/hero1.jpg",
  "images/hero2.jpg"
];

let heroIndex = 0;
const heroImage = document.getElementById("heroImage");

if (heroImage) {
  setInterval(() => {
    heroIndex = (heroIndex + 1) % heroImages.length;

    heroImage.style.opacity = "0";

    setTimeout(() => {
      heroImage.src = heroImages[heroIndex];
      heroImage.style.opacity = "1";
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
