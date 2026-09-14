// ============================================================
// POCKETKEEPS
// HERO IMAGE SLIDER
// ============================================================

const heroSlides = document.querySelectorAll(".hero-slide");

let heroIndex = 0;


if (heroSlides.length > 1) {


    setInterval(() => {


        const currentSlide = heroSlides[heroIndex];


        let nextIndex = heroIndex + 1;


        if (nextIndex >= heroSlides.length) {

            nextIndex = 0;

        }


        const nextSlide = heroSlides[nextIndex];


        // ====================================================
        // PREPARAR LA NUEVA IMAGEN
        // ====================================================

        nextSlide.style.transition = "none";

        nextSlide.style.transform = "translateX(100%)";


        // Forzar al navegador a aplicar la posición
        nextSlide.offsetHeight;


        // ====================================================
        // ACTIVAR ANIMACIÓN
        // ====================================================

        nextSlide.style.transition =
            "transform 1s ease-in-out";


        currentSlide.style.transition =
            "transform 1s ease-in-out";


        // La imagen actual sale hacia la izquierda

        currentSlide.style.transform =
            "translateX(-100%)";


        // La nueva imagen entra desde la derecha

        nextSlide.style.transform =
            "translateX(0)";


        // ====================================================
        // DESPUÉS DE LA ANIMACIÓN
        // ====================================================

        setTimeout(() => {


            currentSlide.classList.remove("active");

            currentSlide.style.transition = "none";

            currentSlide.style.transform =
                "translateX(100%)";


            nextSlide.classList.add("active");


        }, 1000);


        heroIndex = nextIndex;


    }, 4000);

}



// ============================================================
// AÑO AUTOMÁTICO DEL FOOTER
// ============================================================

const year = document.querySelector(".year");


if (year) {

    year.textContent =
        new Date().getFullYear();

}



// ============================================================
// BOTÓN BACK TO TOP
// ============================================================

const topButton =
    document.querySelector(".top");


if (topButton) {


    window.addEventListener("scroll", () => {


        topButton.classList.toggle(
            "show",
            window.scrollY > 500
        );


    });


    topButton.addEventListener("click", () => {


        window.scrollTo({

            top:0,

            behavior:"smooth"

        });


    });

}



// ============================================================
// TOAST
// ============================================================

const toast =
    document.querySelector(".toast");



// ============================================================
// FUNCIÓN PARA MOSTRAR TOAST
// ============================================================

function show(message) {


    if (!toast) return;


    toast.textContent =
        message;


    toast.classList.add("show");


    clearTimeout(
        window.toastTimer
    );


    window.toastTimer =
        setTimeout(() => {


            toast.classList.remove(
                "show"
            );


        }, 3500);

}



// ============================================================
// BOTONES ORDER
// ============================================================

document
    .querySelectorAll(".order")
    .forEach(button => {


        button.addEventListener(
            "click",
            () => {


                show(
                    `"${button.dataset.item}" selected. We'll connect ordering and PayPal next.`
                );


            }
        );


    });



// ============================================================
// FORMULARIO DE COTIZACIÓN
// ============================================================

document
    .querySelector("#quoteForm")
    ?.addEventListener(
        "submit",
        event => {


            event.preventDefault();


            show(
                "Quote request prepared. We'll connect the form to email next."
            );


            event.target.reset();


        }
    );



// ============================================================
// FORMULARIO DE CONTACTO
// ============================================================

document
    .querySelector("#contactForm")
    ?.addEventListener(
        "submit",
        event => {


            event.preventDefault();


            show(
                "Message prepared. We'll connect the contact form to email next."
            );


            event.target.reset();


        }
    );
