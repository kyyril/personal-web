"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    const [direction, setDirection] = useState<number>(0);
    const { theme } = useTheme();

    // Loading states for each image
    const [loadingStates, setLoadingStates] = useState({
        githubStats: true,
        githubStreak: true,
        githubLangs: true,
        wakatime: true,
    });

    const currentTheme = theme === "dark" || theme === "system" ? "dark" : "light";
    const statsTheme = currentTheme === "dark" ? "dark" : "default";
    const titleColor = currentTheme === "dark" ? "3b82f6" : "0f172a";

    const githubStatsUrl = `https://github-readme-stats-fast.vercel.app/api?username=kyyril&show_icons=true&theme=${statsTheme}&bg_color=00000000&hide_border=true&title_color=${titleColor}&text_color=${currentTheme === "dark" ? "888888" : "475569"}`;
    const githubStreakUrl = `https://github-readme-stats-fast.vercel.app/api/streak?username=kyyril&theme=${statsTheme}&bg_color=00000000&hide_border=true&ring=${titleColor}&stroke=${titleColor}&currStreakLabel=${titleColor}`;
    const githubLangsUrl = `https://github-readme-stats-fast.vercel.app/api/top-langs/?username=kyyril&layout=compact&theme=${statsTheme}&bg_color=00000000&hide_border=true&title_color=${titleColor}`;
    const wakatimeUrl = "https://wakatime.com/share/@kyyril/9eb071bf-655b-4fb3-a970-6fc2f7c3b2ec.svg";

    // Fix hydration mismatch and Pre-load images
    useEffect(() => {
        setMounted(true);

        // Pre-fetch all images immediately using the global Image constructor
        [githubStatsUrl, githubStreakUrl, githubLangsUrl, wakatimeUrl].forEach(url => {
            if (typeof window !== "undefined") {
                const img = new window.Image();
                img.src = url;
                // Warm the cache
                if (url === wakatimeUrl) {
                    img.onload = () => handleImageLoad('wakatime');
                }
            }
        });
    }, [githubStatsUrl, githubStreakUrl, githubLangsUrl, wakatimeUrl]);

    const tabs = [
        { id: "overview", label: "GitHub", icon: Github },
        { id: "wakatime", label: "WakaTime", icon: Clock },
    ];

    const handleImageLoad = (key: keyof typeof loadingStates) => {
        setLoadingStates(prev => ({ ...prev, [key]: false }));
    };

    const handleTabChange = (newTab: TabType) => {
        if (newTab === activeTab) return;
        const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
        const newIndex = tabs.findIndex(tab => tab.id === newTab);
        setDirection(newIndex > currentIndex ? 1 : -1);
        setActiveTab(newTab);
    };

    // Correctly sized skeleton for initial load to prevent layout shift
    if (!mounted) {
        return (
            <div className="w-full max-w-4xl mt-8 md:mt-12 space-y-8 h-[650px]">
                <div className="flex justify-end">
                    <div className="h-10 w-48 bg-muted/10 rounded-xl" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-[195px] bg-muted/5 rounded-lg animate-pulse" />
                    <div className="h-[195px] bg-muted/5 rounded-lg animate-pulse" />
                </div>
                <div className="flex justify-center">
                    <div className="h-[165px] w-full md:w-1/2 bg-muted/5 rounded-lg animate-pulse" />
                </div>
            </div>
        );
    }

    // Ultra-fast animation variants
    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0,
            scale: 0.98,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -100 : 100,
            opacity: 0,
            scale: 0.98,
        }),
    };

    return (
        <div className="w-full max-w-4xl mt-8 md:mt-12">
            <div className="flex justify-end mb-8">
                <div className="flex p-1 bg-muted/10 rounded-xl w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id as TabType)}
                            className={`relative flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${activeTab === tab.id
                                ? "text-foreground"
                                : "text-muted-foreground hover:text-foreground/70"
                                }`}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-background shadow-sm rounded-lg"
                                    transition={{ type: "spring", bounce: 0, duration: 0.2 }}
                                />
                            )}
                            <tab.icon className="w-3.5 h-3.5 relative z-10" />
                            <span className="relative z-10">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative min-h-[580px] w-full overflow-hidden">
                {/* GitHub Tab Content */}
                <motion.div
                    initial={false}
                    animate={{
                        x: activeTab === "overview" ? 0 : -100,
                        opacity: activeTab === "overview" ? 1 : 0,
                        scale: activeTab === "overview" ? 1 : 0.98,
                        pointerEvents: activeTab === "overview" ? "auto" : "none"
                    }}
                    transition={{
                        x: { type: "spring", stiffness: 600, damping: 50 },
                        opacity: { duration: 0.15 },
                        scale: { duration: 0.15 }
                    }}
                    className="absolute inset-0 w-full"
                >
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="overflow-hidden relative min-h-[195px] rounded-lg">
                                {loadingStates.githubStats && (
                                    <Skeleton className="absolute inset-0 w-full h-full" />
                                )}
                                <NextImage
                                    src={githubStatsUrl}
                                    alt="GitHub Stats"
                                    width={400}
                                    height={200}
                                    unoptimized
                                    className={`w-full h-auto transition-opacity duration-200 ${loadingStates.githubStats ? 'opacity-0' : 'opacity-100'}`}
                                    onLoad={() => handleImageLoad('githubStats')}
                                />
                            </div>
                            <div className="overflow-hidden relative min-h-[195px] rounded-lg">
                                {loadingStates.githubStreak && (
                                    <Skeleton className="absolute inset-0 w-full h-full" />
                                )}
                                <NextImage
                                    src={githubStreakUrl}
                                    alt="GitHub Streak"
                                    width={400}
                                    height={200}
                                    unoptimized
                                    className={`w-full h-auto transition-opacity duration-200 ${loadingStates.githubStreak ? 'opacity-0' : 'opacity-100'}`}
                                    onLoad={() => handleImageLoad('githubStreak')}
                                />
                            </div>
                        </div>
                        <div className="flex justify-center w-full">
                            <div className="w-full md:w-1/2 overflow-hidden relative min-h-[165px] rounded-lg">
                                {loadingStates.githubLangs && (
                                    <Skeleton className="absolute inset-0 w-full h-full" />
                                )}
                                <NextImage
                                    src={githubLangsUrl}
                                    alt="Top Languages"
                                    width={400}
                                    height={200}
                                    unoptimized
                                    className={`w-full h-auto transition-opacity duration-200 ${loadingStates.githubLangs ? 'opacity-0' : 'opacity-100'}`}
                                    onLoad={() => handleImageLoad('githubLangs')}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* WakaTime Tab Content */}
                <motion.div
                    initial={false}
                    animate={{
                        x: activeTab === "wakatime" ? 0 : 100,
                        opacity: activeTab === "wakatime" ? 1 : 0,
                        scale: activeTab === "wakatime" ? 1 : 0.98,
                        pointerEvents: activeTab === "wakatime" ? "auto" : "none"
                    }}
                    transition={{
                        x: { type: "spring", stiffness: 600, damping: 50 },
                        opacity: { duration: 0.15 },
                        scale: { duration: 0.15 }
                    }}
                    className="absolute inset-0 w-full px-2"
                >
                    <div className="flex justify-center items-center overflow-hidden py-4">
                        <div className="w-full max-w-2xl relative min-h-[500px] rounded-lg">
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
                                    } ${loadingStates.wakatime ? 'opacity-0' : 'opacity-100'}`}
                                onLoad={() => handleImageLoad('wakatime')}
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DevActivity;
