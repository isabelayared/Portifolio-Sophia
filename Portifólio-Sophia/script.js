// --- GSAP Register Plugin
if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
    gsap.registerPlugin(ScrollTrigger);
}

/* -----------------------
   CURSOR PERSONALIZADO
   ----------------------- */
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const interactiveElements = document.querySelectorAll('a, button, .gallery-item, .swiper-slide, .btn, .primary-btn, .close-modal, .pdf-btn');

if (cursor && follower && window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.01, ease: "power1.out" });
        gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.12, ease: "power1.out" });
    });

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => follower.classList.add('cursor-active'));
        el.addEventListener('mouseleave', () => follower.classList.remove('cursor-active'));
    });
}

/* -----------------------
   ENTRADA (HERO) COM GSAP
   ----------------------- */
const timeline = gsap.timeline();

timeline.from('.navbar', {
    y: -80, opacity: 0, duration: 0.9, ease: "power4.out"
})
.from('.reveal-text', {
    y: 36, opacity: 0, duration: 0.9, stagger: 0.18, ease: "power3.out"
}, "-=0.45")
.from('.hero-image', {
    x: 80, opacity: 0, duration: 1.1, ease: "power3.out"
}, "-=0.9");

/* -----------------------
   ANIMAÇÕES AO SCROLL
   ----------------------- */
if (typeof ScrollTrigger !== 'undefined') {
    gsap.from(".gallery-item", {
        scrollTrigger: { trigger: ".gallery-grid", start: "top 80%" },
        y: 80, opacity: 0, duration: 0.9, stagger: 0.08, ease: "power3.out"
    });

    gsap.from(".about-text", {
        scrollTrigger: { trigger: ".about-section", start: "top 75%" },
        x: -40, opacity: 0, duration: 0.9, ease: "power3.out"
    });

    gsap.from(".stat-item", {
        scrollTrigger: { trigger: ".stats", start: "top 85%" },
        y: 40, opacity: 0, duration: 0.7, stagger: 0.18
    });
}

/* -----------------------
   VANILLA TILT (Galeria)
   ----------------------- */
if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".gallery-item"), {
        max: 10, speed: 400, glare: true, "max-glare": 0.2, scale: 1.03
    });
}

/* -----------------------
   SWIPER (CARROSSEL)
   ----------------------- */
if (typeof Swiper !== 'undefined') {
    const swiper = new Swiper(".mySwiper", {
        slidesPerView: 'auto',
        spaceBetween: 22,
        grabCursor: true,
        loop: true,
        autoplay: { delay: 2500, disableOnInteraction: false },
        speed: 800,
    });
    
    // Pausa no hover
    const swiperEl = document.querySelector('.mySwiper');
    if (swiperEl) {
        swiperEl.addEventListener('mouseenter', () => swiper.autoplay.pause());
        swiperEl.addEventListener('mouseleave', () => swiper.autoplay.resume());
    }
}

/* -----------------------
   SMOOTH SCROLL NAV
   ----------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href.length > 1 && href !== "#") {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const yOffset = -70;
                const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    });
});

/* -----------------------
   LÓGICA DO MODAL (CORRIGIDA)
   ----------------------- */
const modal = document.getElementById("projectModal");
const modalImg = document.getElementById("img01");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalLinkBtn = document.getElementById("modal-link-btn");
const closeBtn = document.querySelector(".close-modal");
const body = document.body;

function openModal(element) {
    if (!modal) return; 

    // Pega a imagem
    const img = element.querySelector('img');
    
    // Tenta pegar o título e descrição (seja da galeria ou do carrossel)
    const titleEl = element.querySelector('h3');
    const descEl = element.querySelector('p');

    // Usa textContent em vez de innerText para ler elementos ocultos (display: none)
    const title = titleEl ? titleEl.textContent : "Projeto"; 
    const desc = descEl ? descEl.textContent : "Detalhes em breve";
    
    // Pega o LINK do atributo data-link
    const projectLink = element.getAttribute('data-link');

    // Preenche o modal
    modalImg.src = img.src;
    modalTitle.innerText = title; // Aqui no modal usamos innerText pois ele é visível
    modalDesc.innerText = desc;

    // Lógica do Botão: Atualiza o HREF
    if (projectLink && projectLink !== "#" && projectLink !== "") {
        modalLinkBtn.style.display = "inline-flex";
        modalLinkBtn.href = projectLink;
    } else {
        modalLinkBtn.style.display = "none";
    }

    // Mostra o modal
    modal.classList.add('show');
    body.style.overflow = "hidden";
}
function closeModal() {
    if (!modal) return;
    modal.classList.remove('show');
    body.style.overflow = "auto";
    setTimeout(() => { modalImg.src = ""; }, 400);
}

// Event Listeners do Modal
if (closeBtn) closeBtn.onclick = closeModal;

window.onclick = function(event) {
    if (event.target == modal) closeModal();
}

document.addEventListener('keydown', function(event) {
    if (event.key === "Escape" && modal.classList.contains('show')) closeModal();
});