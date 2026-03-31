"use client";

import { cn } from "@/lib/utils";
import {
    type CSSProperties,
    cloneElement,
    type ReactElement,
    type Ref,
    useEffect,
    useRef,
    useState,
} from "react";

export interface GlowHoverTheme {
    hue: number;
    saturation: number;
    lightness: number;
}

export interface GlowHoverItem {
    id: string;
    element: ReactElement;
    theme?: GlowHoverTheme;
}

export interface GlowHoverProps {
    items: GlowHoverItem[];
    className?: string;
    maskSize?: number;
    glowIntensity?: number;
}

export default function GlowHover({
    items,
    className = "",
    maskSize = 450,
    glowIntensity = 0.12,
}: GlowHoverProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLElement | null)[]>([]);
    const overlayItemRefs = useRef<(HTMLElement | null)[]>([]);
    const [mousePosition, setMousePosition] = useState<{
        x: number;
        y: number;
        opacity: number;
    }>({ x: 0, y: 0, opacity: 0 });

    // Detect reduced motion preference
    const prefersReducedMotion =
        typeof window !== "undefined"
            ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
            : false;

    useEffect(() => {
        const container = containerRef.current;
        if (!container || prefersReducedMotion) return;

        const handlePointerMove = (e: PointerEvent) => {
            const rect = container.getBoundingClientRect();
            setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top, opacity: 1 });
        };

        const handlePointerLeave = () => {
            setMousePosition((prev) => ({ ...prev, opacity: 0 }));
        };

        container.addEventListener("pointermove", handlePointerMove);
        container.addEventListener("pointerleave", handlePointerLeave);
        return () => {
            container.removeEventListener("pointermove", handlePointerMove);
            container.removeEventListener("pointerleave", handlePointerLeave);
        };
    }, [prefersReducedMotion]);

    // Sync overlay card sizes and positions
    useEffect(() => {
        if (prefersReducedMotion || !overlayRef.current || !containerRef.current) return;

        const syncCards = () => {
            const container = containerRef.current;
            const overlay = overlayRef.current;
            if (!(container && overlay)) return;

            itemRefs.current.forEach((itemEl, index) => {
                const overlayItemEl = overlayItemRefs.current[index];
                if (!(itemEl && overlayItemEl)) return;

                const itemRect = itemEl.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();

                overlayItemEl.style.position = "absolute";
                overlayItemEl.style.left = `${itemRect.left - containerRect.left}px`;
                overlayItemEl.style.top = `${itemRect.top - containerRect.top}px`;
                overlayItemEl.style.width = `${itemRect.width}px`;
                overlayItemEl.style.height = `${itemRect.height}px`;
            });
        };

        const observers: ResizeObserver[] = [];
        const mutationObserver = new MutationObserver(syncCards);

        for (const itemEl of itemRefs.current) {
            if (!itemEl) continue;
            const observer = new ResizeObserver(syncCards);
            observer.observe(itemEl);
            observers.push(observer);
        }

        if (containerRef.current) {
            mutationObserver.observe(containerRef.current, {
                childList: true,
                subtree: true,
                attributes: true,
            });
        }

        syncCards();
        window.addEventListener("scroll", syncCards, { passive: true });
        window.addEventListener("resize", syncCards);

        return () => {
            for (const observer of observers) observer.disconnect();
            mutationObserver.disconnect();
            window.removeEventListener("scroll", syncCards);
            window.removeEventListener("resize", syncCards);
        };
    }, [prefersReducedMotion]);

    const applyGlowStyles = (
        element: ReactElement,
        theme?: GlowHoverTheme,
        isOverlay = false
    ): ReactElement => {
        if (!isOverlay) return element;

        const props = element.props as { style?: CSSProperties; className?: string };
        const existingStyle = props.style || {};

        let glowStyles: CSSProperties;
        if (theme) {
            const hsl = `${theme.hue}, ${theme.saturation}%, ${theme.lightness}%`;
            glowStyles = {
                borderColor: `hsla(${hsl}, 0.8)`,
                boxShadow: `0 0 0 1px inset hsla(${hsl}, 0.5), 0 0 25px hsla(${hsl}, ${glowIntensity})`,
                backgroundColor: `hsla(${hsl}, ${glowIntensity})`,
            };
        } else {
            // Default: primary (red) brand color
            glowStyles = {
                borderColor: `hsl(0 100% 56% / 0.8)`,
                boxShadow: `0 0 0 1px inset hsl(0 100% 56% / 0.5), 0 0 25px hsl(0 100% 56% / ${glowIntensity})`,
                backgroundColor: `hsl(0 100% 56% / ${glowIntensity})`,
            };
        }

        return cloneElement(element, {
            ...props,
            style: { ...existingStyle, ...glowStyles },
            children: null,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
    };

    return (
        <div
            className={cn("relative", className)}
            ref={containerRef}
            style={prefersReducedMotion ? undefined : { willChange: "contents" }}
        >
            {/* Original Items */}
            <div className="contents">
                {items.map((item, index) =>
                    cloneElement(item.element, {
                        key: item.id,
                        ref: (el: HTMLElement | null) => {
                            itemRefs.current[index] = el;
                            const elementProps = item.element.props as { ref?: Ref<HTMLElement> };
                            const existingRef = elementProps?.ref;
                            if (typeof existingRef === "function") existingRef(el);
                            else if (existingRef && typeof existingRef === "object") {
                                (existingRef as { current: HTMLElement | null }).current = el;
                            }
                        },
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } as any)
                )}
            </div>

            {/* Glow Overlay */}
            {!prefersReducedMotion && (
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 select-none"
                    ref={overlayRef}
                    style={{
                        opacity: mousePosition.opacity,
                        maskImage: `radial-gradient(${maskSize}px ${maskSize}px at ${mousePosition.x}px ${mousePosition.y}px, #000 1%, transparent 50%)`,
                        WebkitMaskImage: `radial-gradient(${maskSize}px ${maskSize}px at ${mousePosition.x}px ${mousePosition.y}px, #000 1%, transparent 50%)`,
                        transition: "opacity 200ms ease",
                        willChange: "mask-image, opacity",
                    }}
                >
                    {items.map((item, index) => {
                        const glowElement = applyGlowStyles(item.element, item.theme, true);
                        return cloneElement(glowElement, {
                            key: item.id,
                            ref: (el: HTMLElement | null) => {
                                overlayItemRefs.current[index] = el;
                            },
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        } as any);
                    })}
                </div>
            )}
        </div>
    );
}
