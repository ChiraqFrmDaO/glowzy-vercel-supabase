# Supabase Setup Guide voor Glowzy.lol

Je database is nu gemigreerd van MySQL naar Supabase (PostgreSQL). Volg deze stappen om alles in te stellen.

## Stap 1: Maak een Supabase Project

1. Ga naar [supabase.com](https://supabase.com)
2. Log in met je GitHub account
3. Klik op **"New Project"**
4. Kies een organisatie (of maak een nieuwe)
5. Project naam: `glowzy-lol`
6. Database wachtwoord: kies een sterk wachtwoord
7. Regio: kies de dichtstbijzijnde regio (bijv. EU West)
8. Klik op **"Create new project"**

## Stap 2: Database Schema Importeren

Nadat het project is aangemaakt:

1. Ga naar de **SQL Editor** in je Supabase dashboard
2. Kopieer de inhoud van `database/supabase-schema.sql`
3. Plak de SQL code in de editor
4. Klik op **"Run"** om alle tabellen aan te maken

## Stap 3: Haal je Supabase Keys

In je Supabase dashboard:

1. Ga naar **Project Settings** → **API**
2. Kopieer de volgende waarden:

**Project URL:**
```
https://your-project-id.supabase.co
```

**Keys:**
- `anon` key (public)
- `service_role` key (secret - alleen server-side!)

## Stap 4: Environment Variables Configureren

Update je `.env.local` bestand:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Application Configuration
NODE_ENV=production
PORT=3001
UPLOAD_DIR=/tmp
MAX_FILE_SIZE=524288000
```

## Stap 5: Vercel Environment Variables

In je Vercel project settings:

1. Ga naar **Environment Variables**
2. Voeg alle Supabase variabelen toe:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Voeg andere variabelen toe:
   - `JWT_SECRET`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`

## Stap 6: Test de Database Connectie

Start je applicatie lokaal om te testen:

```bash
npm run dev:all
```

Check de console voor:
```
✅ Database connected
```

## Belangrijke Supabase Features

### Row Level Security (RLS)
Je database heeft RLS policies ingesteld:
- Gebruikers kunnen alleen hun eigen profiel wijzigen
- Templates zijn publiek leesbaar
- Downloads worden getracked per gebruiker

### Authentication
Supabase auth is geconfigureerd maar we gebruiken nog steeds custom JWT voor compatibiliteit met bestaande code.

### Storage
Voor file uploads kun je Supabase Storage gebruiken in plaats van lokale files.

## Database Structuur

### Hoofdtabellen:
- `users` - Gebruikersaccounts
- `profiles` - Gebruikersprofielen
- `templates` - Template uploads
- `user_badges` - Badges per gebruiker
- `user_glowzycoin` - Glowzycoins saldo
- `glowzycoin_transactions` - Transactie historie

### Relaties:
- `users` → `profiles` (1:1)
- `users` → `templates` (1:many)
- `users` → `user_badges` (1:many)

## Veelvoorkomende Problemen

### 1. Connection Error
```bash
❌ Database connection failed
```
**Oplossing:** Check je SUPABASE_URL en keys.

### 2. Permission Denied
```bash
permission denied for table users
```
**Oplossing:** Gebruik de `service_role` key, niet de `anon` key.

### 3. Row Level Security
```bash
new row violates row-level security policy
```
**Oplossing:** Gebruik de service role key die RLS omzeilt.

## Volgende Stappen

1. Deploy naar Vercel
2. Test alle API endpoints
3. Upload een test template
4. Test user registration/login
5. Verifieer Stripe webhooks

Je database is nu klaar voor productie met Supabase!
