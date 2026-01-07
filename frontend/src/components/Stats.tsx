"use client";

import React from "react";
import { motion } from "framer-motion";
import { projects, experiences } from "@/lib/data";

const Stats: React.FC = () => {
    // Calculate some stats dynamically
    const projectCount = projects.length;

    // Get all unique technologies
    const allTechs = new Set([
        ...experiences.flatMap((e) => e.technologies),
        ...projects.flatMap((p) => p.technologies),
    ]);
    const techCount = allTechs.size;

    // Assuming articles count is 6 (from content folder)
    const articleCount = 6;

    const stats = [
        {
            label: "Years of Practice",
            value: "1+",
            description: "Building software",
        },
        {
            label: "Projects Done",
            value: projectCount.toString(),
            description: "Open source & clients",
        },
        {
            label: "Blog Posts",
            value: articleCount.toString(),
            description: "Technical writing",
        },
        {
            label: "Technologies",
            value: `${techCount}+`,
            description: "Tools & Frameworks",
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
            },
        },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-4xl mt-12"
        >
            {stats.map((stat, index) => (
                <motion.div
                    key={index}
                    variants={itemVariants}
                    className="group relative flex flex-col p-5 rounded-2xl border border-muted/10 bg-card/10 backdrop-blur-[2px] hover:border-foreground/20 hover:bg-card/20 transition-all duration-500 overflow-hidden"
                >
                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-muted/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="text-4xl font-bold text-foreground mb-1 tracking-tighter group-hover:scale-105 transition-transform duration-500 origin-left">
                        {stat.value}
                    </div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">
                        {stat.label}
                    </div>
                    <div className="text-xs text-muted-foreground/60 leading-tight">
                        {stat.description}
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default Stats;
