/**
 * Registered electors per riding at the 2026 general election, summed over
 * polling divisions (Élections Québec results by polling station, via
 * votovision/data). Used by the dashboard map to size ridings by electors.
 *
 * Run: node tools/make_riding_electors.mjs [path/to/resultats_sections_qc.csv]
 * Writes data/qc_riding_electors.json {riding_code: electors}.
 */
import { readFileSync, writeFileSync } from "node:fs";

const src = process.argv[2] ?? new URL("../../data/csv/resultats_sections_qc.csv", import.meta.url);
const lines = readFileSync(src, "utf-8").trim().split("\n");
const head = lines[0].split(",");
const col = (name) => head.indexOf(name);
const [iElection, iMap, iRiding, iElectors] = ["election", "carte", "circonscription", "electeurs"].map(col);

const electors = {};
for (const line of lines.slice(1)) {
  const c = line.split(",");
  if (c[iElection] !== "2026-10-05" || c[iMap] !== "2026") continue;
  electors[c[iRiding]] = (electors[c[iRiding]] ?? 0) + (+c[iElectors] || 0);
}
const n = Object.keys(electors).length;
if (n !== 127) throw new Error(`expected 127 ridings, got ${n}`);
writeFileSync(new URL("../data/qc_riding_electors.json", import.meta.url), JSON.stringify(electors));
const total = Object.values(electors).reduce((a, b) => a + b, 0);
console.log(`${n} ridings, ${total} electors`);
