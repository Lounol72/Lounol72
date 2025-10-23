import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../contexts/LanguageContext'

// Composant Contact avec formulaire interactif
const Contact = () => {
  const { language } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  // Données de contact avec support multilingue
  const contactData = {
    fr: {
      title: "Contact",
      info: {
        email: "email@example.com",
        phone: "+33 x xx xx xx xx"
      },
      form: {
        name: "Nom",
        email: "Email",
        message: "Votre message",
        submit: "Envoyer",
        submitting: "Envoi en cours...",
        success: "Message envoyé avec succès !",
        error: "Erreur lors de l'envoi du message."
      },
      social: {
        linkedin: "LinkedIn",
        twitter: "Twitter",
        instagram: "Instagram"
      }
    },
    en: {
      title: "Contact",
      info: {
        email: "email@example.com",
        phone: "+33 x xx xx xx xx"
      },
      form: {
        name: "Name",
        email: "Email",
        message: "Your message",
        submit: "Send",
        submitting: "Sending...",
        success: "Message sent successfully!",
        error: "Error sending message."
      },
      social: {
        linkedin: "LinkedIn",
        twitter: "Twitter",
        instagram: "Instagram"
      }
    }
  }

  const currentData = contactData[language]

  // Gestion des changements de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulation d'envoi (à remplacer par une vraie API)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

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
      transition: { duration: 0.5 }
    }
  }

  return (
    <motion.section
      id="contact"
      className="contact"
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

        <div className="contact-content">
          {/* Informations de contact */}
          <motion.div 
            className="contact-info"
            variants={itemVariants}
          >
            <motion.div 
              className="contact-item"
              whileHover={{ scale: 1.05 }}
            >
              <i className="fas fa-envelope"></i>
              <span>{currentData.info.email}</span>
            </motion.div>
            
            <motion.div 
              className="contact-item"
              whileHover={{ scale: 1.05 }}
            >
              <i className="fas fa-phone"></i>
              <span>{currentData.info.phone}</span>
            </motion.div>

            <div className="social-links">
              <motion.a 
                href="#"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                aria-label={currentData.social.linkedin}
              >
                <i className="fab fa-linkedin"></i>
              </motion.a>
              
              <motion.a 
                href="#"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                aria-label={currentData.social.twitter}
              >
                <i className="fab fa-twitter"></i>
              </motion.a>
              
              <motion.a 
                href="#"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                aria-label={currentData.social.instagram}
              >
                <i className="fab fa-instagram"></i>
              </motion.a>
            </div>
          </motion.div>

          {/* Formulaire de contact */}
          <motion.form 
            className="contact-form"
            onSubmit={handleSubmit}
            variants={itemVariants}
          >
            <motion.input
              type="text"
              name="name"
              placeholder={currentData.form.name}
              value={formData.name}
              onChange={handleInputChange}
              required
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
            
            <motion.input
              type="email"
              name="email"
              placeholder={currentData.form.email}
              value={formData.email}
              onChange={handleInputChange}
              required
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
            
            <motion.textarea
              name="message"
              placeholder={currentData.form.message}
              value={formData.message}
              onChange={handleInputChange}
              required
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />

            {submitStatus && (
              <motion.div 
                className={`submit-status ${submitStatus}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {submitStatus === 'success' ? currentData.form.success : currentData.form.error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="submit-button"
            >
              {isSubmitting ? currentData.form.submitting : currentData.form.submit}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </motion.section>
  )
}

export default Contact
