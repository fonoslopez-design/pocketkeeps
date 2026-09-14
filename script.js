```javascript
// ============================================================
// POCKETKEEPS
// HERO IMAGE SLIDER
// ============================================================

const heroTrack = document.querySelector(".hero-track");

let heroIndex = 0;

if (heroTrack) {

    setInterval(() => {

        heroIndex++;

        if (heroIndex >= 2) {
            heroIndex = 0;
        }

        heroTrack.style.transform =
            `translateX(-${heroIndex * 50}%)`;

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

    window.addEventListener("scroll", () => {

        topButton.classList.toggle(
            "show",
            window.scrollY > 500
        );

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

    show(
        "Quote request prepared. We'll connect the form to email next."
    );

    event.target.reset();

});


// ============================================================
// FORMULARIO DE CONTACTO
// ============================================================

document.querySelector("#contactForm")?.addEventListener("submit", event => {

    event.preventDefault();

    show(
        "Message prepared. We'll connect the contact form to email next."
    );

    event.target.reset();

});
```
