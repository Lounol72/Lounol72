import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../contexts/LanguageContext'

// Composant Education avec timeline animée
const Education = () => {
  const { language } = useLanguage()

  // Données de l'éducation avec support multilingue
  const educationData = {
    fr: {
      title: "Parcours Académique",
      items: [
        {
          title: "Licence Informatique",
          date: "2023 - Présent",
          institution: "Université du Mans",
          description: "Spécialisation en développement d'applications. Modules: Algorithmes et structures de données, Programmation orientée objet, Bases de données, Développement web, Réseaux."
        },
        {
          title: "Baccalauréat Scientifique",
          date: "2022",
          institution: "Lycée Racan",
          description: "Option Anglais Informatique. Mention Bien."
        }
      ]
    },
    en: {
      title: "Academic Background",
      items: [
        {
          title: "Computer Science Degree",
          date: "2023 - Present",
          institution: "Le Mans University",
          description: "Specialization in application development. Modules: Algorithms and data structures, Object-oriented programming, Databases, Web development, Networks."
        },
        {
          title: "Scientific Baccalaureate",
          date: "2022",
          institution: "Racan High School",
          description: "English Computer Science option. Good mention."
        }
      ]
    }
  }

  const currentData = educationData[language]

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  return (
    <motion.section
      id="education"
      className="education"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="container">
        <motion.h2 
          className="section-title"
          variants={itemVariants}
        >
          {currentData.title}
        </motion.h2>

        <div className="timeline">
          {currentData.items.map((item, index) => (
            <motion.div
              key={index}
              className="timeline-item"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <div className="timeline-dot">
                <motion.div
                  className="dot-inner"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5,
                    delay: index * 0.2
                  }}
                />
              </div>
              
              <motion.div 
                className="timeline-content"
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
                }}
                transition={{ duration: 0.2 }}
              >
                <h3>{item.title}</h3>
                <p className="timeline-date">{item.date}</p>
                <p className="timeline-institution">{item.institution}</p>
                <p className="timeline-description">{item.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default Education
