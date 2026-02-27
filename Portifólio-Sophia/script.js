// REGISTRO DO GSAP E PLUGINS
if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

/* -----------------------
   CURSOR E MENU MOBILE
   ----------------------- */
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const interactiveElements = document.querySelectorAll('a, button, .gallery-item, .btn, .primary-btn, .close-modal, .pdf-btn, .lang-btn, .theme-btn, .menu-btn');
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

const menuBtn = document.getElementById('menu-btn');
const navMenu = document.getElementById('nav-menu');

if(menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = menuBtn.querySelector('i');
        if(navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    document.querySelectorAll('.nav-link, .btn-contato').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuBtn.querySelector('i').classList.remove('fa-times');
            menuBtn.querySelector('i').classList.add('fa-bars');
        });
    });
}

/* -----------------------
   TRANSIÇÃO PARALLAX SEGURO E ANIMAÇÕES
   ----------------------- */
const timeline = gsap.timeline();
timeline.from('.navbar', { y: -80, opacity: 0, duration: 0.9, ease: "power4.out" })
        .from('.reveal-text', { y: 36, opacity: 0, duration: 0.9, stagger: 0.18, ease: "power3.out" }, "-=0.45")
        .from('.hero-image', { x: 80, opacity: 0, duration: 1.1, ease: "power3.out" }, "-=0.9");

if (typeof ScrollTrigger !== 'undefined') {
    
    // Navbar colorindo no scroll
    ScrollTrigger.create({
        trigger: ".projects-and-carousel-wrapper",
        start: "top 80px", 
        onEnter: () => {
            document.querySelector(".navbar").classList.add("nav-active");
            document.body.classList.add("navbar-shrink");
        },
        onLeaveBack: () => {
            document.querySelector(".navbar").classList.remove("nav-active");
            document.body.classList.remove("navbar-shrink");
        }
    });

    // MÁGICA SEGURA: Move suavemente, não altera opacidade da imagem. ZERO bugs!
    let mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
        gsap.to(".hero-text", {
            y: -120, 
            scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
        });
        gsap.to(".hero-image", {
            y: 80, 
            scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
        });
    });

    mm.add("(max-width: 768px)", () => {
        gsap.to(".hero-text", {
            y: -40, 
            scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
        });
        gsap.to(".hero-image", {
            y: 20, 
            scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
        });
    });

    gsap.from(".gallery-item", { scrollTrigger: { trigger: ".gallery-grid", start: "top 80%" }, y: 80, opacity: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" });
    gsap.from(".about-text", { scrollTrigger: { trigger: ".about-section", start: "top 75%" }, x: -40, opacity: 0, duration: 0.9, ease: "power3.out" });
    gsap.from(".stat-item", { scrollTrigger: { trigger: ".stats", start: "top 85%" }, y: 40, opacity: 0, duration: 0.7, stagger: 0.18 });
}

if (typeof VanillaTilt !== 'undefined') { VanillaTilt.init(document.querySelectorAll(".gallery-item"), { max: 10, speed: 400, glare: true, "max-glare": 0.2, scale: 1.03 }); }

/* -----------------------
   SWIPER E ROLAGEM SUAVE
   ----------------------- */
let isDragging = false;
if (typeof Swiper !== 'undefined') {
    const swiper = new Swiper(".mySwiper", {
        slidesPerView: 'auto', spaceBetween: 22, grabCursor: true, loop: true, autoplay: { delay: 2500, disableOnInteraction: false }, speed: 800,
        on: { touchStart: function() { isDragging = false; }, sliderMove: function() { isDragging = true; }, touchMove: function() { isDragging = true; } }
    });
    const swiperEl = document.querySelector('.mySwiper');
    if (swiperEl) { swiperEl.addEventListener('mouseenter', () => swiper.autoplay.pause()); swiperEl.addEventListener('mouseleave', () => swiper.autoplay.resume()); }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href.length > 1 && href !== "#") {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const yOffset = -70;
                gsap.to(window, { duration: 1.2, scrollTo: { y: target, offsetAuto: false, offsetY: -yOffset }, ease: "power3.inOut" });
            }
        }
    });
});

/* -----------------------
   MODAL
   ----------------------- */
const modal = document.getElementById("projectModal");
const modalImg = document.getElementById("img01");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const closeBtn = document.querySelector(".close-modal");
const body = document.body;

