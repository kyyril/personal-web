"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { BarChart3, Github, Clock, Layout } from "lucide-react";

type TabType = "overview" | "languages" | "wakatime";

const DevActivity: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>("overview");
    const [mounted, setMounted] = useState(false);
    const { theme } = useTheme();

    // Fix hydration mismatch by only rendering theme-specific content after mount
    React.useEffect(() => {
        setMounted(true);
    }, []);

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

            <div className="relative min-h-[300px]">
                {/* GitHub Tab Content */}
                <div className={activeTab === "overview" ? "block" : "hidden"}>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col gap-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="overflow-hidden">
                                <img
                                    src={githubStatsUrl}
                                    alt="GitHub Stats"
                                    className="w-full h-auto"
                                    loading="lazy"
                                />
                            </div>
                            <div className="overflow-hidden">
                                <img
                                    src={githubStreakUrl}
                                    alt="GitHub Streak"
                                    className="w-full h-auto"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                        <div className="flex justify-center w-full">
                            <div className="w-full md:w-1/2 overflow-hidden">
                                <img
                                    src={githubLangsUrl}
                                    alt="Top Languages"
                                    className="w-full h-auto"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* WakaTime Tab Content */}
                <div className={activeTab === "wakatime" ? "block" : "hidden"}>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex justify-center items-center overflow-hidden py-4"
                    >
                        <img
                            src="https://wakatime.com/share/@kyyril/9eb071bf-655b-4fb3-a970-6fc2f7c3b2ec.svg"
                            alt="Wakatime Stats"
                            className={`w-full max-w-2xl h-auto transition-all duration-500 ${currentTheme === "light" ? "invert opacity-90" : "opacity-80"
                                }`}
                            loading="lazy"
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default DevActivity;
