"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

// Make Dock items magnify based on mouse proximity
// Using framer-motion's useMotionValue and useTransform for performant unmounted animation

interface DockProps {
    className?: string;
    children: React.ReactNode;
}

export function Dock({ className, children }: DockProps) {
    // Track mouse X position relative to the viewport
    const mouseX = useMotionValue(Infinity);

    return (
        <motion.div
            className={cn(
                "flex items-center gap-2 rounded-2xl bg-black/40 backdrop-blur-xl border border-border px-3 h-14 shadow-lg transition-colors hover:border-primary/50",
                className
            )}
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
        >
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    // Pass mouseX down to each valid child
                    return React.cloneElement(child, {
                        mouseX,
                    } as any);
                }
                return child;
            })}
        </motion.div>
    );
}

interface DockItemProps {
    className?: string;
    children: React.ReactNode;
    href?: string;
    onClick?: () => void;
    mouseX?: any; // Received from Dock parent
}

export function DockItem({ className, children, href, onClick, mouseX }: DockItemProps) {
    const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

    // Calculate distance between mouseX and the center of this item
    const distance = useTransform(mouseX, (val: number) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    // Map distance to width/height
    const sizeTransform = useTransform(distance, [-150, 0, 150], [48, 80, 48]);
    const size = useSpring(sizeTransform, { mass: 0.1, stiffness: 150, damping: 12 });

    const content = (
        <>
            {children}
            {/* The sweep effect inner border */}
            <div className="absolute inset-0 rounded-full border border-border2 transition-colors group-hover:border-primary" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </>
    );

    const baseClasses = cn(
        "group relative flex aspect-square items-center justify-center rounded-full bg-background transition-colors hover:bg-black overflow-visible",
        className
    );

    // If it's a link
    if (href) {
        return (
            <motion.a
                ref={ref as any}
                href={href}
                className={baseClasses}
                style={{ width: size, height: size }}
            >
                {content}
            </motion.a>
        );
    }

    // If it's a button
    return (
        <motion.button
            ref={ref as any}
            onClick={onClick}
            className={baseClasses}
            style={{ width: size, height: size }}
        >
            {content}
        </motion.button>
    );
}

export function DockIcon({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            whileHover={{ scale: 1.15, rotate: [-5, 5, 0] }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
            className="relative z-10 flex h-full w-full items-center justify-center text-foreground/70 transition-colors group-hover:text-primary"
        >
            {children}
        </motion.div>
    );
}

export function DockLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 opacity-0 -translate-y-2 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 whitespace-nowrap z-50">
            <span className="bg-black/95 border border-border px-3 py-1.5 rounded-md font-display text-[0.65rem] uppercase tracking-widest text-foreground shadow-lg backdrop-blur-md block">
                {children}
            </span>
            {/* Tooltip triangle */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/95 border-l border-t border-border rotate-45" />
        </div>
    );
}
