# Vercel Deployment Guide

Je backend en frontend zijn nu compatibel gemaakt met Vercel! Hier is wat er is veranderd en hoe je kunt deployen.

## Wat is er veranderd?

### 1. Vercel Configuratie (`vercel.json`)
- Frontend wordt gebouwd als static site
- Backend wordt gedeployed als serverless functions
- Routes zijn correct geconfigureerd voor API calls

### 2. Backend Aanpassingen
- Server export voor Vercel serverless functions
- File uploads werken met `/tmp` directory (Vercel limitatie)
- Database connectie ondersteunt SSL voor productie
- Environment variables voor configuratie

### 3. Package.json Scripts
- `vercel-build` script toegevoegd
- Build process geoptimaliseerd voor Vercel

## Deployment Stappen

### 1. Environment Variables Instellen
Kopieer `.env.example` naar `.env.local` en vul je waarden in:

```bash
cp .env.example .env.local
```

Belangrijke variables voor Vercel:
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `DB_SSL=true` (voor externe databases)

### 2. Deployen naar Vercel
```bash
# Installeer Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Of via de Vercel Dashboard:
1. Push je code naar GitHub
2. Import repository in Vercel
3. Configureer environment variables
4. Deploy

### 3. Database Configuratie
Voor productie gebruik je een externe MySQL database:
- PlanetScale
- Railway
- AWS RDS
- DigitalOcean

Zorg dat `DB_SSL=true` is ingesteld voor secure connecties.

## Belangrijke Limitaties

### File Uploads
- Files worden tijdelijk opgeslagen in `/tmp`
- Max file size: 500MB (configureerbaar)
- Voor permanente opslag: gebruik Vercel Blob of AWS S3

### Database
- Externe database required (geen lokale MySQL)
- SSL connectie aanbevolen
- Connection pooling geconfigureerd

### Performance
- Serverless functions hebben cold starts
- Max duration: 30 seconden (configureerbaar in `vercel.json`)

## Testing
```bash
# Local development
npm run dev:all

# Build test
npm run build
npm run preview
```

## Support
Als je problemen hebt met de deployment:
1. Check Vercel logs
2. Verify environment variables
3. Test database connectie
4. Check file upload permissions
