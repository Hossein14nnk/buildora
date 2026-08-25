import chokidar from 'chokidar';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync, exec } from 'child_process';
import {
    readdirSync,
    statSync,
    readFileSync,
    writeFileSync,
    mkdirSync,
    existsSync,
} from 'fs';
import { promisify } from "util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'));
const cleanScript = packageJson.scripts?.clean;
const lastArg = cleanScript.trim().split(/\s+/).pop();
const execAsync = promisify(exec);

let assetsRoot, mizRoot;

switch (lastArg) {
    case 'laravel':
        assetsRoot = join(process.cwd(), 'public');
        mizRoot = join(process.cwd(), 'resources');
        break;
    case 'react':
    case 'vue':
        assetsRoot = join(process.cwd(), 'src');
        mizRoot = join(process.cwd(), 'src');
        break;
    default:
        assetsRoot = process.cwd();
        mizRoot = process.cwd();
}


const isWatchMode = process.argv.includes('--watch');
const isBuildMode = process.argv.includes('--build');
const projectRoot = process.cwd();

function findJsFiles(dir) {
    let jsFiles = [];
    for (const file of readdirSync(dir)) {
        const filePath = join(dir, file);
        const stat = statSync(filePath);
        if (stat.isDirectory()) {
            jsFiles = jsFiles.concat(findJsFiles(filePath));
        } else if (file.endsWith('.js')) {
            jsFiles.push(filePath);
        }
    }
    return jsFiles;
}

function mergeJsFilesComponents() {
    const componentsDir = join(__dirname, '..', '..', 'views', 'components');
    const jsFiles = findJsFiles(componentsDir);
    let mergedContent = '';

    console.log(`🔍 Found ${jsFiles.length} JS files to merge...`);

    jsFiles.forEach((file) => {
        try {
            const content = readFileSync(file, 'utf8');
            mergedContent += `\n// File: ${relative(componentsDir, file)}\n${content}\n`;
        } catch (err) {
            console.error(`❌ Error reading file ${file}:`, err);
        }
    });

    return mergedContent;
}

function mergeJsFilesGlobal() {
    const globalDir = join(__dirname, '..', '..', 'views', 'global');
    const jsFiles = findJsFiles(globalDir);
    let mergedContent = '';

    console.log(`🔍 Found ${jsFiles.length} JS files to merge...`);

    jsFiles.forEach((file) => {
        try {
            const content = readFileSync(file, 'utf8');
            mergedContent += `\n// File: ${relative(globalDir, file)}\n${content}\n`;
        } catch (err) {
            console.error(`❌ Error reading file ${file}:`, err);
        }
    });

    return mergedContent;
}

function mergeJsFilesPages() {
    const pagesDir = join(__dirname, '..', '..', 'views', 'pages');
    const jsFiles = findJsFiles(pagesDir);
    let mergedContent = '';

    console.log(`🔍 Found ${jsFiles.length} JS files to merge...`);

    jsFiles.forEach((file) => {
        try {
            const content = readFileSync(file, 'utf8');
            mergedContent += `\n// File: ${relative(pagesDir, file)}\n${content}\n`;
        } catch (err) {
            console.error(`❌ Error reading file ${file}:`, err);
        }
    });

    return mergedContent;
}

function writeMergedJsContent() {
    const configOutput = {
        global: "/assets/js/mizchin.min.js",
        components: "/assets/js/mizchin.min.js",
        pages: "/assets/js/mizchin.min.js",
    };

    const content = {
        global: mergeJsFilesGlobal(),
        components: mergeJsFilesComponents(),
        pages: mergeJsFilesPages(),
    };

    const outputs = {};

    for (const [section, outputPath] of Object.entries(configOutput)) {
        if (!outputs[outputPath]) {
            outputs[outputPath] = [];
        }

        outputs[outputPath].push({
            section,
            content: content[section],
        });
    }

    for (const [relativePath, sections] of Object.entries(outputs)) {
        const outputPath = join(projectRoot, relativePath);

        mkdirSync(dirname(outputPath), { recursive: true });

        const mergedContent = sections
            .map(({ section, content }) => {
                return [
                    `/* ==================== ${section.toUpperCase()} ==================== */`,
                    content,
                ].join("\n");
            })
            .join("\n\n");

        writeFileSync(outputPath, mergedContent, "utf8");

        console.log(`💾 Merged JS written to: ${relativePath}`);

        if (isBuildMode) {
            try {
                console.log(`⚙️ Running terser for ${relativePath}...`);

                execSync(
                    `terser "${outputPath}" -o "${outputPath}" --compress --mangle`,
                    { stdio: "inherit" }
                );

                console.log(`✅ Minification complete: ${relativePath}`);
            } catch (err) {
                console.error(
                    `❌ Error during terser execution for ${relativePath}:`,
                    err.message
                );
            }
        }
    }
}

