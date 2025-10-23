import React, { useState } from 'react'
import { motion } from 'framer-motion'

// Composant ProjectCard avec modal et animations
const ProjectCard = ({ project, index, variants }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Animation de la carte
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }
    }
  }

  // Animation du modal
  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  return (
    <>
      <motion.div
        className="portfolio-item"
        variants={cardVariants}
        whileHover={{ 
          y: -10,
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="portfolio-image">
          <img 
            src={project.image} 
            alt={project.title}
            loading="lazy"
          />
          <div className="portfolio-overlay">
            <motion.i 
              className="fas fa-eye"
              whileHover={{ scale: 1.2 }}
            ></motion.i>
          </div>
        </div>
        
        <div className="portfolio-info">
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          
          {/* Meta information for GitHub projects */}
          {project.stars !== undefined && (
            <div className="portfolio-meta">
              <span><i className="fas fa-star"></i> {project.stars}</span>
              <span><i className="fas fa-code-branch"></i> {project.forks}</span>
              {project.lastUpdated && (
                <span><i className="fas fa-calendar"></i> {new Date(project.lastUpdated).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              )}
            </div>
          )}
          
          <div className="portfolio-tech">
            {project.technologies.slice(0, 3).map((tech, idx) => (
              <span key={idx} className="tech-tag">
                {tech}
              </span>
            ))}
          </div>
          
          {/* Category badge */}
          {project.category && (
            <div className="category-badge" style={{
              backgroundColor: project.category === 'academic' ? '#4a90e220' : 
                              project.category === 'personal' ? '#7ed32120' : 
                              project.category === 'hackathon' ? '#f5a62320' : '#66666620',
              color: project.category === 'academic' ? '#4a90e2' : 
                     project.category === 'personal' ? '#7ed321' : 
                     project.category === 'hackathon' ? '#f5a623' : '#666666',
              border: `1px solid ${project.category === 'academic' ? '#4a90e240' : 
                                   project.category === 'personal' ? '#7ed32140' : 
                                   project.category === 'hackathon' ? '#f5a62340' : '#66666640'}`
            }}>
              <i className={`fas ${project.category === 'academic' ? 'fa-graduation-cap' : 
                              project.category === 'personal' ? 'fa-user' : 
                              project.category === 'hackathon' ? 'fa-trophy' : 'fa-folder'}`}></i>
              {project.category === 'academic' ? 'Académique' : 
               project.category === 'personal' ? 'Personnel' : 
               project.category === 'hackathon' ? 'Hackathon' : 'Autre'}
            </div>
          )}
          
          <motion.button 
            className="view-project"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Voir plus
          </motion.button>
        </div>
      </motion.div>

      {/* Modal du projet */}
      {isModalOpen && (
        <motion.div
          className="project-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            className="project-modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="modal-close"
              onClick={() => setIsModalOpen(false)}
            >
              <i className="fas fa-times"></i>
            </button>
            
            <div className="modal-content">
              <div className="modal-image">
                <img src={project.image} alt={project.title} />
              </div>
              
              <div className="modal-info">
                <h2>{project.title}</h2>
                <p className="modal-description">{project.description}</p>
                
                <div className="modal-tech">
                  <h4>Technologies utilisées :</h4>
                  <div className="tech-tags">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* GitHub stats in modal */}
                {project.stars !== undefined && (
                  <div className="modal-github-stats">
                    <h4>Statistiques GitHub :</h4>
                    <div className="github-stats">
                      <div className="stat-item">
                        <i className="fas fa-star"></i>
                        <span>{project.stars} étoiles</span>
                      </div>
                      <div className="stat-item">
                        <i className="fas fa-code-branch"></i>
                        <span>{project.forks} forks</span>
                      </div>
                      {project.lastUpdated && (
                        <div className="stat-item">
                          <i className="fas fa-calendar"></i>
                          <span>Mis à jour le {new Date(project.lastUpdated).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="modal-actions">
                  {project.github && (
                    <motion.a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal-button github"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <i className="fab fa-github"></i>
                      Code source
                    </motion.a>
                  )}
                  
                  {project.demo && (
                    <motion.a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal-button demo"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <i className="fas fa-external-link-alt"></i>
                      Démo
                    </motion.a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

export default ProjectCard
