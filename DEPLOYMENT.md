# Astrodev Cloud - Deployment Guide

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Run `npm run build` to generate production build
- [ ] Test build locally with `npm run preview`
- [ ] Verify all environment variables are set
- [ ] Database migrations applied (`npx supabase db push`)
- [ ] All git changes committed

### Deployment Steps

## Option 1: Deploy ke Server dengan SCP

### Prerequisites
- SSH access ke server
- Nginx installed dan configured
- Node.js installed di server

### Steps

1. **Build aplikasi**
```bash
npm run build
```

2. **Copy files ke server**
```bash
cd dist
scp -r . root@147.139.247.39:/var/www/astrodev/
```

3. **Configure Nginx**
```nginx
server {
    listen 80;
    server_name astrodev.cloud www.astrodev.cloud;
    
    root /var/www/astrodev;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json application/javascript;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # Serve index.html for all routes (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Block access to sensitive files
    location ~ /\. {
        deny all;
    }
}
```

4. **SSL/HTTPS (Let's Encrypt)**
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d astrodev.cloud -d www.astrodev.cloud

# Update Nginx config to use SSL
```

5. **Restart Nginx**
```bash
sudo systemctl restart nginx
sudo systemctl status nginx
```

### Server Directory Structure

```
/var/www/astrodev/
├── index.html
├── assets/
├── logo-astrodev.png
└── ... (dist files)
```

## Option 2: Deploy ke GitHub Pages (Static)

```bash
npm run build

# Push to GitHub
git add dist
git commit -m "Deploy build"
git push origin main
```

## Option 3: Deploy ke Vercel/Netlify

### Vercel

1. Connect GitHub repository ke Vercel
2. Vercel akan auto-detect Vite project
3. Configure environment variables di Vercel dashboard
4. Deploy dengan git push

### Netlify

1. Connect GitHub ke Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables
5. Deploy

## 🔄 Continuous Deployment (CI/CD)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Server

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Install Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build
      run: npm run build
    
    - name: Deploy to server
      uses: appleboy/scp-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SERVER_SSH_KEY }}
        source: "dist/*"
        target: "/var/www/astrodev"
```

## 🗄️ Database Backup

### Manual Backup

```bash
# Backup Supabase database
pg_dump postgresql://user:password@host:port/database > backup.sql

# Restore
psql postgresql://user:password@host:port/database < backup.sql
```

### Automated Backup (Optional)

Use Supabase automated backups or set up cron job:

```bash
# Cron job untuk daily backup
0 2 * * * pg_dump postgresql://user:password@host:port/database > /backups/backup_$(date +\%Y\%m\%d).sql
```

## 📊 Post-Deployment Checks

- [ ] Website accessible di domain
- [ ] HTTPS working correctly
- [ ] Admin dashboard login works
- [ ] Projects loading dari database
- [ ] Contact form submitting
- [ ] Document sharing working
- [ ] YouTube videos embedding
- [ ] Mobile responsive
- [ ] SEO meta tags present
- [ ] Performance metrics good

## 🚨 Troubleshooting

### White screen / 404 errors
```bash
# Check Nginx config
sudo nginx -t

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Database connection errors
- Verify Supabase URL dan keys di `.env`
- Check RLS policies
- Verify IP whitelist di Supabase

### Performance issues
- Enable gzip compression di Nginx
- Use CDN untuk static assets
- Monitor database query performance
- Check server CPU/memory usage

## 📈 Monitoring

### Server Health
```bash
# Check disk space
df -h

# Check memory
free -h

# Check processes
ps aux | grep node
```

### Application Monitoring
- Set up error tracking (Sentry, LogRocket)
- Monitor API response times
- Track user interactions
- Set up alerts untuk downtime

## 🔐 Security Checklist

- [ ] HTTPS enabled
- [ ] Firewall configured
- [ ] SSH keys secured
- [ ] Database credentials in secure env vars
- [ ] RLS policies enforced
- [ ] Rate limiting enabled (optional)
- [ ] Regular backups automated
- [ ] Security headers set (HSTS, CSP, etc)

## 📝 Environment Variables

Required `.env.local` variables:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxx
```

Never commit `.env` files to git!

## 🔄 Update Deployment

Untuk update aplikasi setelah changes:

```bash
# Develop & test locally
npm run dev

# Commit changes
git add .
git commit -m "Feature: Add new feature"

# Build production
npm run build

# Deploy ke server
cd dist
scp -r . root@147.139.247.39:/var/www/astrodev/

# Verify deployment
curl https://astrodev.cloud
```

---

**Last Updated**: December 31, 2025  
**Deployed To**: Server IP 147.139.247.39  
**Domain**: astrodev.cloud
