import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, User, UserPlus } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import ParticleField from "@/components/ParticleField";
import ProgressBar from "@/components/ProgressBar";
import Navbar from "@/components/Navbar";

export default function SignUp() {
    const navigate = useNavigate();
    const { signUpWithEmail, signInWithGoogle, isLoading, user } = useAuthStore();

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!name.trim() || !email.trim() || !password.trim()) {
            setError("Please fill in all fields.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await signUpWithEmail(email, password, name);
            toast.success("Account created! Welcome to Prompt Forge Verse.");
            navigate("/");
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Sign up failed. Please try again.";
            setError(message);
            toast.error(message);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            toast.success("Welcome back!");
            navigate("/");
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Google sign in failed.";
            toast.error(message);
        }
    };

    return (
        <>
            <ParticleField />
            <div className="grid-lines scanlines-blue"></div>
            <div className="orb orb-red-topleft"></div>
            <div className="orb orb-blue-bottomleft"></div>
            <ProgressBar />
            <Navbar />

            <main
                className="relative z-[1] flex items-center justify-center min-h-screen px-4"
                style={{ paddingTop: "100px", paddingBottom: "60px" }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-md"
                >
                    {/* Card */}
                    <div
                        className="relative border border-border p-8 md:p-10"
                        style={{
                            background: "rgba(2,4,8,0.85)",
                            backdropFilter: "blur(24px)",
                            clipPath:
                                "polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)",
                        }}
                    >
                        {/* Accent line */}
                        <div
                            className="absolute top-0 left-0 w-full h-[2px]"
                            style={{
                                background:
                                    "linear-gradient(90deg, transparent, #1a4fff, #e8192c, transparent)",
                            }}
                        />

                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1
                                className="font-display text-2xl font-extrabold tracking-[.15em] uppercase text-secondary mb-2 glitch"
                                data-text="CREATE ACCOUNT"
                            >
                                CREATE ACCOUNT
                            </h1>
                            <p className="text-muted-foreground text-sm font-mono tracking-wide">
                                Join the prompt engineering revolution
                            </p>
                        </div>

                        {/* Google Button */}
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-border2 text-foreground font-display text-[.75rem] font-bold tracking-[.1em] uppercase transition-all duration-300 hover:border-secondary hover:bg-secondary/5 hover:text-secondary disabled:opacity-40 mb-6"
                            style={{
                                clipPath:
                                    "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continue with Google
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex-1 h-[1px] bg-border" />
                            <span className="text-muted-foreground text-[.65rem] font-mono tracking-[.2em] uppercase">
                                or
                            </span>
                            <div className="flex-1 h-[1px] bg-border" />
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name */}
                            <div className="relative">
                                <User
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                />
                                <input
                                    type="text"
                                    placeholder="Full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="field-input"
                                    style={{ paddingLeft: "2.5rem" }}
                                    autoComplete="name"
                                />
                            </div>

                            {/* Email */}
                            <div className="relative">
                                <Mail
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                />
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="field-input"
                                    style={{ paddingLeft: "2.5rem" }}
                                    autoComplete="email"
                                />
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <Lock
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password (min 6 characters)"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="field-input"
                                    style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>

                            {/* Confirm Password */}
                            <div className="relative">
                                <Lock
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="field-input"
                                    style={{ paddingLeft: "2.5rem" }}
                                    autoComplete="new-password"
                                />
                            </div>

                            {/* Error */}
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-destructive text-xs font-mono"
                                >
                                    {error}
                                </motion.p>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-sweep relative w-full py-3.5 font-display text-[.75rem] font-bold tracking-[.15em] uppercase overflow-hidden border border-secondary bg-secondary/10 text-secondary transition-all duration-300 hover:bg-secondary/20 disabled:opacity-40"
                                style={{
                                    clipPath:
                                        "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
                                }}
                            >
                                <span className="relative z-[2] flex items-center justify-center gap-2">
                                    <UserPlus size={16} />
                                    {isLoading ? "Creating account..." : "Create Account"}
                                </span>
                            </button>
                        </form>

                        {/* Footer */}
                        <p className="text-center text-muted-foreground text-xs font-mono mt-6 tracking-wide">
                            Already have an account?{" "}
                            <Link
                                to="/sign-in"
                                className="text-primary hover:text-secondary transition-colors font-bold no-underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </main>
        </>
    );
}
