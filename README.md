# Droplr for Linux
A Basic [Droplr](https://d.pr/) client for Linux. Captures a screenshot (area of the screen) and posts it to Droplr via the Droplr API. Copies the share (short) link to your clipboard for immediate use.

## Requirements
* An existing [Droplr](https://d.pr/) account.

## Installation
1. Clone the repo
1. Copy `config-sample.json` to `config.json` and set your Droplr username & password.
1. Optionally run `npm install`. The first run of `droplr.sh` (see below) will run this if `node_modules` doesn't exist.

## Usage
1. Simply run `./droplr.sh`.
1. Optionally associate a keyboard shortcut with the script.