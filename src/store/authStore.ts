import { create } from "zustand";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebaseClient";

// Abstract User interface to replace Supabase's User type
export interface AppUser {
    id: string;
    email: string | null;
}

export interface Profile {
    id: string;
    email: string;
    display_name: string | null;
    avatar_url: string | null;
    plan: "free" | "pro_monthly" | "pro_yearly";
    plan_started_at: string | null;
    plan_expires_at: string | null;
}

export interface Credits {
    used: number;
    remaining: number;
    limit: number;
}

interface AuthState {
    user: AppUser | null;
    profile: Profile | null;
    credits: Credits | null;
    isLoading: boolean;
    isInitialized: boolean;

    initialize: () => void;
    fetchProfile: (uid: string) => Promise<void>;
    refreshCredits: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (
        email: string,
        password: string,
        name: string
    ) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    deductLocalCredit: () => void;
    updateProfile: (partial: Partial<Profile>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    profile: null,
    credits: null,
    isLoading: true,
    isInitialized: false,

    initialize: () => {
        // Listen for Firebase auth state changes
        onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const appUser: AppUser = { id: firebaseUser.uid, email: firebaseUser.email };
                set({ user: appUser, isLoading: false, isInitialized: true });
                await get().fetchProfile(firebaseUser.uid);
                await get().refreshCredits();
            } else {
                set({
                    user: null,
                    profile: null,
                    credits: null,
                    isLoading: false,
                    isInitialized: true
                });
            }
        });
    },

    fetchProfile: async (uid: string) => {
        try {
            const docRef = doc(db, "profiles", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                set({ profile: docSnap.data() as Profile });
            } else {
                // Fallback or create missing profile
                const currentUser = auth.currentUser;
                if (currentUser) {
                    const newProfile: Profile = {
                        id: uid,
                        email: currentUser.email || "",
                        display_name: currentUser.displayName || currentUser.email?.split("@")[0] || "User",
                        avatar_url: currentUser.photoURL || null,
                        plan: "free",
                        plan_started_at: null,
                        plan_expires_at: null,
                    };

                    await setDoc(docRef, newProfile);
                    set({ profile: newProfile });
                }
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        }
    },

    refreshCredits: async () => {
        const { profile, user } = get();
        if (!profile || !user) return;

        // Pro users have unlimited credits
        if (profile.plan !== "free") {
            set({ credits: { used: 0, remaining: Infinity, limit: Infinity } });
            return;
        }

        // For free users, check daily usage
        try {
            const today = new Date().toISOString().split("T")[0];
            const docRef = doc(db, "daily_credits", `${user.id}_${today}`);
            const docSnap = await getDoc(docRef);

            const limit = 10;
            let used = 0;

            if (docSnap.exists()) {
                used = docSnap.data().credits_used || 0;
            }

            set({ credits: { used, remaining: Math.max(0, limit - used), limit } });
        } catch (error) {
            console.error("Failed to refresh credits:", error);
        }
    },

    deductLocalCredit: () => {
        const credits = get().credits;
        if (credits && credits.limit !== Infinity && credits.remaining > 0) {
            set({
                credits: {
                    ...credits,
                    used: credits.used + 1,
                    remaining: credits.remaining - 1,
                }
            });
        }
    },

    signInWithEmail: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } finally {
            set({ isLoading: false });
        }
    },

    signUpWithEmail: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Update Firebase Profile
            await updateProfile(userCredential.user, { displayName: name });

            // Create user document in Firestore immediately
            const newProfile: Profile = {
                id: userCredential.user.uid,
                email: email,
                display_name: name,
                avatar_url: null,
                plan: "free",
                plan_started_at: null,
                plan_expires_at: null,
            };

            // Avoid fetching immediately since we construct it here
            await setDoc(doc(db, "profiles", userCredential.user.uid), newProfile);
            set({ profile: newProfile });

        } finally {
            set({ isLoading: false });
        }
    },

    signInWithGoogle: async () => {
        await signInWithPopup(auth, googleProvider);
    },

    signOut: async () => {
        await firebaseSignOut(auth);
        set({ user: null, profile: null, credits: null });
    },

    updateProfile: (partial) =>
        set((state) => ({
            profile: state.profile ? { ...state.profile, ...partial } : state.profile,
        })),
}));
