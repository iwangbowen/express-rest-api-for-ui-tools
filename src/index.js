import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';

const fileUpload = require('express-fileupload');

let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit: config.bodyLimit
}));

app.use(fileUpload());

app.post('/api/upload', function (req, res) {
	if (!req.files)
		return res.status(400).send('No files were uploaded.');
	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
	const pendings = Object.values(req.files).reduce((prev, file) => {
		const [name, ext] = file.name.split('\.');
		const mv = require('util').promisify(file.mv);
		prev.push(mv(`./uploads/${name}${Date.now()}.${ext}`));
		return prev;
	}, []);
	Promise.all(pendings)
		.then(() => res.send('File uploaded!'))
		.catch(err => res.status(500).send(err));
});

// connect to db
initializeDb(db => {

	// internal middleware
	app.use(middleware({ config, db }));

	// api router
	app.use('/api', api({ config, db }));

	app.server.listen(process.env.PORT || config.port, () => {
		console.log(`Started on port ${app.server.address().port}`);
	});
});

export default app;
