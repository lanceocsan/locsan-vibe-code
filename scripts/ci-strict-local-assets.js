"use strict";

const fs = require("fs");
const path = require("path");

const FORBIDDEN_SUBSTRINGS = [
  "cdn.tailwindcss.com",
  "fonts.googleapis.com",
  "fonts.gstatic.com",
];

const walkSourceTree = (folderPath) => {
  const queue = [folderPath];
  const collection = [];
  while (queue.length > 0) {
    const currentPath = queue.pop();
    const statDescriptor = fs.statSync(currentPath);
    if (statDescriptor.isDirectory()) {
      for (const childName of fs.readdirSync(currentPath)) {
        if (childName === "node_modules" || childName === "dist" || childName === "dist-electron" || childName === "release") {
          continue;
        }
        queue.push(path.join(currentPath, childName));
      }
    } else if (statDescriptor.isFile()) {
      const lowerName = currentPath.toLowerCase();
      if (
        lowerName.endsWith(".ts") ||
        lowerName.endsWith(".tsx") ||
        lowerName.endsWith(".css") ||
        lowerName.endsWith(".html")
      ) {
        collection.push(currentPath);
      }
    }
  }
  return collection;
};

const srcRoot = path.join(__dirname, "..", "src");
const failures = [];
for (const filePath of walkSourceTree(srcRoot)) {
  const fileBody = fs.readFileSync(filePath, "utf8");
  for (const needle of FORBIDDEN_SUBSTRINGS) {
    if (fileBody.includes(needle)) {
      failures.push({ filePath, needle });
    }
  }
}

if (failures.length > 0) {
  console.error("strictLocal asset scan failed — external CDN references detected:");
  for (const row of failures) {
    console.error(`  ${row.filePath}: ${row.needle}`);
  }
  process.exit(1);
}

console.log("strictLocal asset scan passed.");
