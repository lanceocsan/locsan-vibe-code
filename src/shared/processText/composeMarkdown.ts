import type { AceCategoryScores, AceStructure } from "../apiTypes.js";

const pillarEyebrowTitles: Record<keyof AceStructure, { eyebrow: string }> = {
  aptitude: {
    eyebrow: "Logic & Hard Skills",
  },
  character: {
    eyebrow: "Resilience & Teamwork",
  },
  effectiveness: {
    eyebrow: "Outcomes & KPIs",
  },
};

const evidenceBulletBlock = (evidenceRows: string[]): string => {
  if (evidenceRows.length > 0) {
    return evidenceRows.map((snippet) => `- ${snippet}`).join("\n");
  }
  return "_No additional evidence lines captured for this pillar._";
};

export const composeAceMarkdownExport = ({
  ace,
  aceScores,
}: {
  ace: AceStructure;
  aceScores: AceCategoryScores;
}): string => {
  const sectionBodies = (bucketKey: keyof AceStructure): string =>
    [
      "### Category score",
      `**${aceScores[bucketKey]} / 5** (operator-entered)`,
      "",
      "### Evidence",
      evidenceBulletBlock(ace[bucketKey].evidence),
      "",
      `_${ace[bucketKey].summary}_`,
    ].join("\n");

  const blocks = (["aptitude", "character", "effectiveness"] as const).map(
    (key) =>
      [`## ${pillarEyebrowTitles[key].eyebrow}`, sectionBodies(key), ""].join("\n"),
  );

  return `# ACE Evaluation Workspace — Markdown Draft\nCONFIDENTIAL • Leadership review mandatory\n\n${blocks.join("\n")}`;
};
