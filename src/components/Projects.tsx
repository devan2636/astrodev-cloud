'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExternalLink, Github, ChevronRight, Loader2, LogIn, LogOut, Trash2, Save, BookOpen, PlusCircle } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { supabase } from '@/integrations/supabase/client'
import type { Session } from '@supabase/supabase-js'

interface Project {
  id: string
  title: string
  description: string
  content?: string | null
  category: string
  tags: string[]
  image_url?: string
  demo_url?: string
  github_url?: string
  youtube_url?: string
  featured?: boolean
  owner_id?: string | null
}

// Fallback projects for when database is empty
const fallbackProjects: Project[] = [
  {
    id: '1',
    title: 'AstrodevIoT Platform',
    description: 'Integrated IoT monitoring platform for weather, water/air quality, and power management with Telegram bot integration.',
    category: 'IoT',
    tags: ['React', 'Supabase', 'ESP32', 'MQTT', 'Telegram Bot'],
    demo_url: 'https://iot.astrodev.cloud',
    featured: true,
  },
  {
    id: '2',
    title: 'E-Commerce Dashboard',
    description: 'Full-featured admin dashboard for e-commerce with real-time analytics, inventory management, and order tracking.',
    category: 'Web App',
    tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Recharts'],
    demo_url: '#',
    github_url: '#',
  },
  {
    id: '3',
    title: 'Smart Home Controller',
    description: 'Mobile-responsive web app to control smart home devices with voice commands and automation rules.',
    category: 'IoT',
    tags: ['React', 'Node.js', 'WebSocket', 'Arduino'],
    github_url: '#',
  },
  {
    id: '4',
    title: 'Weather Station API',
    description: 'RESTful API for weather data collection and analysis with historical data and predictions.',
    category: 'API',
    tags: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
    github_url: '#',
  },
]

interface ProjectsProps {
  showAuthControls?: boolean
  enableAdminPanel?: boolean
}

