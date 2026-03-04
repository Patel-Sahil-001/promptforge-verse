import { create } from "zustand";

interface PromptState {
  selectedCategory: string;
  formValues: Record<string, string>;
  generatedPrompt: string;
  // AI enhancement state
  userPrompt: string;
  enhancedPrompt: string;
  isEnhancing: boolean;
  enhanceError: string;
  apiKey: string;
  setCategory: (cat: string) => void;
  setFieldValue: (field: string, value: string) => void;
  setGeneratedPrompt: (prompt: string) => void;
  resetForm: () => void;
  setUserPrompt: (prompt: string) => void;
  setEnhancedPrompt: (prompt: string) => void;
  setIsEnhancing: (loading: boolean) => void;
  setEnhanceError: (error: string) => void;
  setApiKey: (key: string) => void;
}

export const usePromptStore = create<PromptState>((set) => ({
  selectedCategory: "llm",
  formValues: {},
  generatedPrompt: "",
  userPrompt: "",
  enhancedPrompt: "",
  isEnhancing: false,
  enhanceError: "",
  apiKey: localStorage.getItem("gemini_api_key") || import.meta.env.VITE_GEMINI_API_KEY || "",
  setCategory: (cat) => set({ selectedCategory: cat, formValues: {}, generatedPrompt: "", enhancedPrompt: "", enhanceError: "" }),
  setFieldValue: (field, value) =>
    set((state) => ({ formValues: { ...state.formValues, [field]: value } })),
  setGeneratedPrompt: (prompt) => set({ generatedPrompt: prompt }),
  resetForm: () => set({ formValues: {}, generatedPrompt: "" }),
  setUserPrompt: (prompt) => set({ userPrompt: prompt }),
  setEnhancedPrompt: (prompt) => set({ enhancedPrompt: prompt }),
  setIsEnhancing: (loading) => set({ isEnhancing: loading }),
  setEnhanceError: (error) => set({ enhanceError: error }),
  setApiKey: (key) => {
    localStorage.setItem("gemini_api_key", key);
    set({ apiKey: key });
  },
}));
