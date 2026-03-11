"use strict";
/**
 * Portfolio Louis Subtil - JavaScript Principal
 */
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const SCROLL_THRESHOLD = 80;
    const BACK_TO_TOP_THRESHOLD = 400;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // === NAVBAR SCROLL-AWARE (show on scroll-up, hide on scroll-down) ===
    let lastScrollY = window.scrollY;
    const handleNavbarVisibility = () => {
        if (!navbar || prefersReducedMotion)
            return;
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > SCROLL_THRESHOLD) {
            navbar.classList.add('navbar--hidden');
        }
        else if (currentScrollY < lastScrollY) {
            navbar.classList.remove('navbar--hidden');
        }
        lastScrollY = currentScrollY;
    };
    if (!prefersReducedMotion) {
        window.addEventListener('scroll', handleNavbarVisibility, { passive: true });
        handleNavbarVisibility();
    }
    // === SMOOTH SCROLL FOR NAV LINKS ===
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId?.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    e.preventDefault();
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach((button) => {
        button.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId?.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    e.preventDefault();
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
    // === ACTIVE NAV LINK ON SCROLL ===
    const sections = document.querySelectorAll('section');
    const navLinksArray = Array.from(navLinks);
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 200) {
                const id = section.getAttribute('id');
                if (id)
                    current = id;
            }
        });
        navLinksArray.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
    // === INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS ===
    if (!prefersReducedMotion) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.target instanceof HTMLElement) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        const animatedElements = document.querySelectorAll('section');
        animatedElements.forEach((el) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    // === MOBILE MENU ===
    const createMobileMenu = () => {
        const navContainer = document.querySelector('.nav-container');
        if (!navContainer)
            return;
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.setAttribute('aria-label', 'Ouvrir le menu de navigation');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
        mobileMenuBtn.style.display = 'none';
        navContainer.appendChild(mobileMenuBtn);
        mobileMenuBtn.addEventListener('click', () => {
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu) {
                const isExpanded = navMenu.classList.toggle('active');
                mobileMenuBtn.setAttribute('aria-expanded', String(isExpanded));
                mobileMenuBtn.setAttribute('aria-label', isExpanded ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation');
            }
        });
        const checkScreenSize = () => {
            const navMenu = document.querySelector('.nav-menu');
            if (window.innerWidth <= 768) {
                mobileMenuBtn.style.display = 'block';
                if (navMenu)
                    navMenu.style.display = 'none';
            }
            else {
                mobileMenuBtn.style.display = 'none';
                if (navMenu)
                    navMenu.style.display = 'flex';
            }
        };
        window.addEventListener('resize', checkScreenSize);
        checkScreenSize();
    };
    createMobileMenu();
    // === BACK TO TOP BUTTON ===
    const createBackToTopButton = () => {
        const btn = document.createElement('button');
        btn.className = 'back-to-top';
        btn.setAttribute('aria-label', 'Retour en haut de page');
        btn.innerHTML = '<i class="fas fa-chevron-up" aria-hidden="true"></i>';
        document.body.appendChild(btn);
        const toggleVisibility = () => {
            if (window.scrollY > BACK_TO_TOP_THRESHOLD) {
                btn.classList.add('visible');
            }
            else {
                btn.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', toggleVisibility, { passive: true });
        toggleVisibility();
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };
    createBackToTopButton();
    // === CONTACT FORM FEEDBACK ===
    const initContactForm = () => {
        const form = document.getElementById('contact-form');
        if (!form)
            return;
        const submitBtn = form.querySelector('button[type="submit"]');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const existingMessage = form.querySelector('.form-message');
            if (existingMessage)
                existingMessage.remove();
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Envoi…';
            }
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { Accept: 'application/json' },
                });
                const message = document.createElement('div');
                if (response.ok) {
                    message.className = 'form-message form-message--success';
                    message.innerHTML = '<i class="fas fa-check-circle" aria-hidden="true"></i> Message envoyé avec succès !';
                    form.reset();
                }
                else {
                    message.className = 'form-message form-message--error';
                    message.innerHTML = '<i class="fas fa-exclamation-circle" aria-hidden="true"></i> Une erreur est survenue. Veuillez réessayer.';
                }
                form.appendChild(message);
            }
            catch {
                const message = document.createElement('div');
                message.className = 'form-message form-message--error';
                message.innerHTML = '<i class="fas fa-exclamation-circle" aria-hidden="true"></i> Impossible d\'envoyer le message. Vérifiez votre connexion.';
                form.appendChild(message);
            }
            finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Envoyer';
                }
            }
        });
    };
    initContactForm();
    // === FOOTER YEAR ===
    const yearEl = document.getElementById('currentYear');
    if (yearEl)
        yearEl.textContent = String(new Date().getFullYear());
});
