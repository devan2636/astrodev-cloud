-- Structured site content table so sections can be edited from Supabase
create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  section text not null unique,
  content jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- Ensure policy exists without duplicate errors
do $$
begin
  if exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'site_content'
      and policyname = 'Site content readable by everyone'
  ) then
    drop policy "Site content readable by everyone" on public.site_content;
  end if;

  create policy "Site content readable by everyone"
    on public.site_content
    for select
    using (true);
end $$;

drop trigger if exists update_site_content_updated_at on public.site_content;
create trigger update_site_content_updated_at
  before update on public.site_content
  for each row
  execute function public.update_updated_at_column();

-- Seed default content matching the current UI
insert into public.site_content (section, content) values
('hero', $json$
{
  "logoInitials": "Y",
  "logoText": "YourName",
  "statusText": "Available for work",
  "headlineName": "Your Name",
  "headlineRole": "Full Stack Developer",
  "description": "Passionate developer specializing in building modern web applications, IoT solutions, and cloud-based systems. Turning ideas into elegant, functional digital experiences.",
  "navLinks": [
    { "label": "About", "href": "#about" },
    { "label": "Skills", "href": "#skills" },
    { "label": "Projects", "href": "#projects" },
    { "label": "Contact", "href": "#contact" }
  ],
  "ctaPrimary": { "label": "View Projects", "href": "#projects" },
  "ctaSecondary": { "label": "Get in Touch", "href": "#contact" },
  "socials": [
    { "label": "GitHub", "href": "https://github.com", "icon": "github" },
    { "label": "LinkedIn", "href": "https://linkedin.com", "icon": "linkedin" },
    { "label": "Email", "href": "mailto:your@email.com", "icon": "mail" }
  ],
  "featuredProject": {
    "badge": "Featured Project",
    "title": "AstrodevIoT",
    "subtitle": "Integrated Sensor Platform",
    "description": "Complete monitoring solution: Weather, Water/Air Quality, and Power Management (AC/DC) with smart Telegram Bot integration.",
    "tags": ["Weather", "Water Quality", "Power Monitor", "Telegram Bot"],
    "stats": [
      { "label": "Projects", "value": "6+", "color": "primary" },
      { "label": "Years Exp", "value": "3+", "color": "emerald" },
      { "label": "Technologies", "value": "10+", "color": "purple" }
    ]
  }
}
$json$::jsonb),
('about', $json$
{
  "heading": "Passionate About Building Digital Solutions",
  "pill": "About Me",
  "paragraphs": [
    "I'm a full-stack developer with a unique blend of expertise in web development and IoT technologies. My journey started with curiosity about how things work, which led me to explore both software and hardware domains.",
    "Today, I specialize in creating modern web applications using React, TypeScript, and cloud technologies, while also developing IoT solutions that bridge the digital and physical worlds. I believe in writing clean, maintainable code and creating user experiences that truly make a difference.",
    "When I'm not coding, you'll find me experimenting with new sensors, contributing to open-source projects, or learning about the latest in cloud and edge computing technologies."
  ],
  "highlights": [
    { "number": "3+", "label": "Years Experience", "description": "Building web apps & IoT solutions" },
    { "number": "15+", "label": "Projects Completed", "description": "From concept to deployment" },
    { "number": "10+", "label": "Technologies", "description": "Modern tech stack mastery" }
  ],
  "profile": {
    "name": "Your Name",
    "title": "Full Stack Developer & IoT Enthusiast",
    "location": "Indonesia",
    "education": "Computer Science / Engineering",
    "focus": "Web Apps, IoT, Cloud",
    "emoji": "👨‍💻"
  }
}
$json$::jsonb),
('skills', $json$
{
  "header": "Skills & Technologies",
  "subheader": "A comprehensive toolkit spanning frontend, backend, IoT, and cloud technologies",
  "categories": [
    {
      "category": "Frontend",
      "color": "accent-blue",
      "items": [
        { "name": "React", "level": 90 },
        { "name": "TypeScript", "level": 85 },
        { "name": "Next.js", "level": 80 },
        { "name": "Tailwind CSS", "level": 95 },
        { "name": "Vue.js", "level": 70 }
      ]
    },
    {
      "category": "Backend",
      "color": "accent-emerald",
      "items": [
        { "name": "Node.js", "level": 85 },
        { "name": "Python", "level": 80 },
        { "name": "Express", "level": 85 },
        { "name": "PostgreSQL", "level": 75 },
        { "name": "Supabase", "level": 90 }
      ]
    },
    {
      "category": "IoT & Hardware",
      "color": "accent-purple",
      "items": [
        { "name": "Arduino", "level": 90 },
        { "name": "ESP32", "level": 85 },
        { "name": "MQTT", "level": 80 },
        { "name": "Sensors", "level": 85 },
        { "name": "Raspberry Pi", "level": 75 }
      ]
    },
    {
      "category": "Tools & Cloud",
      "color": "accent-cyan",
      "items": [
        { "name": "Git", "level": 90 },
        { "name": "Docker", "level": 75 },
        { "name": "AWS", "level": 70 },
        { "name": "Vercel", "level": 85 },
        { "name": "Figma", "level": 70 }
      ]
    }
  ],
  "techLogos": ["React", "TypeScript", "Node.js", "Python", "PostgreSQL", "Supabase", "Tailwind", "Docker", "Git", "Arduino"]
}
$json$::jsonb),
('footer', $json$
{
  "brandName": "MOJJU",
  "description": "Revolutionizing video production with intelligent AI that understands creativity, storytelling, and human emotion.",
  "socials": [
    { "label": "X", "href": "https://x.com/Mojjuai", "icon": "x" },
    { "label": "TikTok", "href": "https://www.tiktok.com/@mojju.ai", "icon": "tiktok" },
    { "label": "Instagram", "href": "https://www.instagram.com/mojju.ai", "icon": "instagram" },
    { "label": "LinkedIn", "href": "https://linkedin.com/company/mojju", "icon": "linkedin" }
  ],
  "aiTools": [
    "Runway Gen-4",
    "Kling 2",
    "Veo 3",
    "Higgsfield AI",
    "Hailuo Minimax 2",
    "Midjourney",
    "Leonardo AI",
    "Krea AI",
    "Runway",
    "Suno AI",
    "ElevenLabs"
  ],
  "address": "2847 HIGHLAND AVE. SUITE 310 BIRMINGHAM 35205, AL, USA",
  "copyright": "© 2025 MOJJU. All rights reserved."
}
$json$::jsonb)
on conflict (section) do update set content = excluded.content, updated_at = now();
