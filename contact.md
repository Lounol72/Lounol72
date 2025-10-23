---
layout: default
title: "Contact"
description: "Contactez Louis Subtil pour vos projets de développement web"
permalink: /contact/
---

<div class="contact-page">
    <div class="container">
        <div class="contact-header">
            <h1 class="page-title">Contactez-moi</h1>
            <p class="page-description">
                Vous avez un projet en tête ? Une collaboration à proposer ? 
                N'hésitez pas à me contacter, je serais ravi d'échanger avec vous !
            </p>
        </div>

        <div class="contact-content">
            <div class="contact-info">
                <h2>Informations de contact</h2>
                <div class="contact-details">
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <div>
                            <strong>Email</strong>
                            <p>{{ site.email }}</p>
                        </div>
                    </div>
                    
                    <div class="contact-item">
                        <i class="fab fa-github"></i>
                        <div>
                            <strong>GitHub</strong>
                            <p><a href="https://github.com/{{ site.github_username }}" target="_blank">@{{ site.github_username }}</a></p>
                        </div>
                    </div>
                    
                    <div class="contact-item">
                        <i class="fas fa-university"></i>
                        <div>
                            <strong>Université</strong>
                            <p>{{ site.university }}</p>
                        </div>
                    </div>
                    
                    <div class="contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <div>
                            <strong>Localisation</strong>
                            <p>Le Mans, France</p>
                        </div>
                    </div>
                </div>

                <div class="contact-availability">
                    <h3>Disponibilité</h3>
                    <p>Je suis disponible pour :</p>
                    <ul>
                        <li>Stages en développement web</li>
                        <li>Projets collaboratifs</li>
                        <li>Freelance (projets courts)</li>
                        <li>Échanges techniques</li>
                    </ul>
                </div>
            </div>

            <div class="contact-form-section">
                <h2>Envoyez-moi un message</h2>
                {% include contact-form.html %}
            </div>
        </div>
    </div>
</div>

<style>
.contact-page {
    padding: 4rem 0;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    min-height: 100vh;
}

.contact-header {
    text-align: center;
    margin-bottom: 4rem;
}

.page-title {
    font-size: 3rem;
    color: #333;
    margin-bottom: 1rem;
    font-weight: 700;
}

.page-description {
    font-size: 1.2rem;
    color: #666;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
}

.contact-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    max-width: 1200px;
    margin: 0 auto;
}

.contact-info h2,
.contact-form-section h2 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 2rem;
    font-weight: 600;
}

.contact-details {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 3rem;
}

.contact-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.5rem;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.contact-item:hover {
    transform: translateY(-2px);
}

.contact-item i {
    font-size: 1.5rem;
    color: #007bff;
    margin-top: 0.25rem;
    min-width: 24px;
}

.contact-item strong {
    display: block;
    color: #333;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.contact-item p {
    color: #666;
    margin: 0;
}

.contact-item a {
    color: #007bff;
    text-decoration: none;
}

.contact-item a:hover {
    text-decoration: underline;
}

.contact-availability {
    background: #fff;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.contact-availability h3 {
    color: #333;
    margin-bottom: 1rem;
    font-size: 1.5rem;
}

.contact-availability p {
    color: #666;
    margin-bottom: 1rem;
}

.contact-availability ul {
    list-style: none;
    padding: 0;
}

.contact-availability li {
    padding: 0.5rem 0;
    color: #666;
    position: relative;
    padding-left: 1.5rem;
}

.contact-availability li:before {
    content: "✓";
    color: #28a745;
    font-weight: bold;
    position: absolute;
    left: 0;
}

.contact-form-section {
    background: #fff;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
    .contact-content {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    
    .page-title {
        font-size: 2rem;
    }
    
    .contact-page {
        padding: 2rem 0;
    }
}
</style>
