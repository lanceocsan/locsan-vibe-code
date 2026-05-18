import { v4 as uuidV4Call } from "uuid";
import type { ProcessTextSuccessResponse } from "../../shared/apiTypes.js";
import {
  type ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useToastOutlet } from "../context/ToastProvider.js";
import WorkspaceMarkdownPreviewColumnRoute from "./WorkspaceMarkdownPreviewColumn.js";
import { readInitialMarkdownPreviewSurfaceFromWebStorage } from "./workspaceMarkdownPreviewPreference.js";
import ManualAceWorkspaceSection from "./ManualAceWorkspaceSection.js";
import { readNeutralManualAceDraftSkeleton } from "./neutralManualAceDraft.js";

const APPENDIX_SESSION_STORAGE_KEY_DESCRIPTOR_LITERAL =
  "ace-eval.session.include_anonymised_intake_appendix.v1";

const readAppendixInclusionFromBrowserSessionComputation = (): boolean => {
  try {
    const persistedAppendixSessionLiteralObservation =
      window.sessionStorage.getItem(APPENDIX_SESSION_STORAGE_KEY_DESCRIPTOR_LITERAL);
    const appendixEnabledObservation =
      persistedAppendixSessionLiteralObservation === "1";

    return appendixEnabledObservation;
  } catch (_appendixPeekFaultObservation) {
    return false;
  }
};

