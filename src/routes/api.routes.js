module.exports = (app) => {
    const api = require('../controllers/api.controller.js');

    app.get('/api/subjects', api.getSubjects);

}