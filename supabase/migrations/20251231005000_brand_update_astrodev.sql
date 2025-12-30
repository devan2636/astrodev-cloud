-- Update site content branding to Astrodev
update public.site_content
set content = $json$
{
  "logoInitials": "A",
  "logoText": "Astrodev",
  "logoImage": "/logo-astrodev.png",
  "statusText": "Available for work",
  "headlineName": "Astrodev",
  "headlineRole": "Full Stack Lab",
  "description": "Astrodev adalah gerbang utama untuk web dan project yang saya kerjakan—modern web apps, IoT, dan solusi cloud end-to-end.",
  "navLinks": [
    { "label": "About", "href": "#about" },
    { "label": "Projects", "href": "#projects" },
    { "label": "Contact", "href": "#contact" }
  ],
  "ctaPrimary": { "label": "View Projects", "href": "#projects" },
  "ctaSecondary": { "label": "Get in Touch", "href": "#contact" },
  "socials": [
    { "label": "GitHub", "href": "https://github.com/devan2636", "icon": "github" },
    { "label": "LinkedIn", "href": "https://www.linkedin.com/in/devandrisuherman", "icon": "linkedin" },
    { "label": "Email", "href": "mailto:devandrisuherman9@gmail.com", "icon": "mail" }
  ],
  "featuredProject"
: {
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
$json$::jsonb
where section = 'hero';

update public.site_content
set content = $json$
{
  "heading": "Astrodev Builds Digital Solutions",
  "pill": "About Astrodev",
  "paragraphs": [
    "Astrodev adalah tempat saya meracik web modern dan solusi IoT. Berawal dari rasa penasaran bagaimana hal bekerja, berlanjut ke eksplorasi software dan hardware.",
    "Saya fokus membangun aplikasi React/TypeScript, layanan cloud, dan integrasi IoT yang menjembatani dunia digital dan fisik. Prinsipnya: kode bersih, UX jelas, dan hasil yang bisa dipakai.",
    "Di luar coding, saya bereksperimen dengan sensor baru, ikut open source, dan terus belajar tren cloud dan edge computing."
  ],
  "highlights": [
    { "number": "3+", "label": "Years Experience", "description": "Building web apps & IoT solutions" },
    { "number": "15+", "label": "Projects Completed", "description": "From concept to deployment" },
    { "number": "10+", "label": "Technologies", "description": "Modern tech stack mastery" }
  ],
  "profile"
: {
    "name": "Astrodev",
    "title": "Full Stack Lab & IoT Enthusiast",
    "location": "Indonesia",
    "education": "Computer Science / Engineering",
    "focus": "Web Apps, IoT, Cloud",
    "emoji": "👨‍💻"
  }
}
$json$::jsonb
where section = 'about';

update public.site_content
set content = $json$
{
  "brandName": "Astrodev",
  "description": "Astrodev — etalase dan lab kecil untuk web, IoT, dan solusi cloud yang saya kerjakan.",
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
  "address": "Indonesia",
  "copyright": "© 2025 Astrodev. All rights reserved."
}
$json$::jsonb
where section = 'footer';
