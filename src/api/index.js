import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import companies from './companies';
import countries from './countries';
import data from './data';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));
	api.use('/companies', companies({ config, db }));
	api.use('/countries', countries({ config, db }));
	api.use('/data', data({config, db}));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}
