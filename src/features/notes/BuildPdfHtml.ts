import { Note } from "@/src/storage/notesStorage";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Alert, Platform } from "react-native";

export type AnyCheck =
  | {
      id?: string;
      text?: string;
      title?: string;
      label?: string;
      isChecked?: boolean;
      checked?: boolean;
      done?: boolean;
      completed?: boolean;
      status?: string | boolean;
    }
  | string;

export type Block = { type?: string; value?: any } | any;
export const tryParse = (s: string) => {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
};

export function getBlocks(content: string): Block[] {
  const j = tryParse(content);
  if (!j) return [];
  if (Array.isArray(j)) {
    const looksLikeBlock = (x: any) =>
      x && typeof x === "object" && "type" in x;
    return j.every(looksLikeBlock) ? j : []; 
  }
  if (Array.isArray(j?.blocks)) return j.blocks;
  return [];
}


export function pickText(blocks: Block[], raw: string) {
  const b = blocks.find((x) => (x?.type ?? "").toLowerCase() === "text");
  const v = (b?.value ?? "").toString().trim();
  if (v) return v;
  if (!tryParse(raw)) return raw; 
  return "";
}

export function normalizeCheck(it: AnyCheck) {
  if (typeof it === "string") return { text: it.trim(), checked: false };
  const text = (it.text ?? it.title ?? it.label ?? "").toString().trim();
  const status = (it as any).status;
  const checked = Boolean(
    it.isChecked ??
      it.checked ??
      it.done ??
      it.completed ??
      (typeof status === "string"
        ? /^(done|true|checked|ok|complete(d)?)$/i.test(status)
        : status === true)
  );
  return { text, checked };
}

export function parseChecklistMarkdown(txt: string) {
  const items: { text: string; checked: boolean }[] = [];
  txt.split(/\r?\n/).forEach((raw) => {
    const line = raw.trim();
    const m = line.match(/^[-*]\s*\[(x|X|\s)?\]\s*(.+)$/);
    if (m) {
      items.push({ text: m[2], checked: /x/i.test(m[1] ?? "") });
      return;
    }
    const m2 = line.match(/^(\d+[.)]|[-*•])\s+(.+)$/); 
    if (m2) items.push({ text: m2[2], checked: false });
  });
  return items;
}

 export const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        c
      ] as string)
  );

export function buildPdfHtml(
  item: Note,
  textHtml: string,
  tasks: { text: string; checked: boolean }[]
) {
  const title = escapeHtml(item.title || "Nota");
  const date = new Date(item.updatedAt).toLocaleString("pt-BR");
  const typeLabel =
    item.type === "task"
      ? "Tarefa"
      : item.type === "analysis"
      ? "Análise"
      : "Rápida";

  const tasksHtml = tasks.length
    ? `<div class="section">
         <h3>Tarefas</h3>
         <ul class="tasks">
           ${tasks
             .map(
               (i) =>
                 `<li class="${i.checked ? "done" : ""}">${
                   i.checked ? "☑︎" : "☐"
                 } ${escapeHtml(i.text)}</li>`
             )
             .join("")}
         </ul>
       </div>`
    : "";

  const textSection = textHtml
    ? `<div class="section"><p>${textHtml}</p></div>`
    : "";

  return `
  <!doctype html>
  <html><head><meta charset="utf-8"/>
    <style>
      body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Inter,Arial;margin:0;padding:0;color:#222}
      .wrap{padding:28px}
      .head{border-radius:16px;padding:16px;background:linear-gradient(135deg, rgba(160,101,199,.22), rgba(160,101,199,.06))}
      h1{margin:0 0 6px 0;font-size:22px}
      .pill{display:inline-block;border:1px solid rgba(160,101,199,.35);background:rgba(160,101,199,.14);color:#5b3c73;border-radius:999px;padding:2px 10px;font-size:12px;margin-left:8px}
      .meta{font-size:12px;color:#666}
      .section{margin-top:18px;font-size:14px;line-height:1.48}
      .tasks{list-style:none;padding-left:0;margin:8px 0 0 0}
      .tasks li{margin:6px 0}
      .tasks li.done{color:#777;text-decoration:line-through}
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="head">
        <h1>${title} <span class="pill">${typeLabel}</span></h1>
        <div class="meta">Atualizada em ${date}</div>
      </div>
      ${tasksHtml}
      ${textSection}
    </div>
  </body></html>`;
}

export async function shareNotePdf(
  item: Note,
  blocks: Block[],
  tasksArr: { text: string; checked: boolean }[]
) {
  // monta texto c/ quebras
  const rawText = pickText(blocks, item.content);
  const textHtml = rawText ? escapeHtml(rawText).replace(/\n/g, "<br/>") : "";

  // web: usa printAsync
  if (Platform.OS === "web") {
    await Print.printAsync({ html: buildPdfHtml(item, textHtml, tasksArr) });
    return;
  }
  // guard para build sem módulo nativo
  const hasPrint = typeof (Print as any)?.printToFileAsync === "function";
  if (!hasPrint) {
    Alert.alert(
      "Função indisponível",
      "Este build não tem o módulo nativo do Expo Print."
    );
    return;
  }

  const { uri } = await Print.printToFileAsync({
    html: buildPdfHtml(item, textHtml, tasksArr),
  });

  const safeName = (item.title || "nota")
    .slice(0, 32)
    .replace(/[^\w\d-_.]+/g, "_");
  const target = `${FileSystem.cacheDirectory}${safeName}.pdf`;
  await FileSystem.copyAsync({ from: uri, to: target });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(target, {
      mimeType: "application/pdf",
      UTI: "com.adobe.pdf",
      dialogTitle: item.title || "Compartilhar PDF",
    });
  } else {
    Alert.alert("PDF gerado", target);
  }
}


export function getChecklistFlexible(content: string) {
  const parsed = tryParse(content);
  const blocks = getBlocks(content);

  // 1) bloco dentro de blocks
  const blk =
    blocks.find((b) =>
      ["checklist", "tasks", "todos", "todo"].includes(
        (b?.type ?? "").toLowerCase()
      )
    ) ?? null;
  let arr: AnyCheck[] =
    (blk?.value && Array.isArray(blk.value) && blk.value) || [];

  // 2) objeto raiz com arrays conhecidos
  if (arr.length === 0 && parsed && !Array.isArray(parsed)) {
    const rootArr =
      (Array.isArray((parsed as any).checklist) && (parsed as any).checklist) ||
      (Array.isArray((parsed as any).tasks) && (parsed as any).tasks) ||
      (Array.isArray((parsed as any).todos) && (parsed as any).todos) ||
      (Array.isArray((parsed as any).items) && (parsed as any).items) ||
      [];
    if (rootArr.length) arr = rootArr;
  }

  // 3) raiz como array de itens (ChecklistItem[])
  if (arr.length === 0 && Array.isArray(parsed)) {
    const looksLikeChecklistItem = (x: any) =>
      x &&
      typeof x === "object" &&
      ("text" in x || "title" in x || "label" in x || typeof x === "string");
    if (parsed.some(looksLikeChecklistItem)) arr = parsed as AnyCheck[];
  }

  // 4) markdown no texto
  if (arr.length === 0) {
    const txt = pickText(blocks, content);
    arr = parseChecklistMarkdown(txt);
  }

  const items = arr.map(normalizeCheck).filter((x) => x.text);
  const total = items.length;
  const done = items.filter((i) => i.checked).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return { items, total, done, pct, blocks };
}

