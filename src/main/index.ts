import path from "node:path";
import { app, BrowserWindow, shell } from "electron";
import { registerIpcHandlers } from "./ipc/registerHandlers.js";

const BUILD_DEV_TOOLS_ENABLED = !!process.env.ACE_EVAL_DEBUG;

const bootstrapWindowCreator = (): void => {
  const browserWindowReference = new BrowserWindow({
    width: 1380,
    height: 900,
    minWidth: 1024,
    minHeight: 720,
    backgroundColor: "#f7f9fb",
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  browserWindowReference.webContents.setWindowOpenHandler(
    ({ url: interceptedUrl }: { url: string }) => {
      void shell.openExternal(interceptedUrl);
      return { action: "deny" };
    },
  );

  if (!app.isPackaged) {
    void browserWindowReference.loadURL(
      process.env.ELECTRON_RENDERER_URL ??
        process.env.VITE_DEV_SERVER_URL ??
        "http://localhost:5173",
    );
  } else {
    void browserWindowReference.loadFile(
      path.join(__dirname, "../renderer/index.html"),
    );
  }

  if (BUILD_DEV_TOOLS_ENABLED) {
    browserWindowReference.webContents.openDevTools({ mode: "detach" });
  }
};

app.whenReady().then(() => {
  registerIpcHandlers();
  bootstrapWindowCreator();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      bootstrapWindowCreator();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
