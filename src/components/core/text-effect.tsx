"use client";

import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

type Preset = "blur" | "fade" | "scale" | "slide";

interface TextEffectProps {
    children: string;
    as?: React.ElementType;
    className?: string;
    style?: React.CSSProperties;
    per?: "word" | "char" | "line";
    preset?: Preset;
    delay?: number;
}

const defaultContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const defaultItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier matching the app
        },
    },
};

const presetVariants: Record<Preset, { container: Variants; item: Variants }> = {
    blur: {
        container: defaultContainerVariants,
        item: {
            hidden: { opacity: 0, filter: "blur(12px)" },
            visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.5 } },
        },
    },
    fade: {
        container: defaultContainerVariants,
        item: {
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.5 } },
        },
    },
    scale: {
        container: defaultContainerVariants,
        item: {
            hidden: { opacity: 0, scale: 0 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
        },
    },
    slide: {
        container: defaultContainerVariants,
        item: {
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
        },
    },
};

export function TextEffect({
    children,
    as: Component = "p",
    className,
    style,
    per = "word",
    preset = "fade",
    delay = 0,
}: TextEffectProps) {
    const words = children.split(" ");
    const { container, item } = presetVariants[preset];

    // Combine custom delay into container variants
    const customContainer = {
        ...container,
        visible: {
            ...container.visible,
            transition: {
                ...(container.visible as any)?.transition,
                delayChildren: delay,
            },
        },
    };

    const generateContent = () => {
        if (per === "word") {
            return words.map((word, i) => (
                <motion.span
                    key={`word-${i}`}
                    variants={item}
                    className="inline-block whitespace-pre"
                >
                    {word}{" "}
                </motion.span>
            ));
        }

        if (per === "char") {
            return words.map((word, i) => (
                <span key={`word-${i}`} className="inline-block whitespace-pre">
                    {word.split("").map((char, j) => (
                        <motion.span
                            key={`char-${j}`}
                            variants={item}
                            className="inline-block"
                        >
                            {char}
                        </motion.span>
                    ))}
                    {i !== words.length - 1 && " "}
                </span>
            ));
        }

        return <motion.span variants={item}>{children}</motion.span>;
    };

    const MotionComponent = motion(Component as any);

    return (
        <MotionComponent
            initial="hidden"
            animate="visible"
            variants={customContainer}
            className={cn(className)}
            style={style}
        >
            {generateContent()}
        </MotionComponent>
    );
}
