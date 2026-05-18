import { BrowserWindow } from "electron";

import fs from "node:fs/promises";

import os from "node:os";

import path from "node:path";

import { assemblePortableEvalHtmlStandaloneDocument } from "../../shared/markdown/assemblePortableEvalHtmlDocument.js";

import { renderPortableMarkdownToHtmlFragment } from "../../shared/markdown/renderPortableMarkdownToHtmlFragment.js";



type MarkdownPdfRasterisationOutcome =

  | { rasterisationOk: true; pdfPayloadBuffer: Buffer }

  | { rasterisationOk: false; rasterisationFaultReason: string };



export const rasteriseMarkdownToPdfPayloadBufferFromSource = async (

  markdownUtf8Payload: string,

): Promise<MarkdownPdfRasterisationOutcome> => {

  const renderedMarkdownBodyHtmlEnvelope =

    renderPortableMarkdownToHtmlFragment(markdownUtf8Payload);



  const standalonePrintableMarkupEnvelope =

    assemblePortableEvalHtmlStandaloneDocument(renderedMarkdownBodyHtmlEnvelope);



  const ephemeralWorkspaceDirectory = await fs.mkdtemp(

    path.join(os.tmpdir(), "ace-eval-pdf-export-"),

  );

  const htmlTemporaryFileAbsolutePath = path.join(

    ephemeralWorkspaceDirectory,

    "export.html",

  );



  await fs.writeFile(

    htmlTemporaryFileAbsolutePath,

    standalonePrintableMarkupEnvelope,

    "utf-8",

  );



  const ephemeralHiddenRenderWindowBootstrap = new BrowserWindow({

    show: false,

    width: 1024,

    height: 1200,

    webPreferences: {

      sandbox: false,

      contextIsolation: true,

      nodeIntegration: false,

    },

  });



  try {

    await ephemeralHiddenRenderWindowBootstrap.webContents.loadFile(

      htmlTemporaryFileAbsolutePath,

    );

    const printPayloadUint8Outcome =

      await ephemeralHiddenRenderWindowBootstrap.webContents.printToPDF({

        printBackground: true,

      });

    return {

      rasterisationOk: true,

      pdfPayloadBuffer: Buffer.from(printPayloadUint8Outcome),

    };

  } catch (caughtPdfFailure) {

    console.error("[ace-eval] Markdown PDF rasterisation failure", caughtPdfFailure);

    const faultNarrative =

      caughtPdfFailure instanceof Error

        ? caughtPdfFailure.message

        : "printToPDF_failure";

    return { rasterisationOk: false, rasterisationFaultReason: faultNarrative };

  } finally {

    ephemeralHiddenRenderWindowBootstrap.destroy();

    await fs.rm(ephemeralWorkspaceDirectory, { recursive: true, force: true });

  }

};

