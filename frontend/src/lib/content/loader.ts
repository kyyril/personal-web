import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkSlug from "remark-slug";
import {
  BlogPost,
  BlogPostMetadata,
  Frontmatter,
  Category,
} from "@/types/content";
import { extractHeadings } from "./mdx";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

// Get all blog posts metadata (for listing)
export function getAllPostsMetadata(): BlogPostMetadata[] {
  const slugs = getAllPostSlugs();

  const posts = slugs
    .map((slug) => {
      const fullPath = path.join(ARTICLES_DIR, `${slug}.mdx`);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        ...data,
        slug,
      } as BlogPostMetadata;
    })
    .filter((post) => !post.draft && post.published !== false)
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return posts;
}

// Get slugs for all posts
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) {
    return [];
  }

  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

// Get a single blog post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const fullPath = path.join(ARTICLES_DIR, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  // Filter out drafts unless explicitly published
  if (data.draft || data.published === false) {
    return null;
  }

  // Process the markdown content
  const processedContent = await remark().use(remarkGfm).process(content);

  const contentText = processedContent.toString();
  const headings = extractHeadings(content);

  // Generate excerpt (first 160 characters)
  const excerpt =
    content.replace(/[#*`]/g, "").replace(/\n+/g, " ").trim().slice(0, 160) +
    "...";

  return {
    slug,
    frontmatter: data as Frontmatter,
    content: contentText,
    excerpt,
    headings,
  };
}

// Get all blog posts (full content)
export async function getAllPosts(): Promise<BlogPost[]> {
  const slugs = getAllPostSlugs();

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const post = await getPostBySlug(slug);
      return post;
    })
  );

  return posts.filter((post): post is BlogPost => post !== null);
}

// Get posts by category
export function getPostsByCategory(category: string): BlogPostMetadata[] {
  const posts = getAllPostsMetadata();
  return posts.filter(
    (post) => post.category.toLowerCase() === category.toLowerCase()
  );
}

// Get all categories with post counts
export function getAllCategories(): Category[] {
  const posts = getAllPostsMetadata();
  const categoryMap = new Map<string, number>();

  posts.forEach((post) => {
    const count = categoryMap.get(post.category) || 0;
    categoryMap.set(post.category, count + 1);
  });

  return Array.from(categoryMap.entries()).map(([name, count]) => ({
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    description: `${name} related articles`,
    count,
  }));
}

// Get related posts based on category and tags
export function getRelatedPosts(
  currentPost: BlogPostMetadata,
  limit: number = 3
): BlogPostMetadata[] {
  const allPosts = getAllPostsMetadata();

  const related = allPosts
    .filter(
      (post) =>
        post.slug !== currentPost.slug && // Exclude current post
        (post.category === currentPost.category || // Same category
          post.tags.some((tag) => currentPost.tags.includes(tag))) // Shared tags
    )
    .sort((a, b) => {
      // Prefer same category posts
      if (
        a.category === currentPost.category &&
        b.category !== currentPost.category
      ) {
        return -1;
      }
      if (
        b.category === currentPost.category &&
        a.category !== currentPost.category
      ) {
        return 1;
      }

      // Then by shared tags count
      const aSharedTags = a.tags.filter((tag) =>
        currentPost.tags.includes(tag)
      ).length;
      const bSharedTags = b.tags.filter((tag) =>
        currentPost.tags.includes(tag)
      ).length;

      if (aSharedTags !== bSharedTags) {
        return bSharedTags - aSharedTags;
      }

      // Finally by date
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, limit);

  return related;
}

// Search posts by title, description, or content
export function searchPosts(query: string): BlogPostMetadata[] {
  const posts = getAllPostsMetadata();
  const searchTerm = query.toLowerCase();

  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm) ||
      post.description.toLowerCase().includes(searchTerm) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
  );
}

// Get recent posts (for sidebar, related posts fallback)
export function getRecentPosts(limit: number = 5): BlogPostMetadata[] {
  const posts = getAllPostsMetadata();
  return posts.slice(0, limit);
}
