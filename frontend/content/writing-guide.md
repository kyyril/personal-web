# Blog Content Writing Guidelines

## 📝 Content Standards

### Article Structure
Every article should follow this standard structure:

```yaml
---
title: "Clear, Descriptive Title"
description: "Compelling description (150-160 characters for SEO)"
date: "YYYY-MM-DD"
category: "Category Name"
tags: ["tag1", "tag2", "tag3"]
author: "Your Name"
readTime: "X min read"
coverImage: "/path/to/cover-image.jpg"
published: true
---

# Main Heading (H1)

Introduction paragraph that hooks the reader and provides context.

## Section Heading (H2)

Content with paragraphs, code examples, and visual elements.

### Subsection (H3)

More detailed content.

## Another Major Section

Continue with engaging content.

## Conclusion

Wrap up with key takeaways and call-to-action.
```

### Title Guidelines
- **Length**: 30-60 characters
- **Clarity**: Use clear, descriptive language
- **SEO**: Include relevant keywords naturally
- **Engagement**: Make it compelling and clickable
- **Examples**: 
  - "Getting Started dengan Next.js 15 App Router"
  - "Modern React Patterns untuk 2025"
  - "MDX: Menggabungkan Markdown dengan React Components"

### Description Guidelines
- **Length**: 150-160 characters
- **Purpose**: Summarize the article's value proposition
- **Keywords**: Include primary keywords naturally
- **Engagement**: Make readers want to click and read

## 🏷️ Categorization System

### Primary Categories
- **Next.js**: Next.js tutorials, features, best practices
- **React**: React patterns, hooks, performance tips
- **JavaScript**: ES6+ features, performance, frameworks
- **Web Development**: General web development topics
- **Tutorial**: Step-by-step guides and how-tos
- **Performance**: Optimization techniques and benchmarks
- **Tools**: Development tools, editor setups, workflows

### Tag Strategy
Use 3-5 relevant tags per article:
- **Technology tags**: `react`, `nextjs`, `typescript`, `tailwind`
- **Topic tags**: `tutorial`, `patterns`, `optimization`, `best-practices`
- **Difficulty tags**: `beginner`, `intermediate`, `advanced`
- **Year tags**: `2025`, `2024` (for trend-based content)

## ✍️ Writing Style

### Tone and Voice
- **Professional but approachable**
- **Clear and concise**
- **Tutorial-focused with practical examples**
- **Engaging and informative**
- **Use first person when sharing experiences**

### Code Examples
- **Always provide working code**
- **Use syntax highlighting with proper language tags**
- **Include file names and paths**
- **Add comments to explain complex parts**
- **Test all code examples**

```tsx
// Example: Clear code with comments
export function DataFetcher({ endpoint }: DataFetcherProps) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data on component mount
    fetchData(endpoint).then(result => {
      setData(result);
      setLoading(false);
    });
  }, [endpoint]);

  if (loading) return <LoadingSpinner />;
  return <DataDisplay data={data} />;
}
```

### Visual Elements
- **Screenshots**: Use high-quality, relevant screenshots
- **Diagrams**: Create simple diagrams for complex concepts
- **Code blocks**: Highlight important code sections
- **Callouts**: Use callout boxes for important tips
- **Tables**: For comparisons and structured data

## 📐 Formatting Standards

### Headings
- **H1**: Article title (only one per article)
- **H2**: Major sections
- **H3**: Subsections
- **H4+**: Sub-subsections (use sparingly)

### Lists
- **Bulleted lists**: For unordered items
- **Numbered lists**: For sequential steps
- **Checklists**: For tasks or requirements

### Code Blocks
```bash
# Terminal commands
npm install next@latest

# File creation
touch new-component.tsx

# Copy-paste friendly examples
const example = "Easy to copy";
```

### Links
- **Internal links**: Link to other articles using `/articles/slug`
- **External links**: Use descriptive anchor text
- **Documentation links**: Link to official docs when relevant

## 🎯 Content Types

