// Returns a parsed object interpretation of the text from a layermaps.c file
function parseLayerMapsFile(text) {
    let maps = [];
    let consts = text.split('\nKEYMAP').filter(text => {
        let unspaced = text.replace(/[\s\n]/g,'');
        return unspaced.length > 6 && unspaced.slice(0, 1) == '('
            && unspaced.slice(-3) == '}};';
    });
    for(var constblock in consts) {
        let block = consts[constblock];
        let layername = block.replace(/[\s\n]/g,'').split(')')[0].slice(1);
        let rows = block.slice(block.indexOf('{')+1, block.lastIndexOf('}'))
            .replace(/\s/g,'')
            .split('},');
        let layermap = [];
        for(var rowtext in rows) {
            let keystrings = rows[rowtext].replace(/{/g, '')
                .replace(/}/g, '')
                .split(',');
            layermap.push(keystringsToKeyArray(keystrings));
        }
        maps.push({name: layername, map: layermap});
    }
    return(maps);
}

function keystringsToKeyArray(keystrings) {
    let keys = [];
    if(keystrings.length == 0)
        return [];
    if(keystrings[0] == 'NONE') {
        keys.push({type: 'NONE', data: ''});
        return keys.concat(keystringsToKeyArray(keystrings.slice(1)));
    }
    else if(keystrings[0].split('(')[0] == 'HIDMOD') {
        keys.push({type: 'HIDMOD', data: keystrings[0].split('(')[1] +
            ',' + keystrings[1].replace(/\)/g, '')});
        return keys.concat(keystringsToKeyArray(keystrings.slice(2)));
    }
    else {
        keys.push({type: keystrings[0].split('(')[0],
            data: keystrings[0].split('(')[1].replace(/\)/g, '')});
        return keys.concat(keystringsToKeyArray(keystrings.slice(1)));
    }
}

export default parseLayerMapsFile;
