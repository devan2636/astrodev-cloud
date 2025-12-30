'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useSectionContent } from '@/hooks/use-section-content'

type AboutContent = {
  heading: string
  pill: string
  paragraphs: string[]
  highlights: { number: string; label: string; description?: string }[]
  profile: {
    name: string
    title: string
    location: string
    education: string
    focus: string
    emoji: string
  }
}

const defaultAboutContent: AboutContent = {
  heading: 'Astrodev Builds Digital Solutions',
  pill: 'About Astrodev',
  paragraphs: [
    'Astrodev adalah tempat saya meracik web modern dan solusi IoT. Berawal dari rasa penasaran bagaimana hal bekerja, berlanjut ke eksplorasi software dan hardware.',
    'Saya fokus membangun aplikasi React/TypeScript, layanan cloud, dan integrasi IoT yang menjembatani dunia digital dan fisik. Prinsipnya: kode bersih, UX jelas, dan hasil yang bisa dipakai.',
    'Di luar coding, saya bereksperimen dengan sensor baru, ikut open source, dan terus belajar tren cloud dan edge computing.',
  ],
  highlights: [
    { number: '3+', label: 'Years Experience', description: 'Building web apps & IoT solutions' },
    { number: '15+', label: 'Projects Completed', description: 'From concept to deployment' },
    { number: '10+', label: 'Technologies', description: 'Modern tech stack mastery' },
  ],
  profile: {
    name: 'Astrodev',
    title: 'Full Stack Lab & IoT Enthusiast',
    location: 'Indonesia',
    education: 'Computer Science / Engineering',
    focus: 'Web Apps, IoT, Cloud',
    emoji: '👨‍💻',
  },
}

export function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const content = useSectionContent<AboutContent>('about', defaultAboutContent)

  return (
    <section id="about" className="relative py-24 bg-background overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-purple/10 rounded-full blur-3xl" />

      <div ref={ref} className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: About Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-purple/10 border border-accent-purple/20 mb-6">
              <div className="w-2 h-2 rounded-full bg-accent-purple" />
              <span className="text-sm font-medium text-accent-purple">{content.pill}</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              {content.heading}
            </h2>

            <div className="space-y-4 text-muted-foreground">
              {(content.paragraphs || defaultAboutContent.paragraphs).map((text, idx) => (
                <p key={idx}>{text}</p>
              ))}
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {(content.highlights || defaultAboutContent.highlights).map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="text-center p-4 rounded-xl bg-card border border-border"
                >
                  <div className="text-3xl font-bold text-primary mb-1">{item.number}</div>
                  <div className="text-sm font-medium text-foreground">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-card-strong rounded-3xl p-8">
              {/* Profile Photo Placeholder */}
              <div className="w-48 h-48 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent-purple/20 flex items-center justify-center">
                <div className="text-6xl">{content.profile?.emoji}</div>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">{content.profile?.name}</h3>
                <p className="text-muted-foreground">{content.profile?.title}</p>
              </div>

              {/* Info Cards */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                  <div className="w-10 h-10 rounded-lg bg-accent-blue/10 flex items-center justify-center">
                    <span className="text-accent-blue">📍</span>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Location</div>
                    <div className="text-sm font-medium text-foreground">{content.profile?.location}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                  <div className="w-10 h-10 rounded-lg bg-accent-emerald/10 flex items-center justify-center">
                    <span className="text-accent-emerald">🎓</span>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Education</div>
                    <div className="text-sm font-medium text-foreground">{content.profile?.education}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                  <div className="w-10 h-10 rounded-lg bg-accent-purple/10 flex items-center justify-center">
                    <span className="text-accent-purple">💼</span>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Focus</div>
                    <div className="text-sm font-medium text-foreground">{content.profile?.focus}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent-blue/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent-purple/10 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
