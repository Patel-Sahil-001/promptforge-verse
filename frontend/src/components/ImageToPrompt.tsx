import React, { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { UploadCloud, Image as ImageIcon, Copy, Wand2, X } from "lucide-react";
import { analyzeImage } from "@/services/aiService";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ImageToPrompt() {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const [output, setOutput] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState("");

    const { credits, deductLocalCredit } = useAuthStore();
    const navigate = useNavigate();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleMagMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const w = e.currentTarget;
        const r = w.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        w.style.transform = `translate(${(e.clientX - cx) * 0.3}px, ${(e.clientY - cy) * 0.3}px)`;
    }, []);

    const handleMagLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = "";
    }, []);

    const processFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("Please upload a valid image file (JPEG, PNG, WebP).");
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError("Image size must be less than 5MB.");
            return;
        }

        setImageFile(file);
        setError("");

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const handleGenerate = async () => {
        if (!imagePreviewUrl || !imageFile) {
            setError("Please upload an image first.");
            return;
        }

        setIsGenerating(true);
        setError("");
        setOutput("");

        try {
            const result = await analyzeImage(imagePreviewUrl, imageFile.type);
            setOutput(result);
            deductLocalCredit();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to analyze image.";
            if (message.includes("free credits")) {
                toast.error("Limit Reached", { description: message });
                navigate("/pricing");
            }
            setError(message);
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        toast.success("Copied to clipboard!");
    };

    const clearImage = () => {
        setImageFile(null);
        setImagePreviewUrl(null);
        setOutput("");
        setError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border lg:min-h-[700px]"
        >
            {/* Left Panel - Input */}
            <div className="bg-background p-5 md:p-10 flex flex-col gap-5 md:gap-6 relative">
                <div className="font-mono text-[.65rem] tracking-[.2em] text-foreground/35 uppercase mb-2 flex items-center gap-4">
                    Image Uploader
                    <span className="flex-1 h-px bg-border" />
                </div>

                <div
                    className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-border2 bg-black/20 hover:border-foreground/30 hover:bg-black/40"
                        } ${imagePreviewUrl ? "border-none bg-transparent p-0 overflow-hidden" : ""}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                >
                    {imagePreviewUrl ? (
                        <div className="relative w-full h-full group">
                            <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-contain bg-black/50 rounded-xl" />
                            <button
                                onClick={clearImage}
                                className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90 backdrop-blur-sm"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <UploadCloud size={48} className="mx-auto mb-4 text-foreground/30" />
                            <h3 className="font-display font-bold text-lg mb-2 text-foreground/80">Drag & Drop Image</h3>
                            <p className="text-sm font-mono text-foreground/50 mb-6">or click to browse from your computer</p>

                            <input
                                type="file"
                                accept="image/jpeg, image/png, image/webp"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-6 py-2 border border-border2 rounded-lg font-mono text-[.75rem] uppercase tracking-wider hover:bg-white/5 transition-colors"
                            >
                                Browse Files
                            </button>
                            <p className="mt-6 text-[.6rem] uppercase tracking-widest text-foreground/30">Supports JPEG, PNG, WEBP (Max 5MB)</p>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 font-mono text-[.7rem] text-red-400 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="pt-4 mag-wrap w-full" onMouseMove={handleMagMove} onMouseLeave={handleMagLeave}>
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !imagePreviewUrl || Boolean(credits && credits.limit !== Infinity && credits.remaining === 0)}
                        className="btn-sweep relative px-8 py-3.5 font-display text-[.72rem] font-bold tracking-[.15em] uppercase cursor-none overflow-hidden bg-primary text-primary-foreground transition-all duration-300 hover:scale-[1.03] disabled:opacity-50 disabled:hover:scale-100 w-full"
                        style={{ clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)" }}
                    >
                        {isGenerating ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="inline-block w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                Analyzing Image...
                            </span>
                        ) : (
                            "🔍 Extract Prompt"
                        )}
                    </button>
                </div>
            </div>

            {/* Right Panel - Output */}
            <div className="bg-background p-5 md:p-10 flex flex-col lg:min-h-[700px]">
                <div className="font-mono text-[.65rem] tracking-[.2em] text-foreground/35 uppercase mb-7 flex items-center justify-between gap-4">
                    <span className="flex items-center gap-4 flex-1">
                        Generated Prompt
                        <span className="flex-1 h-px bg-border" />
                    </span>
                    {output && !isGenerating && (
                        <button
                            onClick={copyToClipboard}
                            className="text-foreground/40 hover:text-primary transition-colors duration-200 font-mono text-[.65rem] tracking-[.1em] uppercase flex items-center gap-1.5"
                        >
                            📋 Copy
                        </button>
                    )}
                </div>

                <div className="flex-1 bg-black/40 border border-border p-6 font-mono text-[.78rem] leading-[1.9] text-foreground/80 whitespace-pre-wrap break-words min-h-[300px] overflow-y-auto mb-8">
                    {isGenerating ? (
                        <div className="space-y-3 animate-pulse">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-3 bg-foreground/5 rounded"
                                    style={{ width: `${70 + Math.random() * 30}%` }}
                                />
                            ))}
                        </div>
                    ) : output ? (
                        output
                    ) : (
                        <span className="text-foreground/20 italic">
                            Upload an image and hit generate to see the extracted visual prompt...
                        </span>
                    )}
                </div>

                {/* Tips Card */}
                <div className="border border-border bg-black/20 p-6 mt-auto">
                    <div className="font-mono text-[.65rem] tracking-[.2em] text-foreground/35 uppercase mb-4 flex items-center gap-4">
                        How it works
                        <span className="flex-1 h-px bg-border" />
                    </div>

                    <div className="flex flex-col gap-3 font-mono text-[.7rem] text-foreground/60 leading-relaxed">
                        <div className="flex items-start gap-3">
                            <span className="text-primary mt-0.5"><Wand2 size={14} /></span>
                            <p>Our VLM (Vision Language Model) analyzes your image pixel-by-pixel.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-primary mt-0.5"><ImageIcon size={14} /></span>
                            <p>It identifies camera angles, art styles, lighting setups, and core subjects.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-primary mt-0.5"><Copy size={14} /></span>
                            <p>It generates a highly descriptive Stable Diffusion / Midjourney prompt for you to copy.</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
