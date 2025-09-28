// utils/date.ts
const TZ = "America/Sao_Paulo"; // mantém coerência com o app

function toDate(input: string | number | Date) {
  return input instanceof Date ? input : new Date(input);
}

export function formatDateShort(input: string | number | Date) {
  const d = toDate(input);
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

export function formatTimeShort(input: string | number | Date) {
  const d = toDate(input);
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatRelativeDate(input: string | number | Date) {
  const d = toDate(input);
  if (isNaN(d.getTime())) return "";

  const now = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;

  // zera horas para comparar só o “dia”
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate());
  const diffDays = Math.floor(
    (startOf(now).getTime() - startOf(d).getTime()) / msPerDay
  );

  if (diffDays === 0) return `Hoje, ${formatTimeShort(d)}`;
  if (diffDays === 1) return `Ontem, ${formatTimeShort(d)}`;

  // Ex.: 12 set 2025
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: TZ,
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}
