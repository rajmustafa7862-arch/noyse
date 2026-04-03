@AGENTS.md

# NOYSE — Project Brief for Claude Code

## What is NOYSE?
NOYSE (News Without Clutter) is a modern, human-curated news platform website. A human admin manually writes and publishes news articles and blogs through an admin CMS panel. Published articles automatically appear on the frontend website for visitors to read.

## Tech Stack — Use Exactly This, Nothing Else
- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS — blue and black color scheme
- **Animations:** GSAP + Anime.js for subtle entrance and scroll animations, Three.js for hero section only
- **CMS:** Payload CMS 3.0 (installed inside Next.js — no separate server)
- **Database:** Supabase (PostgreSQL — free tier)
- **Image Hosting:** Cloudinary (free tier)
- **Email/Newsletter:** Resend (free tier — 3000 emails/month)
- **Analytics:** Umami (free, privacy-first)
- **SEO:** next-seo library + Schema.org NewsArticle JSON-LD
- **Deployment:** Vercel (free tier)

## Design Rules — Follow Strictly
- Primary colors: Deep Blue (#0A1628) and Black (#000000)
- Accent color: Electric Blue (#2563EB)
- Text: White (#FFFFFF) and Light Gray (#94A3B8) on dark backgrounds
- Font: Inter (Google Fonts)
- Style: Modern, minimal, editorial — like The Verge meets a dark-mode news app
- Animations: Subtle only. Entrance animations on page load, scroll-triggered reveals on cards, smooth hover effects. NO excessive or distracting animations.
- GSAP for scroll animations and timeline sequences
- Anime.js for card hover effects and micro-interactions
- Three.js ONLY on the Home page hero section — a subtle animated particle background or floating 3D shapes
- Every page must be fully responsive — mobile, tablet, desktop
- Dark mode is the DEFAULT and primary design

## Website Pages — Build All 5

### Page 1: Home (/)
- Sticky navigation bar with NOYSE logo, links to all 5 pages, and a Subscribe button
- Hero section with Three.js animated background, big headline "News Without Clutter", subheadline, and CTA button
- Breaking News ticker/marquee strip below hero
- Featured Articles section — top 3 latest published blogs displayed as large cards
- Latest News grid — next 6 articles in a responsive card grid
- Categories section — visual cards for each news category
- Social Media section — embedded latest Instagram Reels, YouTube Shorts, X posts (using official embed codes)
- Newsletter signup section — email input connected to Resend
- Footer with logo, links, social icons, copyright

### Page 2: About Us (/about)
- Hero section with NOYSE mission statement
- "Who We Are" section with team description
- "What We Do" section explaining the curation philosophy
- "Why NOYSE" section with key differentiators shown as feature cards
- Newsletter signup section
- Footer

### Page 3: Our Blogs (/blogs)
- Page header with title and search bar
- Category filter tabs (All, Politics, Tech, Sports, Entertainment, World, etc.)
- Responsive article card grid — shows all published blogs
- Each card shows: featured image, category badge, title, excerpt, read time, date, read more button
- Pagination at the bottom
- Footer

### Page 4: Categories (/categories)
- Visual grid of all categories — each as a large clickable card with icon and article count
- Clicking a category filters and shows all articles in that category
- Footer

### Page 5: Contact (/contact)
- Contact form with: Name, Email, Subject, Message fields
- Form submissions stored in Supabase
- Social media links
- Footer

## Admin CMS Panel — Payload CMS
- Admin login at /admin — email and password protected
- Admin can: Create new blog post, Edit existing post, Delete post, Publish or unpublish post
- Blog post fields:
  - Title (text)
  - Slug (auto-generated from title)
  - Featured Image (upload via Cloudinary)
  - Category (dropdown: Politics, Tech, Sports, Entertainment, World, Business, Lifestyle)
  - Content (rich text editor — like Google Docs experience)
  - Excerpt (short summary — max 160 characters)
  - Read Time (auto-calculated from content length)
  - Published Date (auto-set on publish)
  - Status (Draft or Published)
  - SEO Title (text — for meta tag)
  - SEO Description (text — for meta description)
- Affiliate Product section on each blog post (optional — admin can add or leave empty):
  - Product Name (text)
  - Product Image (upload)
  - Product Description (short text)
  - Affiliate Link (URL)
  - If filled in — shows as a styled product recommendation card on the single blog page

## Single Blog Post Page (/blogs/[slug])
- Full article with featured image, title, category badge, date, read time
- Rich text content rendered beautifully
- If affiliate product is added by admin — show a styled "Recommended Product" card below the article content
- Related articles section at the bottom (same category)
- Social share buttons (Twitter/X, WhatsApp, Copy Link)
- Newsletter signup at the bottom

## SEO Requirements
- Every page has unique meta title and description
- All blog posts use Schema.org NewsArticle JSON-LD structured data
- Auto-generated sitemap.xml
- robots.txt configured correctly
- Open Graph images for all pages (for WhatsApp and social sharing previews)
- Page load speed optimized — use Next.js Image component for all images

## Modern News Platform Features to Include
- Dark mode as default (no toggle needed)
- Breaking news ticker on homepage
- Reading time estimate on all articles
- Related articles on single blog page
- Social share buttons on single blog page
- Category badges on all article cards
- Search functionality on blogs page
- Newsletter subscription with Resend
- Smooth page transitions using GSAP

## Subagent Instructions
When building this project, use subagents as follows:
- Agent 1: Set up Payload CMS, define all collections and fields as described above
- Agent 2: Build the Home page (/) with all sections
- Agent 3: Build the Blogs listing page (/blogs) and single blog page (/blogs/[slug])
- Agent 4: Build About, Categories, and Contact pages
- Agent 5: Implement SEO, sitemap, robots.txt, and Schema.org across all pages
- Agent 6: Implement all animations — GSAP, Anime.js, Three.js hero

## Folder Structure to Follow
src/
  app/
    (frontend)/
      page.tsx          → Home
      about/page.tsx    → About
      blogs/page.tsx    → Blogs listing
      blogs/[slug]/page.tsx → Single blog
      categories/page.tsx → Categories
      contact/page.tsx  → Contact
    (payload)/
      admin/[[...segments]]/page.tsx → Payload CMS admin
  components/
    ui/                 → Reusable UI components
    layout/             → Navbar, Footer
    home/               → Home page sections
    blog/               → Blog cards, blog content
    animations/         → GSAP and Anime.js wrappers
  lib/
    payload.ts          → Payload CMS config
    supabase.ts         → Supabase client
    cloudinary.ts       → Cloudinary config
  styles/
    globals.css

## Important Rules for Claude Code
- Always use TypeScript — never plain JavaScript
- Always use Tailwind CSS for styling — never write custom CSS unless absolutely necessary
- Always use Next.js App Router conventions — never Pages Router
- Always use Next.js Image component for images — never plain <img> tags
- Always make components responsive — mobile first approach
- Before writing any page or component, check this document first
- If unsure about any design decision, refer to the Design Rules section above
- Install all required packages before writing code that uses them