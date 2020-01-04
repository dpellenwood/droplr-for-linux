#!/usr/bin/env node

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const path = require('path');

const Droplr = require('droplr-api');
const moment = require('moment');

const configFile = path.resolve( __dirname, 'config.json' );

/**
 * Make sure the config file exists before trying to use it.
 */
if( !fs.existsSync(configFile) ) {
	//console.error("Couldn't find config.json. Did you remember to setup your credentials?");
	exec(`notify-send -c transfer.error "Couldn't find config.json. Did you remember to setup your credentials?"`);
	process.exit();
}

const config = require(configFile);

const state = {
	dir: path.resolve(__dirname, config.tempDir),
	filename: `screenshot_${ moment().format('Y-MM-DD_HH:mm:ss') }.png`,
	filePath: '',
};

/**
 * Create a new authorized client for the API.
 *
 * @type {Client}
 */
const client = new Droplr.Client({
	auth: new Droplr.BasicAuth(config.username, config.password),
});

/**
 * Copy the screenshot's shortlink to the system clipboard and remove the temp screenshot file.
 *
 * @param url
 */
const copyClipLink = (url) => {
	exec(`echo ${url} | tr -d '[:space:]' | xsel -ib`);
	exec(`notify-send -c transfer.complete 'Drop created' 'Share link ${url} copied to clipboard.'`);
	exec(`rm ${state.filePath}`);
};

/**
 * Post the screenshot to Droplr.
 */
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
		exec(`notify-send -c transfer.error "Unable to publish screenshot." "${error}"`);
	});
}

/**
 * Create the screenshot.
 *
 * @returns {Promise<void>}
 */
const createClip = async () => {
	try {
		const { stdout, stderr } = await exec( `gnome-screenshot -a -f ${state.filePath}` );

		if ( stderr ) {
			//console.error('stderr:', stderr);
			exec(`notify-send -c transfer.error "Unable to create screenshot." "${stderr}"`);
			process.exit();
		}

	} catch ( error ) {
		//console.error('error:', error);
		exec(`notify-send -c transfer.error "Unable to create screenshot." "${error}"`);
		process.exit();
	}

	postClip();
}

/**
 * Set the state values necessary for the script to run properly.
 */
const handleInitialState = () => {
	if ( !fs.existsSync(state.dir) ) {
		exec(`mkdir -p ${state.dir}`);
	}

	state.filePath = path.resolve(__dirname, config.tempDir, state.filename);
}

/**
 * Run this thing.
 *
 * @returns {Promise<void>}
 */
const init = async () => {
	await handleInitialState();
	createClip();
};

init();
