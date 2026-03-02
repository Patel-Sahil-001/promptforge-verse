import categories from "@/categories";
import { usePromptStore } from "@/store/promptStore";

export default function DynamicForm() {
  const { selectedCategory, formValues, setFieldValue } = usePromptStore();
  const cat = categories[selectedCategory];
  if (!cat) return null;

  return (
    <div>
      <div className="font-mono text-[.65rem] tracking-[.2em] text-foreground/35 uppercase mb-7 flex items-center gap-4">
        Input Fields
        <span className="flex-1 h-px bg-border" />
      </div>
      {cat.fields.map((field) => (
        <div key={field.id} className="mb-6">
          <label className="font-mono text-[.68rem] tracking-[.12em] text-foreground/50 uppercase mb-2 block">
            {field.label}
          </label>
          {field.type === "select" ? (
            <select
              className="field-select"
              value={formValues[field.id] || ""}
              onChange={(e) => setFieldValue(field.id, e.target.value)}
            >
              <option value="">Select...</option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : field.type === "textarea" ? (
            <textarea
              className="field-textarea"
              placeholder={field.placeholder}
              value={formValues[field.id] || ""}
              onChange={(e) => setFieldValue(field.id, e.target.value)}
            />
          ) : (
            <input
              className="field-input"
              type="text"
              placeholder={field.placeholder}
              value={formValues[field.id] || ""}
              onChange={(e) => setFieldValue(field.id, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
