import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useCallback, useState, useRef, useEffect } from "react";
import { LogOut, Zap, ChevronDown, HomeIcon, Sparkles, Image as ImageIcon, PenLine, Star, LogIn } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/core/dock";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Home", to: "/", icon: HomeIcon },
  { label: "LLMs", to: "/generator?cat=llm", icon: Sparkles },
  { label: "Image", to: "/generator?cat=image", icon: ImageIcon },
  { label: "Studio", to: "/generator?cat=writing", icon: PenLine },
  { label: "Pricing", to: "/pricing", icon: Star },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { user, profile, credits, signOut } = useAuthStore();

  // Helper to check if a route is active
  const isActive = (path: string) => {
    return location.pathname === path.split('?')[0] &&
      (path.includes('?') ? location.search === `?${path.split('?')[1]}` : true);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
    navigate("/");
  };

  const displayName =
    profile?.display_name ||
    (user as any)?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  const avatarUrl = profile?.avatar_url || (user as any)?.user_metadata?.avatar_url;
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[1000] flex justify-center md:justify-between items-center px-6 md:px-12 py-4 md:py-5 backdrop-blur-2xl border-b border-border"
        style={{
          background: "rgba(2,4,8,0.8)",
          transform: "translateY(-100%)",
          animation: "navIn 1s 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
        }}
      >
        <Link to="/" className="flex items-center gap-2 sm:gap-4 no-underline shrink-0 max-w-full overflow-hidden">
          <img src="/Logo.png" alt="Logo" className="w-12 h-12 min-[400px]:w-14 min-[400px]:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain shrink-0 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-transform hover:scale-105 cursor-pointer z-10" />
          <span className="text-[0.85rem] min-[400px]:text-[0.95rem] sm:text-lg md:text-xl font-extrabold tracking-normal md:tracking-[.15em] text-primary font-display glitch relative whitespace-nowrap truncate" data-text="PROMPT FORGE VERSE">
            PROMPT FORGE VERSE
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 shrink-0">
          {/* Dock Navigation */}
          <div className="hidden md:flex mr-4">
            <Dock>
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.to);
                return (
                  <DockItem key={link.label} href={link.to} className={active ? "bg-primary/20 hover:bg-primary/30" : ""}>
                    <DockLabel>{link.label}</DockLabel>
                    <DockIcon>
                      <Icon className={active ? "text-primary" : "text-foreground"} />
                    </DockIcon>
                  </DockItem>
                );
              })}
            </Dock>
          </div>

          {/* Auth Section */}
          <ul className="flex gap-4 list-none items-center">
            <li>
              {user ? (
                /* Logged-in: User avatar + dropdown */
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 border border-border2 transition-all duration-300 hover:border-primary/50 hover:bg-primary/5"
                    style={{ clipPath: "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)" }}
                  >
                    {/* Avatar */}
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                        <span className="text-primary text-[.6rem] font-bold font-display">{initials}</span>
                      </div>
                    )}

                    {/* Credits badge */}
                    {credits && credits.limit !== Infinity && (
                      <span className="text-[.6rem] font-mono text-muted-foreground">
                        <Zap size={10} className="inline text-primary mr-0.5" />
                        {credits.remaining}/{credits.limit}
                      </span>
                    )}
                    {credits && credits.limit === Infinity && (
                      <span className="text-[.55rem] font-mono text-primary font-bold tracking-wider uppercase">
                        Pro
                      </span>
                    )}

                    <ChevronDown size={12} className={`text-muted-foreground transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown */}
                  {isUserMenuOpen && (
                    <div
                      className="absolute right-0 top-[calc(100%+8px)] w-56 border border-border py-2"
                      style={{
                        background: "rgba(2,4,8,0.95)",
                        backdropFilter: "blur(24px)",
                      }}
                    >
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-xs font-display font-bold text-foreground truncate">{displayName}</p>
                        <p className="text-[.6rem] font-mono text-muted-foreground truncate">{user.email}</p>
                        {profile?.plan && (
                          <span className={`inline-block mt-1.5 text-[.55rem] font-mono font-bold tracking-[.15em] uppercase px-2 py-0.5 border ${profile.plan === "free"
                            ? "border-muted-foreground/30 text-muted-foreground"
                            : "border-primary/50 text-primary bg-primary/10"
                            }`}>
                            {profile.plan.replace('_', ' ')} Plan
                          </span>
                        )}
                      </div>

                      <div className="py-2">
                        <Link
                          to="/pricing"
                          className="block px-4 py-2 text-[.75rem] font-mono text-foreground hover:bg-white/5 hover:text-primary transition-colors cursor-none"
                        >
                          Upgrade Plan
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-[.75rem] font-mono text-destructive hover:bg-destructive/10 transition-colors cursor-none flex items-center gap-2 mt-1 border-t border-border"
                        >
                          <LogOut size={14} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Logged-out: Sign In */
                <Link
                  to="/sign-in"
                  className="group whitespace-nowrap overflow-hidden relative px-5 py-2 inline-flex items-center gap-2 font-display text-[.68rem] font-bold tracking-[.15em] uppercase no-underline cursor-none transition-all duration-300 hover:scale-[1.03] hover:text-primary hover:border-primary border border-border2"
                  style={{ clipPath: "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)" }}
                >
                  Sign In
                  <LogIn size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </li>
          </ul>
        </div>
      </nav>

      {/* MOBILE BOTTOM DOCK */}
      <div className="fixed bottom-0 left-0 right-0 z-[1000] flex md:hidden justify-center pointer-events-none pb-[env(safe-area-inset-bottom,16px)] mb-4">
        <div className="mobile-dock flex w-[94%] max-w-[420px] items-center justify-between p-2 pointer-events-auto">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <div key={link.label} className={`nav-icon-container w-1/5 ${active ? "active" : ""}`}>
                <Link to={link.to} className="flex flex-col items-center justify-center w-full outline-none">
                  <div className={`nav-icon-circle ${active ? "active" : ""}`}>
                    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                  </div>
                  <span className="nav-label">{link.label}</span>
                </Link>
              </div>
            );
          })}

          {/* Mobile Auth Button */}
          <div className="w-1/5 relative flex justify-center" ref={userMenuRef}>
            <div className={`nav-icon-container w-full ${isUserMenuOpen ? "active" : ""}`}>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
                className="flex flex-col items-center justify-center w-full outline-none"
              >
                <div className={`nav-icon-circle ${isUserMenuOpen ? "active" : ""}`}>
                  {user ? (
                    avatarUrl ? (
                      <img src={avatarUrl} alt={displayName} className={`w-[24px] h-[24px] rounded-full object-cover border ${isUserMenuOpen ? "border-transparent" : "border-white/20"}`} />
                    ) : (
                      <span className="font-bold font-display text-xs">{initials}</span>
                    )
                  ) : (
                    <LogIn size={20} strokeWidth={isUserMenuOpen ? 2.5 : 2} />
                  )}
                </div>
                <span className="nav-label">{user ? "Profile" : "Sign In"}</span>
              </button>
            </div>

            {/* Mobile Auth Dropdown (expands upwards) */}
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute bottom-[calc(100%+8px)] right-0 w-56 border border-white/10 p-1.5 rounded-2xl shadow-2xl"
                  style={{ background: "rgba(10,15,24,0.95)", backdropFilter: "blur(24px)" }}
                >
                  {user ? (
                    <>
                      <div className="px-3 py-3 border-b border-white/5 mb-1 bg-white/5 rounded-xl">
                        <p className="text-sm font-display font-bold text-foreground truncate">{displayName}</p>
                        <p className="text-[0.65rem] font-mono text-muted-foreground truncate">{user.email}</p>
                        <div className="flex gap-2 mt-2.5">
                          {profile?.plan && (
                            <span className={`inline-block text-[.55rem] font-mono font-bold tracking-[.15em] uppercase px-2 py-0.5 rounded-md border ${profile.plan === "free" ? "border-muted-foreground/30 text-muted-foreground bg-black/50" : "border-primary/50 text-primary bg-primary/10"}`}>
                              {profile.plan.replace('_', ' ')}
                            </span>
                          )}
                          {credits && credits.limit !== Infinity && (
                            <span className="inline-block text-[.55rem] font-mono font-bold tracking-[.15em] px-2 py-0.5 rounded-md bg-secondary/10 border border-secondary/30 text-secondary">
                              <Zap size={8} className="inline mr-1" />{credits.remaining}/{credits.limit}
                            </span>
                          )}
                          {credits && credits.limit === Infinity && (
                            <span className="inline-block text-[.55rem] font-mono font-bold tracking-[.15em] px-2 py-0.5 rounded-md bg-primary/10 border border-primary/30 text-primary">
                              <Zap size={8} className="inline mr-1" />PRO
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Link to="/pricing" onClick={() => setIsUserMenuOpen(false)} className="px-3 py-2.5 text-[0.8rem] font-medium text-foreground hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2">
                           <Star size={16} className="text-primary"/> Upgrade Plan
                        </Link>
                        <button onClick={handleSignOut} className="w-full text-left px-3 py-2.5 text-[0.8rem] font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2">
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="py-2">
                      <div className="px-4 pb-3 border-b border-white/10 mb-2 text-center">
                        <p className="text-[0.7rem] font-mono text-muted-foreground">Log in to save your prompts across devices.</p>
                      </div>
                      <Link to="/sign-in" onClick={() => setIsUserMenuOpen(false)} className="mx-2 flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-primary-foreground font-display text-[0.75rem] font-bold tracking-widest uppercase rounded-lg">
                        <LogIn size={14} /> Sign In
                      </Link>
                      <Link to="/sign-up" onClick={() => setIsUserMenuOpen(false)} className="mx-2 mt-2 flex items-center justify-center gap-2 py-2.5 px-4 bg-transparent border border-white/20 text-foreground hover:border-primary font-display text-[0.75rem] font-bold tracking-widest uppercase rounded-lg transition-colors">
                        Create Account
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
