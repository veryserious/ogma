module.exports = (app) => {
    const units = require('../controllers/unit.controller.js');

    // Retrieve all units
    app.get('/units', units.findAll)

    // Create a new unit
    app.get('/units/create', units.create_get);
    
    // Create a new unit
    app.post('/units/create', units.create_post);

    // Retrieve a single unit with unitId
    app.get('/units/:unitId', units.findOne);

    // Get the update unit form with unitId
    app.get('/units/:unitId/update', units.updateGet);

    // Update a unit with unitId
    app.post('/units/:unitId/update', units.updatePost);

    // Delete a unit with unitId
    app.delete('/units/:unitId', units.delete);
}