/* function runCommands() {
    const listFilesPath = `${assetsRoot}/assets/vendors/mizban/commands/listFiles.js`;
    const extractVariablesPath = `${assetsRoot}/assets/vendors/mizban/commands/extractVariables.js`;

    if (!existsSync(listFilesPath)) {
        return console.error(`❌ Missing file: ${listFilesPath}`);
    }

    console.log('📂 Running listFiles.js ...');
    execSync(`node "${listFilesPath}"`, (error) => {
        if (error) {
            return console.error(`💥 listFiles.js failed: ${error.message}`);
        }

        console.log('✅ listFiles.js completed.');

        if (!existsSync(extractVariablesPath)) {
            return console.error(`❌ Missing file: ${extractVariablesPath}`);
        }

        console.log('🪄 Running extractVariables.js ...');
        execSync(`node "${extractVariablesPath}"`, (error) => {
            if (error) {
                return console.error(`💥 extractVariables.js failed: ${error.message}`);
            }

            console.log('✨ extractVariables.js completed.');
            console.log('🎉 All commands finished!\n');
        });
    });
} */

let watchers = [];

async function buildEjs() {
    try {
        const { stdout, stderr } = await execAsync(
            `node "${join(mizRoot, 'app', 'system', 'pkg', 'ejs-build.js')}"`
        );

        if (stderr?.trim()) {
            console.error(stderr);
        }

        if (stdout?.trim()) {
            console.log(stdout);
        }

        console.log("✅ ejs-build.js completed.");

    } catch (err) {
        console.error(`💥 ejs-build.js failed: ${err.message}`);

        if (err.stdout) {
            console.error(err.stdout);
        }

        if (err.stderr) {
            console.error(err.stderr);
        }

        throw err;
    }
}

async function rebuildAllDynamic() {
    try {
        writeMergedJsContent();
        /* runCommands(); */
        restartWatchers();
        console.log('✅ Rebuild complete.\n');
    } catch (err) {
        // console.error('❌ Error during rebuild:', err);
    }
}

function clearWatchers() {
    watchers.forEach(w => w.close());
    watchers = [];
}

function restartWatchers() {
    clearWatchers();

    const components = join(__dirname, '..', '..', 'views', 'components');
    const sassDir = join(__dirname, '..', 'sass');
    const configSassDir = join(__dirname, '..', '..', 'views', 'base');
    const ejsDir = join(__dirname, '..', '..', '..', 'app');

    watchers.push(
        chokidar.watch(ejsDir, { ignored: /(^|[\/\\])\../, persistent: true }).on('change', async (path) => {
            if (path.endsWith('.ejs')) {
                console.log(`🗃️ ejs changed: ${path}`);
            } else if (path.endsWith('.json')){
                console.log(`🌐 json changed: ${path}`);
            }
            await buildEjs();
            await rebuildAllDynamic();
        }),

        chokidar.watch(sassDir, { ignored: /(^|[\/\\])\../, persistent: true }).on('change', async (path) => {
            if (path.endsWith('.scss') || path.endsWith('.sass')) {
                console.log(`🎨 Sass changed: ${path}`);
                await rebuildAllDynamic();
            }
        }),

        chokidar.watch(configSassDir, { ignored: /(^|[\/\\])\../, persistent: true }).on('change', async (path) => {
            if (path.endsWith('.scss') || path.endsWith('.sass')) {
                let timeCompiled = new Date();
                console.log(`🧬 Sass Config changed: ${path}`);
                await execSync(`sass --style=expanded app/system/_index.scss:assets/css/miz.min.css`, { stdio: 'inherit' });
                console.log(`[${timeCompiled.getFullYear()}-${timeCompiled.getMonth() + 1}-${timeCompiled.getDate()} ${timeCompiled.getHours()}:${timeCompiled.getMinutes()}] Compiled app\\system\\_index.scss to assets\\css\\miz.min.css.`);
                await rebuildAllDynamic();
            }
        })
    );

    const componentWatcher = chokidar.watch(components, {
        ignored: /(^|[\/\\])\../,
        persistent: true,
    });

    let isReady = false;

    componentWatcher
        .on('add', async path => {
            if (!isReady) return;
            if (path.endsWith('.js')) {
                console.log(`➕ JS file added: ${path}`);
                await rebuildAllDynamic();
            }
        })
        .on('addDir', async path => {
            if (!isReady) return;
            console.log(`📂 Directory added: ${path}`);
            await rebuildAllDynamic();
        })
        .on('unlink', async path => {
            if (path.endsWith('.js')) {
                console.log(`➖ JS file removed: ${path}`);
                await rebuildAllDynamic();
            }
        })
        .on('unlinkDir', async path => {
            console.log(`📁 Directory removed: ${path}`);
            await rebuildAllDynamic();
        })
        .on('change', async path => {
            if (path.endsWith('.js')) {
                console.log(`🧩 JS file changed: ${path}`);
                await rebuildAllDynamic();
            }
        })
        .on('ready', () => {
            console.log('🎯 Component watcher is ready and watching for changes...');
            isReady = true;
        });

    watchers.push(componentWatcher);
}

if (isWatchMode) {
    console.log('👀 Watch mode active...');
    restartWatchers();
} else if (isBuildMode) {
    console.log('🏗️ Build mode active...');
    (async () => {
        writeMergedJsContent();
        execSync(`node "${join(mizRoot, 'app','system', 'pkg', 'ejs-build.js')}"`, { stdio: 'inherit' });
        console.log("✅ compile ejs completed successfully!");
    })();
} else {
    console.log('🚀 Running tasks once...');
    rebuildAllDynamic();
}