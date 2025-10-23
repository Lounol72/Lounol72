import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../contexts/LanguageContext'

// Composant About avec animations et contenu dynamique
const About = () => {
  const { language } = useLanguage()

  // Données de la section About avec support multilingue
  const aboutData = {
    fr: {
      title: "À propos de moi",
      content: [
        "Étudiant passionné en deuxième année d'informatique à l'Université du Mans. Je suis particulièrement intéressé par le développement d'applications, la programmation et les nouvelles technologies. Mon parcours académique m'a permis de développer une solide base technique que j'applique dans mes divers projets.",
        "En constante recherche d'apprentissage et d'amélioration, je m'investis dans des projets personnels et collaboratifs qui me permettent d'approfondir mes connaissances et de rester à jour avec les dernières technologies."
      ]
    },
    en: {
      title: "About me",
      content: [
        "Passionate second-year computer science student at Le Mans University. I'm particularly interested in application development, programming, and new technologies. My academic journey has allowed me to develop a solid technical foundation that I apply in my various projects.",
        "Constantly seeking learning and improvement, I invest in personal and collaborative projects that allow me to deepen my knowledge and stay up-to-date with the latest technologies."
      ]
    }
  }

  const currentData = aboutData[language]

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  return (
    <motion.section
      id="about"
      className="about"
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
        
        <motion.div 
          className="about-content"
          variants={itemVariants}
        >
          <div className="about-text">
            {currentData.content.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.2 
                }}
                className="about-paragraph"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default About
