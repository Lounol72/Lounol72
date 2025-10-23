---
layout: default
title: "Message envoyé"
description: "Votre message a été envoyé avec succès"
permalink: /contact-success/
---

<div class="success-page">
    <div class="container">
        <div class="success-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            
            <h1 class="success-title">Message envoyé !</h1>
            
            <p class="success-message">
                Merci pour votre message. Je vous répondrai dans les plus brefs délais.
            </p>
            
            <div class="success-actions">
                <a href="{{ '/' | relative_url }}" class="btn btn-primary">
                    <i class="fas fa-home"></i> Retour à l'accueil
                </a>
                <a href="{{ '/contact/' | relative_url }}" class="btn btn-secondary">
                    <i class="fas fa-envelope"></i> Nouveau message
                </a>
            </div>
            
            <div class="success-info">
                <h3>En attendant ma réponse :</h3>
                <ul>
                    <li>Consultez mes <a href="{{ '/#portfolio' | relative_url }}">projets</a></li>
                    <li>Découvrez mon <a href="https://github.com/{{ site.github_username }}" target="_blank">GitHub</a></li>
                    <li>Suivez-moi sur les réseaux sociaux</li>
                </ul>
            </div>
        </div>
    </div>
</div>

<style>
.success-page {
    padding: 4rem 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
}

.success-content {
    text-align: center;
    max-width: 600px;
    margin: 0 auto;
    background: #fff;
    padding: 3rem;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.success-icon {
    font-size: 4rem;
    color: #28a745;
    margin-bottom: 2rem;
}

.success-title {
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 1rem;
    font-weight: 700;
}

.success-message {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 2rem;
    line-height: 1.6;
}

.success-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 3rem;
    flex-wrap: wrap;
}

.success-actions .btn {
    padding: 0.875rem 2rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-primary {
    background: #007bff;
    color: #fff;
    border: 2px solid #007bff;
}

.btn-primary:hover {
    background: #0056b3;
    border-color: #0056b3;
    transform: translateY(-2px);
}

.btn-secondary {
    background: transparent;
    color: #007bff;
    border: 2px solid #007bff;
}

.btn-secondary:hover {
    background: #007bff;
    color: #fff;
    transform: translateY(-2px);
}

.success-info {
    text-align: left;
    background: #f8f9fa;
    padding: 2rem;
    border-radius: 12px;
    border-left: 4px solid #007bff;
}

.success-info h3 {
    color: #333;
    margin-bottom: 1rem;
    font-size: 1.3rem;
}

.success-info ul {
    list-style: none;
    padding: 0;
}

.success-info li {
    padding: 0.5rem 0;
    color: #666;
    position: relative;
    padding-left: 1.5rem;
}

.success-info li:before {
    content: "→";
    color: #007bff;
    font-weight: bold;
    position: absolute;
    left: 0;
}

.success-info a {
    color: #007bff;
    text-decoration: none;
    font-weight: 600;
}

.success-info a:hover {
    text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
    .success-content {
        margin: 1rem;
        padding: 2rem;
    }
    
    .success-title {
        font-size: 2rem;
    }
    
    .success-actions {
        flex-direction: column;
        align-items: center;
    }
    
    .success-actions .btn {
        width: 100%;
        max-width: 300px;
        justify-content: center;
    }
}
</style>
