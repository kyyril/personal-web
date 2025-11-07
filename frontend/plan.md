# Plan: Modern Next.js Static Blog dengan MDX untuk Software Engineer

## 📋 Overview

Membangun blog statis modern menggunakan Next.js App Router dan MDX yang dilengkapi dengan fitur-fitur canggih untuk software engineer.

## 🎯 Target Fitur Utama

### 1. **Dasar-dasar Blog Statis dengan Next.js dan MDX**

- [ ] **Next.js App Router Setup**

  - [ ] Konfigurasi App Router untuk static site generation (SSG)
  - [ ] Setup TypeScript dan Tailwind CSS (sudah ada)
  - [ ] Konfigurasi path aliases dan struktur folder

- [ ] **MDX Integration**

  - [ ] Install dan konfigurasi `@next/mdx` untuk dukungan MDX
  - [ ] Setup MDX plugins untuk frontmatter parsing
  - [ ] Konfigurasi rehype plugins untuk enhancement

- [ ] **Frontmatter System**
  - [ ] Setup schema untuk metadata (title, date, description, category, tags)
  - [ ] Buat parser untuk extract frontmatter dari MDX files
  - [ ] Setup TypeScript interfaces untuk metadata

### 2. **Sistem Komentar Berbasis GitHub**

- [ ] **Giscus Integration**

  - [ ] Setup Giscus widget untuk GitHub Discussions
  - [ ] Konfigurasi otomatis berdasarkan repositori
  - [ ] Styling kompatibel dengan tema blog

- [ ] **Utterances Alternative**
  - [ ] Setup Utterances sebagai backup system
  - [ ] Toggle mechanism antara Giscus dan Utterances
  - [ ] Configuration management untuk comment system

### 3. **Filter Konten Berdasarkan Kategori**

- [ ] **Category System**

  - [ ] Buat category pages dinamis (`/category/[category]`)
  - [ ] Setup filtering logic di blog listing
  - [ ] Category sidebar/navigation component
  - [ ] Breadcrumb navigation dengan category

- [ ] **Dynamic Content**
  - [ ] Server-side filtering untuk performa optimal
  - [ ] Pagination untuk large content sets
  - [ ] Search functionality (bonus feature)

### 4. **Related Posts (Postingan Terkait)**

- [ ] **Algorithm Implementation**

  - [ ] Related posts berdasarkan kategori yang sama
  - [ ] Tag-based relationship system
  - [ ] Recent posts fallback

- [ ] **UI Components**
  - [ ] Related posts component di article detail
  - [ ] Card layout untuk related posts
  - [ ] Responsive grid layout

### 5. **Interactive Table of Contents (TOC)**

- [ ] **TOC Generation**

  - [ ] Auto-generate TOC dari MDX headings (h1, h2, h3, dst.)
  - [ ] Setup rehype-slug dan rehype-autolink-headings
  - [ ] Heading hierarchy preservation

- [ ] **Interactive Features**
  - [ ] Smooth scroll ke section yang dituju
  - [ ] Active section highlighting saat scroll
  - [ ] Mobile-responsive TOC (collapsible)
  - [ ] Progress indicator untuk reading progress

### 6. **Syntax Highlighting & Code Features**

- [ ] **Code Highlighting**

  - [ ] Setup rehype-pretty-code atau rehype-highlight
  - [ ] Multiple theme support (dark/light mode)
  - [ ] Line numbers dan line highlighting
  - [ ] Copy code button functionality

- [ ] **Code Blocks Enhancement**
  - [ ] File name attribution
  - [ ] Language detection dan display
  - [ ] Collapsible code blocks untuk long code
  - [ ] Code sandbox integration (optional)

### 7. **SEO & Performance Optimization**

- [ ] **SEO Implementation**

  - [ ] Dynamic meta tags dari frontmatter
  - [ ] Open Graph dan Twitter Card support
  - [ ] JSON-LD structured data untuk articles
  - [ ] Sitemap generation untuk all articles
  - [ ] RSS feed generation

- [ ] **Performance**
  - [ ] Image optimization dengan Next.js Image
  - [ ] Lazy loading untuk content dan components
  - [ ] Critical CSS inlining
  - [ ] Bundle analysis dan optimization

## 🏗️ Implementation Steps

### Phase 1: Project Setup & MDX Configuration

