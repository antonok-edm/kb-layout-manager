import './style.css';
import io from 'socket.io-client';
import Vue from 'vue/dist/vue.js';

/*
 *      Global constants
 */
// Every type that can be assigned to a key
const key_types = ['NONE', 'HID', 'MOD', 'MIDI', 'FUNC', 'TOGGLE', 'TARGET', 'CLICK',
    'MOUSE_X', 'MOUSE_Y', 'SCROLL_X', 'SCROLL_Y', 'HIDMOD'];
// Export header to be added to the beginning of the generated layermap file
const export_header_format =
  '// created by antonok\'s kb layout manager on %%DATE%%\n' +
  '//     www.gitlab.com/antonok/kb\n' +
  '//     www.gitlab.com/antonok/kb-layout-manager\n';
// Dimensions of the keyboard (number of keys)
const WIDTH = 14;
const HEIGHT = 5;
// Strings to be displayed corresponding to every state of the backend server
const status_to_string = {
    'idle': 'Idle',
    'make': 'Compiling...',
    'flash': 'Uploading...',
    'clean': 'Cleaning up...',
    'done': 'Success!',
    'error': 'Failed'
};
// Vue template for key elements on the keyboard visual
const keyboard_key = {
    props: ['x', 'y', 'key_type', 'key_data',
        'is_active'],
    data: function() {
        return { valid_types: key_types };
    },
    template: '<div class="keyboard-key" v-on:click="focusKey"' +
            'v-bind:class="class_by_type">' +
        '<input ref="input"' +
                'class="keyboard-text"' +
                'v-bind:value="key_data"' +
                'v-on:input="updateKey(key_type, $event.target.value)">' +
        '</input>' +
        '<select ref="select"' +
                'class="keyboard-type"' +
                'v-bind:class="class_by_type"' +
                'v-bind:value="key_type"' +
                'v-on:input="updateKey($event.target.value, key_data)">' +
            '<option v-for="valid_type in valid_types" ' +
                    'v-bind:value="valid_type">' +
                '{{ valid_type }}' +
            '</option>' +
        '</select>' +
    '</div>',
    computed: {
        class_by_type: function() {
            return {
                'active': this.is_active,

                'type-none': this.key_type == 'NONE',
                'type-hid': this.key_type == 'HID',
                'type-mod': this.key_type == 'MOD',
                'type-midi': this.key_type == 'MIDI',
                'type-func': this.key_type == 'FUNC',
                'type-toggle': this.key_type == 'TOGGLE',
                'type-target': this.key_type == 'TARGET',
                'type-click': this.key_type == 'CLICK',
                'type-mouse-x': this.key_type == 'MOUSE_X',
                'type-mouse-y': this.key_type == 'MOUSE_Y',
                'type-scroll-x': this.key_type == 'SCROLL_X',
                'type-scroll-y': this.key_type == 'SCROLL_Y',
                'type-hidmod': this.key_type == 'HIDMOD'
            };
        }
    },
    methods: {
        updateKey: function(new_type, new_data) {
            let validated_data = validateByType(new_data, new_type);
            this.$refs.input.value = validated_data;
            this.$emit('updatekey', this.x, this.y, new_type, validated_data);
        },
        focusKey: function() {
            this.$emit('focuskey', this.x, this.y);
        }
    }
};
// Vue template for the popup displaying information about server status
const status_popup = {
    props: ['current_status', 'error_message'],
    data: function() {
        return { status_to_string : status_to_string };
    },
    template: '<div id="status-popup" v-on:click="status_clicked" ' +
            'v-bind:class="show_if_not_idle">' +
        '<div class="status-top-flex">' +
            '<span class="status-title">' +
                '{{ status_string }}' +
            '</span>' +
            '</br>' +
            '<span class="status-info"' +
                    'v-bind:class="show_if_flash">' +
                'Reset keyboard to bootloader ' +
                'to continue' +
            '</span>' +
            '<span class="status-info" ' +
                    'v-bind:class="show_if_done">' +
                'Click to dismiss' +
            '</span>' +
            '<button class="status-cancel" ' +
                    'v-bind:class="show_if_flash" ' +
                    'v-on:click="cancel_flash">' +
                'Cancel' +
            '</button>' +
        '</div>' +
        '<div class="status-bottom-flex">' +
            '<div class="loading-frame">' +
                '<div class="loading-bar" ' +
                        'v-bind:class="class_by_status">' +
                '</div>' +
            '</div>' +
            '<span class="status-error-info" ' +
                    'v-bind:class="show_if_error">' +
                '{{ error_message }}' +
            '</span>' +
        '</div>' +
    '</div>',
    computed: {
        status_string: function() {
            return status_to_string[this.current_status];
        },
        class_by_status: function() {
            return {
                'status-idle': this.current_status == 'idle',
                'status-make': this.current_status == 'make',
                'status-flash': this.current_status == 'flash',
                'status-clean': this.current_status == 'clean',
                'status-done': this.current_status == 'done',
                'status-error': this.current_status == 'error'
            };
        },
        show_if_error: function() {
            return {
                'hidden': this.current_status != 'error'
            };
        },
        show_if_flash: function() {
            return {
                'hidden': this.current_status != 'flash'
            };
        },
        show_if_done: function() {
            return {
                'hidden': this.current_status != 'done'
            };
        },
        show_if_not_idle: function() {
            return {
                'hidden': this.current_status == 'idle'
            };
        }
    },
    methods: {
        status_clicked: function() {
            this.$emit('hide_status');
        },
        cancel_flash: function() {
            this.$emit('hide_status');
            socket.emit('cancel_flash');
        }
    }
};

