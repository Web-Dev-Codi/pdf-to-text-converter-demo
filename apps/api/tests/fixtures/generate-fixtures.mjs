// Generates minimal valid single-page PDFs, one per PDF spec version header.
// Run: node tests/fixtures/generate-fixtures.mjs
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

/** Versions per Wikipedia "History of PDF" (Adobe specs + ISO 32000). */
const VERSIONS = [
  "1.0",
  "1.1",
  "1.2",
  "1.3",
  "1.4",
  "1.5",
  "1.6",
  "1.7",
  "2.0",
];

/**
 * Builds a minimal, structurally valid single-page PDF whose header declares
 * the given spec version and whose page shows `Hello PDF vX.Y`.
 */
function buildPdf(version) {
  const label = `Hello PDF v${version}`;
  const content = `BT /F1 24 Tf 72 700 Td (${label}) Tj ET\n`;
  const objs = [
    "1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n",
    "2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n",
    "3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj\n",
    `4 0 obj<</Length ${content.length}>>stream\n${content}endstream\nendobj\n`,
    "5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\n",
  ];

  let body = "";
  const offsets = [];
  for (const obj of objs) {
    offsets.push(body.length);
    body += obj;
  }

  const xrefPos = body.length;
  const xref =
    `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` +
    offsets
      .map((off) => `${String(off).padStart(10, "0")} 00000 n \n`)
      .join("") +
    `trailer<</Size ${objs.length + 1}/Root 1 0 R>>\nstartxref\n${xrefPos}\n%%EOF\n`;

  return Buffer.from(`%PDF-${version}\n${body}${xref}`, "latin1");
}

for (const version of VERSIONS) {
  const file = join(here, `pdf-${version}.pdf`);
  writeFileSync(file, buildPdf(version));
  console.log(`wrote ${file}`);
}
