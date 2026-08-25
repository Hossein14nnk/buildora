import fs from "fs";
import path from "path";
import prettier from "prettier";
import { fileURLToPath } from "url";

const projectRoot = process.cwd();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.join(projectRoot, "output");

const prettierConfig = {
	parser: "html",
	printWidth: 100000,
	tabWidth: 4,
	singleQuote: true,
	trailingComma: "es5",
	bracketSpacing: true,
	bracketSameLine: true,
	proseWrap: "never",
}

async function htmlFormatter(src) {
    const items = fs.readdirSync(src, { withFileTypes: true });

    for (const item of items) {
        const srcPath = path.join(src, item.name);

        if (item.isDirectory()) {
            await htmlFormatter(srcPath);
            continue;
        }

        if (!item.name.endsWith(".html")) {
            continue;
        }

        try {
            const html = fs.readFileSync(srcPath, "utf-8");

            const formattedHtml = await prettier.format(
                html,
                prettierConfig
            );

            fs.writeFileSync(
                srcPath,
                formattedHtml,
                "utf-8"
            );

            console.log(`🚩 HTML formatted: ${srcPath}`);
        } catch (err) {
            console.error("\n❌ Prettier Format Error\n");
            console.error("📄 File:", srcPath);

            if (err.loc) {
                console.error(
                    `📍 Location: ${err.loc.start.line}:${err.loc.start.column}`
                );
            }

            console.error("Full error:", err.message);
        }
    }
}

await htmlFormatter(outputDir);