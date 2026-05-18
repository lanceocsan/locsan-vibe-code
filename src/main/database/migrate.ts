import Database from "better-sqlite3";
import { SCHEMA_DDL } from "./schemaDdl.js";

/** Bootstrap SQLite (WAL) with bundled DDL suitable for Electron packaging. */
export const initialiseDatabase = (
  sqliteFilePath: string,
): Database.Database => {
  const databaseInstance = new Database(sqliteFilePath);
  databaseInstance.pragma("journal_mode = WAL");
  databaseInstance.exec(SCHEMA_DDL);
  return databaseInstance;
};
