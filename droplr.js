#!/usr/bin/env node

const fs = require('fs');
const Droplr = require('droplr-api');

const config = require('./config.json');
const argv = require('yargs').options({
	'file': {
		alias: 'f',
		demandOption: true,
		describe: 'A complete path to the screenshot file to upload.',
		type: 'string'
	},
	'title': {
		alias: 't',
		demandOption: true,
		describe: 'The title of the screenshot as it will appear on Droplr.',
		type: 'string'
	}
}).argv;

const client = new Droplr.Client({
	auth: new Droplr.BasicAuth(config.username, config.password),
});

const postClip = async () => {
	await client.drops.create({
		type: 'FILE',
		variant: 'image/png',
		title: argv.title,
		content: fs.createReadStream(argv.file),
	}).then((response) => {
		console.log(response.shortlink);
	}, (error) => {
		console.error(error);
	});
}

const init = () => {
	postClip();
};

init();