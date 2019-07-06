module.exports = (app) => {
    const subjects = require('../controllers/subject.controller.js');

    // Retrieve all subjects
    app.get('/subjects', subjects.findAll)

    // Create a new Subject
    app.get('/subjects/create', subjects.create_get);
    
    // Create a new Subject
    app.post('/subjects/create', subjects.create_post);

    // Retrieve a single Subject with subjectId
    app.get('/subjects/:subjectId', subjects.findOne);

    // Update a Subject with subjectId
    app.put('/subjects/:subjectId', subjects.update);

    // Delete a Subject with subjectId
    app.delete('/subjects/:subjectId', subjects.delete);
}