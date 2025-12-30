'use client'

import { motion } from 'framer-motion'
import { Menu, X, Github, Linkedin, Mail, ChevronDown, FileText } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { useSectionContent } from '@/hooks/use-section-content'

type HeroContent = {
  logoInitials: string
  logoText: string
  logoImage?: string
  statusText: string
  headlineName: string
  headlineRole: string
  description: string
  navLinks: { label: string; href: string }[]
  ctaPrimary: { label: string; href: string }
  ctaSecondary: { label: string; href: string }
  socials: { label: string; href: string; icon?: 'github' | 'linkedin' | 'mail' }[]
  featuredProject: {
    badge: string
    title: string
    subtitle: string
    description: string
    tags: string[]
    stats: { label: string; value: string; color?: 'primary' | 'emerald' | 'purple' }[]
  }
}

const defaultHeroContent: HeroContent = {
  logoInitials: 'A',
  logoText: 'Astrodev',
  logoImage: '/logo-astrodev.png',
  statusText: 'Available for work',
  headlineName: 'Astrodev',
  headlineRole: 'Full Stack Lab',
  description: 'Astrodev adalah gerbang utama untuk web dan project yang saya kerjakan—modern web apps, IoT, dan solusi cloud end-to-end.',
  navLinks: [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ],
  ctaPrimary: { label: 'View Projects', href: '#projects' },
  ctaSecondary: { label: 'Get in Touch', href: '#contact' },
  socials: [
    { label: 'GitHub', href: 'https://github.com/devan2636', icon: 'github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/devandrisuherman', icon: 'linkedin' },
    { label: 'Email', href: 'mailto:devandrisuherman9@gmail.com', icon: 'mail' },
  ],
  featuredProject: {
    badge: 'Featured Project',
    title: 'AstrodevIoT',
    subtitle: 'Integrated Sensor Platform',
    description: 'Complete monitoring solution: Weather, Water/Air Quality, and Power Management (AC/DC) with smart Telegram Bot integration.',
    tags: ['Weather', 'Water Quality', 'Power Monitor', 'Telegram Bot'],
    stats: [
      { label: 'Projects', value: '6+', color: 'primary' },
      { label: 'Years Exp', value: '3+', color: 'emerald' },
      { label: 'Technologies', value: '10+', color: 'purple' },
    ],
  },
}

const socialIconMap = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
}

export function Hero() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const content = useSectionContent<HeroContent>('hero', defaultHeroContent)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isMobileMenuOpen])

  const navLinks = content.navLinks?.length ? content.navLinks : defaultHeroContent.navLinks

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Grid Background Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-60" />
      
      {/* Animated Gradient Blobs */}
      <div className="absolute top-20 -left-32 w-96 h-96 bg-accent-blue/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute top-40 right-0 w-80 h-80 bg-accent-purple/15 rounded-full blur-3xl animate-blob-delay" />
      <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-accent-cyan/10 rounded-full blur-3xl animate-blob" />

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 w-full z-50"
      >
        <div className={`w-full px-6 sm:px-8 lg:px-12 py-4 transition-all duration-300 ${
          isScrolled ? 'glass-navbar shadow-sm' : 'bg-transparent'
        }`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <motion.a
              href="#hero"
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center overflow-hidden">
                {content.logoImage ? (
                  <img src={content.logoImage} alt={content.logoText} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-primary-foreground font-bold text-lg">{content.logoInitials}</span>
                )}
              </div>
              <span className="font-bold text-xl text-foreground">{content.logoText}</span>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA & Mobile Menu */}
            <div className="flex items-center gap-3">
              <Button
                asChild
                variant="outline"
                className="hidden sm:inline-flex rounded-full px-6"
              >
                <a href="/share">
                  <FileText className="w-4 h-4 mr-2" />
                  Share
                </a>
              </Button>
              <Button
                asChild
                className="hidden sm:inline-flex bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6"
              >
                <a href="/adminastrodev">Login</a>
              </Button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-0 right-0 h-full w-72 glass-card-strong z-50 md:hidden p-6 pt-20"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-foreground font-medium py-3 px-4 rounded-lg hover:bg-secondary transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 mt-4">
                <Button asChild variant="outline" className="rounded-full">
                  <a href="/share" onClick={() => setIsMobileMenuOpen(false)}>
                    <FileText className="w-4 h-4 mr-2" />
                    Share
                  </a>
                </Button>
                <Button asChild className="rounded-full">
                  <a href="/adminastrodev" onClick={() => setIsMobileMenuOpen(false)}>Login</a>
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-12 pt-32 pb-20 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-xl"
          >
            {/* Status Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 mb-6"
            >
              <div className="w-2 h-2 rounded-full bg-accent-emerald status-online" />
              <span className="text-sm font-medium text-accent-emerald">{content.statusText}</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
              Hi, I'm{' '}
              <span className="text-primary">{content.headlineName}</span>
              <br />
              <span className="text-muted-foreground">{content.headlineRole}</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {content.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-10">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8"
              >
                <a href={content.ctaPrimary.href}>{content.ctaPrimary.label}</a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8"
              >
                <a href={content.ctaSecondary.href}>{content.ctaSecondary.label}</a>
              </Button>
            </div>
          </motion.div>

          {/* Right: Featured Project Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative"
          >
            <div className="glass-card-strong rounded-3xl p-8 hover-lift">
              {/* Card Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-lg bg-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{content.featuredProject.badge}</h3>
                  <p className="text-sm text-muted-foreground">{content.featuredProject.subtitle}</p>
                </div>
              </div>

              {/* Project Preview */}
              <div className="relative rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-primary/5 to-accent-purple/5 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">IoT</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-lg">{content.featuredProject.title}</h4>
                    <p className="text-sm text-muted-foreground">{content.featuredProject.subtitle}</p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  {content.featuredProject.description}
                </p>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-2">
                  {(content.featuredProject.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-secondary text-xs font-medium text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {(content.featuredProject.stats || []).map((stat) => (
                  <div key={stat.label} className="text-center p-3 rounded-xl bg-secondary/50">
                    <div className={`text-2xl font-bold ${
                      stat.color === 'emerald' ? 'text-accent-emerald' :
                      stat.color === 'purple' ? 'text-accent-purple' :
                      'text-primary'
                    }`}>{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent-purple/10 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a href="#about" className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <span className="text-sm">Scroll to explore</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </a>
      </motion.div>
    </div>
  )
}
