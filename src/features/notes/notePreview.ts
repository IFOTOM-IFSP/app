import { Note } from "@/src/storage/notesStorage";

function tryParse(json: string): unknown {
  try {
    return JSON.parse(json);
  } catch {
    return json; 
  }
}

function isBlocks(x: unknown): x is Array<{ type?: string; value?: unknown }> {
  return Array.isArray(x);
}

function isQuickObj(x: unknown): x is { text?: string } {
  return !!x && typeof x === "object" && "text" in (x as any);
}

function isTaskObj(x: unknown): x is { items?: Array<{ text?: string; isChecked?: boolean }> } {
  return !!x && typeof x === "object" && Array.isArray((x as any).items);
}

export function extractTextFromContent(content: string): string {
  const parsed = tryParse(content);

  if (typeof parsed === "string") return parsed;

  if (isBlocks(parsed)) {
    const texts = parsed
      .filter((b) => b?.type === "text" && typeof b.value === "string")
      .map((b) => String(b.value));
    if (texts.length) return texts.join("\n").trim();

    const anyText = parsed
      .map((b) => (typeof b?.value === "string" ? b.value : ""))
      .filter(Boolean)
      .join("\n")
      .trim();
    if (anyText) return anyText;
    return "";
  }

  if (isQuickObj(parsed)) {
    return String((parsed as any).text || "").trim();
  }

  if (isTaskObj(parsed)) {
    const items = (parsed as any).items as Array<{ text?: string; isChecked?: boolean }>;
    const lines = (items || [])
      .slice(0, 3) 
      .map((it) => `${it?.isChecked ? "✓" : "•"} ${(it?.text || "").trim()}`)
      .filter((s) => s && s !== "•")
      .join("\n");
    return lines;
  }

  return "";
}

export function stripInlineFormatting(s: string): string {
  if (!s) return s;
  return s
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/==([^=]+)==/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function getNotePreview(note: Note): string {
  const raw = extractTextFromContent(note.content);
  return stripInlineFormatting(raw);
}
