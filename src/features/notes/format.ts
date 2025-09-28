export type Token = { t: "text" | "fmt"; v: string };

export const tokenRegex = /(\*\*[^*]+\*\*|_[^_]+_|==[^=]+==)/g;

export function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = tokenRegex.exec(line))) {
    if (m.index > lastIndex) tokens.push({ t: "text", v: line.slice(lastIndex, m.index) });
    tokens.push({ t: "fmt", v: m[0] });
    lastIndex = m.index + m[0].length;
  }
    if (lastIndex < line.length) tokens.push({ t: "text", v: line.slice(lastIndex) });
    return tokens;
}

export function FormattedLine({ line, color }) {
  const tokens = tokenizeLine(line);
  return(
    <ThemedText />
  )}
  