// Setup websocket connection using socket.io
var socket = io.connect();

socket.on('connect', () => keyboard.server_connected = true);

socket.on('disconnect', () => keyboard.server_connected = false);

// Parse a layermap file from the server backend and
// set it as the current layout
socket.on('layermaps.c', layermaps_file_text => {
    keyboard.file_data = parseLayerMapsFile(layermaps_file_text);
    keyboard.new_data = keyboard.file_data;
    keyboard.current_layer = 0;
    keyboard.layers = getLayernamesFromFileData(keyboard.file_data);
});

// Notify the user of the progress of backend operations
socket.on('progress', report => {
    keyboard.server_status = report.op;
    if(report.op == 'flash') {
        keyboard.server_error_message = 'Reset to bootloader to continue...';
    }
    else if(report.op == 'error') {
        keyboard.server_error_message = report.traceback.stderr;
        // Also show more detailed information in the browser console
        console.log('The server encountered the following error during '
            + report.during + ':\n' + report.traceback.stderr);
        console.log('The command "' + report.traceback.cmd
            + '" exited with code ' + report.traceback.code);
    }
});

// Initialize keys, a minimal 2D array of key data
var keys = new Array(HEIGHT);
for(var y = 0; y < HEIGHT; y++) {
    keys[y] = new Array(WIDTH);
    for(var x = 0; x < WIDTH; x++) {
        keys[y][x] = {type: 'NONE', data: ''};
    }
}

// Initialize the Vue object that connects all page elements
var keyboard = new Vue({
    el: '#body',
    data: {
        file_data: [{name: '', map: [[]]}],
        new_data: [{name: '', map: [[]]}],
        width: WIDTH,
        height: HEIGHT,
        layers: [],
        current_layer: -1,
        focused_key: { x:-1, y:-1 },
        scale: 1,
        newlayername: '',
        server_connected: false,
        server_status: 'idle',
        server_error_message: '',
        option_backup: false,
        option_write: true,
        option_make: true,
        option_flash: true,
        option_clean: true,
    },
    components: {
        'keyboard-key': keyboard_key,
        'status-popup': status_popup
    },
    computed: {
        keys: function() {
            if(this.current_layer >= 0)
                return this.new_data[this.current_layer].map;
            else
                return keys;
        }
    },
    methods: {
        exportMaps: function() {
            let file_content = createExportFormat(this.new_data);
            saveFile('layermaps.c', file_content);
        },
        exportMapsServer: function() {
            let file_content = createExportFormat(this.new_data);
            sendToServer(file_content);
        },
        processKeyUpdate: function(x, y, type, data) {
            this.new_data[this.current_layer].map[y][x] = {data: data, type: type};
        },
        updateKeyFocus: function(x, y) {
            this.focused_key = {x, y};
        },
        addLayer: function() {
            this.layers.push(this.newlayername);
            this.new_data.push({name: this.newlayername,
                map: keys});
            this.current_layer = this.layers.length-1;
        },
        required_functions: function() {
            let req_funcs = [];
            for(var layer in this.new_data) {
                let l = this.new_data[layer];
                for(var row in l.map) {
                    let r = l.map[row];
                    for(var key in r) {
                        let k = r[key];
                        if(k.type == 'FUNC' && !req_funcs.includes(k.data)) {
                            req_funcs.push(k.data);
                        }
                    }
                }
            }
            return req_funcs.sort();
        },
        set_idle: function() {
            this.server_status = 'idle';
        }
    }
});

// Read in data from a default layermaps.c file
fetch('layermaps.c')
    .then(response => response.text())
    .then(text => {
        if(!keyboard.server_connected) {
            keyboard.file_data = parseLayerMapsFile(text);
            keyboard.new_data = keyboard.file_data;
            keyboard.current_layer = 0;
            keyboard.layers = getLayernamesFromFileData(keyboard.file_data);
        }
    });