function openModal(element) {
    if (isDragging) return;
    if (!modal || !element) return; 
    const img = element.querySelector('img');
    if(!img) return;
    const titleEl = element.querySelector('h3');
    const descEl = element.querySelector('p');
    modalImg.src = img.src;
    modalTitle.innerText = titleEl ? titleEl.textContent : "Projeto"; 
    modalDesc.innerText = descEl ? descEl.textContent : "";
    const projectLink = element.getAttribute('data-link');
    const currentBtn = document.getElementById("modal-link-btn");
    if (currentBtn) {
        if (projectLink && projectLink !== "#" && projectLink !== "") {
            currentBtn.style.display = "inline-flex"; currentBtn.href = projectLink;
            currentBtn.onclick = function(e) { e.preventDefault(); window.open(projectLink, '_blank'); };
        } else {
            currentBtn.style.display = "none"; currentBtn.onclick = null; currentBtn.href = "#";
        }
    }
    modal.classList.add('show'); body.style.overflow = "hidden";
}

function closeModal() {
    if (!modal) return;
    modal.classList.remove('show'); body.style.overflow = "auto";
    setTimeout(() => { modalImg.src = ""; const currentBtn = document.getElementById("modal-link-btn"); if(currentBtn) currentBtn.style.display = "none"; }, 400);
}
if (closeBtn) closeBtn.onclick = closeModal;
window.onclick = function(event) { if (event.target == modal) closeModal(); }
document.addEventListener('keydown', function(event) { if (event.key === "Escape" && modal.classList.contains('show')) closeModal(); });

/* -----------------------
   DARK MODE E TRADUÇÃO
   ----------------------- */
const themeToggleBtn = document.getElementById('theme-toggle');
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = themeToggleBtn.querySelector('i');
        if (document.body.classList.contains('dark-mode')) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); } 
        else { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
    });
}

const translations = {
    pt: { "nav-home": "Início", "nav-projects": "Projetos", "nav-about": "Sobre", "nav-contact": "Contato", "hero-title": "Olá, eu sou a <br><span class='texto-destaque'>Sophia</span>", "hero-desc": "Através de cursos na Alura e de experiências práticas no desenvolvimento de peças gráficas e conteúdos para mídias sociais, aprimorei meu domínio em ferramentas como Illustrator, Photoshop, After Effects, Adobe Premiere e Figma. Minha paixão pelo design gráfico e minha vivência em publicidade me impulsionam a buscar constantemente novas oportunidades para aplicar conhecimentos e contribuir para o sucesso de projetos. Atualmente, curso Publicidade e Propaganda na Fundação Escola de Comércio Álvares Penteado (FECAP).", "hero-btn": "Ver Projetos <i class='fas fa-arrow-down'></i>", "sec-projects": "Projetos Selecionados", "campaign": "Campanha", "branding": "Branding", "rebranding": "Rebranding & Merch", "sec-other": "Outros Projetos", "photo": "Fotografia Publicitária", "product-design": "Design de Produto", "social-media": "Social Media", "ecommerce": "E-commerce Design", "visual-id": "Identidade Visual", "sec-about": "Sobre <span class='outline-text'>Mim</span>", "about-desc": "Tenho uma formação em design, obtida por meio de cursos especializados em plataformas digitais. Minhas habilidades abrangem design gráfico, com proficiência em ferramentas como InDesign, Illustrator e Photoshop. Atualmente, estou focado em aprimorar minha capacidade de edição de layouts e imagens. Possuo um domínio avançado no Canva e estou trabalhando para aprofundar meus conhecimentos no Figma no futuro próximo.", "stat-years": "Anos de Estudo", "stat-projects": "Projetos Reais", "sec-contact": "Contato", "copyright": "© 2025 Desenvolvido por Sophia Desiderio e Isabela Yared. Feito com 💜.", "modal-btn": "<i class='fas fa-external-link-alt'></i> Ver Projeto Completo" },
    en: { "nav-home": "Home", "nav-projects": "Projects", "nav-about": "About", "nav-contact": "Contact", "hero-title": "Hi, I'm <br><span class='texto-destaque'>Sophia</span>", "hero-desc": "Through Alura courses and hands-on experience developing graphic assets and social media content, I have honed my skills in tools like Illustrator, Photoshop, After Effects, Adobe Premiere, and Figma. My passion for graphic design and my background in advertising drive me to constantly seek new opportunities to apply my knowledge and contribute to the success of projects. I am currently studying Advertising at Fundação Escola de Comércio Álvares Penteado (FECAP).", "hero-btn": "View Projects <i class='fas fa-arrow-down'></i>", "sec-projects": "Selected Projects", "campaign": "Campaign", "branding": "Branding", "rebranding": "Rebranding & Merch", "sec-other": "Other Projects", "photo": "Advertising Photography", "product-design": "Product Design", "social-media": "Social Media", "ecommerce": "E-commerce Design", "visual-id": "Visual Identity", "sec-about": "About <span class='outline-text'>Me</span>", "about-desc": "I have a background in design, obtained through specialized courses on digital platforms. My skills encompass graphic design, with proficiency in tools such as InDesign, Illustrator, and Photoshop. Currently, I am focused on improving my layout and image editing skills. I have an advanced mastery of Canva and am working to deepen my knowledge of Figma in the near future.", "stat-years": "Years of Study", "stat-projects": "Real Projects", "sec-contact": "Contact", "copyright": "© 2025 Developed by Sophia Desiderio and Isabela Yared. Made with 💜.", "modal-btn": "<i class='fas fa-external-link-alt'></i> View Full Project" }
};
const langToggleBtn = document.getElementById('lang-toggle');
if (langToggleBtn) {
    let currentLang = 'pt';
    langToggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'pt' ? 'en' : 'pt';
        langToggleBtn.textContent = currentLang === 'pt' ? 'EN' : 'PT';
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[currentLang][key]) { element.innerHTML = translations[currentLang][key]; }
        });
    });
}

