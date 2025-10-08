import { useState } from "react";
import Input from "./Input";

/**
 * PUBLIC_INTERFACE
 * TagInput: Manage simple comma-separated tags
 */
export default function TagInput({ value = [], onChange, label, placeholder }) {
  const [raw, setRaw] = useState(value.join(", "));

  function handleBlur() {
    const tags = raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onChange?.(tags);
  }

  return (
    <Input
      label={label}
      placeholder={placeholder || "e.g., calculus, midterm, 2024"}
      value={raw}
      onChange={(e) => setRaw(e.target.value)}
      onBlur={handleBlur}
    />
  );
}
