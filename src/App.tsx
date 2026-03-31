import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index"; // Eager loaded for optimal LCP

const Generator = lazy(() => import("./pages/Generator"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Pricing = lazy(() => import("./pages/Pricing"));

const PageLoader = () => (
  <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      <span className="text-sm text-muted-foreground font-mono">LOADING VERSE...</span>
    </div>
  </div>
);
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import CursorEffect from "@/components/CursorEffect";
import SmoothScroll from "@/components/SmoothScroll";

const queryClient = new QueryClient();

import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import CurtainTransition from "@/components/CurtainTransition";
import { useOffline } from "@/hooks/useOffline";
import { toast } from "sonner";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname + location.search}>
        <Route
          path="/"
          element={
            <CurtainTransition>
              <Index />
            </CurtainTransition>
          }
        />
        <Route
          path="/generator"
          element={
            <CurtainTransition>
              <Suspense fallback={<PageLoader />}>
                <ProtectedRoute>
                  <Generator />
                </ProtectedRoute>
              </Suspense>
            </CurtainTransition>
          }
        />
        <Route
          path="/sign-in"
          element={
            <CurtainTransition>
              <Suspense fallback={<PageLoader />}>
                <SignIn />
              </Suspense>
            </CurtainTransition>
          }
        />
        <Route
          path="/sign-up"
          element={
            <CurtainTransition>
              <Suspense fallback={<PageLoader />}>
                <SignUp />
              </Suspense>
            </CurtainTransition>
          }
        />
        <Route
          path="/pricing"
          element={
            <CurtainTransition>
              <Suspense fallback={<PageLoader />}>
                <Pricing />
              </Suspense>
            </CurtainTransition>
          }
        />
        <Route
          path="*"
          element={
            <CurtainTransition>
              <Suspense fallback={<PageLoader />}>
                <NotFound />
              </Suspense>
            </CurtainTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const AppContent = () => {
  const initialize = useAuthStore((s) => s.initialize);
  const isOffline = useOffline();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isOffline) {
      toast.error("You are currently offline. Some features may be unavailable.", {
        id: "offline-status",
        duration: Infinity,
      });
    } else {
      toast.dismiss("offline-status");
      // Only show success if they were actually offline before
      if (!isOffline && window.navigator.onLine) {
         // We can't easily track transitions here without an extra ref, 
         // but simple dismiss is enough for now.
      }
    }
  }, [isOffline]);

  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CursorEffect />
      <SmoothScroll>
        <AppContent />
      </SmoothScroll>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
