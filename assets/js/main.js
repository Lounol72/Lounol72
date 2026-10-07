"use strict";
/**
 * Portfolio Louis Subtil - JavaScript commun à toutes les pages
 */
const SCROLL_THRESHOLD = 80;
const BACK_TO_TOP_THRESHOLD = 600;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initActiveNavLink();
    initReveal();
    initBackToTop();
    const yearEl = document.getElementById('currentYear');
    if (yearEl)
        yearEl.textContent = String(new Date().getFullYear());
});
// === NAVIGATION : menu mobile + barre masquée en descendant ===
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.getElementById('nav-menu');
    if (!navbar)
        return;
    const isMenuOpen = () => menu?.classList.contains('is-open') ?? false;
    const setMenuOpen = (open) => {
        if (!toggle || !menu)
            return;
        menu.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
        // On change la classe de l'icône sans la recréer : un nœud retiré pendant le clic
        // ferait croire au gestionnaire « clic en dehors » que le clic vient de l'extérieur
        const icon = toggle.querySelector('i');
        icon?.classList.toggle('fa-bars', !open);
        icon?.classList.toggle('fa-xmark', open);
    };
    toggle?.addEventListener('click', () => setMenuOpen(!isMenuOpen()));
    menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenuOpen(false)));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen()) {
            setMenuOpen(false);
            toggle?.focus();
        }
    });
    document.addEventListener('click', (e) => {
        if (isMenuOpen() && e.target instanceof Node && !navbar.contains(e.target))
            setMenuOpen(false);
    });
    if (prefersReducedMotion)
        return;
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const scrollingDown = currentScrollY > lastScrollY && currentScrollY > SCROLL_THRESHOLD;
        navbar.classList.toggle('navbar--hidden', scrollingDown && !isMenuOpen());
        lastScrollY = currentScrollY;
    }, { passive: true });
}
// === LIEN ACTIF SELON LA SECTION VISIBLE ===
function initActiveNavLink() {
    const links = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
    const sections = links
        .map((link) => document.getElementById(link.hash.slice(1)))
        .filter((section) => section !== null);
    if (sections.length === 0)
        return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting)
                return;
            links.forEach((link) => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((section) => observer.observe(section));
}
// === APPARITION DES BLOCS AU SCROLL ===
function initReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        elements.forEach((el) => el.classList.add('is-visible'));
        return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    elements.forEach((el) => observer.observe(el));
}
// === BOUTON RETOUR EN HAUT ===
function initBackToTop() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Retour en haut de page');
    btn.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
    document.body.appendChild(btn);
    const toggleVisibility = () => {
        btn.classList.toggle('visible', window.scrollY > BACK_TO_TOP_THRESHOLD);
    };
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
}