/* -----------------------
   BOLINHAS SUBINDO DESDE O CARROSSEL (BOMBARDEIO UNIFICADO)
   ----------------------- */
const projectParticlesContainer = document.getElementById('project-particles-container');
const projectsWrapper = document.querySelector('.projects-and-carousel-wrapper');

if (projectParticlesContainer && projectsWrapper) {
    function createProjectParticle(isBurst = false) {
        const particle = document.createElement('div');
        particle.classList.add('project-particle');
        const size = Math.random() * 12 + 4; 
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        
        particle.style.bottom = isBurst ? `${Math.random() * 80}%` : `-50px`; 
        
        const isPrimary = Math.random() > 0.3; 
        particle.style.background = isPrimary ? 'rgba(213, 41, 77, 0.4)' : 'rgba(255, 255, 255, 0.3)';
        if (document.body.classList.contains('dark-mode')) {
             particle.style.background = isPrimary ? 'rgba(213, 41, 77, 0.6)' : 'rgba(255, 255, 255, 0.4)';
        }

        projectParticlesContainer.appendChild(particle);
        gsap.to(particle, { opacity: Math.random() * 0.5 + 0.2, duration: 0.5, ease: "power1.out" });
        
        gsap.to(particle, {
            y: -(projectsWrapper.offsetHeight + 200), 
            x: `+=${Math.random() * 150 - 75}`, 
            duration: Math.random() * 14 + 10, 
            ease: "none", 
            onComplete: () => particle.remove() 
        });
    }

    ScrollTrigger.create({
        trigger: projectsWrapper,
        start: "top 80%", 
        onEnter: () => {
            for(let i = 0; i < 30; i++) { createProjectParticle(true); }
            const projectParticleInterval = setInterval(() => createProjectParticle(false), 120); 
            ScrollTrigger.create({
                trigger: projectsWrapper,
                start: "bottom top", 
                onLeave: () => clearInterval(projectParticleInterval),
                onEnterBack: () => clearInterval(projectParticleInterval) 
            });
        }
    });
}

/* Bolinhas do Rodapé */
const particlesContainer = document.getElementById('particles-container');
const footerSection = document.getElementById('contato');

if (particlesContainer && footerSection) {
    function createFooterParticle(isBurst = false) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 15 + 5; 
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = isBurst ? `${Math.random() * 50}%` : `-20px`; 
        
        const isPrimary = Math.random() > 0.5;
        particle.style.background = isPrimary ? 'rgba(213, 41, 77, 0.5)' : 'rgba(255, 215, 0, 0.3)';
        if (document.body.classList.contains('dark-mode')) {
             particle.style.background = isPrimary ? 'rgba(213, 41, 77, 0.7)' : 'rgba(255, 215, 0, 0.4)';
        }

        particlesContainer.appendChild(particle);
        gsap.to(particle, { opacity: Math.random() * 0.6 + 0.2, duration: 0.5, ease: "power1.out" });
        gsap.to(particle, {
            y: footerSection.offsetHeight + 50, 
            x: `+=${Math.random() * 100 - 50}`, 
            duration: Math.random() * 4 + 2, 
            ease: "sine.inOut",
            onComplete: () => particle.remove() 
        });
    }

    ScrollTrigger.create({
        trigger: footerSection,
        start: "top 90%", 
        onEnter: () => {
            for(let i = 0; i < 20; i++) { createFooterParticle(true); }
            const particleInterval = setInterval(() => createFooterParticle(false), 80); 
            ScrollTrigger.create({
                trigger: footerSection,
                start: "bottom top", 
                onLeave: () => clearInterval(particleInterval),
                onEnterBack: () => clearInterval(particleInterval) 
            });
        }
    });
}
