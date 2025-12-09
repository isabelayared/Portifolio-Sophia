// --- 1. REGISTRO DO GSAP
if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
    gsap.registerPlugin(ScrollTrigger);
}

/* -----------------------
   2. CURSOR PERSONALIZADO
   ----------------------- */
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const interactiveElements = document.querySelectorAll('a, button, .gallery-item, .btn, .primary-btn, .close-modal, .pdf-btn');
const carouselSection = document.querySelector('.carousel-section');

if (cursor && follower && window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.01, ease: "power1.out" });
        gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.12, ease: "power1.out" });
    });

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => follower.classList.add('cursor-active'));
        el.addEventListener('mouseleave', () => follower.classList.remove('cursor-active'));
    });

    if (carouselSection) {
        carouselSection.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hidden');
            follower.classList.add('cursor-hidden');
        });
        carouselSection.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hidden');
            follower.classList.remove('cursor-hidden');
        });
    }
}

/* -----------------------
   3. ANIMAÇÕES (Hero, Scroll, Tilt)
   ----------------------- */
const timeline = gsap.timeline();
timeline.from('.navbar', { y: -80, opacity: 0, duration: 0.9, ease: "power4.out" })
        .from('.reveal-text', { y: 36, opacity: 0, duration: 0.9, stagger: 0.18, ease: "power3.out" }, "-=0.45")
        .from('.hero-image', { x: 80, opacity: 0, duration: 1.1, ease: "power3.out" }, "-=0.9");

if (typeof ScrollTrigger !== 'undefined') {
    gsap.from(".gallery-item", { scrollTrigger: { trigger: ".gallery-grid", start: "top 80%" }, y: 80, opacity: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" });
    gsap.from(".about-text", { scrollTrigger: { trigger: ".about-section", start: "top 75%" }, x: -40, opacity: 0, duration: 0.9, ease: "power3.out" });
    gsap.from(".stat-item", { scrollTrigger: { trigger: ".stats", start: "top 85%" }, y: 40, opacity: 0, duration: 0.7, stagger: 0.18 });
}

if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".gallery-item"), { max: 10, speed: 400, glare: true, "max-glare": 0.2, scale: 1.03 });
}

/* -----------------------
   4. SWIPER (Carrossel)
   ----------------------- */
let isDragging = false;

if (typeof Swiper !== 'undefined') {
    const swiper = new Swiper(".mySwiper", {
        slidesPerView: 'auto',
        spaceBetween: 22,
        grabCursor: true,
        loop: true,
        autoplay: { delay: 2500, disableOnInteraction: false },
        speed: 800,
        on: {
            touchStart: function() { isDragging = false; },
            sliderMove: function() { isDragging = true; },
            touchMove: function() { isDragging = true; }
        }
    });
    
    const swiperEl = document.querySelector('.mySwiper');
    if (swiperEl) {
        swiperEl.addEventListener('mouseenter', () => swiper.autoplay.pause());
        swiperEl.addEventListener('mouseleave', () => swiper.autoplay.resume());
    }
}

/* -----------------------
   5. SMOOTH SCROLL
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
   6. LÓGICA DO MODAL (CORRIGIDA E BLINDADA)
   ----------------------- */
const modal = document.getElementById("projectModal");
const modalImg = document.getElementById("img01");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const closeBtn = document.querySelector(".close-modal");
const body = document.body;

function openModal(element) {
    // 1. Se estiver arrastando, cancela
    if (isDragging) {
        isDragging = false; 
        return;
    }

    if (!modal || !element) return; 
    const img = element.querySelector('img');
    if(!img) return;

    // 2. Busca e limpa dados
    const titleEl = element.querySelector('h3');
    const descEl = element.querySelector('p');
    const title = titleEl ? titleEl.textContent : "Projeto"; 
    const desc = descEl ? descEl.textContent : "";
    const projectLink = element.getAttribute('data-link');

    // 3. Preenche visual
    modalImg.src = img.src;
    modalTitle.innerText = title; 
    modalDesc.innerText = desc;

    // 4. Lógica do Botão 
    const currentBtn = document.getElementById("modal-link-btn");

    if (currentBtn) {
        if (projectLink && projectLink !== "#" && projectLink !== "") {
            // Se tem link: Mostra e Configura
            currentBtn.style.display = "inline-flex";
            currentBtn.href = projectLink;
            
            // Sobrescreve o onclick diretamente (mais seguro que replaceChild)
            currentBtn.onclick = function(e) {
                e.preventDefault(); // Evita qualquer comportamento estranho padrão
                window.open(projectLink, '_blank'); // Força nova aba
            };
        } else {
            // Se NÃO tem link: Esconde completamente e limpa o clique
            currentBtn.style.display = "none";
            currentBtn.onclick = null;
            currentBtn.href = "#";
        }
    }

    // 5. Mostra Modal
    modal.classList.add('show');
    body.style.overflow = "hidden";
}

function closeModal() {
    if (!modal) return;
    
    // Esconde o modal
    modal.classList.remove('show');
    body.style.overflow = "auto";
    
    // Limpeza extra para evitar bugs visuais na transição
    setTimeout(() => { 
        modalImg.src = "";
        
        // Garante que o botão resete ao fechar
        const currentBtn = document.getElementById("modal-link-btn");
        if(currentBtn) currentBtn.style.display = "none";
        
    }, 400);
}

if (closeBtn) closeBtn.onclick = closeModal;

window.onclick = function(event) {
    if (event.target == modal) closeModal();
}

document.addEventListener('keydown', function(event) {
    if (event.key === "Escape" && modal.classList.contains('show')) closeModal();
});
