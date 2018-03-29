# kb-layout-manager
This repository contains an HTML interface and server backend for layout management on antonok's keyboard.
More information on the keyboard can be found in [this repository](https://github.com/antonok-edm/kb).

![kb-layout-manager sample usage](https://raw.githubusercontent.com/antonok-edm/kb-layout-manager/master/sample_usage.png)

## clientside
The layouts for [kb](https://github.com/antonok-edm/kb) are written into C file formats, in the form of multiple 14x5 arrays of various macros denoting different key types.
Editing arrays of this size with variable data in plain-text is very hard to visualize and navigate.
kb-layout-manager provides a clean, modern, and intuitive method for editing and creating new layouts.

## serverside
On its own, a web interface has no way of interfacing with the computer's filesystem, compiling C code, or flashing firmware to hardware.
The backend server for kb-layout-manager is written in NodeJS and is meant to be run locally on the user's computer, allowing automatic file loading, backups, compilation, and firmware flashing.
The web client uses websockets to automatically connect to the server whenever it is running.

## license
kb-layout-manager is licensed under GPLv3. See LICENSE for more information.
