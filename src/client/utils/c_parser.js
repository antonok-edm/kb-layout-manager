// Returns a parsed object interpretation of the text from a layermaps.c file
function parseLayerMapsFile(c_source) {
    let maps = [];
    const text = c_source.split('BEGIN_KEYMAPS')[1].split('END_KEYMAPS')[0];
    const consts = text.split('\n{//').filter(text => {
        const unspaced = text.replace(/[\s\n]/g,'');
        return unspaced.length > 6 && unspaced.slice(0, 1) == '{'
            && unspaced.slice(-3) == ',},';
    });
    for(const constblock in consts) {
        let block = consts[constblock];
        const meta = JSON.parse(block.split('\n')[0].trim());
        block = block.slice(block.indexOf('\n')).trim();
        const layername = 'name' in meta ? meta.name : 'unnamed';
        const rows = block.slice(0, block.lastIndexOf('}'))
            .replace(/\s/g,'')
            .split('},')
            .slice(0, -1);
        let layermap = [];
        for(const rowtext of rows) {
            const keystrings = rowtext.replace(/{/g, '')
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
