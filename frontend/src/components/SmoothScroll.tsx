import React from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';

interface SmoothScrollProps {
    children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
    return (
        <ReactLenis
            root
            options={{
                lerp: 0.08,             // Slower, smoother easing
                duration: 1.2,          // Duration of the scroll animation
                smoothWheel: true,      // Enable smooth scrolling for mouse wheels
                wheelMultiplier: 1.0,   // Scroll speed multiplier
                touchMultiplier: 2.0,   // Touch scroll speed multiplier
                infinite: false,        // Infinite scroll
            }}
        >
            {children}
        </ReactLenis>
    );
}
