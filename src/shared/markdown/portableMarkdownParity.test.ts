import { describe, expect, test } from "vitest";
import { assemblePortableEvalHtmlStandaloneDocument } from "./assemblePortableEvalHtmlDocument.js";
import { renderPortableMarkdownToHtmlFragment } from "./renderPortableMarkdownToHtmlFragment.js";
import { buildMarkdownAnonymizedIntakeAppendix } from "../processText/buildMarkdownAnonymizedIntakeAppendix.js";

describe("portable.markdown.parity_suite", () => {
  test("renderPortableMarkdown emits heading markup for headings", (): void => {
    const outboundHtmlObservation = renderPortableMarkdownToHtmlFragment(
      "## ACE heading sample\nparagraph",
    );
    expect(outboundHtmlObservation).toMatch(/<h2[ >]/);

    expect(outboundHtmlObservation).toContain("ACE heading sample");
  });

  test("assembled PDF shell nests ace-md-export article", (): void => {
    const outboundShellObservation =
      assemblePortableEvalHtmlStandaloneDocument("<p>sample-inner</p>");

    expect(outboundShellObservation).toContain('class="ace-md-export">');
    expect(outboundShellObservation).toContain("<p>sample-inner</p>");
    expect(outboundShellObservation.length).toBeGreaterThan(400);
  });
});

describe("processText.appendix.markdown_composition_helpers", () => {
  test("indent appendix preserves markdown heading escapes when indented", (): void => {
    const appendixObservationLiteral = buildMarkdownAnonymizedIntakeAppendix(
      "Line A\n## not a markdown heading thanks to indentation",
    );
    expect(appendixObservationLiteral).toContain(
      "## Anonymised intake transcript",
    );

    expect(appendixObservationLiteral).not.toContain("<h2");
    expect(appendixObservationLiteral).toContain("    ## not a markdown");
  });
});
