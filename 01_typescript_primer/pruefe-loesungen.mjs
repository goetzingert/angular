// Führt alle Musterlösungen aus und vergleicht die Ausgabe mit der erwarteten Ausgabe (*.expected.txt).
// Aufruf: npm run pruefe-loesungen
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

function findeExpected(dir) {
  const treffer = [];
  for (const name of readdirSync(dir)) {
    const pfad = join(dir, name);
    if (statSync(pfad).isDirectory()) treffer.push(...findeExpected(pfad));
    else if (name.endsWith(".expected.txt")) treffer.push(pfad);
  }
  return treffer;
}

let fehler = 0;
for (const expectedDatei of findeExpected("loesung").sort()) {
  const quelle = expectedDatei.replace(".expected.txt", ".ts");
  const lauf = spawnSync("npx", ["tsx", quelle], { encoding: "utf8", shell: process.platform === "win32" });
  const erwartet = readFileSync(expectedDatei, "utf8").replace(/\r\n/g, "\n");
  const ist = (lauf.stdout ?? "").replace(/\r\n/g, "\n");
  if (lauf.status === 0 && ist === erwartet) {
    console.log(`ok       ${quelle}`);
  } else {
    fehler++;
    console.log(`FEHLER   ${quelle}`);
    if (lauf.status !== 0) console.log(lauf.stderr);
    else console.log(`--- erwartet:\n${erwartet}--- erhalten:\n${ist}`);
  }
}
process.exit(fehler === 0 ? 0 : 1);
