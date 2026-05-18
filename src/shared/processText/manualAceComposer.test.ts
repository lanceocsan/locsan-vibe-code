import { describe, expect, test } from "vitest";
import { ACE_EMPTY_BUCKET_SUMMARY } from "../policyConstants.js";
import { composeAceMarkdownExport } from "./composeMarkdown.js";
import { mapManualAceDraftToPipelineAce } from "./mapManualAceDraftToPipelineAce.js";

describe("manual_ace.manual_draft_mapper", (): void => {
  test("maps summary plus two evidence segments with explicit clamped scores", (): void => {
    const outboundPipelineObservationEnvelope = mapManualAceDraftToPipelineAce({
      aptitude: {
        summary: "Top performer",
        evidencePrimary: "First proof",
        evidenceSecondary: "",
        score: 4,
      },
      character: {
        summary: "",
        evidencePrimary: "Only headline line",
        evidenceSecondary: "",
        score: -9,
      },
      effectiveness: {
        summary: "",
        evidencePrimary: "",
        evidenceSecondary: "",
        score: 11,
      },
    });

    expect(outboundPipelineObservationEnvelope.aceScores).toEqual({
      aptitude: 4,
      character: 1,
      effectiveness: 5,
    });
    expect(
      outboundPipelineObservationEnvelope.aceStructure.aptitude,
    ).toEqual({
      summary: "Top performer",
      evidence: ["First proof"],
    });
    expect(
      outboundPipelineObservationEnvelope.aceStructure.character,
    ).toEqual({
      summary: "Only headline line",
      evidence: [],
    });
    expect(
      outboundPipelineObservationEnvelope.aceStructure.effectiveness.summary,
    ).toBe(ACE_EMPTY_BUCKET_SUMMARY);
  });
});

describe("manual_ace.markdown_composer", (): void => {
  test("emits pillar scores instead of sharpening bullets", (): void => {
    const markdownOutboundObservationEnvelope = composeAceMarkdownExport({
      ace: mapManualAceDraftToPipelineAce({
        aptitude: {
          summary: "Summary line",
          evidencePrimary: "",
          evidenceSecondary: "",
          score: 2,
        },
        character: {
          summary: "",
          evidencePrimary: "",
          evidenceSecondary: "",
          score: 3,
        },
        effectiveness: {
          summary: "",
          evidencePrimary: "",
          evidenceSecondary: "",
          score: 4,
        },
      }).aceStructure,
      aceScores: {
        aptitude: 2,
        character: 3,
        effectiveness: 4,
      },
    });

    expect(markdownOutboundObservationEnvelope).not.toContain("data-icon");
    expect(markdownOutboundObservationEnvelope).not.toContain("<span");
    expect(markdownOutboundObservationEnvelope).toContain(
      "## Logic & Hard Skills",
    );
    expect(markdownOutboundObservationEnvelope).toContain(
      "## Resilience & Teamwork",
    );
    expect(markdownOutboundObservationEnvelope).toContain("## Outcomes & KPIs");
    expect(markdownOutboundObservationEnvelope).not.toContain("Sharpened");
    expect(markdownOutboundObservationEnvelope).not.toContain("next-step");
    expect(markdownOutboundObservationEnvelope).toContain(
      "**2 / 5** (operator-entered)",
    );
    expect(markdownOutboundObservationEnvelope).toContain("_Summary line_");
  });
});
