module.exports = (app) => {
    const concepts = require('../controllers/concept.controller.js');

    //Get the concept create form
    // Get the create concept form
    app.get('/concepts/create', concepts.create_get);

    // Create a new concept
    app.post('/concepts/create', concepts.create_post);

    // Retrieve all concepts
    app.get('/concepts', concepts.findAll)

    // Retrieve a single concept with conceptId
    app.get('/concepts/:conceptId', concepts.findOne);

    // Get the update concept form with conceptId
    app.get('/concepts/:conceptId/update', concepts.updateGet);

    // Update a concept with conceptId
    app.post('/concepts/:conceptId/update', concepts.updatePost);

    // Delete a concept with conceptId
    app.get('/concepts/:conceptId/delete', concepts.delete);
}