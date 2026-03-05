export interface CategoryField {
  id: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
}

export interface Category {
  label: string;
  icon: string;
  fields: CategoryField[];
  template: (values: Record<string, string>) => string;
}

const categories: Record<string, Category> = {
  llm: {
    label: "LLM / ChatGPT",
    icon: "🤖",
    fields: [
      { id: "role", label: "Role / Persona", type: "text", placeholder: "Expert data scientist..." },
      { id: "task", label: "Task", type: "textarea", placeholder: "Describe the task..." },
      { id: "context", label: "Context / Background", type: "textarea", placeholder: "Provide context..." },
      { id: "tone", label: "Tone", type: "select", options: ["Formal", "Casual", "Technical", "Friendly"] },
      { id: "format", label: "Output Format", type: "select", options: ["Paragraph", "Bullet list", "JSON", "Table", "Step-by-step"] },
      { id: "constraints", label: "Constraints", type: "text", placeholder: "Max 200 words, no jargon..." },
    ],
    template: ({ role, task, context, tone, format, constraints }) =>
      `You are a ${role || "..."}.\n\nYour task: ${task || "..."}\n\nContext: ${context || "..."}\n\nTone: ${tone || "..."}\nOutput format: ${format || "..."}\nConstraints: ${constraints || "..."}`,
  },
  image: {
    label: "Image Generation",
    icon: "🎨",
    fields: [
      { id: "subject", label: "Subject", type: "text", placeholder: "A futuristic cityscape..." },
      { id: "style", label: "Art Style", type: "select", options: ["Photorealistic", "Oil painting", "Anime", "Watercolor", "3D render", "Pixel art"] },
      { id: "lighting", label: "Lighting", type: "select", options: ["Golden hour", "Studio", "Neon", "Natural", "Dramatic"] },
      { id: "mood", label: "Mood", type: "text", placeholder: "Serene, mysterious..." },
      { id: "palette", label: "Color Palette", type: "text", placeholder: "Warm earth tones..." },
      { id: "camera", label: "Camera / Angle", type: "text", placeholder: "Wide angle, bokeh, 85mm lens..." },
    ],
    template: ({ subject, style, lighting, mood, palette, camera }) =>
      `${subject || "..."}, ${style || "..."}, ${lighting || "..."} lighting, ${mood || "..."} mood, color palette: ${palette || "..."}, ${camera || "..."}`,
  },
  coding: {
    label: "Coding Assistant",
    icon: "💻",
    fields: [
      { id: "language", label: "Language / Framework", type: "text", placeholder: "TypeScript, React..." },
      { id: "task", label: "What to Build", type: "textarea", placeholder: "Describe the function..." },
      { id: "input", label: "Input / Parameters", type: "text", placeholder: "Array of numbers..." },
      { id: "output", label: "Expected Output", type: "text", placeholder: "Sorted array..." },
      { id: "libraries", label: "Libraries to Use", type: "text", placeholder: "lodash, axios..." },
      { id: "edgeCases", label: "Edge Cases", type: "text", placeholder: "Empty array, null values..." },
    ],
    template: ({ language, task, input, output, libraries, edgeCases }) =>
      `Write a ${language || "..."} function that ${task || "..."}.\n\nInput: ${input || "..."}\nExpected output: ${output || "..."}\nLibraries: ${libraries || "..."}\nHandle these edge cases: ${edgeCases || "..."}`,
  },
  writing: {
    label: "Creative Writing",
    icon: "✍️",
    fields: [
      { id: "genre", label: "Genre", type: "select", options: ["Fantasy", "Sci-fi", "Romance", "Horror", "Mystery", "Literary"] },
      { id: "pov", label: "Point of View", type: "select", options: ["First person", "Second person", "Third person limited", "Omniscient"] },
      { id: "setting", label: "Setting", type: "text", placeholder: "Victorian London..." },
      { id: "character", label: "Main Character", type: "text", placeholder: "A rogue alchemist..." },
      { id: "theme", label: "Theme", type: "text", placeholder: "Redemption, loss..." },
      { id: "length", label: "Length", type: "select", options: ["Flash fiction (< 500 words)", "Short story (1000–3000 words)", "Chapter (~5000 words)"] },
    ],
    template: ({ genre, pov, setting, character, theme, length }) =>
      `Write a ${genre || "..."} story in ${pov || "..."} POV.\n\nSetting: ${setting || "..."}\nMain character: ${character || "..."}\nTheme: ${theme || "..."}\nLength: ${length || "..."}`,
  },
};

export default categories;
