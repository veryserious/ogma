const Concept = require('../models/concept.model.js');
const Topic = require('../models/topic.model.js');
const Subject = require('../models/subject.model.js');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Retrieve and return all concepts from the database.
exports.getSubjects = (req, res) => {
    Subject.find()
    .then(subjects => {
        res.send({'data': subjects});
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving subjects."
        });
    });
};