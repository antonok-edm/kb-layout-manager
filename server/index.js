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

// Directory of keyboard firmware
const firmware_dir = path.join('..', '..', 'kb', 'firmware');

// All possible server operations
const operations = ['backup', 'write', 'make', 'flash', 'clean'];

// Shell commands corresponding to server operations
const ext_commands = {
	backup: "cp " + path.join(firmware_dir, 'layermaps.c') +
		" " + path.join(firmware_dir, 'layermaps.c.bak'),
	write: "mv " + path.join('/tmp', 'layermaps.c') +
		" " + path.join(firmware_dir, 'layermaps.c'),
	make: "make -C " + firmware_dir,
	flash: "teensy_loader_cli --mcu=atmega32u4 -w "
		+ path.join(firmware_dir, 'firmware.hex'),
	clean: "make -C " + firmware_dir + " clean"
};

// Setup socket connection
io.on('connection', socket => {
	console.log('Client connected.');
	// Read layermaps.c file directly from firmware directory and send it
	fs.readFile(path.join(firmware_dir, 'layermaps.c'),
		'ascii',
		(err, layermaps_text) => {
			if(err) {
				console.log("Could not read layermaps.c!");
				console.log("Exiting.");
				process.exit()
			}
			socket.emit('layermaps.c', layermaps_text);
		});
	// Process operation requests from the client
	socket.on('layermaps.c', async function(data) {
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
		+ PORT));

app.use(express.static(path.join('..', 'client')));
