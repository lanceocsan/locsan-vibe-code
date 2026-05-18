import { StrictMode, type ReactElement, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Link, Route, Routes } from "react-router-dom";
import { ToastOutletProvider } from "./context/ToastProvider.js";
import "./theme/tokens.css";
import WorkspacePageRoute from "./pages/WorkspacePage.js";
import AuditLogsRoute from "./pages/AuditLogsPage.js";

/** Root shell: sticky chrome + confidential footer wired to Stitch layout intent */
function ApplicationShellChrome(props: {
  readonly childrenContainer: ReactNode;
}): ReactElement {
  return (
    <div className="application-shell-stack">
      <header className="application-shell-stack__masthead">
        <div className="application-shell-stack__masthead-row">
          <div className="application-shell-stack__brand">
            <span aria-hidden className="application-shell-stack__brand-icon">
              ◆
            </span>
            <strong>ACE Eval Generator</strong>
          </div>
          <div className="application-shell-stack__secure-pill">
            Secure Local Connection: Active
          </div>
          <nav className="application-shell-stack__nav">
            <Link className="link-quiet" to="/">
              Workspace
            </Link>
            <Link className="link-quiet" to="/audit">
              Audit Logs
            </Link>
          </nav>
        </div>
      </header>

      <main className="application-shell-stack__content">
        {props.childrenContainer}
      </main>

      <footer className="application-shell-stack__footer-strip">
        <span className="application-shell-stack__footer-left">
          SYSTEM_CONFIDENTIAL_COMPLIANCE
        </span>
        <span className="application-shell-stack__footer-center">
          Final review by leadership is mandatory.
        </span>
        <div className="application-shell-stack__footer-links">
          <button className="link-quiet" type="button">
            Data Privacy
          </button>
          <Link className="link-quiet" to="/audit">
            Audit Logs
          </Link>
        </div>
      </footer>

      <style>{`
.application-shell-stack { min-height: 100vh; display: flex; flex-direction: column; }
.application-shell-stack__masthead {
  position: sticky; top: 0; z-index: 40;
  border-bottom: 1px solid var(--color-outline);
  background: #fff;
}
.application-shell-stack__masthead-row {
  max-width: 1120px; margin: 0 auto; padding: 0 var(--space-margin);
  height: 64px; display: flex; align-items: center; gap: 16px;
  justify-content: space-between;
}
.application-shell-stack__brand { display: flex; align-items: center; gap: 8px; color: var(--color-primary);}
.application-shell-stack__brand-icon { color: var(--color-accent);}
.application-shell-stack__secure-pill {
  padding: 4px 10px; border-radius: 999px; background: #f1fff7;
  color: var(--color-accent); font-size: 12px; letter-spacing: 0.04em;
}
.application-shell-stack__nav { display: flex; gap: 16px; align-items: center;}
.application-shell-stack__content {
  flex: 1; width:100%; max-width:1120px; margin:0 auto; padding: var(--space-lg)
    var(--space-margin); display:flex; flex-direction:column; gap: var(--space-md);
}
.application-shell-stack__footer-strip {
  position:sticky; bottom:0; margin-top:auto; border-top:1px solid var(--color-outline);
  background:#fff; padding:10px var(--space-margin); display:flex;
  gap:16px; flex-wrap: wrap; justify-content: space-between;
  align-items:center; font-size: 11px; color:var(--color-muted); text-transform:uppercase;
  letter-spacing:0.08em;
}
.application-shell-stack__footer-links{display:flex; gap:14px;background:none;border:none;}
.application-shell-stack__footer-center{font-size:12px;text-transform:none;letter-spacing:normal;}
`}</style>
    </div>
  );
}

function RootBootstrap(): ReactElement {
  return (
    <ToastOutletProvider>
      <HashRouter>
        <ApplicationShellChrome
          childrenContainer={
            <Routes>
              <Route element={<WorkspacePageRoute />} path="/" />
              <Route element={<AuditLogsRoute />} path="/audit" />
            </Routes>
          }
        />
      </HashRouter>
    </ToastOutletProvider>
  );
}

createRoot(document.getElementById("application-root-mount")!).render(
  <StrictMode>
    <RootBootstrap />
  </StrictMode>,
);
