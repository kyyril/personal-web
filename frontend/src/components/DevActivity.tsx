"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { BarChart3, Github, Clock, Layout, Loader2 } from "lucide-react";
import NextImage from "next/image";

type TabType = "overview" | "languages" | "wakatime";

// Skeleton component for loading states
const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
    <div className={`animate-pulse bg-muted/10 rounded-lg ${className}`}>
        <div className="w-full h-full flex flex-col justify-center p-6 space-y-4">
            <div className="h-4 bg-muted/20 rounded w-3/4" />
            <div className="h-4 bg-muted/20 rounded w-1/2" />
            <div className="h-4 bg-muted/20 rounded w-5/6" />
        </div>
    </div>
);

const DevActivity: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>("overview");
    const [mounted, setMounted] = useState(false);
    const [showMetrics, setShowMetrics] = useState(false);
    const { theme } = useTheme();

    // Loading states for each image
    const [loadingStates, setLoadingStates] = useState({
        githubStats: true,
        githubStreak: true,
        wakatime: true,
    });

    const currentTheme = theme === "dark" || theme === "system" ? "dark" : "light";
    const statsTheme = currentTheme === "dark" ? "dark" : "default";
    const titleColor = currentTheme === "dark" ? "3b82f6" : "0f172a";

    const githubStatsUrl = `https://github-readme-stats-fast.vercel.app/api?username=kyyril&show_icons=true&theme=${statsTheme}&bg_color=00000000&hide_border=true&title_color=${titleColor}&text_color=${currentTheme === "dark" ? "888888" : "475569"}`;
    const githubStreakUrl = `https://github-readme-stats-fast.vercel.app/api/streak?username=kyyril&theme=${statsTheme}&bg_color=00000000&hide_border=true&ring=${titleColor}&stroke=${titleColor}&currStreakLabel=${titleColor}`;
    const wakatimeUrl = "https://wakatime.com/share/@kyyril/9eb071bf-655b-4fb3-a970-6fc2f7c3b2ec.svg";

    // Fix hydration mismatch and Pre-load images
    useEffect(() => {
        setMounted(true);

        // Pre-fetch all images immediately using the global Image constructor
        [githubStatsUrl, githubStreakUrl, wakatimeUrl].forEach(url => {
            if (typeof window !== "undefined") {
                const img = new window.Image();
                img.src = url;
                // Warm the cache
                if (url === wakatimeUrl) {
                    img.onload = () => handleImageLoad('wakatime');
                }
            }
        });
    }, [githubStatsUrl, githubStreakUrl, wakatimeUrl]);

    const tabs = [
        { id: "overview", label: "GitHub", icon: Github },
        { id: "wakatime", label: "WakaTime", icon: Clock },
    ];

    const handleImageLoad = (key: keyof typeof loadingStates) => {
        setLoadingStates(prev => ({ ...prev, [key]: false }));
    };

    const handleTabChange = (newTab: TabType) => {
        if (newTab === activeTab) return;
        setActiveTab(newTab);
    };

    // Correctly sized skeleton for initial load to prevent layout shift
    if (!mounted) {
        return (
            <div className="w-full max-w-4xl mt-8 md:mt-12">
                <div className="flex justify-center">
                    <div className="h-10 w-44 bg-muted/10 rounded-2xl animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mt-8 md:mt-12">
            <div className="flex justify-start mb-4">
                <button
                    onClick={() => setShowMetrics(!showMetrics)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium py-1"
                >
                    <div className="w-1 h-1 rounded-full bg-muted-foreground group-hover:bg-foreground" />
                    {showMetrics ? "Hide Metrics" : "View Metrics"}
                </button>
            </div>

            {showMetrics && (
                <div className="overflow-hidden mt-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-100">
                    <div className="flex justify-end mb-8">
                        <div className="flex p-1 w-fit">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id as TabType)}
                                    className={`relative flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors duration-200 ${activeTab === tab.id
                                        ? "text-foreground"
                                        : "text-muted-foreground hover:text-foreground/70"
                                        }`}
                                >
                                    {activeTab === tab.id && (
                                        <div className="absolute inset-0 bg-muted/50 rounded-lg" />
                                    )}
                                    <tab.icon className="w-3.5 h-3.5 relative z-10" />
                                    <span className="relative z-10">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 grid-rows-1 w-full min-h-[480px] md:min-h-[640px]">
                        {/* GitHub Tab Content */}
                        <div
                            className={`col-start-1 row-start-1 w-full transition-opacity duration-200 ${activeTab === "overview" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
                        >
                            <div className="flex flex-col items-center py-2 md:py-6 gap-0">
                                {/* 1. GitHub Streak */}
                                <div className="w-full max-w-2xl">
                                    {loadingStates.githubStreak && <Skeleton className="absolute inset-0 w-full" />}
                                    <div className="flex justify-center">
                                        <NextImage
                                            src={githubStreakUrl}
                                            alt="GitHub Streak"
                                            width={600}
                                            height={240}
                                            unoptimized
                                            priority
                                            className={`w-full h-auto transition-opacity duration-100 block ${loadingStates.githubStreak ? "opacity-0" : "opacity-100"
                                                }`}
                                            onLoad={() => handleImageLoad("githubStreak")}
                                        />
                                    </div>
                                </div>

                                {/* 2. Stats */}
                                <div className="w-full max-w-2xl">
                                    {loadingStates.githubStats && <Skeleton className="absolute inset-0 w-full" />}
                                    <div className="flex justify-center">
                                        <NextImage
                                            src={githubStatsUrl}
                                            alt="GitHub Stats"
                                            width={600}
                                            height={240}
                                            unoptimized
                                            priority
                                            className={`w-full h-auto transition-opacity duration-100 block scale-90 md:scale-100 ${loadingStates.githubStats ? "opacity-0" : "opacity-100"
                                                }`}
                                            onLoad={() => handleImageLoad("githubStats")}
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* WakaTime Tab Content */}
                        <div
                            className={`col-start-1 row-start-1 w-full px-2 transition-opacity duration-200 ${activeTab === "wakatime" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
                        >
                            <div className="flex justify-center items-center overflow-hidden py-4">
                                <div className="w-full max-w-2xl relative rounded-lg">
                                    {loadingStates.wakatime && (
                                        <Skeleton className="absolute inset-0 w-full h-full" />
                                    )}
                                    <NextImage
                                        src={wakatimeUrl}
                                        alt="Wakatime Stats"
                                        width={600}
                                        height={400}
                                        unoptimized
                                        className={`w-full h-auto transition-all duration-200 ${currentTheme === "light" ? "invert" : "opacity-90"
                                            } ${loadingStates.wakatime ? "opacity-0" : "opacity-100"}`}
                                        onLoad={() => handleImageLoad("wakatime")}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DevActivity;
