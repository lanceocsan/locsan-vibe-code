/** Bundled DDL — keep in sync with `schema.sql` for packaging (no filesystem read at runtime). */
export const SCHEMA_DDL = `
CREATE TABLE IF NOT EXISTS evaluations (
    evaluation_id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS evaluation_revisions (
    revision_id TEXT PRIMARY KEY NOT NULL,
    evaluation_id TEXT NOT NULL,
    payload_json TEXT NOT NULL,
    markdown TEXT NOT NULL,
    validator_json TEXT NOT NULL,
    raw_hash TEXT NOT NULL,
    anonymized_hash TEXT NOT NULL,
    created_at TEXT NOT NULL,
    prompt_versions TEXT NOT NULL,
    FOREIGN KEY(evaluation_id) REFERENCES evaluations(evaluation_id)
);

CREATE TABLE IF NOT EXISTS audit_events (
    event_id TEXT PRIMARY KEY NOT NULL,
    evaluation_id TEXT NOT NULL,
    revision_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload_json TEXT NOT NULL,
    integrity_hash TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(revision_id) REFERENCES evaluation_revisions(revision_id)
);

CREATE INDEX IF NOT EXISTS idx_revisions_evaluation
  ON evaluation_revisions(evaluation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_evaluation
  ON audit_events(evaluation_id, created_at);
`;
