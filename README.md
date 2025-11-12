# 🧠 PodBrain - Podcast CMS & Live Assistant

A comprehensive podcast content management system built with Next.js, Supabase, and AI assistance. Designed for podcast hosts and producers to streamline production, manage guests, track sponsors, and maximize ROI.

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

---

## 🚀 Features

### ✅ Completed Features

#### **Episode Management**
- Create, read, update, and delete episodes
- YouTube video integration with automatic thumbnail extraction
- Premium content gating (free vs. subscriber-only)
- Rich text descriptions
- Publication date tracking
- Beautiful grid layout on public pages

#### **Guest Management**
- Comprehensive guest profiles (name, bio, contact info)
- Topics of interest tracking
- Communication style categorization
- Guest appearance history
- Easy-to-use card-based interface

#### **Sponsor Management**
- Sponsor profiles with contact information
- Logo URL support with preview
- Geo-targeting by Brazilian states and regions
- Website and contact tracking
- Delete protection with confirmations

#### **Authentication & Security**
- Google OAuth integration via Supabase
- Protected admin routes
- Row-level security (RLS) policies
- Session management
- Role-based access (admin, premium, free)

#### **Admin Dashboard**
- Real-time statistics (episodes, guests, premium content)
- Quick action shortcuts
- Beautiful sidebar navigation
- User profile display
- Sign out functionality

#### **Public Pages**
- Episode listing with YouTube thumbnails
- Responsive grid layout
- Mobile-friendly design
- Click-through to YouTube videos
- Premium badge indicators

---

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework

### **Backend**
- **Next.js API Routes** - Serverless functions
- **Supabase** - PostgreSQL database
- **Supabase Auth** - Authentication & user management
- **Supabase Storage** - File storage (ready for use)

### **Deployment**
- **Vercel** - Hosting platform (recommended)
- **Supabase Cloud** - Database hosting

### **Development Tools**
- **Cursor** - AI-powered code editor
- **Claude Code** - AI coding assistant
- **Git** - Version control

---

## 📁 Project Structure

```
podbrain/
├── app/
│   ├── (public)/
│   │   └── episodes/
│   │       └── page.tsx              # Public episodes listing
│   ├── admin/
│   │   ├── layout.tsx                # Admin layout with sidebar
│   │   ├── page.tsx                  # Dashboard
│   │   ├── episodes/
│   │   │   ├── page.tsx              # Episodes list
│   │   │   ├── new/
│   │   │   │   └── page.tsx          # Create episode
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx      # Edit episode
│   │   ├── guests/
│   │   │   ├── page.tsx              # Guests list
│   │   │   ├── new/
│   │   │   │   └── page.tsx          # Create guest
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx      # Edit guest
│   │   └── sponsors/
│   │       ├── page.tsx              # Sponsors list
│   │       ├── new/
│   │       │   └── page.tsx          # Create sponsor
│   │       └── [id]/
│   │           └── edit/
│   │               └── page.tsx      # Edit sponsor
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts              # OAuth callback handler
│   └── login/
│       └── page.tsx                  # Login page
├── utils/
│   └── supabase.ts                   # Supabase client
├── public/
│   └── (static assets)
├── .env.local                        # Environment variables
├── claude.md                         # Project context for AI
├── README.md                         # This file
├── CHANGELOG.md                      # Version history
└── package.json                      # Dependencies
```

---

## 🗄️ Database Schema

### **Tables**

#### `users`
- `id` (UUID, Primary Key)
- `email` (Text, Unique)
- `full_name` (Text)
- `subscription_tier` (Text: 'free' | 'premium')
- `created_at` (Timestamp)

#### `episodes`
- `id` (UUID, Primary Key)
- `title` (Text, Required)
- `youtube_url` (Text)
- `description` (Text)
- `published_at` (Timestamp)
- `is_premium` (Boolean, Default: false)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### `guests`
- `id` (UUID, Primary Key)
- `name` (Text, Required)
- `bio` (Text)
- `email` (Text)
- `phone` (Text)
- `topics_of_interest` (Text Array)
- `communication_style` (Text)
- `created_at` (Timestamp)

#### `episode_guests` (Join Table)
- `episode_id` (UUID, Foreign Key → episodes)
- `guest_id` (UUID, Foreign Key → guests)
- `appearance_number` (Integer)
- Primary Key: (episode_id, guest_id)

#### `sponsors`
- `id` (UUID, Primary Key)
- `name` (Text, Required)
- `website` (Text)
- `logo_url` (Text)
- `contact_email` (Text)
- `contact_phone` (Text)
- `geo_targeting` (Text Array)
- `created_at` (Timestamp)

#### `episode_sponsors` (Join Table)
- `id` (UUID, Primary Key)
- `episode_id` (UUID, Foreign Key → episodes)
- `sponsor_id` (UUID, Foreign Key → sponsors)
- `placement_type` (Text)
- `timestamp_start` (Integer)
- `timestamp_end` (Integer)
- `clicks` (Integer, Default: 0)
- `impressions` (Integer, Default: 0)
- `created_at` (Timestamp)

---

## 🚀 Getting Started

### **Prerequisites**

- Node.js 18+ installed
- Git installed
- Supabase account
- Google Cloud Console account (for OAuth)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd podbrain
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up Supabase database**
   
   - Go to your Supabase project
   - Navigate to SQL Editor
   - Run the SQL scripts in the `/sql` folder (or from CHANGELOG.md)

