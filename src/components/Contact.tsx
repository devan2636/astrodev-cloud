'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Mail, MapPin, Send, Github, Linkedin, MessageCircle } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { useToast } from '@/hooks/use-toast'
import { z } from 'zod'
import { supabase } from '@/integrations/supabase/client'

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email is too long'),
  message: z.string().trim().min(1, 'Message is required').max(1000, 'Message is too long'),
})

export function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({})
  const [contactData, setContactData] = useState({
    email: 'your@email.com',
    location: 'Indonesia',
    responseTime: '< 24 hours',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  })

  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('content')
          .eq('section', 'contact_info')
          .maybeSingle()

        if (error) throw error
        if (data?.content) {
          setContactData(data.content as any)
        }
      } catch (err) {
        console.error('Error loading contact info', err)
      }
    }
    loadContactInfo()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    
    const result = contactSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: { name?: string; email?: string; message?: string } = {}
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof typeof fieldErrors] = err.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: result.data.name,
          email: result.data.email,
          message: result.data.message,
        })

      if (error) throw error

      toast({
        title: 'Message Sent!',
        description: 'Thank you for reaching out. I\'ll get back to you soon.',
      })
      
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: contactData.email,
      href: `mailto:${contactData.email}`,
    },
    {
      icon: MapPin,
      label: 'Location',
      value: contactData.location,
    },
    {
      icon: MessageCircle,
      label: 'Response Time',
      value: contactData.responseTime,
    },
  ]

  const socialLinks = [
    { icon: Github, href: contactData.github, label: 'GitHub' },
    { icon: Linkedin, href: contactData.linkedin, label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:your@email.com', label: 'Email' },
  ]

  return (
    <section id="contact" className="relative py-24 bg-secondary/30 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-20 left-0 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-80 h-80 bg-accent-emerald/10 rounded-full blur-3xl" />

      <div ref={ref} className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-blue/10 border border-accent-blue/20 mb-6">
            <div className="w-2 h-2 rounded-full bg-accent-blue" />
            <span className="text-sm font-medium text-accent-blue">GET IN TOUCH</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Open for collaborations and project inquiries.
          </h2>
          <p className="text-lg text-muted-foreground">Indonesia</p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="glass-card-strong rounded-2xl p-6 hover-lift">
              <h3 className="text-xl font-semibold text-foreground mb-6">Contact</h3>
              <div className="space-y-5">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-accent-blue" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground font-medium mb-1">{item.label}</div>
                      {item.href ? (
                        <a href={item.href} className="text-sm font-semibold text-foreground hover:text-accent-blue transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <div className="text-sm font-semibold text-foreground">{item.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="glass-card-strong rounded-2xl p-6 hover-lift">
              <h3 className="text-xl font-semibold text-foreground mb-5">Connect</h3>
              <div className="flex gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-xl bg-white/80 border border-border/60 flex items-center justify-center hover:bg-accent-blue hover:text-white hover:border-accent-blue transition-all shadow-sm hover:shadow-md"
                    aria-label={link.label}
                  >
                    <link.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="glass-card-strong rounded-2xl p-8 hover-lift">
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell me about your project..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={errors.message ? 'border-destructive' : ''}
                  />
                  {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-xl bg-accent-blue hover:bg-accent-blue/90 shadow-md hover:shadow-lg transition-all"
                  disabled={loading}
                >
                  {loading ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
