// Portfolio Louis Subtil - JavaScript Principal

document.addEventListener('DOMContentLoaded', function() {
    // Navigation smooth scroll
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Hero buttons smooth scroll
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Active navigation link
    const sections = document.querySelectorAll('section');
    const navLinksArray = Array.from(navLinks);
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinksArray.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
    
    // Form submission
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Ici vous pouvez ajouter la logique d'envoi du formulaire
            // Pour l'instant, on affiche juste un message
            alert('Message envoyé ! (Fonctionnalité à implémenter)');
            
            // Reset du formulaire
            this.reset();
        });
    }
    
    // Animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observer les sections pour l'animation
    const animatedElements = document.querySelectorAll('section');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Mobile menu toggle (si vous voulez ajouter un menu mobile)
    const createMobileMenu = () => {
        const navbar = document.querySelector('.navbar');
        const navContainer = document.querySelector('.nav-container');
        
        // Créer le bouton hamburger
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuBtn.style.display = 'none';
        
        // Ajouter le bouton au container
        navContainer.appendChild(mobileMenuBtn);
        
        // Toggle menu mobile
        mobileMenuBtn.addEventListener('click', function() {
            const navMenu = document.querySelector('.nav-menu');
            navMenu.classList.toggle('active');
        });
        
        // Afficher/masquer le bouton selon la taille d'écran
        const checkScreenSize = () => {
            if (window.innerWidth <= 768) {
                mobileMenuBtn.style.display = 'block';
                document.querySelector('.nav-menu').style.display = 'none';
            } else {
                mobileMenuBtn.style.display = 'none';
                document.querySelector('.nav-menu').style.display = 'flex';
            }
        };
        
        window.addEventListener('resize', checkScreenSize);
        checkScreenSize();
    };
    
    createMobileMenu();
});

// Fonction utilitaire pour le scroll smooth
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}
