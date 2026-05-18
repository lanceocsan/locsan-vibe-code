import type { AceStructure, ManualAceDraft } from "../../shared/apiTypes.js";
import { clampAceCategoryScoreInput } from "../../shared/processText/clampAceCategoryScoreInput.js";
import type { ChangeEvent, ReactElement } from "react";

type PillarWorkbenchDescriptorSlice = {
  slug: keyof AceStructure;
  caption: string;
};

const pillarWorkbenchDescriptorSlices: PillarWorkbenchDescriptorSlice[] = [
  { slug: "aptitude", caption: "Aptitude — logic & hard skills" },
  { slug: "character", caption: "Character — resilience & teamwork" },
  {
    slug: "effectiveness",
    caption: "Effectiveness — outcomes & KPIs",
  },
];

type ManualAceWorkspaceSectionProps = {
  manualAceDraftEnvelope: ManualAceDraft;
  onMutateManualAceDraft: (nextEnvelope: ManualAceDraft) => void;
};

export default function ManualAceWorkspaceSection({
  manualAceDraftEnvelope,
  onMutateManualAceDraft,
}: ManualAceWorkspaceSectionProps): ReactElement {
  return (
    <section aria-label="Manual ACE pillar inputs" style={{ marginTop: 14 }}>
      <h2 style={{ fontSize: 16, margin: "0 0 4px" }}>
        Structured ACE pillars (manual entry)
      </h2>
      <p style={{ margin: 0, color: "var(--color-muted)", fontSize: 13 }}>
        Three narrative boxes plus a score per pillar feed the ACE Markdown preview—nothing
        is routed through keyword guessing from your raw notes.
      </p>
      {pillarWorkbenchDescriptorSlices.map((pillarDescriptorCaptured) => {
        const pillarKeyCaptured = pillarDescriptorCaptured.slug;
        const pillarBucketCaptured = manualAceDraftEnvelope[pillarKeyCaptured];

        return (
          <fieldset
            className="manual-ace-pillar-fieldset-slot"
            key={pillarKeyCaptured}
            style={{
              marginTop: 14,
              border: "1px solid var(--color-outline)",
              borderRadius: "var(--radius-card)",
              padding: 12,
            }}
          >
            <legend style={{ padding: "0 6px", fontWeight: 600 }}>
              {pillarDescriptorCaptured.caption}
            </legend>
            <label
              className="manual-ace-box-label-slot"
              htmlFor={`${pillarKeyCaptured}-summary-slot`}
            >
              Summary (pillar narrative)
            </label>
            <textarea
              className="manual-ace-mini-textarea-slot"
              id={`${pillarKeyCaptured}-summary-slot`}
              onChange={(summaryChangeObservation: ChangeEvent<HTMLTextAreaElement>): void =>
                onMutateManualAceDraft({
                  ...manualAceDraftEnvelope,
                  [pillarKeyCaptured]: {
                    ...pillarBucketCaptured,
                    summary: summaryChangeObservation.target.value,
                  },
                })
              }
              placeholder="Lead sentence or headline observation for this pillar…"
              rows={3}
              value={pillarBucketCaptured.summary}
            />
            <label
              className="manual-ace-box-label-slot"
              htmlFor={`${pillarKeyCaptured}-evidence-primary-slot`}
            >
              Evidence line A
            </label>
            <textarea
              className="manual-ace-mini-textarea-slot"
              id={`${pillarKeyCaptured}-evidence-primary-slot`}
              onChange={(
                primaryEvidenceObservation: ChangeEvent<HTMLTextAreaElement>,
              ): void =>
                onMutateManualAceDraft({
                  ...manualAceDraftEnvelope,
                  [pillarKeyCaptured]: {
                    ...pillarBucketCaptured,
                    evidencePrimary: primaryEvidenceObservation.target.value,
                  },
                })
              }
              placeholder="Supporting detail or example…"
              rows={2}
              value={pillarBucketCaptured.evidencePrimary}
            />
            <label
              className="manual-ace-box-label-slot"
              htmlFor={`${pillarKeyCaptured}-evidence-secondary-slot`}
            >
              Evidence line B
            </label>
            <textarea
              className="manual-ace-mini-textarea-slot"
              id={`${pillarKeyCaptured}-evidence-secondary-slot`}
              onChange={(
                secondaryEvidenceObservation: ChangeEvent<HTMLTextAreaElement>,
              ): void =>
                onMutateManualAceDraft({
                  ...manualAceDraftEnvelope,
                  [pillarKeyCaptured]: {
                    ...pillarBucketCaptured,
                    evidenceSecondary: secondaryEvidenceObservation.target.value,
                  },
                })
              }
              placeholder="Optional second snippet…"
              rows={2}
              value={pillarBucketCaptured.evidenceSecondary}
            />
            <label
              className="manual-ace-box-label-slot"
              htmlFor={`${pillarKeyCaptured}-score-slot`}
            >
              Category score (1–5)
            </label>
            <input
              className="manual-ace-score-input-slot"
              id={`${pillarKeyCaptured}-score-slot`}
              max={5}
              min={1}
              onChange={(scoreObservation: ChangeEvent<HTMLInputElement>): void =>
                onMutateManualAceDraft({
                  ...manualAceDraftEnvelope,
                  [pillarKeyCaptured]: {
                    ...pillarBucketCaptured,
                    score: clampAceCategoryScoreInput(scoreObservation.target.value),
                  },
                })
              }
              step={1}
              type="number"
              value={pillarBucketCaptured.score}
            />
          </fieldset>
        );
      })}
    </section>
  );
}
