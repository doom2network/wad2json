# wad2json

wad2json is a tool that parses wad files and outputs a JSON representation of its data


## Description

wad2json will get wads from a directory, parse them into json, then output the json to disk

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

## Usage

Make sure you have `WAD_PATH` and `JSON_PATH` set in your environment before running.

```
WAD_PATH=/path/to/wads \
JSON_PATH=/path/to/save/jsons \
yarn start
```

Once complete, you will be presented with a list of the created files

<img src="https://github.com/doom2network/wad2json/blob/master/assets/screenshot-dark.png?raw=true" width='50%' alt="wad2json at work" />

