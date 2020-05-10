import fs from 'fs'
import path from 'path'
import wadParser from 'doom-wad'

function readWadsFromDir(dir: string): string[] {
    const files: string[] = fs.readdirSync(dir)
    const mapped: string[] = files.map(file => path.resolve(dir, file))
    const wads: string[] = mapped
        .filter(file => path.extname(file).toUpperCase() === '.WAD')
    return wads
}

function handleError(error: any, message?: string) {
    const e = message ? new Error(`\n❗${message}\n\n${error}`) : new Error(`❗${error}`)
    throw e
}

function readWad(wadpath: string) {
    try { 
        const buffer = fs.readFileSync(wadpath)
        const data = wadParser(buffer)
        return data
    } catch (error) {
        handleError(error, `Could not read wad from ${wadpath}`)
    }
}

function main(args: any):void {

    const { WAD_PATH: wadPath, JSON_PATH: outputPath } = args

    if (!wadPath) {
        handleError('WAD_PATH is missing from environment. See README.md for usage instructions')
    }

    if (!outputPath) {
        handleError('JSON_PATH is missing from environment See README.md for usage instructions')
    }

    console.log('Getting wads from file system 💾')
    const wadPaths = readWadsFromDir(wadPath)

    console.log('Parsing wads into JSON 🔨')
    const wadDatas = wadPaths.map(wad => {
        const data = readWad(wad)
        return {
            wadName: path.basename(wad),
            data
        }
    })

    console.log('Writing JSONs to disk ✍')
    const jsons = wadDatas.map(({ wadName, data }) => {
        const outfp = path.resolve(outputPath, `${wadName}.json`)
        try {
            fs.writeFileSync(outfp, JSON.stringify(data))
            return outfp
        } catch (error) {
            handleError(error)
        }
    })

    console.log('JSONs are ready ✨')
    console.log(jsons)
}

main(process.env)
