import Parser from "doom-wad";
import Fs from "fs-extra";
import Path from "path";
import { performance } from "perf_hooks";

const now = Date.now()
const errorLogPath = Path.resolve(__dirname, '..', 'logs', `error-${now}.log`)

/**
 * @description Recursively crawls a directory for wad files
 * @param dir
 * @param files
 * @param result
 * @param regex
 */
function readWadsFromDir(
    dir: string,
    files?: any,
    result?: any,
    regex?: any
): string[] {
    files = files || Fs.readdirSync(dir);
    result = result || [];
    regex = regex || /^.*\.wad/i;

    for (let i = 0; i < files.length; i++) {
        let file = Path.join(dir, files[i]);

        if (Fs.statSync(file).isDirectory()) {
            try {
                result = readWadsFromDir(file, Fs.readdirSync(file), result, regex);
            } catch (error) {
                continue;
            }
        } else {
            if (regex.test(file)) {
                result.push(file);
            }
        }
    }

    return result;
}

/**
 * @description Iterate over wads and outout JSON for each wad to outputDir
 * @param wadsList
 * @param outputDir
 * @param errorThreshhold
 */

async function runner(wadsList: string[], outputDir: string, errorThreshhold: number) {
    const errors = [];

    for (const wadPath of wadsList) {

        const start = performance.now()

        try {

            console.info(`
                error threshold: ${errorThreshhold} ${typeof errorThreshhold}
                errors: ${errors.length} ${typeof errors.length}
            `)

            if (errors.length === errorThreshhold) {
                // stop the program
                console.error("Reached error threshold. Halting scan.")
                process.exit()
            }

            console.log(`💽  Building JSON for ${wadPath}`);
            console.log(`Errors: ${errors.length}`);
            const json = await parseWadToJSON(wadPath);
            const wadName = Path.basename(wadPath);
            console.log('Writing JSONs to disk...')
            await writeWadJsonToDisk(`${outputDir}/${wadName}.json`, json);
            const end = performance.now()
            const dt = end - start
            console.log("");
            console.log(`✨Finished in ${(dt / 1000).toFixed(2)}s✨`)
            console.log("");

        } catch (error) {
            Fs.appendFileSync(errorLogPath, `${Date.now()} ${error}\n`)
            errors.push(error);
            console.error(error);
        }
    }
}

/**
 * @description Reads a wad from disk, parses out useful information from it,
 * then returns that data as JSON
 * @param wadpath
 */
async function parseWadToJSON(wadpath: string): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            const buffer = Fs.readFileSync(wadpath);
            const wadData = Parser(buffer);
            resolve(wadData);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * @description Writes wad data to disk
 * @param data
 * @param outPath
 */
async function writeWadJsonToDisk(
    outPath: string,
    data: object
): Promise<string> {
    return new Promise((resolve, reject) => {
        Fs.writeJson(outPath, data, (error) => {
            if (error) {
                reject(error);
            }
            resolve(outPath);
        });
    });
}

function main(args: any):void {

    const { WAD_PATH: wadPath, JSON_PATH: outputPath, ERROR_THRESHOLD: errorThreshold = 50 } = args

    if (!wadPath) {
        throw new Error('WAD_PATH is missing from environment. See README.md for usage instructions')
    }

    if (!outputPath) {
        throw new Error('JSON_PATH is missing from environment See README.md for usage instructions')
    }

    const wads = readWadsFromDir(wadPath);
    console.log(`Found ${wads.length} wads!`);

    runner(wads, outputPath, Number(errorThreshold));

}

main(process.env)
