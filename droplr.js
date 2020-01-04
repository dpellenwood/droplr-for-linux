#!/usr/bin/env node

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const path = require('path');

const Droplr = require('droplr-api');
const moment = require('moment');

const configFile = path.resolve( __dirname, 'config.json' );

if( !fs.existsSync(configFile) ) {
	//console.error("Couldn't find config.json. Did you remember to setup your credentials?");
	exec(`notify-send "Couldn't find config.json. Did you remember to setup your credentials?"`);
	process.exit();
}

const config = require(configFile);

const state = {
	dir: path.resolve(__dirname, config.tempDir),
	filename: `screenshot_${ moment().format('Y-MM-DD_HH:mm:ss') }.png`,
	filePath: '',
};

const client = new Droplr.Client({
	auth: new Droplr.BasicAuth(config.username, config.password),
});

const copyClipLink = (url) => {
	exec(`echo ${url} | tr -d '[:space:]' | xclip -sel clip -l 2`);
	exec(`notify-send "Copied ${url} to clipboard"`);
	exec(`rm ${state.filePath}`);
};

const postClip = () => {
	client.drops.create({
		type: 'FILE',
		variant: 'image/png',
		title: state.filename,
		content: fs.createReadStream(state.filePath),
	}).then((response) => {
		copyClipLink(response.shortlink);
	}, (error) => {
		//console.error(error);
		exec(`notify-send "Unable to publish screenshot. ${error}"`);
	});
}

const createClip = async () => {
	const { stdout, stderr } = await exec(`gnome-screenshot -a -f ${state.filePath}`);

	if ( stderr ) {
		//console.error('stderr:', stderr);
		exec(`notify-send "Unable to create screenshot. Error: ${stderr}"`);
		process.exit();
	}

	postClip();
}

const handleInitialState = () => {
	if ( !fs.existsSync(state.dir) ) {
		exec(`mkdir -p ${state.dir}`);
	}

	state.filePath = path.resolve(__dirname, config.tempDir, state.filename);
}

const init = async () => {
	await handleInitialState();
	createClip();
};

init();
