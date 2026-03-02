import { create } from "zustand";

interface PromptState {
  selectedCategory: string;
  formValues: Record<string, string>;
  generatedPrompt: string;
  setCategory: (cat: string) => void;
  setFieldValue: (field: string, value: string) => void;
  setGeneratedPrompt: (prompt: string) => void;
  resetForm: () => void;
}

export const usePromptStore = create<PromptState>((set) => ({
  selectedCategory: "llm",
  formValues: {},
  generatedPrompt: "",
  setCategory: (cat) => set({ selectedCategory: cat, formValues: {}, generatedPrompt: "" }),
  setFieldValue: (field, value) =>
    set((state) => ({ formValues: { ...state.formValues, [field]: value } })),
  setGeneratedPrompt: (prompt) => set({ generatedPrompt: prompt }),
  resetForm: () => set({ formValues: {}, generatedPrompt: "" }),
}));
