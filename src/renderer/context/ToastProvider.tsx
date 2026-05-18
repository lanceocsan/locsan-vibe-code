import {
  createContext,
  type ReactElement,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

export type ToastKind = "neutral" | "success" | "warning" | "danger";

export type ToastRecord = {
  id: string;
  kind: ToastKind;
  message: string;
};

type ToastOutletContextShape = {
  publishToastNotification: (
    toastKind: ToastKind,
    outgoingMessage: string,
  ) => void;
};

const ToastOutletContext = createContext<ToastOutletContextShape | null>(null);

const createIdentifier = (): string =>
  typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.round(Math.random() * 1_000_000)}`;

/** Accessible toast outlet without native alerts */
export function ToastOutletProvider(props: {
  children: ReactNode;
}): ReactElement {
  const [toastRecords, mutateToastRecords] = useState<ToastRecord[]>([]);
  const liveRegionReference = useRef<HTMLDivElement>(null);

  const publishToastNotification = useCallback(
    (toastKind: ToastKind, outgoingMessage: string) => {
      const freshIdentifier = createIdentifier();
      mutateToastRecords((previousToastStack) =>
        previousToastStack.concat([
          { id: freshIdentifier, kind: toastKind, message: outgoingMessage },
        ]),
      );
      queueMicrotask(() => {
        if (liveRegionReference.current !== null) {
          liveRegionReference.current.textContent = outgoingMessage;
        }
      });

      window.setTimeout(() => {
        mutateToastRecords((previousToastStack) =>
          previousToastStack.filter(
            (stackEntryCandidate) =>
              stackEntryCandidate.id !== freshIdentifier,
          ),
        );
      }, 4700);
    },
    [],
  );

  const contextValueMemo = useMemo(
    (): ToastOutletContextShape => ({
      publishToastNotification,
    }),
    [publishToastNotification],
  );

  return (
    <ToastOutletContext.Provider value={contextValueMemo}>
      <div
        aria-live="polite"
        className="visually-hidden"
        ref={liveRegionReference}
      />

      <div className="toast-stack" role="presentation">
        {toastRecords.map((toastRow) => (
          <ToastCard key={toastRow.id} record={toastRow} />
        ))}
      </div>
      {props.children}
      <ToastGlobalStylesSnippet />
    </ToastOutletContext.Provider>
  );
}

export function useToastOutlet(): ToastOutletContextShape {
  const contextReferenceValue = useContext(ToastOutletContext);
  if (!contextReferenceValue) {
    throw new Error("ToastOutletProvider missing from component tree.");
  }
  return contextReferenceValue;
}

function ToastCard(props: { record: ToastRecord }): ReactElement {
  const backgroundColour =
    props.record.kind === "success"
      ? "#eaf7f2"
      : props.record.kind === "warning"
        ? "#fff6e9"
        : props.record.kind === "danger"
          ? "#fde8e8"
          : "#f2f4f6";
  const borderHue =
    props.record.kind === "success"
      ? "var(--color-accent)"
      : props.record.kind === "warning"
        ? "#dba339"
        : props.record.kind === "danger"
          ? "#ba1a1a"
          : "var(--color-outline)";

  return (
    <div
      aria-atomic="true"
      aria-relevant="additions removals"
      className="toast-card"
      role="status"
      style={{
        background: backgroundColour,
        borderLeft: `3px solid ${borderHue}`,
      }}
    >
      <span className="toast-card__mono">{props.record.message}</span>
    </div>
  );
}

function ToastGlobalStylesSnippet(): ReactElement {
  return (
    <style>{`
.visually-hidden {
  position: absolute !important;
  height: 1px; width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
  white-space: nowrap;
}
.toast-stack {
  position: fixed;
  bottom: calc(var(--space-margin));
  right: calc(var(--space-margin));
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 5000;
  pointer-events: none;
}
.toast-card {
  min-width: 240px;
  max-width: 360px;
  padding: 10px 12px;
  border-radius: var(--radius-lg);
  box-shadow: 0 1px 6px rgb(25 26 46 / 0.12);
}
.toast-card__mono {
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.03em;
  color: var(--color-primary);
}`}</style>
  );
}
