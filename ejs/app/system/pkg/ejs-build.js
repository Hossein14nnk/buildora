import ejs from "ejs";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = process.cwd();


const appDir = path.join(projectRoot, "app");
const pagesDir = path.join(appDir, "views", "pages");
const componentsDir = path.join(appDir, "views", "components");
const dataDir = path.join(appDir, "lang");
const outputDir = path.join(projectRoot, "output");

const excludePages = ["content.ejs"];
const excludeComponents = ["content.ejs"];

const languages = fs.readdirSync(dataDir).map((file) => file.replace(".json", ""))

const globalJSDir = path.join(appDir, 'views', "functions", "globals.js");
const globals = (await import(pathToFileURL(globalJSDir).href)).default;

function removeOutputDir(dir) {
    if (!fs.existsSync(dir)) {
        return;
    }

    const maxAttempts = 20;
    const retryDelay = 100;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            fs.rmSync(dir, {
                recursive: true,
                force: true,
                maxRetries: 0,
            });

            return;
        } catch (err) {
            if (err.code !== "EBUSY" && err.code !== "EPERM") {
                throw err;
            }

            if (attempt < maxAttempts) {
                Atomics.wait(
                    new Int32Array(new SharedArrayBuffer(4)),
                    0,
                    0,
                    retryDelay
                );
            }
        }
    }

    try {
        const items = fs.readdirSync(dir);

        for (const item of items) {
            const itemPath = path.join(dir, item);

            try {
                fs.rmSync(itemPath, {
                    recursive: true,
                    force: true,
                });
            } catch {}
        }
    } catch {}
}

removeOutputDir(outputDir);

// =======================
// FUNCTIONS
// =======================

async function renderComponents(src, dest, data, lang) {
    fs.mkdirSync(dest, { recursive: true });

    const items = fs.readdirSync(src, { withFileTypes: true });

    for (const item of items) {
        const srcPath = path.join(src, item.name);

        if (item.isDirectory()) {
            const indexFile = path.join(srcPath, "index.ejs");

            if (fs.existsSync(indexFile)) {
                const outputFile = path.join(dest, `${item.name}.html`);

                try {
                    const html = await ejs.renderFile(
                        indexFile,
                        {
                            ...globals,
                            t: data,
                            lang
                        },
                        {
                            root: appDir
                        }
                    );

                    fs.writeFileSync(outputFile, html);

                    console.log(`✅ Component rendered: ${outputFile}`);
                } catch (err) {
                    console.error(`❌ Error rendering component: ${indexFile}`);
                    console.error(err);
                }

                continue;
            }

            await renderComponents(
                srcPath,
                path.join(dest, item.name),
                data,
                lang
            );

            continue;
        }
    }
}

async function renderPages(src, dest, data, lang) {
    fs.mkdirSync(dest, { recursive: true });

    const items = fs.readdirSync(src, { withFileTypes: true });

    for (const item of items) {
        const srcPath = path.join(src, item.name);

        if (item.isDirectory()) {
            const indexFile = path.join(srcPath, "index.ejs");

            if (fs.existsSync(indexFile)) {
                const outputFile = path.join(
                    dest,
                    `${item.name}.html`
                );

                try {
                    const html = await ejs.renderFile(
                        indexFile,
                        {
                            ...globals,
                            t: data,
                            lang,
                        },
                        {
                            root: appDir,
                        }
                    );

                    fs.writeFileSync(outputFile, html);

                    console.log(`✅ Page rendered: ${outputFile}`);
                } catch (err) {
                    console.error(`❌ Error rendering page: ${indexFile}`);
                    console.error(err);
                }

                continue;
            }

            await renderPages(
                srcPath,
                path.join(dest, item.name),
                data,
                lang
            );
        }
    }
}

// =======================
// BUILD PAGES
// =======================

for (const lang of languages) {
    const langJsonPath = path.join(dataDir, `${lang}.json`);
    const langDataRaw = JSON.parse(
        fs.readFileSync(langJsonPath, "utf-8")
    );

    const outPagesDir = path.join(outputDir, lang, "pages");

    await renderPages(
        pagesDir,
        outPagesDir,
        langDataRaw,
        lang
    );
}

// =======================
// BUILD COMPONENTS
// =======================
for (const lang of languages) {
	const langJsonPath = path.join(dataDir, `${lang}.json`)
	const langDataRaw = JSON.parse(fs.readFileSync(langJsonPath, "utf-8"))

	const outComponentsDir = path.join(outputDir, lang, "components")
	await renderComponents(componentsDir, outComponentsDir, langDataRaw, lang)
}

console.log("✅ compile ejs completed successfully!");