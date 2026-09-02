// build-content.js
// Runs automatically on Netlify at deploy time.
// Reads every individual sermon/resource file that Decap CMS creates
// under content/sermons/ and content/resources/, and bundles them
// into single JSON files under data/ that the site's front-end can fetch.
//
// This lets Dr. Marrow add or delete entries one at a time in the CMS
// (which folder collections handle well) while the live site only
// needs to make one fetch() call to get the whole list.

const fs = require("fs");
const path = require("path");

function readCollection(folderRelativePath) {
  const dir = path.join(__dirname, folderRelativePath);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      try {
        return JSON.parse(raw);
      } catch (err) {
        console.warn(`Skipping ${f}: invalid JSON (${err.message})`);
        return null;
      }
    })
    .filter(Boolean);
}

function main() {
  const outDir = path.join(__dirname, "data");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const sermons = readCollection("content/sermons").sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  fs.writeFileSync(
    path.join(outDir, "sermons.json"),
    JSON.stringify(sermons, null, 2)
  );

  const resources = readCollection("content/resources");
  fs.writeFileSync(
    path.join(outDir, "resources.json"),
    JSON.stringify(resources, null, 2)
  );

  console.log(
    `Content build complete: ${sermons.length} sermon(s), ${resources.length} resource(s).`
  );
}

main();
