// Imports
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// Port to run on
const PORT = 17407;

// Specify the "KB_LAYOUT_MANAGER_DEMO_MODE" environment variable to run a
// restricted featureset. This will assume all websocket connections are
// untrusted.
const DEMO_MODE = ("KB_LAYOUT_MANAGER_DEMO_MODE" in process.env);

// Directory of keyboard firmware
const firmware_dir = path.join('..', 'kb', 'firmware');

// Directory of layermaps directory
const layermaps_dir = path.join(firmware_dir, 'layermaps');

// All possible server operations
const operations = ['backup', 'write', 'make', 'flash', 'clean'];

// Shell commands corresponding to server operations
const ext_commands = {
    backup: "cp " + path.join(layermaps_dir, 'layermaps.c') +
        " " + path.join(layermaps_dir, 'layermaps.c.bak'),
    write: "mv " + path.join('/tmp', 'layermaps.c') +
        " " + path.join(layermaps_dir, 'layermaps.c'),
    make: "make -C " + firmware_dir,
    flash: "teensy_loader_cli --mcu=atmega32u4 -w "
        + path.join(firmware_dir, 'firmware.hex'),
    clean: "make -C " + firmware_dir + " clean"
};

// Setup socket connection
io.on('connection', socket => {
    console.log('Client connected.');

    // Read layermaps.c file directly from firmware directory and send it
    socket.on('request_saved_map', async function() {
        fs.readFile(path.join(layermaps_dir, 'layermaps.c'),
            'ascii',
            (err, layermaps_text) => {
                if(err) {
                    console.log("Could not read layermaps.c!");
                    console.log("Exiting.");
                    process.exit()
                }
                socket.emit('layermaps.c', layermaps_text);
            });
    });

    // Process operation requests from the client
    socket.on('layermaps.c', async function(data) {
        if(DEMO_MODE) {
            setTimeout(() => socket.emit('progress', { op: 'make', during: '', traceback: {} }), 0);
            setTimeout(() => socket.emit('progress', { op: 'flash', during: '', traceback: {} }), 1500);
            setTimeout(() => socket.emit('progress', { op: 'error', during: 'make', traceback:
                { stderr: 'Serverside operations are a WIP for this live demo. '
                    + 'For full functionality, clone the project on Gitlab and try it locally!' } }), 2500);
        }
        else {
            let options = data.options;
            let file_text = data.file_text;
            await writeTmpFile('layermaps.c', file_text);
            //for(i in operations) {
                //op = operations[i];
            for(op in ext_commands) {
                if(options[op]) {
                    let res = await do_op(op);
                    if(res === -1) {
                        return;
                    }
                }
            }
            socket.emit('progress',
                { op: "done", during: "", traceback: "" });
        }
    });

    async function do_op(op) {
        socket.emit('progress',
            { op: op, during: "", traceback: "" });
        let exitcode = await exec(ext_commands[op]).catch(err => {
            console.log("The following error occurred during '" +
                op + "':");
            console.log(err);
            socket.emit('progress',
                { op: "error", during: op, traceback: err });
            return -1;
        });
        return exitcode;
    }
});

// Write text to a file in the firmware directory
async function writeTmpFile(name, contents) {
    fs.writeFileSync(path.join('/tmp', name), contents, err => {
        return console.log(err);
    });
    console.log("Wrote " + name);
}

http.listen(PORT, () =>
    console.log('kb layout manager backend running on http://localhost:'
        + PORT + (DEMO_MODE ? ' in demo mode' : '')));

app.use(express.static(path.join('dist')));