// Validation functions for the string data of each keytype.
// Called on every update of string contents.
function validateByType(key_data, key_type) {
    let validated_data;
    switch(key_type) {
    case 'NONE':
        validated_data = validateTypeNONE(key_data);
        break;
    case 'HID':
        validated_data = validateTypeHID(key_data);
        break;
    case 'MOD':
        validated_data = validateTypeMOD(key_data);
        break;
    case 'MIDI':
        validated_data = validateTypeMIDI(key_data);
        break;
    case 'FUNC':
        validated_data = validateTypeFUNC(key_data);
        break;
    case 'TOGGLE':
        validated_data = validateTypeTOGGLE(key_data);
        break;
    case 'TARGET':
        validated_data = validateTypeTARGET(key_data);
        break;
    case 'CLICK':
        validated_data = validateTypeCLICK(key_data);
        break;
    case 'MOUSE_X':
        validated_data = validateTypeMOUSE_X(key_data);
        break;
    case 'MOUSE_Y':
        validated_data = validateTypeMOUSE_Y(key_data);
        break;
    case 'SCROLL_X':
        validated_data = validateTypeSCROLL_X(key_data);
        break;
    case 'SCROLL_Y':
        validated_data = validateTypeSCROLL_Y(key_data);
        break;
    case 'HIDMOD':
        validated_data = validateTypeHIDMOD(key_data);
        break;
    }
    return validated_data;
}


function validateTypeNONE() {
    return '';
}
function validateTypeHID(data) {
    return addLeadingUnderscore(
        stripIllegalChars(
            spacesToUnderscores(
                data.toUpperCase())));
}
function validateTypeMOD(data) {
    return addLeadingUnderscore(
        stripIllegalChars(
            spacesToUnderscores(
                data.toUpperCase())));
}
function validateTypeMIDI(data) {
    return stripIllegalChars(data);
}
function validateTypeFUNC(data) {
    return stripIllegalChars(
        spacesToUnderscores(data));
}
function validateTypeTOGGLE(data) {
    return stripIllegalChars(
        spacesToUnderscores(data));
}
function validateTypeTARGET(data) {
    return stripIllegalChars(
        spacesToUnderscores(data));
}
function validateTypeCLICK(data) {
    if(data.toUpperCase() == 'LEFT') return 0;
    if(data.toUpperCase() == 'RIGHT') return 1;
    if(data.toUpperCase() == 'MIDDLE') return 2;
    return stripIllegalChars(data);
}
function validateTypeMOUSE_X(data) {
    return stripIllegalChars(data);
}
function validateTypeMOUSE_Y(data) {
    return stripIllegalChars(data);
}
function validateTypeSCROLL_X(data) {
    return stripIllegalChars(data);
}
function validateTypeSCROLL_Y(data) {
    return stripIllegalChars(data);
}
function validateTypeHIDMOD(data) {
    let comma_pos = data.indexOf(',');
    if(comma_pos > 0)
        return stripIllegalChars(data.substring(0, comma_pos)
            .toUpperCase()) + ','
            + stripIllegalChars(data.substring(comma_pos)
                .toUpperCase());
    else
        return stripIllegalChars(data.toUpperCase());
}

// Formatting helper functions
function addLeadingUnderscore(data) {
    if(data.length > 0 && data[0] != '_')
        return '_' + data;
    return data;
}
function spacesToUnderscores(data) {
    return data.replace(/\s/g, '_');
}
function stripIllegalChars(data) {
    return data.replace(/[.,?!*+@#$%^&()[\]{}='"\\/\s]/g, '');
}

// File export functions
function createExportFormat(file_data) {
    let contents = createExportHeader();
    return file_data.reduce((accum, current) =>
        accum + '\n' + createExportForLayer(current), contents);
}
function createExportForLayer(layer_data) {
    let output = 'KEYMAP(' + layer_data.name + ') {';
    return layer_data.map.reduce((accum, current) =>
        accum + '\n' + createExportForRow(current), output).slice(0,-1) + '};\n';
}
function createExportForRow(row_data) {
    return row_data.reduce((accum, current) =>
        accum + createExportForKey(current), '{').slice(0,-1) + '},';
}
function createExportForKey(key_data) {
    if(key_data.type == 'NONE')
        return 'NONE,';
    else
        return key_data.type + '(' + key_data.data + '),';
}
function createExportHeader() {
    let header = export_header_format.replace(/%%DATE%%/g, new Date().toDateString());
    return header;
}

// Extracts only the layernames from a parsed layermaps.c file
function getLayernamesFromFileData(file_data) {
    let layernames = [];
    for(var layer in file_data)
        layernames.push(file_data[layer].name);
    return layernames;
}

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

// Triggers the browser to download a text file with the given name
// and content
function saveFile(name, content) {
    let link = document.createElement('a');
    link.setAttribute('download', name);
    link.setAttribute('href', 'data:text/plain;charset=utf-8,'
        + encodeURIComponent(content));

    if(document.createEvent) {
        let e= document.createEvent('MouseEvents');
        e.initEvent('click', true, true);
        link.dispatchEvent(e);
    }
    else {
        link.click();
    }
}

// Sends the text of a layermaps.c file to the server, along with
// options specified in the main Vue instance
function sendToServer(file_content) {
    let data = {
        options: {
            backup: keyboard.option_backup,
            write:  keyboard.option_write,
            make:   keyboard.option_make,
            flash:  keyboard.option_flash,
            clean:  keyboard.option_clean
        },
        file_text: file_content
    };
    socket.emit('layermaps.c', data);
}
