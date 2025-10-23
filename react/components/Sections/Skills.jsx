import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../contexts/LanguageContext'
import SkillBar from '../UI/SkillBar'
import SkillTag from '../UI/SkillTag'

// Composant Skills avec barres de progression animées et filtres
const Skills = () => {
  const { language } = useLanguage()
  const [activeCategory, setActiveCategory] = useState('programming')

  // Données des compétences avec support multilingue
  const skillsData = {
    fr: {
      title: "Compétences Techniques",
      categories: {
        programming: "Langages de programmation",
        web: "Technologies Web",
        tools: "Outils & Méthodologies"
      }
    },
    en: {
      title: "Technical Skills",
      categories: {
        programming: "Programming Languages",
        web: "Web Technologies", 
        tools: "Tools & Methodologies"
      }
    }
  }

  // Données des compétences
  const skills = {
    programming: [
      { name: 'Java', level: 85, color: '#f89820' },
      { name: 'Python', level: 80, color: '#3776ab' },
      { name: 'C/C++', level: 70, color: '#00599c' },
      { name: 'JavaScript', level: 75, color: '#f7df1e' }
    ],
    web: [
      'HTML5', 'CSS3', 'React', 'Node.js', 'Vue.js', 'TypeScript'
    ],
    tools: [
      'Git', 'GitHub', 'VS Code', 'Vim', 'Cursor', 'IntelliJ', 
      'Agile/Scrum', 'Docker', 'Linux'
    ]
  }

  const currentData = skillsData[language]

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <motion.section
      id="skills"
      className="skills"
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

        {/* Filtres de catégories */}
        <motion.div 
          className="skills-filters"
          variants={itemVariants}
        >
          {Object.entries(currentData.categories).map(([key, label]) => (
            <motion.button
              key={key}
              className={`skill-filter ${activeCategory === key ? 'active' : ''}`}
              onClick={() => setActiveCategory(key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {label}
            </motion.button>
          ))}
        </motion.div>

        {/* Contenu des compétences */}
        <motion.div 
          className="skills-content"
          variants={itemVariants}
        >
          {activeCategory === 'programming' && (
            <div className="skills-category">
              <h3>{currentData.categories.programming}</h3>
              <div className="skill-bars">
                {skills.programming.map((skill, index) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    color={skill.color}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            </div>
          )}

          {activeCategory === 'web' && (
            <div className="skills-category">
              <h3>{currentData.categories.web}</h3>
              <div className="skill-tags">
                {skills.web.map((skill, index) => (
                  <SkillTag
                    key={skill}
                    name={skill}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            </div>
          )}

          {activeCategory === 'tools' && (
            <div className="skills-category">
              <h3>{currentData.categories.tools}</h3>
              <div className="skill-tags">
                {skills.tools.map((skill, index) => (
                  <SkillTag
                    key={skill}
                    name={skill}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.section>
  )
}

export default Skills
