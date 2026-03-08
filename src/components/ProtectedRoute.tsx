import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, isLoading, isInitialized } = useAuthStore();

    // Still loading auth state — show spinner
    if (!isInitialized || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div
                        className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"
                    />
                    <span className="text-muted-foreground text-xs font-mono tracking-[.2em] uppercase">
                        Authenticating...
                    </span>
                </motion.div>
            </div>
        );
    }

    // Not authenticated — redirect to sign-in
    if (!user) {
        return <Navigate to="/sign-in" replace />;
    }

    return <>{children}</>;
}