export function Projects({ showAuthControls = false, enableAdminPanel = false }: ProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<string[]>(['All'])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [authMessage, setAuthMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)
  const [formMessage, setFormMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    tags: '',
    image_url: '',
    demo_url: '',
    github_url: '',
    youtube_url: '',
    featured: false,
  })
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('display_order', { ascending: true })

        if (error) throw error

        if (data && data.length > 0) {
          setProjects(data)
          const uniqueCategories = ['All', ...new Set(data.map(p => p.category))]
          setCategories(uniqueCategories)
        } else {
          // Use fallback data when database is empty
          setProjects(fallbackProjects)
          const uniqueCategories = ['All', ...new Set(fallbackProjects.map(p => p.category))]
          setCategories(uniqueCategories)
        }
      } catch (error) {
        // Use fallback data on error
        setProjects(fallbackProjects)
        const uniqueCategories = ['All', ...new Set(fallbackProjects.map(p => p.category))]
        setCategories(uniqueCategories)
      } finally {
        setLoading(false)
      }
    }

    async function initAuth() {
      if (!enableAdminPanel) return () => {};

      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      if (data.session) {
        await ensureProfile(data.session)
        await loadProfile(data.session)
      }

      const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
        setSession(newSession)
        if (newSession) {
          await ensureProfile(newSession)
          await loadProfile(newSession)
        } else {
          setIsAdmin(false)
        }
      })

      return () => {
        listener.subscription.unsubscribe()
      }
    }

    fetchProjects()
    let unsub: (() => void) | undefined
    const init = async () => {
      unsub = await initAuth()
    }
    init()
    return () => {
      if (unsub) unsub()
    }
  }, [enableAdminPanel])

  const ensureProfile = async (session: Session) => {
    await supabase.from('profiles').upsert({
      id: session.user.id,
      email: session.user.email,
    })
  }

  const loadProfile = async (session: Session) => {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .maybeSingle()

    setIsAdmin((data?.role || 'user') === 'admin')
  }

  const handleAuth = async (type: 'signin' | 'signup') => {
    setAuthLoading(true)
    setAuthMessage(null)
    try {
      const fn = type === 'signin' ? supabase.auth.signInWithPassword : supabase.auth.signUp
      const { error, data } = await fn({
        email: authForm.email,
        password: authForm.password,
      })
      if (error) throw error
      if (data?.session) {
        await ensureProfile(data.session)
        await loadProfile(data.session)
        setAuthMessage({ type: 'success', text: type === 'signin' ? 'Signed in.' : 'Account created and signed in.' })
      } else if (type === 'signup') {
        setAuthMessage({ type: 'success', text: 'Account created. Check email if confirmations are required.' })
      }
    } catch (err) {
      console.error('Auth error', err)
      setAuthMessage({ type: 'error', text: (err as any)?.message || 'Authentication failed' })
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setIsAdmin(false)
  }

  const handleEditClick = (project: Project) => {
    setEditProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      content: project.content || '',
      category: project.category,
      tags: project.tags?.join(', ') || '',
      image_url: project.image_url || '',
      demo_url: project.demo_url || '',
      github_url: project.github_url || '',
      youtube_url: project.youtube_url || '',
      featured: Boolean(project.featured),
    })
  }

  const resetForm = () => {
    setEditProject(null)
    setShowAddForm(false)
    setFormData({
      title: '',
      description: '',
      content: '',
      category: '',
      tags: '',
      image_url: '',
      demo_url: '',
      github_url: '',
      youtube_url: '',
      featured: false,
    })
  }

  const handleAddNewClick = () => {
    resetForm()
    setShowAddForm(true)
  }

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormMessage(null)
    if (!session || !isAdmin) {
      setFormMessage({ type: 'error', text: 'You must be signed in as admin to save projects.' })
      return
    }
    setSaving(true)
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        content: formData.content || null,
        category: formData.category,
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        image_url: formData.image_url || null,
        demo_url: formData.demo_url || null,
        github_url: formData.github_url || null,
        youtube_url: formData.youtube_url || null,
        featured: formData.featured,
        owner_id: session.user.id,
      }

      if (editProject) {
        const { error } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', editProject.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('projects')
          .insert(payload)
        if (error) throw error
      }

      await refreshProjects()
      resetForm()
      setFormMessage({ type: 'success', text: 'Project saved.' })
    } catch (err) {
      console.error('Save project error', err)
      setFormMessage({ type: 'error', text: err?.message || 'Failed to save project' })
    } finally {
      setSaving(false)
    }
  }

  const refreshProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true })
    if (data) {
      setProjects(data)
      const uniqueCategories = ['All', ...new Set(data.map(p => p.category))]
      setCategories(uniqueCategories)
    }
  }

  const handleDelete = async (projectId: string) => {
    if (!session || !isAdmin) return
    setSaving(true)
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
      if (error) throw error
      await refreshProjects()
    } catch (err) {
      console.error('Delete project error', err)
    } finally {
      setSaving(false)
    }
  }

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory)

  return (
    <section id="projects" className="relative py-24 bg-secondary/30 overflow-hidden">
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
            <span className="text-sm font-medium text-accent-blue">Portfolio</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Featured Projects
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A collection of projects showcasing my skills in web development, IoT, and cloud technologies
          </p>
        </motion.div>

        {/* Admin Panel (optional) */}
        {enableAdminPanel && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="glass-card rounded-2xl p-4 mb-10"
          >
            {formMessage && (
              <div
                className={`mb-3 rounded-lg border px-3 py-2 text-sm ${
                  formMessage.type === 'error'
                    ? 'border-destructive/40 bg-destructive/10 text-destructive'
                    : 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'
                }`}
              >
                {formMessage.text}
              </div>
            )}
            
            {enableAdminPanel && session && isAdmin && !showAddForm && !editProject && (
              <div className="flex justify-end">
                <Button onClick={handleAddNewClick} className="bg-accent-blue hover:bg-accent-blue/90">
                  <PlusCircle className="w-4 h-4 mr-2" /> Add New Project
                </Button>
              </div>
            )}

            {enableAdminPanel && session && isAdmin && (showAddForm || editProject) && (
              <form onSubmit={handleSaveProject} className="mt-4 grid gap-3 md:grid-cols-2">
                <Input
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <Input
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
                <Textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="md:col-span-2"
                  required
                />                <Textarea
                  placeholder="Content (detailed blog-like description, optional)"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="md:col-span-2 min-h-[200px]"
                />                <Input
                  placeholder="Tags (comma separated)"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="md:col-span-2"
                />
                <Input
                  placeholder="Demo URL"
                  value={formData.demo_url}
                  onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                />
                <Input
                  placeholder="GitHub URL"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                />
                <Input
                  placeholder="YouTube URL"
                  value={formData.youtube_url}
                  onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                />
                <Input
                  placeholder="Image URL"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="md:col-span-2"
                />
                <div className="flex items-center gap-3 md:col-span-2">
                  <label className="text-sm text-muted-foreground flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                    Featured
                  </label>
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" disabled={saving}>
                      <Save className="w-4 h-4 mr-2" /> {editProject ? 'Update' : 'Add'} Project
                    </Button>
                    {editProject && (
                      <Button type="button" variant="ghost" size="sm" onClick={resetForm}>
                        Cancel
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </motion.div>
        )}

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {authMessage && (
            <div
              className={`mb-3 rounded-lg border px-3 py-2 text-sm ${
                authMessage.type === 'error'
                  ? 'border-destructive/40 bg-destructive/10 text-destructive'
                  : 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'
              }`}
            >
              {authMessage.text}
            </div>
          )}
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-card text-foreground hover:bg-secondary border border-border'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`glass-card-strong rounded-2xl overflow-hidden hover-lift ${
                  project.featured ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                {/* Project Image */}
                <div className="h-48 bg-gradient-to-br from-primary/10 via-accent-purple/5 to-accent-cyan/10 flex items-center justify-center relative overflow-hidden">
                  {project.featured && (
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium z-10">
                      Featured
                    </div>
                  )}
                  {project.image_url ? (
                    <img 
                      src={project.image_url} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-5xl font-bold text-primary/20">{project.title.charAt(0)}</div>
                  )}
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 rounded-md bg-secondary text-xs font-medium text-muted-foreground">
                      {project.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-full bg-secondary/80 text-xs text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags && project.tags.length > 3 && (
                      <span className="px-2 py-1 rounded-full bg-secondary/80 text-xs text-muted-foreground">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 items-center flex-wrap">
                    {project.content && (
                      <button
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                      >
                        <BookOpen className="w-4 h-4" />
                        Read More
                      </button>
                    )}
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                      >
                        <Github className="w-4 h-4" />
                        Code
                      </a>
                    )}
                    {session && isAdmin && (
                      <div className="flex gap-2 ml-auto">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(project)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(project.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* View More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >

        </motion.div>
      </div>
    </section>
  )
}