5. **Configure Google OAuth**
   
   - Go to Google Cloud Console
   - Create OAuth 2.0 credentials
   - Add redirect URI: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
   - Copy Client ID and Secret to Supabase → Authentication → Providers → Google

6. **Run development server**
   ```bash
   npm run dev
   ```

7. **Open browser**
   
   Navigate to `http://localhost:3000`

---

## 🔐 Authentication

### **Admin Access**

1. Navigate to `/login`
2. Click "Sign in with Google"
3. Authenticate with your Google account
4. You'll be redirected to the admin dashboard

### **Setting Up First Admin**

By default, any authenticated user has admin access. To restrict this:

1. Add a `role` column to the `users` table
2. Update authentication logic in `app/admin/layout.tsx`
3. Check user role before granting admin access

---

## 📝 Usage Guide

### **Creating an Episode**

1. Log in to admin panel
2. Navigate to **Episodes** → **New Episode**
3. Fill in:
   - Title (required)
   - YouTube URL
   - Description
   - Premium toggle
4. Click **Create Episode**

### **Managing Guests**

1. Navigate to **Guests** → **New Guest**
2. Add guest information:
   - Name, email, phone
   - Bio
   - Topics (comma-separated)
   - Communication style
3. Click **Add Guest**

### **Managing Sponsors**

1. Navigate to **Sponsors** → **New Sponsor**
2. Fill in sponsor details:
   - Name, website, logo URL
   - Contact information
   - Select geo-targeting regions
3. Click **Add Sponsor**

---

## 🎨 Customization

### **Changing Colors**

Edit `tailwind.config.js` to customize the color scheme:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
      },
    },
  },
}
```

### **Modifying Navigation**

Edit `app/admin/layout.tsx` to add/remove sidebar items.

### **Adding Fields**

1. Update database schema in Supabase
2. Modify the corresponding form component
3. Update TypeScript types

---

## 🚀 Deployment

### **Deploy to Vercel (Recommended)**

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy!

3. **Update OAuth Redirect**
   - Add production URL to Google OAuth settings
   - Update Supabase redirect URLs

### **Environment Variables for Production**

```bash
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## 🧪 Testing

### **Manual Testing Checklist**

- [ ] Can log in with Google
- [ ] Can create/edit/delete episodes
- [ ] Can create/edit/delete guests
- [ ] Can create/edit/delete sponsors
- [ ] YouTube thumbnails load correctly
- [ ] Public episodes page works
- [ ] Mobile responsive on all pages
- [ ] Sign out works correctly

### **Testing on Mobile**

1. Run `npm run dev`
2. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. On your phone, navigate to `http://YOUR_IP:3000`

---

## 🐛 Troubleshooting

### **"Cannot read property of undefined" errors**

- Check that all database tables are created
- Verify environment variables are set correctly
- Ensure Supabase URL and keys are correct

### **Authentication not working**

- Verify Google OAuth credentials
- Check redirect URI matches exactly
- Ensure cookies are enabled in browser

### **Images not loading**

- Check YouTube URLs are valid
- Verify CORS settings if using custom images
- Test URLs in browser directly

### **Database errors**

- Check Row Level Security (RLS) policies
- Verify foreign key relationships
- Test queries in Supabase SQL Editor

---

## 📚 Resources

### **Documentation**
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

### **Learning**
- [Next.js Learn Course](https://nextjs.org/learn)
- [Supabase Tutorials](https://supabase.com/docs/guides/getting-started/tutorials)

### **Community**
- [Next.js Discord](https://nextjs.org/discord)
- [Supabase Discord](https://discord.supabase.com)

---

## 🗺️ Roadmap

### **Phase 2: Advanced Features** (Planned)

- [ ] Link guests to episodes (episode-guest relationships)
- [ ] Link sponsors to episodes (sponsor placements)
- [ ] AI content generation (episode intros, summaries)
- [ ] YouTube Analytics integration
- [ ] Spotify integration
- [ ] Advanced guest CRM fields
- [ ] Sponsor performance analytics
- [ ] Geolocation-based ad serving

### **Phase 3: Monetization** (Future)

- [ ] Stripe payment integration
- [ ] Subscription tiers (Free/Premium)
- [ ] Premium content access control
- [ ] User favorites and collections
- [ ] Download functionality
- [ ] Personal notes on episodes

### **Phase 4: Growth** (Future)

- [ ] SEO optimization
- [ ] Social sharing
- [ ] Email capture
- [ ] Episode search and filtering
- [ ] RSS feed generation
- [ ] Clip player with highlights

---

## 🤝 Contributing

This is a personal project, but if you want to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

## 👤 Author

**Your Name**
- Built with AI assistance (Cursor + Claude Code)
- Started: November 2025

---

## 🙏 Acknowledgments

- Built with guidance from Claude (Anthropic)
- Developed using Cursor IDE
- UI inspired by modern SaaS designs
- Brazilian regions list for geo-targeting

---

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review the CHANGELOG.md for recent changes
3. Consult the documentation links
4. Ask Claude Code for help!

---

## 🎉 Quick Stats

- **Lines of Code**: ~2,000+
- **Development Time**: 1 day
- **Technologies Used**: 8+
- **Database Tables**: 6
- **Admin Pages**: 10+
- **CRUD Systems**: 3 (Episodes, Guests, Sponsors)

---

**Built with ❤️ and AI assistance**

Last Updated: November 2025