### Tutorials
- **Goal-oriented**: Solve a specific problem
- **Step-by-step**: Clear progression through solution
- **Code-heavy**: Practical examples throughout
- **Beginner-friendly**: Assume minimal prior knowledge

### Best Practices
- **Problem-solution**: Address common issues
- **Pro-cons**: Present trade-offs clearly
- **Examples**: Show good and bad implementations
- **Performance**: Include benchmarks when relevant

### Technical Deep Dives
- **Exploratory**: Investigate how things work
- **Detailed**: Cover edge cases and nuances
- **Research-backed**: Include references and sources
- **Advanced**: Assume solid foundation knowledge

### Opinion Pieces
- **Personal perspective**: Share your viewpoint
- **Evidence-based**: Support with examples
- **Balanced**: Acknowledge different approaches
- **Engaging**: Spark discussion in comments

## 📊 SEO Best Practices

### Keywords
- **Research**: Use tools like Google Keyword Planner
- **Natural integration**: Avoid keyword stuffing
- **Long-tail**: Target specific, less competitive terms
- **Semantic**: Use related terms and synonyms

### Meta Information
- **Title tags**: Unique, descriptive, under 60 characters
- **Meta descriptions**: Compelling, under 160 characters
- **URL structure**: Clean, descriptive slugs
- **Header structure**: Proper H1-H6 hierarchy

### Internal Linking
- **Related articles**: Link to relevant content
- **Contextual links**: Natural mentions within text
- **Categories and tags**: Help users discover content
- **Navigation**: Clear site structure

## 🔍 Quality Checklist

### Pre-Publish Review
- [ ] **Content accuracy**: All information is correct
- [ ] **Code examples**: All code is tested and working
- [ ] **Links**: All internal and external links work
- [ ] **Images**: All images load and are properly sized
- [ ] **Spelling**: No typos or grammatical errors
- [ ] **SEO**: Title, description, and keywords optimized
- [ ] **Mobile**: Content readable on mobile devices

### Technical Review
- [ ] **Syntax highlighting**: Code blocks properly formatted
- [ ] **Table of contents**: Auto-generated TOC is accurate
- [ ] **Related posts**: Algorithm finds relevant articles
- [ ] **Comments**: Comment system functioning
- [ ] **Performance**: Page loads quickly

## 📝 Content Calendar

### Publishing Schedule
- **Frequency**: 1-2 articles per week
- **Consistency**: Same day/time each week
- **Quality over quantity**: Better to publish less frequently
- **Seasonal content**: Plan around tech trends and events

### Content Planning
- **Quarterly themes**: Focus on specific technologies
- **Series articles**: Multi-part deep dives
- **Guest posts**: Occasionally feature other developers
- **Response articles**: React to industry news/changes

## 🎨 Visual Guidelines

### Images
- **Dimensions**: 1200x630px for Open Graph
- **Format**: WebP or PNG for quality
- **Alt text**: Descriptive alt text for accessibility
- **Consistent style**: Brand-aligned visual design

### Screenshots
- **High resolution**: Crisp, clear images
- **Relevant content**: Show exactly what you're describing
- **Annotations**: Highlight important areas
- **Consistent theme**: Dark/light mode consistency

## 📈 Analytics and Performance

### Track These Metrics
- **Page views**: Popular content identification
- **Time on page**: Engagement quality
- **Bounce rate**: Content effectiveness
- **Social shares**: Content virality
- **Comments**: Community engagement

### Performance Monitoring
- **Loading speed**: Optimize for Core Web Vitals
- **Mobile performance**: Test on various devices
- **SEO rankings**: Monitor keyword positions
- **User feedback**: Comments and feedback

---

## 🎯 Getting Started

1. **Choose a topic** that solves a real problem
2. **Research thoroughly** to ensure accuracy
3. **Write a draft** following this guide
4. **Review and edit** for clarity and quality
5. **Add images and code** for engagement
6. **Optimize for SEO** with proper metadata
7. **Test everything** before publishing
8. **Share and promote** across your channels

Remember: **Great content takes time**. Focus on providing genuine value to your readers, and the engagement will follow naturally.