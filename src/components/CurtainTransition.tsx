import { motion, useIsPresent } from "framer-motion";
import { useEffect, useRef } from "react";
import { animateIn } from "@/lib/animations";

export default function CurtainTransition({ children }: { children: React.ReactNode }) {
    const isPresent = useIsPresent();
    const pageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isPresent && pageRef.current) {
            setTimeout(() => {
                if (pageRef.current) {
                    animateIn(pageRef.current);
                }
            }, 50);
        }
    }, [isPresent]);

    return (
        <div ref={pageRef} className="page-wrapper relative w-full h-full min-h-screen">
            {children}

            <motion.div
                className="fixed top-0 left-0 bottom-0 w-[50.1%] bg-[#e8192c] z-[9999] pointer-events-none"
                initial={{ scaleX: 1, transformOrigin: "right center" }}
                animate={{ scaleX: 0, transformOrigin: "right center", transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1], delay: 0.04 } }}
                exit={{ scaleX: 1, transformOrigin: "left center", transition: { duration: 0.36, ease: [0.76, 0, 0.24, 1] } }}
            />
            <motion.div
                className="fixed top-0 right-0 bottom-0 w-[50.1%] bg-[#1a4fff] z-[9999] pointer-events-none"
                initial={{ scaleX: 1, transformOrigin: "left center" }}
                animate={{ scaleX: 0, transformOrigin: "left center", transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] } }}
                exit={{ scaleX: 1, transformOrigin: "right center", transition: { duration: 0.36, ease: [0.76, 0, 0.24, 1], delay: 0.055 } }}
            />
        </div>
    );
}
