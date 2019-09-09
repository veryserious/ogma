const Topic = require('../models/topic.model.js');
const Concept = require('../models/concept.model.js');
const Subject= require('../models/subject.model.js');
const async = require('async');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display Topic create form on GET.
exports.createGet = function(req, res, next) {
    Subject.find().
    then(results => {
        res.render('forms/topicForm', { title: 'Create Topic', subjects: results, errors: '' });
    })
  };

  // Handle Topic create on POST.
exports.createPost =  [

    // Convert the subjects to an array.
    (req, res, next) => {
        if(!(req.body.subjects instanceof Array)){
            if(typeof req.body.subjects==='undefined')
            req.body.subjects=[];
            else
            req.body.subjects=new Array(req.body.subjects);
        }
        next();
    },
   
    // Validate that the title field is not empty.
    body('title', 'Topic name required').isLength({ min: 1 }).trim(),

    // Sanitize (escape) the name field.
    sanitizeBody('title').escape(),
    sanitizeBody('subjects.*').escape(),
    sanitizeBody('description').escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
  
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create a topic object with escaped and trimmed data.
      var topic = new Topic(
        { title: req.body.title,
          subjects: req.body.subjects,
          description: req.body.description,
         }
      );  
  
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render('forms/topicForm', { title: 'Create Topic', topic: topic, errors: errors.array()});
        return;
      }
      else {
        // Data from form is valid.
        // Check if Topic with same name already exists.
        Topic.findOne({ 'title': req.body.title })
          .exec( function(err, found_topic) {
             if (err) { return next(err); }
  
             if (found_topic) {
               // Topic exists, redirect to its detail page.
               res.redirect(found_topic.url);
             }
             else {
  
               topic.save(function (err) {
                 if (err) { return next(err); }
                 // Topic saved. Redirect to topic detail page.
                 res.redirect(topic.url);
               });
  
             }
  
           });
      }
    }
  ];


// Retrieve and return all subjects from the database.
exports.findAll = (req, res) => {
    Topic.find()
    .then(topics => {
        res.render('pages/topics', { topics: topics });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving subjects."
        });
    });
};

// Find a single topic with a topicId
exports.findOne = (req, res, next) => {
    async.parallel({
        topic: function(callback) {
            Topic.findById(req.params.topicId)
              .exec(callback);
        },

        topicConcepts: function(callback) {
            Concept.find({ 'topics': req.params.topicId })
              .exec(callback);
        }

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.topic==null) { // No results.
            var err = new Error('Topic not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('pages/topicSingle', { title: 'Topic Single', topic: results.topic, topicConcepts: results.topicConcepts } );
    });
};

exports.updateGet = (req, res) => {
    Topic.findById(req.params.topicId)
    .populate('subjects')
    .then(topic => {
        res.render('forms/topicForm', { title: 'Update topic', subjects: topic.subjects, topic: topic, errors: null });
    });
};

// Update a concept identified by the conceptId in the request
exports.updatePost = (req, res) => {
    // Validate Request
    if(!req.body.title) {
        return res.status(400).send({
            message: "Title can not be empty"
        });
    }

    // Find topic and update it with the request body
    Topic.findByIdAndUpdate(req.params.topicId, {
        title: req.body.title || "Untitled topic",
        description: req.body.description,
    }, {new: true})
    .then(topic => {
        if(!topic) {
            return res.status(404).send({
                message: "topic not found with id " + req.params.topicId
            });
        }
        res.redirect(topic.url);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "topic not found with id " + req.params.topicId
            });                
        }
        console.log(err);
        return res.status(500).send({
            message: "Error updating topic with id " + req.params.topicId
        });
    });
};

// Update a topic identified by the topicId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.description) {
        return res.status(400).send({
            message: "Topic description can not be empty"
        });
    }

    // Find topic and update it with the request body
    Topic.findByIdAndUpdate(req.params.topicId, {
        title: req.body.title || "Untitled Topic",
        description: req.body.description
    }, {new: true})
    .then(topic => {
        if(!topic) {
            return res.status(404).send({
                message: "Topic not found with id " + req.params.topicId
            });
        }
        res.send(topic);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Topic not found with id " + req.params.topicId
            });                
        }
        return res.status(500).send({
            message: "Error updating topic with id " + req.params.topicId
        });
    });
};

// Delete a topic with the specified topicId in the request
exports.delete = (req, res) => {
    Topic.findByIdAndRemove(req.params.topicId)
    .then(topic => {
        if(!topic) {
            return res.status(404).send({
                message: "Topic not found with id " + req.params.topicId
            });
        }
        res.send({message: "Topic deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Topic not found with id " + req.params.topicId
            });                
        }
        return res.status(500).send({
            message: "Could not delete topic with id " + req.params.topicId
        });
    });
};