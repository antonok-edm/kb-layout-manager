import io from 'socket.io-client';
import Vue from 'vue/dist/vue.js';

import './styles/style.sass';
import './favicon/favicon.ico';

import parseLayerMapsFile from './utils/c_parser';
import createExportFormat from './utils/c_formatter';

import keyboard_key from './components/keyboard_key.vue';
import status_popup from './components/status_popup.vue';

/*
 *      Global constants
 */
// Dimensions of the keyboard (number of keys)
const WIDTH = 14;
const HEIGHT = 5;

// Setup websocket connection using socket.io
var socket = io.connect();

socket.on('connect', () => keyboard.server_connected = true);

socket.on('disconnect', () => keyboard.server_connected = false);

// Parse a layermap file from the server backend and
// set it as the current layout
socket.on('layermaps.c', layermaps_file_text => {
    keyboard.loadNewLayerMaps(layermaps_file_text);
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
        layout_data: [{name: '', map: [[]]}],
        width: WIDTH,
        height: HEIGHT,
        current_layer: -1,
        focused_key: { x:-1, y:-1 },
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
                return this.layout_data[this.current_layer].map;
            else
                return keys;
        },
        layers: function() {
            return getLayernamesFromFileData(this.layout_data);
        },
    },
    methods: {
        loadNewLayerMaps: function(layermaps_file_text) {
            this.layout_data = parseLayerMapsFile(layermaps_file_text);
            this.current_layer = 0;
        },
        exportMaps: function() {
            let file_content = createExportFormat(this.layout_data);
            saveFile('layermaps.c', file_content);
        },
        exportMapsServer: function() {
            let file_content = createExportFormat(this.layout_data);
            sendToServer(file_content);
        },
        processKeyUpdate: function(x, y, type, data) {
            this.layout_data[this.current_layer].map[y][x] = {data: data, type: type};
        },
        updateKeyFocus: function(x, y) {
            this.focused_key = {x, y};
        },
        renameLayer: function() {
            this.layout_data[this.current_layer].name = this.newlayername;
            this.newlayername = '';
        },
        addLayer: function() {
            this.layout_data.push({name: this.newlayername,
                map: keys});
            this.current_layer = this.layers.length-1;
            this.newlayername = '';
        },
        removeLayer: function() {
            // Remove the layer
            this.layout_data.splice(this.current_layer, 1);
            // Update the data of all TOGGLE and TARGET keys to account for the
            // removed layer
            for(var layer in this.layout_data) {
                let l = this.layout_data[layer];
                for(var row in l.map) {
                    let r = l.map[row];
                    for(var key in r) {
                        let k = r[key];
                        if(k.type == 'TOGGLE' || k.type == 'TARGET') {
                            let as_number = parseInt(k.data);
                            if(Number.isInteger(as_number)) {
                                if(as_number > this.current_layer) {
                                    k.data = (as_number - 1).toString();
                                }
                                else if(as_number == this.current_layer) {
                                    k.type = 'NONE';
                                    k.data = '';
                                }
                            }
                        }
                    }
                }
            }
            // Switch to a valid layer index if the last one was removed
            if(this.current_layer == this.layout_data.length) {
                this.current_layer -= 1;
            }
        },
        required_functions: function() {
            let req_funcs = [];
            for(var layer in this.layout_data) {
                let l = this.layout_data[layer];
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
        },
        cancel_flash: function() {
            socket.emit('cancel_flash');
        },
    }
});

// Extracts only the layernames from a parsed layermaps.c file
function getLayernamesFromFileData(file_data) {
    let layernames = [];
    for(var layer in file_data)
        layernames.push(file_data[layer].name);
    return layernames;
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

// Register an event listener for the file import button
const file_importer = new FileReader();
file_importer.onloadend = function() {
    keyboard.loadNewLayerMaps(this.result);
};
document.getElementById('import-layermaps-file').addEventListener('change', function() {
    let file = this.files[0];
    if(file) {
        file_importer.readAsText(file);
    }
});
