import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getAllArticles, getRelatedArticles } from '@/data/blog-data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Clock, User, ArrowLeft, Share2, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { Metadata } from 'next';
import { TableOfContents, BackToTop } from '@/components/blog/TableOfContents';
import { ClientCommentSection } from '@/components/blog/ClientCommentSection';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getArticleBySlug(slug);
  
  if (!post) {
    return {
      title: 'Article Not Found',
    };
  }
  
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: 'article',
      publishedTime: post.frontmatter.date,
      authors: [post.frontmatter.author],
      tags: post.frontmatter.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.frontmatter.title,
      description: post.frontmatter.description,
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllArticles();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = getArticleBySlug(slug);
  
  if (!post) {
    notFound();
  }
  
  const relatedPosts = getRelatedArticles(post, 3);
  
  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/articles" className="hover:text-foreground transition-colors">
            Articles
          </Link>
          <span>/</span>
          <Link 
            href={`/articles/category/${post.frontmatter.category.toLowerCase().replace(/\s+/g, '-')}`}
            className="hover:text-foreground transition-colors"
          >
            {post.frontmatter.category}
          </Link>
          <span>/</span>
          <span className="text-foreground">{post.frontmatter.title}</span>
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
      </div>
      
      {/* Main Content Layout with TOC */}
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents Sidebar */}
          <div className="lg:col-span-1">
            <TableOfContents headings={post.headings} />
          </div>
          
          {/* Main Article Content */}
          <div className="lg:col-span-3">
            <article className="mb-12">
              {/* Article Header */}
              <header className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="secondary">{post.frontmatter.category}</Badge>
                  {post.frontmatter.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
                  {post.frontmatter.title}
                </h1>
                
                <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                  {post.frontmatter.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{post.frontmatter.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    <time dateTime={post.frontmatter.date}>
                      {format(new Date(post.frontmatter.date), 'MMMM dd, yyyy')}
                    </time>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{post.frontmatter.readTime}</span>
                  </div>
                  <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                </div>
              </header>
              
              {/* Article Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            </article>
            
            {/* Comments Section */}
            <ClientCommentSection article={post} />
            
            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <BookOpen className="h-6 w-6" />
                  Related Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Card key={relatedPost.slug} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {relatedPost.frontmatter.category}
                          </Badge>
                          <span>•</span>
                          <span>
                            {format(new Date(relatedPost.frontmatter.date), 'MMM dd, yyyy')}
                          </span>
                        </div>
                        <CardTitle className="text-lg line-clamp-2 hover:text-primary transition-colors">
                          <Link href={`/articles/${relatedPost.slug}`}>
                            {relatedPost.frontmatter.title}
                          </Link>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {relatedPost.frontmatter.description}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {relatedPost.frontmatter.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
            
            {/* Call to Action */}
            <section className="text-center py-12 border-t border-border">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Enjoyed this article?
              </h3>
              <p className="text-muted-foreground mb-6">
                Follow me for more insights on web development and modern frontend technologies.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link 
                  href="/articles" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  Read More Articles
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
      
      {/* Back to Top Button */}
      <BackToTop />
    </>
  );
}