1. **Week 1: Foundation**

   - [ ] Install MDX dependencies (@next/mdx, @mdx-js/rollup, etc.)
   - [ ] Setup MDX plugins (remark, rehype)
   - [ ] Create content directory structure
   - [ ] Setup frontmatter schema dan TypeScript interfaces
   - [ ] Create sample MDX files untuk testing

2. **Week 2: Content System**
   - [ ] Build content loader functions
   - [ ] Create blog listing page (/)
   - [ ] Setup dynamic article pages (/blog/[slug])
   - [ ] Implement content metadata extraction

### Phase 2: Core Features Implementation

3. **Week 3: Navigation & Filtering**

   - [ ] Build category system
   - [ ] Create category pages
   - [ ] Implement filtering UI components
   - [ ] Add breadcrumb navigation

4. **Week 4: Table of Contents**
   - [ ] Setup heading extraction system
   - [ ] Build interactive TOC component
   - [ ] Implement scroll tracking
   - [ ] Add mobile TOC functionality

### Phase 3: Enhanced Features

5. **Week 5: Comments & Related Posts**

   - [ ] Integrate Giscus comment system
   - [ ] Build related posts algorithm
   - [ ] Create related posts UI component
   - [ ] Setup alternative comment system (Utterances)

6. **Week 6: Code Highlighting & SEO**
   - [ ] Implement syntax highlighting
   - [ ] Add code block enhancements
   - [ ] Setup SEO meta tags system
   - [ ] Generate sitemap dan RSS feed

### Phase 4: Polish & Optimization

7. **Week 7: Performance & Mobile**

   - [ ] Performance optimization
   - [ ] Mobile responsiveness testing
   - [ ] Accessibility improvements
   - [ ] Cross-browser testing

8. **Week 8: Content & Documentation**
   - [ ] Create multiple sample articles
   - [ ] Setup content writing guidelines
   - [ ] Documentation untuk contributors

## 📁 Proposed Directory Structure

```
frontend/
├── content/                    # MDX content directory
│   ├── articles/              # Article files
│   │   ├── getting-started-nextjs.mdx
│   │   ├── modern-react-patterns.mdx
│   │   └── ...
│   ├── categories/            # Category descriptions (optional)
│   └── authors/              # Author info (optional)
├── src/
│   ├── app/
│   │   ├── blog/
│   │   │   ├── page.tsx      # Blog listing
│   │   │   ├── [slug]/       # Dynamic blog posts
│   │   │   └── category/     # Category filtering
│   │   ├── api/              # API routes if needed
│   │   └── layout.tsx
│   ├── components/
│   │   ├── blog/             # Blog-specific components
│   │   │   ├── ArticleCard.tsx
│   │   │   ├── TableOfContents.tsx
│   │   │   ├── CommentSystem.tsx
│   │   │   ├── RelatedPosts.tsx
│   │   │   ├── CategoryFilter.tsx
│   │   │   └── CodeBlock.tsx
│   │   └── ui/               # Existing UI components
│   ├── lib/
│   │   ├── content/          # Content loading utilities
│   │   │   ├── loader.ts
│   │   │   ├── mdx.ts
│   │   │   └── types.ts
│   │   └── utils/
│   └── types/
│       └── content.ts        # Content-related TypeScript types
```

## 🛠️ Technical Stack & Dependencies

### Core Dependencies

- `next`: ^15.x (sudah ada)
- `react`: ^18.x (sudah ada)
- `typescript`: ^5.x (sudah ada)
- `tailwindcss`: ^3.x (sudah ada)

### MDX & Content

- `@next/mdx`: MDX integration
- `gray-matter`: Frontmatter parsing
- `remark`: Markdown processing
- `rehype`: HTML processing

### Enhanced Features

- `rehype-slug`: Auto-generate heading IDs
- `rehype-autolink-headings`: Add links to headings
- `rehype-pretty-code`: Syntax highlighting
- `giscus-react`: GitHub Discussions comments
- `react-intersection-observer`: For TOC active tracking
- `date-fns`: Date formatting (sudah ada)

### SEO & Performance

- `next-sitemap`: Sitemap generation
- `rss`: RSS feed generation
- `@vercel/analytics`: Analytics (sudah ada)

## 🎨 Design Guidelines

### Typography & Readability

- Clean, readable font stack (Inter, system fonts)
- Proper line height dan spacing untuk code blocks
- Consistent heading hierarchy
- Mobile-first responsive design

### Color Scheme

