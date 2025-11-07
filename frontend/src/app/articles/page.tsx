import React from 'react';
import Link from 'next/link';
import { getAllArticles, getAllCategories } from '@/data/blog-data';
import { ClientFilterWrapper } from '@/components/blog/ClientFilterWrapper';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Clock, User, Folder } from 'lucide-react';
import { Article } from '@/data/blog-data';

export const metadata = {
  title: 'Articles | Blog',
  description: 'Read the latest articles about web development, React, Next.js, and modern frontend technologies.',
};

function ArticlesList({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No articles found</h3>
          <p>Try adjusting your search criteria or clearing the filters.</p>
          <Link 
            href="/articles"
            className="text-primary hover:underline mt-2 inline-block"
          >
            View all articles →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((post) => (
        <Card key={post.slug} className="h-full hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Badge variant="secondary">{post.frontmatter.category}</Badge>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                {new Date(post.frontmatter.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
              <Link href={`/articles/${post.slug}`}>
                {post.frontmatter.title}
              </Link>
            </CardTitle>
            <CardDescription className="line-clamp-3">
              {post.frontmatter.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {post.frontmatter.author}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.frontmatter.readTime}
              </span>
            </div>
            
            {/* Tags */}
            {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1">
                {post.frontmatter.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {post.frontmatter.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{post.frontmatter.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}
            
            <div className="mt-4">
              <Link 
                href={`/articles/${post.slug}`}
                className="text-primary hover:underline font-medium"
              >
                Read more →
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function ArticlesPage() {
  const allArticles = getAllArticles();
  const categories = getAllCategories();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Articles</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover insights, tutorials, and best practices in modern web development.
        </p>
      </div>

      {/* Client-side Filter Component */}
      <ClientFilterWrapper 
        allArticles={allArticles} 
        categories={categories}
      />

      {/* Quick Category Links */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Folder className="h-5 w-5" />
          Quick Category Links
        </h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/articles">
            <Badge variant="secondary" className="cursor-pointer hover:bg-accent">
              All ({allArticles.length})
            </Badge>
          </Link>
          {categories.map((category) => (
            <Link key={category.slug} href={`/articles/category/${category.slug}`}>
              <Badge variant="secondary" className="cursor-pointer hover:bg-accent">
                {category.name} ({category.count})
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}