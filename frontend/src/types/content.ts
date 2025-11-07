export interface Frontmatter {
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  author: string;
  readTime: string;
  coverImage?: string;
  published?: boolean;
  draft?: boolean;
}

export interface BlogPost {
  slug: string;
  frontmatter: Frontmatter;
  content: string;
  excerpt: string;
  headings: Heading[];
}

export interface BlogPostMetadata extends Frontmatter {
  slug: string;
}

export interface Heading {
  id: string;
  text: string;
  level: number;
  children?: Heading[];
}

export interface Category {
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface RelatedPost {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  date: string;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
  children?: TocItem[];
}

export interface CommentConfig {
  provider: 'giscus' | 'utterances';
  repository: string;
  category?: string;
  categoryId?: string;
  theme: 'light' | 'dark' | 'preferred-color-scheme';
}