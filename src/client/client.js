import { createApp } from 'vue/dist/vue.esm-bundler.js';

import './styles/style.sass';
import './favicon/favicon.ico';

import parseLayerMapsFile from './utils/c_parser.js';
import createExportFormat from './utils/c_formatter.js';

import keyboard_key from './components/keyboard_key.vue';
import status_popup from './components/status_popup.vue';

// This import is managed by a webpack plugin. Setting the
// `KB_LAYOUT_MANAGER_DEMO_MODE` environment variable will import
// `mock_server_connection.js` instead.
import ServerConnection from './utils/server_connection.js';

// Scripts are enabled, activate the continue button
const continueButton = document.getElementById('continue-button');
continueButton.classList.remove('disabled');
continueButton.title = '';

/*
 *      Global constants
 */
// Dimensions of the keyboard (number of keys)
const WIDTH = 14;
const HEIGHT = 5;

// Initialize keys, a minimal 2D array of key data
let keys = new Array(HEIGHT);
for(let y = 0; y < HEIGHT; y++) {
    keys[y] = new Array(WIDTH);
    for(let x = 0; x < WIDTH; x++) {
        keys[y][x] = {type: 'NONE', data: ''};
    }
}

let server_connection;

// Initialize the Vue app that connects all page elements
const app = createApp({
    data: () => {
        return {
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
        };
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
        dismissSplash: function() {
            document.getElementById('kb2-notice').style.display = 'none';
        },
        newLayerMapsImported: function(e) {
            const file_importer = new FileReader();
            const keyboard = this;
            file_importer.onloadend = function() {
                keyboard.loadNewLayerMaps(this.result);
            };

            const file = e.target.files[0];
            if(file) {
                file_importer.readAsText(file);
            }
            e.target.value = '';
        },
        loadNewLayerMaps: function(layermaps_file_text) {
            this.layout_data = parseLayerMapsFile(layermaps_file_text);
            this.current_layer = 0;
        },
        exportMaps: function() {
            const file_content = createExportFormat(this.layout_data);
            saveFile('layermaps.c', file_content);
        },
        exportMapsServer: function() {
            const file_content = createExportFormat(this.layout_data);
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
            for(let layer of this.layout_data) {
                for(let row of layer.map) {
                    for(let key of row) {
                        if(key.type == 'TOGGLE' || key.type == 'TARGET') {
                            const as_number = parseInt(key.data);
                            if(Number.isInteger(as_number)) {
                                if(as_number > this.current_layer) {
                                    key.data = (as_number - 1).toString();
                                }
                                else if(as_number == this.current_layer) {
                                    key.type = 'NONE';
                                    key.data = '';
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
            for(const layer of this.layout_data) {
                for(const row of layer.map) {
                    for(const key of row) {
                        if(key.type == 'FUNC' && !req_funcs.includes(key.data)) {
                            req_funcs.push(key.data);
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
            server_connection.cancelFlash();
        },
    }
});
const keyboard = app.mount('#body');

// Extracts only the layernames from a parsed layermaps.c file
function getLayernamesFromFileData(file_data) {
    let layernames = [];
    for(const layer of file_data)
        layernames.push(layer.name);
    return layernames;
}

// Triggers the browser to download a text file with the given name
// and content
function saveFile(name, content) {
    let link = document.createElement('a');
    link.setAttribute('download', name);
    link.setAttribute('href', 'data:text/plain;charset=utf-8,'
        + encodeURIComponent(content));
    link.click();
}

// Sends the text of a layermaps.c file to the server, along with
// options specified in the main Vue app
function sendToServer(file_content) {
    const data = {
        options: {
            backup: keyboard.option_backup,
            write:  keyboard.option_write,
            make:   keyboard.option_make,
            flash:  keyboard.option_flash,
            clean:  keyboard.option_clean
        },
        file_text: file_content
    };
    server_connection.sendLayermaps(data);
}

const server_callbacks = {
    'connect': () => keyboard.server_connected = true,
    'disconnect': () => keyboard.server_connected = false,
    // Parse a layermap file from the server backend and
    // set it as the current layout
    'layermaps.c': layermaps_file_text => {
        keyboard.loadNewLayerMaps(layermaps_file_text);
    },
    // Notify the user of the progress of backend operations
    'progress': report => {
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
    },
};

server_connection = new ServerConnection(server_callbacks);
