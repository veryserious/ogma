const Subject = require('../models/subject.model.js');
const Topic = require('../models/topic.model.js');
const async = require('async');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Create and Save a new Subject

// Display Subject create form on GET.
exports.create_get = function(req, res, next) {     
    res.render('forms/subjectForm', { title: 'Create Subject', errors: '' });
  };

  // Handle Subject create on POST.
exports.create_post =  [
   
    // Validate that the title field is not empty.
    body('title', 'Subject name required').isLength({ min: 1 }).trim(),

    // Sanitize (escape) the name field.
    sanitizeBody('title').escape(),
    sanitizeBody('description').escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
  
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create a subject object with escaped and trimmed data.
      var subject = new Subject(
        { title: req.body.title,
          description: req.body.description,
         }
      );
  
  
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render('forms/subjectForm', { title: 'Create Subject', subject: subject, errors: errors.array()});
        return;
      }
      else {
        // Data from form is valid.
        // Check if Subject with same name already exists.
        Subject.findOne({ 'title': req.body.title })
          .exec( function(err, found_subject) {
             if (err) { return next(err); }
  
             if (found_subject) {
               // Subject exists, redirect to its detail page.
               res.redirect(found_subject.url);
             }
             else {
  
               subject.save(function (err) {
                 if (err) { return next(err); }
                 // Subject saved. Redirect to subject detail page.
                 res.redirect(subject.url);
               });
  
             }
  
           });
      }
    }
  ];

// Retrieve and return all subjects from the database.
exports.findAll = (req, res) => {
    Subject.find()
    .then(subjects => {
        res.render('pages/subjects', { subjects: subjects });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving subjects."
        });
    });
};

// Find a single subject with a subjectId
exports.findOne = (req, res, next) => {
    async.parallel({
        subject: function(callback) {
            Subject.findById(req.params.subjectId)
              .exec(callback);
        },

        subjectTopics: function(callback) {
            Topic.find({ 'subjects': req.params.subjectId })
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.subject==null) { // No results.
            var err = new Error('Subject not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('pages/subjectSingle', { title: 'Subject Single', subject: results.subject, subjectTopics: results.subjectTopics } );
    });
};

// Update a subject identified by the subjectId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.description) {
        return res.status(400).send({
            message: "Subject description can not be empty"
        });
    }

    // Find subject and update it with the request body
    Subject.findByIdAndUpdate(req.params.subjectId, {
        title: req.body.title || "Untitled Subject",
        description: req.body.description
    }, {new: true})
    .then(subject => {
        if(!subject) {
            return res.status(404).send({
                message: "Subject not found with id " + req.params.subjectId
            });
        }
        res.send(subject);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Subject not found with id " + req.params.subjectId
            });                
        }
        return res.status(500).send({
            message: "Error updating subject with id " + req.params.subjectId
        });
    });
};

// Delete a subject with the specified subjectId in the request
exports.delete = (req, res) => {
    Subject.findByIdAndRemove(req.params.subjectId)
    .then(subject => {
        if(!subject) {
            return res.status(404).send({
                message: "Subject not found with id " + req.params.subjectId
            });
        }
        res.send({message: "Subject deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Subject not found with id " + req.params.subjectId
            });                
        }
        return res.status(500).send({
            message: "Could not delete subject with id " + req.params.subjectId
        });
    });
};