import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import { Heading } from '@/types/content';
import {visit} from 'unist-util-visit';

// Extract headings from markdown content
export function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      headings.push({
        id,
        text,
        level,
      });
    }
  }
  
  return headings;
}

// Create hierarchical heading structure
export function createHeadingTree(headings: Heading[]): Heading[] {
  const tree: Heading[] = [];
  const stack: Heading[] = [];
  
  for (const heading of headings) {
    // Remove headings of same or higher level from stack
    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }
    
    // Add children array if this heading will have children
    heading.children = [];
    
    if (stack.length === 0) {
      // Top-level heading
      tree.push(heading);
    } else {
      // Child heading
      const parent = stack[stack.length - 1];
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(heading);
    }
    
    stack.push(heading);
  }
  
  return tree;
}

// Process MDX content with plugins
export async function processMdx(content: string): Promise<string> {
  const processor = unified()
    .use(remarkParse) // Parse markdown
    .use(remarkGfm) // GitHub Flavored Markdown
    .use(remarkRehype) // Convert to HTML
    .use(rehypeSlug) // Ensure heading slugs
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: {
        class: 'heading-link',
      },
    })
    .use(rehypePrettyCode, {
      theme: {
        dark: 'github-dark',
        light: 'github-light',
      },
      keepBackground: false,
    })
    .use(rehypeStringify); // Stringify to HTML
  
  const processed = await processor.process(content);
  return String(processed);
}

// Get table of contents from markdown
export function getTableOfContents(content: string) {
  return createHeadingTree(extractHeadings(content));
}

// Extract code blocks from content for syntax highlighting
export function extractCodeBlocks(content: string) {
  const codeBlocks: { language: string; code: string; filename?: string }[] = [];
  const lines = content.split('\n');
  
  let inCodeBlock = false;
  let currentLanguage = '';
  let currentCode = '';
  let currentFilename = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for code block start
    if (line.match(/^```(\w+)?/)) {
      // If we were already in a code block, save the previous one
      if (inCodeBlock) {
        codeBlocks.push({
          language: currentLanguage,
          code: currentCode.trim(),
          filename: currentFilename || undefined,
        });
      }
      
      // Start new code block
      inCodeBlock = true;
      currentLanguage = line.replace(/^```/, '').trim() || 'text';
      currentCode = '';
      currentFilename = '';
      
      // Check for filename on next line
      if (i + 1 < lines.length && lines[i + 1].startsWith('// File:')) {
        currentFilename = lines[i + 1].replace('// File:', '').trim();
        i++; // Skip the filename line
      }
    } else if (line === '```' && inCodeBlock) {
      // End code block
      codeBlocks.push({
        language: currentLanguage,
        code: currentCode.trim(),
        filename: currentFilename || undefined,
      });
      inCodeBlock = false;
      currentLanguage = '';
      currentCode = '';
      currentFilename = '';
    } else if (inCodeBlock) {
      currentCode += line + '\n';
    }
  }
  
  return codeBlocks;
}

// Clean markdown content for excerpts
export function cleanMarkdownForExcerpt(content: string, maxLength: number = 160): string {
  // Remove frontmatter
  content = content.replace(/^---[\s\S]*?---\n/, '');
  
  // Remove code blocks
  content = content.replace(/```[\s\S]*?```/g, '');
  
  // Remove inline code
  content = content.replace(/`[^`]*`/g, '');
  
  // Remove markdown formatting
  content = content.replace(/[*_#`\[\]()]/g, '');
  
  // Remove links but keep text
  content = content.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Remove multiple spaces and newlines
  content = content.replace(/\s+/g, ' ');
  
  return content.trim().slice(0, maxLength) + (content.length > maxLength ? '...' : '');
}

// Generate reading time estimate
export function estimateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const textContent = cleanMarkdownForExcerpt(content, 10000); // Get substantial content
  const wordCount = textContent.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  return `${minutes} min read`;
}