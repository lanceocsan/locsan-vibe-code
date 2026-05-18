import type { HistoryItemSummary } from "../../shared/apiTypes.js";
import { type ReactElement, useEffect, useState } from "react";

const extractDesktopApi = (): typeof window.aceDeskApi => window.aceDeskApi;

/** Read-only Audit Logs surface routed from footer/header links */
export default function AuditLogsRoute(): ReactElement {
  const [records, appendRecordsMutation] = useState<HistoryItemSummary[]>([]);
  const [continuationCursorToken, mutateCursorContinuation] =
    useState<string | null>(null);
  const [loadFaultMessageLiteral, mutateLoadFault] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let cancelledContinuationFlag = false;
    async function hydrateInitialPageEnvelope(): Promise<void> {
      const desktopApiReference = extractDesktopApi();
      const outboundEnvelopeFetch = await desktopApiReference.getHistoryPage({
        cursor: null,
        limit: 30,
      });
      if (!outboundEnvelopeFetch.ok) {
        mutateLoadFault(outboundEnvelopeFetch.error.message);
        return;
      }
      if (!cancelledContinuationFlag) {
        appendRecordsMutation(outboundEnvelopeFetch.data.items);
        mutateCursorContinuation(outboundEnvelopeFetch.data.nextCursor);
      }
    }
    void hydrateInitialPageEnvelope();
    return (): void => {
      cancelledContinuationFlag = true;
    };
  }, []);

  return (
    <section className="audit-page-section">
      <header className="audit-page-headline">
        <h1 style={{ margin: 0 }}>Audit Logs</h1>
        <p style={{ margin: "6px 0 0", color: "var(--color-muted)", maxWidth: 720 }}>
          Local revision rows only — data never leaves this workstation in strict-local installs.
        </p>
      </header>

      {loadFaultMessageLiteral ? (
        <p role="alert" style={{ color: "#ba1a1a" }}>
          {loadFaultMessageLiteral}
        </p>
      ) : null}

      <div style={{ overflowX: "auto", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-outline)" }}>
        <table className="audit-table-matrix" width="100%">
          <thead>
            <tr>
              <th align="left">Title</th>
              <th align="left">Updated</th>
              <th align="left">Revision</th>
              <th align="left">Preview</th>
            </tr>
          </thead>
          <tbody>
            {records.map((historicalRecordEntry) => (
              <tr key={historicalRecordEntry.latestRevisionId}>
                <td>{historicalRecordEntry.title}</td>
                <td>{historicalRecordEntry.updatedAt}</td>
                <td style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
                  {historicalRecordEntry.latestRevisionId.slice(0, 12)}…
                </td>
                <td>{historicalRecordEntry.previewSnippet}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
        <button
          disabled={continuationCursorToken === null}
          onClick={async () => {
            if (!continuationCursorToken) {
              return;
            }
            const desktopContinuationApi = extractDesktopApi();
            const pagingOutcome = await desktopContinuationApi.getHistoryPage({
              cursor: continuationCursorToken,
              limit: 30,
            });
            if (!pagingOutcome.ok) {
              mutateLoadFault(pagingOutcome.error.message);
              return;
            }
            appendRecordsMutation((previousSlices) =>
              previousSlices.concat(pagingOutcome.data.items),
            );
            mutateCursorContinuation(pagingOutcome.data.nextCursor);
          }}
          style={{ padding: "8px 16px", borderRadius: "var(--radius-card)" }}
          type="button"
        >
          Load more
        </button>
      </div>

      <style>{`
.audit-table-matrix { border-collapse: collapse; font-size: 13px;}
.audit-table-matrix th,.audit-table-matrix td{padding:10px 12px;border-bottom:1px solid var(--color-outline);}
.audit-table-matrix th{font-size:12px;color:var(--color-muted);}
`}</style>
    </section>
  );
}
