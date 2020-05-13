# wad2json

wad2json is a tool that parses wad files and outputs a JSON representation of its data


## Description

wad2json will crawl a directory for wads, parse them into json, then output the json to disk

Each json object has the following keys
```
[
  'type',     'colorMap',
  'demos',    'dmxgus',
  'dmxgusc',  'endoom',
  'flats',    'genMidi',
  'maps',     'music',
  'palettes', 'patches',
  'sounds',   'sprites',
  'textures', 'ui'
]
```

See the [doom-wad](https://github.com/nrkn/doom-wad) and [nlump](https://github.com/nrkn/nlump) for more information

## Installation

This project has been built and tested with `yarn`, though it *should* run with `npm` as well.

```
git clone https://github.com/doom2network/wad2json.git
cd wad2json
yarn install
```

## Usage

Make sure you have `WAD_PATH` and `JSON_PATH` set in your environment before running.

```
WAD_PATH=/path/to/wads \
JSON_PATH=/path/to/save/jsons \
yarn start
```

You can additionally add `ERROR_THRESHOLD` to your environment to exit the process if it's hit.


## Extra

If you have a lot of wads, it is possible that node may run out of memory. You can run the process directly, and allocate more memory to the node process like this:

```
node --max-old-space-size=8192 .\dist\index.js
```

