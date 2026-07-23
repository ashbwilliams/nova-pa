import { readFileSync } from "node:fs";
import { join } from "node:path";
import { marked, Renderer, type Tokens } from "marked";

export type ResourceSection = {
  id: string;
  title: string;
};

const RESOURCE_PATH = join(
  process.cwd(),
  "src/content/resources/marching-percussion-as-an-educational-discipline.md",
);

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function tokenText(tokens: Tokens.Heading["tokens"] | Tokens.Link["tokens"]): string {
  return tokens
    .map((token) => {
      if ("text" in token && typeof token.text === "string") {
        return token.text;
      }

      if ("tokens" in token && Array.isArray(token.tokens)) {
        return tokenText(token.tokens as Tokens.Heading["tokens"]);
      }

      return "";
    })
    .join("");
}

class ResourceRenderer extends Renderer {
  heading({ tokens, depth }: Tokens.Heading) {
    const title = tokenText(tokens);
    const id = slugify(title);
    const webDepth = Math.min(depth + 1, 6);

    return `<h${webDepth} id="${id}">${this.parser.parseInline(tokens)}</h${webDepth}>\n`;
  }

  link({ href, title, tokens }: Tokens.Link) {
    const safeHref =
      href.startsWith("https://") ||
      href.startsWith("http://") ||
      href.startsWith("/") ||
      href.startsWith("#")
        ? href
        : "#";
    const external = safeHref.startsWith("http");
    const titleAttribute = title ? ` title="${escapeHtml(title)}"` : "";
    const externalAttributes = external
      ? ' target="_blank" rel="noreferrer noopener"'
      : "";

    return `<a href="${escapeHtml(safeHref)}"${titleAttribute}${externalAttributes}>${this.parser.parseInline(tokens)}</a>`;
  }

  html({ text }: Tokens.HTML | Tokens.Tag) {
    return escapeHtml(text);
  }
}

export function getMarchingPercussionPaper() {
  const source = readFileSync(RESOURCE_PATH, "utf8").replace(
    /^(?:%[^\n]*\n){3}\s*/,
    "",
  );
  const sections = Array.from(source.matchAll(/^# ([^\n]+)$/gm), ([, title]) => ({
    id: slugify(title),
    title,
  }));
  const wordCount = source
    .replace(/[#*|[\]()`]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  const html = marked.parse(source, {
    async: false,
    gfm: true,
    renderer: new ResourceRenderer(),
  });

  return {
    html,
    readingMinutes: Math.max(1, Math.round(wordCount / 235)),
    sections,
  };
}
