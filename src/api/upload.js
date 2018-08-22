import resource from 'resource-router-middleware';

export default ({ config, db }) => resource({
    /** Property name to store preloaded entity on `request`. */
    id: 'upload',
    /** POST / - Create a new entity */
    create({ body, files }, res) {
        if (!files) {
            return res.status(400).send('No files were uploaded.');
        }
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        const pendings = Object.values(files).reduce((prev, file) => {
            const [name, ext] = file.name.split('\.');
            const mv = require('util').promisify(file.mv);
            prev.push(mv(`./uploads/${name}${Date.now()}.${ext}`));
            return prev;
        }, []);
        Promise.all(pendings)
            .then(() => res.json({ data: 'File uploaded!' }))
            .catch(err => res.status(500).send(err));
    },
});