- Dark/light mode support (existing theme system)
- Syntax highlighting themes
- Accessible color contrast ratios
- Category-based color coding (optional)

### Layout Patterns

- Article layout: Header, TOC, Content, Related Posts, Comments
- Blog listing: Grid/list view toggle
- Mobile navigation: Collapsible menu patterns
- Loading states untuk better UX

## 📊 Content Strategy

### Initial Content (Week 1-2)

1. **"Getting Started dengan Next.js 15 App Router"**

   - Category: Next.js
   - Tags: nextjs, app-router, tutorial
   - Features to demonstrate: Code highlighting, TOC, related posts

2. **"Modern React Patterns untuk 2025"**

   - Category: React
   - Tags: react, patterns, hooks
   - Advanced code examples

3. **"MDX: Menggabungkan Markdown dengan React Components"**
   - Category: Next.js
   - Tags: mdx, content, components
   - Meta content tentang blog itself

### Content Templates

Create MDX template dengan frontmatter:

```yaml
---
title: "Article Title"
description: "Article description for SEO"
date: "2025-01-01"
category: "Category"
tags: ["tag1", "tag2"]
author: "Author Name"
readTime: "5 min read"
coverImage: "/path/to/image"
---
```

## 🔧 Configuration Files

### next.config.mjs Updates

```javascript
// Add MDX configuration
const nextConfig = {
  // ... existing config
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  experimental: {
    mdxRs: true,
  },
};
```

### tailwind.config.ts Updates

```typescript
// Add MDX-specific styles
export default {
  content: [
    // ... existing content paths
    "./content/**/*.{js,ts,jsx,tsx,md,mdx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          // Custom typography for blog content
        },
      },
    },
  },
};
```

## 🧪 Testing Strategy

### Component Testing

- [ ] Test MDX rendering dengan various content
- [ ] Test TOC generation dan navigation
- [ ] Test comment system integration
- [ ] Test responsive layouts

### Content Testing

- [ ] Test frontmatter parsing
- [ ] Test content filtering
- [ ] Test related posts algorithm
- [ ] Test SEO meta generation

### Performance Testing

- [ ] Test static generation time
- [ ] Test bundle size impact
- [ ] Test image optimization
- [ ] Test lazy loading effectiveness

## 📈 Success Metrics

### Technical Metrics

- ✅ Static generation time < 30 seconds
- ✅ First Contentful Paint < 2 seconds
- ✅ Time to Interactive < 3 seconds
- ✅ Lighthouse score > 90

### Content Metrics

- ✅ At least 10 high-quality articles
- ✅ Proper categorization dan tagging
- ✅ Working comment system
- ✅ Mobile-responsive design

### User Experience Metrics

- ✅ Smooth navigation antar articles
- ✅ Working TOC navigation
- ✅ Fast search dan filtering
- ✅ Accessible design (WCAG 2.1)

## 🚀 Deployment Strategy

### Build Process

1. **Static Generation**: All blog pages pre-rendered
2. **Image Optimization**: Automatic optimization during build
3. **Bundle Analysis**: Automated bundle size monitoring

### Hosting Recommendations

- **Vercel**: Optimal untuk Next.js dengan edge functions
- **Netlify**: Good alternative dengan form handling
- **GitHub Pages**: Simple static hosting option

### CI/CD Pipeline

- Automated builds on content changes
- Preview deployments untuk draft content
- Automated testing on pull requests

## 📝 Documentation Plan

### For Developers

- [ ] Setup dan installation guide
- [ ] Content writing guidelines
- [ ] Component documentation
- [ ] API reference untuk custom functions

### For Content Creators

- [ ] MDX writing tutorial
- [ ] Frontmatter field guide
- [ ] Image dan asset guidelines
- [ ] Category management

## 🎉 Next Steps

1. **Immediate Actions (Today)**

   - [ ] Review dan approve plan
   - [ ] Setup development environment
   - [ ] Install initial dependencies

2. **This Week**

   - [ ] Complete Phase 1 setup
   - [ ] Create first test article
   - [ ] Setup basic MDX rendering

3. **This Month**
   - [ ] Complete core blog functionality
   - [ ] Launch beta version
   - [ ] Gather initial feedback

---

**Total Estimated Time**: 6-8 weeks
**Complexity Level**: Intermediate to Advanced
**Prerequisites**: Next.js, TypeScript, React expertise
**Team Size**: 1-2 developers recommended
