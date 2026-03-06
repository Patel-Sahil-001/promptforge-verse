import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Generator from "./pages/Generator";
import NotFound from "./pages/NotFound";
import SmoothScroll from "@/components/SmoothScroll";

const queryClient = new QueryClient();

import { AnimatePresence, motion } from "framer-motion";
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
              <Generator />
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SmoothScroll>
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </SmoothScroll>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
