import {
  type ReactElement,
  useMemo,
} from "react";
import { PORTABLE_EVAL_ACE_MARKDOWN_SELECTOR_EMBEDDED_CSS } from "../../shared/markdown/aceMarkdownExportSelectorsEmbeddedCss.js";
import { renderPortableMarkdownToHtmlFragment } from "../../shared/markdown/renderPortableMarkdownToHtmlFragment.js";
import {
  persistMarkdownPreviewSurfaceLiteralsEnvelope,
  type WorkspaceMarkdownPreviewSurfaceLiteralsPreference,
} from "./workspaceMarkdownPreviewPreference.js";
import { resolveWorkspaceRenderedMarkdownPreviewHtmlComputation } from "./resolveWorkspaceRenderedMarkdownPreviewHtmlComputation.js";

type WorkspaceMarkdownPreviewColumnProps = {
  readonly markdownDraftPayloadLiteral: string;
  readonly evaluationDraftHydratedFlag: boolean;
  readonly previewProcessingBusyComputationFlag: boolean;
  readonly previewSurfaceLiteralsEnvelope: WorkspaceMarkdownPreviewSurfaceLiteralsPreference;
  readonly mutatePreviewSurfaceLiteralsEnvelope: (
    nextEnvelope: WorkspaceMarkdownPreviewSurfaceLiteralsPreference,
  ) => void;
};

export default function WorkspaceMarkdownPreviewColumnRoute(
  props: WorkspaceMarkdownPreviewColumnProps,
): ReactElement {
  const portableRenderedHtmlEnvelopeObservation = useMemo(
    (): string =>
      renderPortableMarkdownToHtmlFragment(props.markdownDraftPayloadLiteral),
    [props.markdownDraftPayloadLiteral],
  );

  const previewHtmlOutboundLiteralObservation = resolveWorkspaceRenderedMarkdownPreviewHtmlComputation(
    {
      evaluationDraftHydratedFlag: props.evaluationDraftHydratedFlag,
      markdownDraftPayloadLiteral: props.markdownDraftPayloadLiteral,
      portableRenderedHtmlEnvelopeObservation:
        portableRenderedHtmlEnvelopeObservation,
    },
  );

  const readSurfaceToolbarButtonClickHandlerComputation = (
    targetSurfaceEnvelope: WorkspaceMarkdownPreviewSurfaceLiteralsPreference,
  ): void => {
    persistMarkdownPreviewSurfaceLiteralsEnvelope(targetSurfaceEnvelope);
    props.mutatePreviewSurfaceLiteralsEnvelope(targetSurfaceEnvelope);
  };

  return (
    <aside className="preview-column-stack">
      <h2 style={{ marginTop: 0 }}>Markdown preview</h2>
      <p className="workspace-md-preview-eyebrow-copy-slot">
        Rendered mirrors PDF typography. Markdown source is the exact persisted export payload.
      </p>
      <div
        aria-label="Markdown preview format toggle"
        className="workspace-preview-toolbar-row-slot"
        role="toolbar"
      >
        <button
          aria-pressed={
            props.previewSurfaceLiteralsEnvelope === "rendered"
          }
          className="btn-muted-segment-slot"
          type="button"
          onClick={() =>
            readSurfaceToolbarButtonClickHandlerComputation("rendered")
          }
        >
          Rendered
        </button>
        <button
          aria-pressed={props.previewSurfaceLiteralsEnvelope === "source"}
          className="btn-muted-segment-slot"
          type="button"
          onClick={() =>
            readSurfaceToolbarButtonClickHandlerComputation("source")
          }
        >
          Markdown source
        </button>
      </div>

      <div className="preview-surface-relative-anchor-slot">
        {props.previewSurfaceLiteralsEnvelope === "source" ? (
          <pre className="preview-preformatted-panel-slot">
            {props.markdownDraftPayloadLiteral}
          </pre>
        ) : (
          <div className="preview-md-surface-mount-slot">
            <article
              dangerouslySetInnerHTML={{
                __html: previewHtmlOutboundLiteralObservation,
              }}
              className="ace-md-export preview-rendered-article-mount-slot"
            />
          </div>
        )}

        {props.previewProcessingBusyComputationFlag ? (
          <div className="preview-processing-busy-shroud-slot" role="status">
            Refreshing preview…
          </div>
        ) : null}
      </div>

      <style>{`${PORTABLE_EVAL_ACE_MARKDOWN_SELECTOR_EMBEDDED_CSS}
.preview-md-surface-mount-slot {
  font-family: ui-sans-serif, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 13px;
  line-height: 1.45;
  color: #14191f;
  background: #fff;
  border-radius: var(--radius-lg);
  border: 1px dashed var(--color-outline);
  padding: 14px;
  max-height: 70vh;
  overflow: auto;
}
.workspace-md-preview-eyebrow-copy-slot {
  color: var(--color-muted);
  font-size: 12px;
  margin: 4px 0 10px;
  max-width: 520px;
}
.workspace-md-preview-inline-muted-tone { color:#6f7a82;margin:0; }
.workspace-md-preview-inline-fault-tone { color:#ba1a1a;margin:0;font-weight:600;}
.preview-rendered-article-mount-slot { min-height: 52px; }
.preview-surface-relative-anchor-slot { position: relative; }
.preview-processing-busy-shroud-slot {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.76);
  font-size: 13px;
  color: var(--color-primary);
  letter-spacing: 0.03em;
  z-index: 4;
}
.workspace-preview-toolbar-row-slot {
  display: inline-flex;
  gap: 0;
  border-radius: var(--radius-card);
  overflow: hidden;
  border: 1px solid var(--color-outline);
  align-self: flex-start;
  margin-bottom: 10px;
}
.btn-muted-segment-slot {
  font-size: 12px;
  padding: 6px 12px;
  border: none;
  cursor: pointer;
  background: #fff;
  color: var(--color-muted);
}
.btn-muted-segment-slot:hover { background:#f7f9fb;color:var(--color-primary);}
.btn-muted-segment-slot[aria-pressed="true"] {
  background: var(--color-primary);
  color:#fff;
}
.preview-preformatted-panel-slot {
  white-space: pre-wrap;
  background:#fff;
  border-radius:var(--radius-lg);
  padding:14px;
  border:1px dashed var(--color-outline);
  font-size:13px;
  font-family:var(--font-mono);
  max-height:70vh;
  overflow:auto;
  margin:0;
}
`}</style>
    </aside>
  );
}
