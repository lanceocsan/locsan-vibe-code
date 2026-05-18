import MarkdownIt from "markdown-it";

const PORTABLE_EVALUATION_HTML_EMPTY_SNIPPET = "<p>(empty evaluation)</p>";

let reusableMarkdownPortableEngine: MarkdownIt | undefined;

const ensurePortableMarkdownEngineSingleton = (): MarkdownIt => {
  if (!reusableMarkdownPortableEngine) {
    reusableMarkdownPortableEngine = new MarkdownIt({
      breaks: true,
      html: false,
      linkify: true,
    });
  }
  return reusableMarkdownPortableEngine;
};

/** HTML fragment for Markdown intended for Electron PDF + parity preview rendering. */
export const renderPortableMarkdownToHtmlFragment = (
  markdownUtf8Envelope: string,
): string => {
  const engineReference = ensurePortableMarkdownEngineSingleton();
  const trimmedMarkdownLiteral = markdownUtf8Envelope.trim();
  if (!trimmedMarkdownLiteral) {
    return PORTABLE_EVALUATION_HTML_EMPTY_SNIPPET;
  }
  return engineReference.render(markdownUtf8Envelope);
};
