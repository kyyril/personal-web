"use client";

import React from "react";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
} from "./ui/dialog";
import { cn } from "../lib/utils";

interface ImagePreviewProps {
    src: string;
    alt: string;
    children: React.ReactNode;
    className?: string;
    aspectRatio?: "video" | "square" | "auto";
}

export default function ImagePreview({
    src,
    alt,
    children,
    className,
    aspectRatio = "video",
}: ImagePreviewProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <span className={cn("cursor-zoom-in transition-opacity hover:opacity-95 block", className)}>
                    {children}
                </span>
            </DialogTrigger>
            <DialogContent
                className="max-w-[95vw] md:max-w-[90vw] lg:max-w-[85vw] p-0 overflow-hidden border-none bg-transparent shadow-2xl"
                closeClassName="right-0 top-0 rounded-none rounded-bl-lg bg-background/60 backdrop-blur-xl p-3 hover:bg-background/80 transition-all duration-200 m-0 text-foreground border-none outline-none focus:ring-0 focus:ring-offset-0"
            >
                <DialogTitle className="sr-only">Image Preview: {alt}</DialogTitle>
                <div className="relative w-full flex items-center justify-center p-2 md:p-4 bg-none">
                    <img
                        src={src}
                        alt={alt}
                        className="w-full h-auto max-h-[85vh] object-contain rounded-md shadow-lg"
                        style={{
                            WebkitBackfaceVisibility: "hidden"
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
