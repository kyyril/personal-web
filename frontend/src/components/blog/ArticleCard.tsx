"use client";

import React from "react";
import Link from "next/link";
import { Article } from "@/data/blog-data";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { CalendarDays, Clock, User, Folder } from "lucide-react";

interface ArticleCardProps {
    post: Article;
}

export function ArticleCard({ post }: ArticleCardProps) {
    return (
        <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-300 border-muted/40 group hover:-translate-y-1">
            <CardHeader className="flex-none pb-4">
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Link
                        href={`/blog/category/${encodeURIComponent(
                            post.frontmatter.category.toLowerCase().replace(/\s+/g, "-")
                        )}`}
                        className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 font-medium"
                    >
                        <Folder className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{post.frontmatter.category}</span>
                    </Link>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" aria-hidden="true" />
                        {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </span>
                </div>
                <CardTitle className="mb-2 text-lg sm:text-xl font-bold tracking-tight leading-tight min-h-[3rem]">
                    <Link href={`/blog/${post.slug}`} className="line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                        {post.frontmatter.title}
                    </Link>
                </CardTitle>
                <CardDescription className="line-clamp-3 text-muted-foreground leading-relaxed min-h-[4.5rem]">
                    {post.frontmatter.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                        <User className="h-3 w-3" aria-hidden="true" />
                        {post.frontmatter.author}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        {post.frontmatter.readTime}
                    </span>
                </div>

                {/* Tags - Strictly 1 Line */}
                {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                    <div className="flex flex-nowrap gap-2 mb-4 overflow-hidden items-center no-scrollbar">
                        {post.frontmatter.tags.slice(0, 4).map((tag, index) => (
                            <Link
                                key={`${tag}-${index}`}
                                href={`/blog/tags/${encodeURIComponent(
                                    tag.toLowerCase().replace(/\s+/g, "-")
                                )}`}
                                className="flex-shrink-0"
                            >
                                <Badge
                                    variant="secondary"
                                    className="text-[10px] whitespace-nowrap cursor-pointer hover:bg-secondary/50 rounded-md border-none bg-secondary/50 text-muted-foreground font-medium"
                                >
                                    {tag}
                                </Badge>
                            </Link>
                        ))}
                        {post.frontmatter.tags.length > 4 && (
                            <Badge variant="secondary" className="text-[10px] whitespace-nowrap rounded-md border-none bg-secondary/50 text-muted-foreground flex-shrink-0">
                                +{post.frontmatter.tags.length - 4}
                            </Badge>
                        )}
                    </div>
                )}

                <div className="mt-auto flex justify-end">
                    <Link
                        href={`/blog/${post.slug}`}
                        className="text-primary hover:underline font-medium text-sm flex items-center gap-1"
                    >
                        Read
                        <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
