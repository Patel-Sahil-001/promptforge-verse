import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Generator from "./pages/Generator";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Pricing from "./pages/Pricing";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import CursorEffect from "@/components/CursorEffect";
import SmoothScroll from "@/components/SmoothScroll";

const queryClient = new QueryClient();

import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import CurtainTransition from "@/components/CurtainTransition";

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
              <ProtectedRoute>
                <Generator />
              </ProtectedRoute>
            </CurtainTransition>
          }
        />
        <Route
          path="/sign-in"
          element={
            <CurtainTransition>
              <SignIn />
            </CurtainTransition>
          }
        />
        <Route
          path="/sign-up"
          element={
            <CurtainTransition>
              <SignUp />
            </CurtainTransition>
          }
        />
        <Route
          path="/pricing"
          element={
            <CurtainTransition>
              <Pricing />
            </CurtainTransition>
          }
        />
        <Route
          path="*"
          element={
            <CurtainTransition>
              <NotFound />
            </CurtainTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const AppContent = () => {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

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