/** Primary direct-entry ACE workspace mirrored to Stitch wireframe ergonomics */
export default function WorkspacePageRoute(): ReactElement {
  const { publishToastNotification } = useToastOutlet();
  const [draftPlainText, mutateDraftPlainText] = useState("");
  const [manualAceDraftCaptured, mutateManualAceDraftCaptured] = useState(
    readNeutralManualAceDraftSkeleton,
  );
  const [processingToggleActive, mutateProcessingToggle] = useState(false);
  const [strictLocalWorkbenchFlag, mutateStrictWorkbench] = useState(true);
  const [latestHydratedEnvelope, mutateLatestHydratedEnvelope] =
    useState<ProcessTextSuccessResponse | null>(null);
  const [evaluationContinuationPrimaryKey, mutateEvaluationContinuationPk] =
    useState<string | null>(null);
  const [markdownPreviewRendered, mutateMarkdownRendered] =
    useState<string>("Paste notes to populate preview…");

  const [appendixDraftInclusionWorkbenchFlag, mutateAppendixDraftInclusionWorkbenchFlag] =
    useState((): boolean => readAppendixInclusionFromBrowserSessionComputation());

  const [previewSurfacePreferenceEnvelopeLit, mutatePreviewSurfacePreferenceEnvelopeLit] =
    useState(readInitialMarkdownPreviewSurfaceFromWebStorage);

  const debouncingTimerReferenceHolder = useRef<number | undefined>(undefined);

  const scheduleDebouncedReflowPipeline = useCallback((): void => {
    window.clearTimeout(debouncingTimerReferenceHolder.current);
    debouncingTimerReferenceHolder.current = window.setTimeout(async () => {
      if (!draftPlainText.trim()) {
        mutateMarkdownRendered("Paste notes to populate preview…");
        mutateLatestHydratedEnvelope(null);
        return;
      }

      mutateProcessingToggle(true);
      publishToastNotification("neutral", "Processing evaluation…");

      const desktopBridgeReferenceWindow = window.aceDeskApi;
      const ipcOutcomeEnvelope =
        await desktopBridgeReferenceWindow.processTextRequest({
          requestId: uuidV4Call(),
          rawText: draftPlainText,
          options: {
            manualAce: manualAceDraftCaptured,
            strictLocal: strictLocalWorkbenchFlag,
            aceModelId: undefined,
            includeAnonymizedIntakeAppendix: appendixDraftInclusionWorkbenchFlag,
          },
        });

      mutateProcessingToggle(false);

      if (!ipcOutcomeEnvelope.ok) {
        publishToastNotification(
          "danger",
          `Processing failed (${ipcOutcomeEnvelope.error.code})`,
        );
        mutateMarkdownRendered("Unable to synthesize preview.");
        mutateLatestHydratedEnvelope(null);
        return;
      }

      mutateLatestHydratedEnvelope(ipcOutcomeEnvelope.data);
      mutateMarkdownRendered(ipcOutcomeEnvelope.data.markdown);
      publishToastNotification("success", "Anonymization + ACE refresh complete.");
    }, 320);
  }, [
    appendixDraftInclusionWorkbenchFlag,
    draftPlainText,
    manualAceDraftCaptured,
    publishToastNotification,
    strictLocalWorkbenchFlag,
  ]);

  useEffect(() => {
    scheduleDebouncedReflowPipeline();
    return (): void =>
      window.clearTimeout(debouncingTimerReferenceHolder.current);
  }, [scheduleDebouncedReflowPipeline]);

  const saveFinalizeDisabledComputation = useMemo(() => {
    if (!latestHydratedEnvelope) {
      return true;
    }
    return false;
  }, [latestHydratedEnvelope]);

  const exportPdfFinalizeDisabledComputation = useMemo(() => {
    const markdownCandidateTrimEnvelope =
      latestHydratedEnvelope?.markdown?.trim() ?? "";
    return markdownCandidateTrimEnvelope.length === 0;
  }, [latestHydratedEnvelope?.markdown]);

  return (
    <div className="workspace-layout-grid">
      <section>
        <div className="workspace-layout-grid__toolbar">
          <h1 style={{ margin: 0 }}>Raw Feedback Entry</h1>
        </div>
        <label className="sr-only-description" htmlFor="raw-draft-textarea-slot">
          Raw evaluator notes — paste-only workspace
        </label>
        <textarea
          className="raw-draft-textarea"
          id="raw-draft-textarea-slot"
          placeholder="Paste raw interview notes or type performance observations here…"
          rows={10}
          value={draftPlainText}
          onChange={(inputChangeEventCandidate) =>
            mutateDraftPlainText(inputChangeEventCandidate.target.value)
          }
        />

        <ManualAceWorkspaceSection
          manualAceDraftEnvelope={manualAceDraftCaptured}
          onMutateManualAceDraft={mutateManualAceDraftCaptured}
        />

        <div className="control-row-slot">
          <label>
            <input
              checked={strictLocalWorkbenchFlag}
              type="checkbox"
              onChange={(strictCheckboxEvtCandidate) =>
                mutateStrictWorkbench(strictCheckboxEvtCandidate.target.checked)
              }
            />{" "}
            Strict local (no ACE LLM egress)
          </label>
        </div>

        <div className="control-row-slot">
          <label>
            <input
              checked={appendixDraftInclusionWorkbenchFlag}
              type="checkbox"
              onChange={(appendixEvt) => {
                const nextAppendixObservation = appendixEvt.target.checked;
                mutateAppendixDraftInclusionWorkbenchFlag(nextAppendixObservation);

                try {
                  window.sessionStorage.setItem(
                    APPENDIX_SESSION_STORAGE_KEY_DESCRIPTOR_LITERAL,
                    nextAppendixObservation === true ? "1" : "0",
                  );
                } catch (_appendixPersistFaultObservation) {}
              }}
            />{" "}
            Include anonymised intake notes in Markdown exports (toggle described below)
          </label>
        </div>

        <details className="workspace-guidance-accordion-slot">
          <summary>How your notes become this PDF draft</summary>
          <div className="workspace-guidance-accordion-inner-slot">
            <p style={{ margin: "6px 0" }}>
              <strong>Quick pipeline:</strong> raw notes undergo deterministic anonymisation
              first. The three boxes plus score under each pillar are copied verbatim into ACE
              Markdown—your raw paragraphs are never keyword-scanned into buckets anymore.
              The preview merges structured pillars with sanitised excerpts,{" "}
              <em>so it might not mirror the raw paste literally</em>.
            </p>
            <ul style={{ margin: "6px 0 10px", paddingLeft: "1.25rem" }}>
              <li>
                Populate each pillar manually; those strings become summaries, evidence bullets,
                and exporter-ready scores immediately.
              </li>
              <li>
                Separate evidence lines cleanly so Markdown lists stay tidy for reviewers.
              </li>
              <li>Choose a pillar score between 1 and 5 anytime it changes—it debounces refresh.</li>
              <li>
                Need anonymised wording on PDFs? Tick{" "}
                <strong>Include anonymised intake notes in Markdown exports</strong>{" "}
                to append an indented transcript appended after ACE content (privacy safe: anonymised narrative only).
              </li>
            </ul>
            <p style={{ margin: 0 }}>
              Exported Markdown (Copy, SQLite, PDF) always matches the synthesized string shown above—Rendered view matches PDF typography, Source view exposes the verbatim payload engineers audit.
            </p>
          </div>
        </details>

        <div className="action-bar-row-slot">
          <button
            className="btn-secondary-outline"
            type="button"
            onClick={async () => {
              const markdownExportPayload =
                latestHydratedEnvelope?.markdown ?? markdownPreviewRendered;
              try {
                await navigator.clipboard.writeText(markdownExportPayload);
                publishToastNotification("success", "Markdown copied.");
              } catch (_clipboardFailureEvent) {
                publishToastNotification("danger", "Clipboard unavailable.");
              }
            }}
          >
            Copy Markdown
          </button>
          <button
            aria-label="Export processed Markdown preview as formatted PDF file"
            className="btn-secondary-outline"
            disabled={
              exportPdfFinalizeDisabledComputation || processingToggleActive
            }
            type="button"
            onClick={async () => {
              const hydratedExportSnapshotCaptured = latestHydratedEnvelope;
              if (!hydratedExportSnapshotCaptured?.markdown.trim()) {
                return;
              }
              const synthesizedExportTitleStemEnvelope =
                draftPlainText.split("\n")[0]?.slice(0, 140) ??
                `Evaluation ${uuidV4Call().slice(0, 8)}`;

              const pdfExportEnvelopeOutcomeBootstrap =
                await window.aceDeskApi.exportMarkdownPdf({
                  markdown: hydratedExportSnapshotCaptured.markdown,
                  suggestedBasename: synthesizedExportTitleStemEnvelope,
                });

              if (!pdfExportEnvelopeOutcomeBootstrap.ok) {
                publishToastNotification(
                  "danger",
                  pdfExportEnvelopeOutcomeBootstrap.error.message,
                );
                return;
              }

              const pdfDispositionPayloadCarrier =
                pdfExportEnvelopeOutcomeBootstrap.data;

              if (pdfDispositionPayloadCarrier.cancelled) {
                return;
              }

              const savedPathDisplayTailSegment =
                pdfDispositionPayloadCarrier.savedPath.replace(/\\/g, "/");
              const shortenedDisplayLabelCandidate =
                savedPathDisplayTailSegment.replace(/^.*\//u, "");

              publishToastNotification(
                "success",
                `PDF saved — ${shortenedDisplayLabelCandidate}`,
              );
            }}
          >
            Export PDF
          </button>
          <button
            className="btn-primary-solid"
            disabled={saveFinalizeDisabledComputation}
            type="button"
            onClick={async () => {
              const hydratedSnapshotCaptured = latestHydratedEnvelope;
              if (!hydratedSnapshotCaptured) {
                return;
              }
              const synthesizedTitleStem =
                draftPlainText.split("\n")[0]?.slice(0, 140) ??
                `Evaluation ${uuidV4Call().slice(0, 8)}`;

              const saveOutcomeEnvelopeWindow =
                await window.aceDeskApi.saveEvaluationRevision({
                  evaluationId: evaluationContinuationPrimaryKey ?? undefined,
                  requestId: uuidV4Call(),
                  title: synthesizedTitleStem,
                  rawTextOriginal: draftPlainText,
                  anonymizedText: hydratedSnapshotCaptured.anonymizedText,
                  aceJson: hydratedSnapshotCaptured.ace,
                  aceCategoryScoresJson: hydratedSnapshotCaptured.aceScores,
                  sharpJson: hydratedSnapshotCaptured.sharp,
                  markdownFinal: hydratedSnapshotCaptured.markdown,
                  validationSnapshot: {
                    hallucinationRiskScore:
                      hydratedSnapshotCaptured.validation.hallucinationRiskScore,
                    pronounNeutralizationOk:
                      hydratedSnapshotCaptured.validation.pronounNeutralizationOk,
                    flags: hydratedSnapshotCaptured.validation.flags,
                  },
                  metadata: {
                    createdByOperatorId: null,
                    tags: [],
                  },
                });

              if (!saveOutcomeEnvelopeWindow.ok) {
                publishToastNotification(
                  "danger",
                  saveOutcomeEnvelopeWindow.error.message,
                );
                return;
              }

              mutateEvaluationContinuationPk(
                saveOutcomeEnvelopeWindow.data.evaluationId,
              );
              publishToastNotification("success", "Saved locally");
            }}
          >
            Save to Local Database
          </button>
        </div>
      </section>

      <WorkspaceMarkdownPreviewColumnRoute
        evaluationDraftHydratedFlag={latestHydratedEnvelope !== null}
        markdownDraftPayloadLiteral={markdownPreviewRendered}
        mutatePreviewSurfaceLiteralsEnvelope={mutatePreviewSurfacePreferenceEnvelopeLit}
        previewProcessingBusyComputationFlag={processingToggleActive}
        previewSurfaceLiteralsEnvelope={previewSurfacePreferenceEnvelopeLit}
      />

      <style>{`
.workspace-layout-grid { display: grid; gap: var(--space-md);}
@media (min-width: 980px){ .workspace-layout-grid{ grid-template-columns: 1fr 1fr;} }
.raw-draft-textarea{
  width:100%;resize:vertical;min-height:220px;font-family:var(--font-body);
  border-radius:var(--radius-card);border:1px solid var(--color-outline);padding:12px;line-height:1.5;background:#fff;}
.manual-ace-mini-textarea-slot{
  width:100%;resize:vertical;min-height:56px;font-family:var(--font-body);
  border-radius:var(--radius-card);border:1px solid var(--color-outline);padding:8px;line-height:1.45;background:#fff;}
.manual-ace-box-label-slot{display:block;margin-top:8px;margin-bottom:4px;font-size:12px;color:var(--color-muted);}
.manual-ace-score-input-slot{width:6rem;margin-top:4px;padding:6px 8px;border-radius:var(--radius-card);border:1px solid var(--color-outline);}
.control-row-slot{display:flex;align-items:center;gap:12px;margin-top:10px;color:var(--color-muted);}
.action-bar-row-slot{display:flex;justify-content:flex-end;gap:10px;margin-top:16px;}
.btn-secondary-outline{border:1px solid var(--color-outline);background:#fff;color:var(--color-primary);padding:8px 14px;border-radius:var(--radius-card);cursor:pointer;font-size:13px;}
.btn-secondary-outline:disabled{opacity:0.5;cursor:not-allowed;}
.btn-primary-solid{border:none;background:var(--color-primary);color:#fff;padding:8px 16px;border-radius:var(--radius-card);cursor:pointer;font-size:13px;}
.btn-primary-solid:disabled{opacity:0.5;cursor:not-allowed;}
.workspace-guidance-accordion-slot {
  margin-top:12px;padding:12px;border:1px solid var(--color-outline);border-radius:var(--radius-card);background:#f9fbfc;
}
.workspace-guidance-accordion-inner-slot {margin-top:8px;color:var(--color-muted);font-size:13px;line-height:1.45;}
.sr-only-description{position:absolute;left:-10000px;}
`}</style>
    </div>
  );
}
