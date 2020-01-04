# Droplr for Linux
A Basic [Droplr](https://d.pr/) client for Linux. Captures a screenshot (area of the screen) and posts it to Droplr via the Droplr API. Copies the share (short) link to your clipboard for immediate use.

Developed and tested on Ubuntu 19.10. Should work with any Ubuntu/Debian derivative that meets the requirements.

## Requirements
* An existing [Droplr](https://d.pr/) account.
* Node & NPM.
* gnome-screenshot: `which gnome-screenshot`.
* xclip: `sudo apt update && sudo apt install xclip`.

## Installation
1. Clone the repo
1. Copy `config-sample.json` to `config.json` and set your Droplr username & password.
1. Run `npm install && npm link`.

## Usage
* Simply run `./droplr.js`.
* Optionally associate a keyboard shortcut with the above command.