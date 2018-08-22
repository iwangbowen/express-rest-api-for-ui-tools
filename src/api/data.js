import resource from 'resource-router-middleware';
import data from '../models/data';

export default ({ config, db }) => resource({
	/** Property name to store preloaded entity on `request`. */
	id: 'data',
	/** For requests with an `id`, you can auto-load the entity.
	 *  Errors terminate the request, success sets `req[id] = data`.
	 */
	load(req, id, callback) {
		let facet = data.find(facet => facet.id === id),
			err = facet ? null : 'Not found';
		callback(err, facet);
	},
	/** GET / - List all entities */
	index({ params }, res) {
		res.json({ data: data.slice(0, 100) });
	},
	/** POST / - Create a new entity */
	create({ body }, res) {
		res.json({ data: data });
	},
	/** GET /:id - Return a given entity */
	read({ facet }, res) {
		res.json(facet);
	},
	/** PUT /:id - Update a given entity */
	update({ facet, body }, res) {
		for (let key in body) {
			if (key !== 'id') {
				facet[key] = body[key];
			}
		}
		res.sendStatus(204);
	},
	/** DELETE /:id - Delete a given entity */
	delete({ facet }, res) {
		data.splice(data.indexOf(facet), 1);
		res.sendStatus(204);
	}
});
