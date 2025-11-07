import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllCategories, getArticlesByCategory } from '@/data/blog-data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Clock, User, Folder, ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const categories = getAllCategories();
  const categoryData = categories.find(cat => cat.slug === category);
  
  if (!categoryData) {
    return {
      title: 'Category Not Found',
    };
  }
  
  return {
    title: `${categoryData.name} Articles`,
    description: `Browse all ${categoryData.name.toLowerCase()} articles and tutorials.`,
    openGraph: {
      title: `${categoryData.name} Articles`,
      description: `Browse all ${categoryData.name.toLowerCase()} articles and tutorials.`,
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const categories = getAllCategories();
  const categoryData = categories.find(cat => cat.slug === category);
  
  if (!categoryData) {
    notFound();
  }
  
  const articles = getArticlesByCategory(category);
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
        <Link href="/articles" className="hover:text-foreground transition-colors">
          Articles
        </Link>
        <span>/</span>
        <span className="text-foreground">{categoryData.name}</span>
      </nav>
      
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          href="/articles" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Articles
        </Link>
      </div>
      
      {/* Category Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Folder className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-4xl font-bold text-foreground">{categoryData.name}</h1>
            <p className="text-lg text-muted-foreground mt-2">
              {categoryData.description} ({categoryData.count} article{categoryData.count !== 1 ? 's' : ''})
            </p>
          </div>
        </div>
        
        {/* All Categories Navigation */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">All Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/articles/category/${cat.slug}`}>
                <Badge 
                  variant={cat.slug === category ? "default" : "secondary"}
                  className="cursor-pointer hover:bg-accent"
                >
                  {cat.name} ({cat.count})
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Articles Grid */}
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Card key={article.slug} className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Badge variant="secondary">{article.frontmatter.category}</Badge>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    {new Date(article.frontmatter.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                  <Link href={`/articles/${article.slug}`}>
                    {article.frontmatter.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {article.frontmatter.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {article.frontmatter.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.frontmatter.readTime}
                  </span>
                </div>
                
                {/* Tags */}
                {article.frontmatter.tags && article.frontmatter.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1">
                    {article.frontmatter.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {article.frontmatter.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{article.frontmatter.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="mt-4">
                  <Link 
                    href={`/articles/${article.slug}`}
                    className="text-primary hover:underline font-medium"
                  >
                    Read more →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No articles in this category yet</h3>
            <p>Check back soon for new {categoryData.name.toLowerCase()} content!</p>
          </div>
        </div>
      )}
    </div>
  );
}