"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { BarChart3, Github, Clock, Layout } from "lucide-react";

type TabType = "overview" | "languages" | "wakatime";

// Skeleton component for loading states
const ImageSkeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
    <div className={`animate-pulse bg-muted/20 rounded-lg ${className}`}>
        <div className="w-full h-full flex items-center justify-center">
            <div className="space-y-3 w-full p-4">
                <div className="h-4 bg-muted/30 rounded w-3/4"></div>
                <div className="h-4 bg-muted/30 rounded w-1/2"></div>
                <div className="h-4 bg-muted/30 rounded w-5/6"></div>
            </div>
        </div>
    </div>
);

const DevActivity: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>("overview");
    const [mounted, setMounted] = useState(false);
    const [visitedTabs, setVisitedTabs] = useState<Set<TabType>>(new Set(["overview"]));
    const { theme } = useTheme();

    // Loading states for each image
    const [loadingStates, setLoadingStates] = useState({
        githubStats: true,
        githubStreak: true,
        githubLangs: true,
        wakatime: true,
    });

    // Fix hydration mismatch by only rendering theme-specific content after mount
    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Track visited tabs
    useEffect(() => {
        setVisitedTabs(prev => new Set(prev).add(activeTab));
    }, [activeTab]);

    const currentTheme = theme === "dark" || theme === "system" ? "dark" : "light";
    const statsTheme = currentTheme === "dark" ? "dark" : "default";
    const titleColor = currentTheme === "dark" ? "3b82f6" : "0f172a";

    const githubStatsUrl = `https://github-readme-stats-fast.vercel.app/api?username=kyyril&show_icons=true&theme=${statsTheme}&bg_color=00000000&hide_border=true&title_color=${titleColor}&text_color=${currentTheme === "dark" ? "888888" : "475569"}`;
    const githubStreakUrl = `https://github-readme-stats-fast.vercel.app/api/streak?username=kyyril&theme=${statsTheme}&bg_color=00000000&hide_border=true&ring=${titleColor}&stroke=${titleColor}&currStreakLabel=${titleColor}`;
    const githubLangsUrl = `https://github-readme-stats-fast.vercel.app/api/top-langs/?username=kyyril&layout=compact&theme=${statsTheme}&bg_color=00000000&hide_border=true&title_color=${titleColor}`;

    const tabs = [
        { id: "overview", label: "GitHub", icon: Github },
        { id: "wakatime", label: "WakaTime", icon: Clock },
    ];

    const handleImageLoad = (key: keyof typeof loadingStates) => {
        setLoadingStates(prev => ({ ...prev, [key]: false }));
    };

    // Placeholder or skeleton during SSR to avoid mismatch
    if (!mounted) {
        return (
            <div className="w-full max-w-4xl mt-12 animate-pulse">
                <div className="h-10 w-48 mx-auto bg-muted/20 rounded-xl" />
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mt-8 md:mt-12">
            <div className="flex justify-end mb-8">
                <div className="flex p-1 bg-muted/10 rounded-xl w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={`relative flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${activeTab === tab.id
                                ? "text-foreground"
                                : "text-muted-foreground hover:text-foreground/70"
                                }`}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-background shadow-sm rounded-lg"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <tab.icon className="w-3.5 h-3.5 relative z-10" />
                            <span className="relative z-10">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative min-h-[580px]">
                {/* GitHub Tab Content */}
                <div
                    className={`absolute inset-0 transition-opacity duration-300 ${activeTab === "overview" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                        }`}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: activeTab === "overview" ? 1 : 0, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col gap-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="overflow-hidden relative min-h-[195px]">
                                {loadingStates.githubStats && (
                                    <ImageSkeleton className="absolute inset-0 min-h-[195px]" />
                                )}
                                <img
                                    src={githubStatsUrl}
                                    alt="GitHub Stats"
                                    className={`w-full h-auto transition-opacity duration-300 ${loadingStates.githubStats ? 'opacity-0' : 'opacity-100'}`}
                                    loading="lazy"
                                    onLoad={() => handleImageLoad('githubStats')}
                                />
                            </div>
                            <div className="overflow-hidden relative min-h-[195px]">
                                {loadingStates.githubStreak && (
                                    <ImageSkeleton className="absolute inset-0 min-h-[195px]" />
                                )}
                                <img
                                    src={githubStreakUrl}
                                    alt="GitHub Streak"
                                    className={`w-full h-auto transition-opacity duration-300 ${loadingStates.githubStreak ? 'opacity-0' : 'opacity-100'}`}
                                    loading="lazy"
                                    onLoad={() => handleImageLoad('githubStreak')}
                                />
                            </div>
                        </div>
                        <div className="flex justify-center w-full">
                            <div className="w-full md:w-1/2 overflow-hidden relative min-h-[165px]">
                                {loadingStates.githubLangs && (
                                    <ImageSkeleton className="absolute inset-0 min-h-[165px]" />
                                )}
                                <img
                                    src={githubLangsUrl}
                                    alt="Top Languages"
                                    className={`w-full h-auto transition-opacity duration-300 ${loadingStates.githubLangs ? 'opacity-0' : 'opacity-100'}`}
                                    loading="lazy"
                                    onLoad={() => handleImageLoad('githubLangs')}
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* WakaTime Tab Content */}
                <div
                    className={`absolute inset-0 transition-opacity duration-300 ${activeTab === "wakatime" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                        }`}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: activeTab === "wakatime" ? 1 : 0, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex justify-center items-center overflow-hidden py-4"
                    >
                        <div className="w-full max-w-2xl relative min-h-[500px]">
                            {loadingStates.wakatime && visitedTabs.has("wakatime") && (
                                <ImageSkeleton className="absolute inset-0 min-h-[500px]" />
                            )}
                            {visitedTabs.has("wakatime") && (
                                <img
                                    src="https://wakatime.com/share/@kyyril/9eb071bf-655b-4fb3-a970-6fc2f7c3b2ec.svg"
                                    alt="Wakatime Stats"
                                    className={`w-full h-auto transition-all duration-500 ${currentTheme === "light" ? "invert opacity-90" : "opacity-80"
                                        } ${loadingStates.wakatime ? 'opacity-0' : ''}`}
                                    loading="eager"
                                    onLoad={() => handleImageLoad('wakatime')}
                                />
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default DevActivity;
