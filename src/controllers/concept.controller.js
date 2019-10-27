
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const dotenv = require('dotenv');
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const url = require('url');
const Concept = require('../models/concept.model.js');
const Topic = require('../models/topic.model.js');

// Create and Save a new Concept

// Display Concept create form on GET.
exports.create_get = function(req, res, next) {
    Topic.find()
    .then(results => {
        const q = url.parse(req.headers.referer, true);
        currentTopic = q.pathname.split('/').pop();
        res.render('forms/conceptForm', { title: 'Create Concept', topics: results, currentTopic: currentTopic, errors: null })
    });
  };

  // Handle Concept create on POST.
exports.create_post =  [

    // Convert the topics to an array.
    (req, res, next) => {
        if(!(req.body.topics instanceof Array)){
            if(typeof req.body.topics==='undefined')
            req.body.topics=[];
            else
            req.body.topics=new Array(req.body.topics);
        }
        next();
    },
    
    // Validate that the title field is not empty.
    body('title', 'Concept name required').isLength({ min: 1 }).trim(),

    // Sanitize (escape) the name field.
    sanitizeBody('title').escape(),
    sanitizeBody('topics.*').escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
  
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create a concept object with escaped and trimmed data.
      var concept = new Concept(
        { title: req.body.title,
          topics: req.body.topics,
          summary: req.body.summary,
          content: req.body.content,
         }
      );  
  
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.

        res.render('forms/conceptForm', { title: 'Create Concept', concept: concept, errors: errors.array()});
        return;
      }
      else {
        // Data from form is valid.
        // Check if Concept with same name already exists.
        Concept.findOne({ 'title': req.body.title })
          .exec( function(err, found_concept) {
             if (err) { return next(err); }
  
             if (found_concept) {
               // Concept exists, redirect to its detail page.
               res.redirect(found_concept.url);
             }
             else {
  
               concept.save(function (err) {
                 if (err) { return next(err); }
                 // Concept saved. Redirect to concept detail page.
                 res.redirect(concept.url);
               });
  
             }
  
           });
      }
    }
  ];


// Retrieve and return all concepts from the database.
exports.findAll = (req, res) => {
    Concept.find()
    .then(concepts => {
        res.render('pages/concepts', { concepts: concepts });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving concepts."
        });
    });
};

// Find a single concept with a conceptId
exports.findOne = (req, res) => {
    Concept.findById(req.params.conceptId)
    .populate('topics')
    .then(concept => {
        if(!concept) {
            return res.status(404).send({
                message: "Concept not found with id " + req.params.conceptId
            });            
        }
        res.render('pages/conceptSingle', { concept: concept, topics: concept.topics });
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Concept not found with id " + req.params.conceptId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving concept with id " + req.params.conceptId
        });
    });
};

exports.updateGet = (req, res) => {
    Concept.findById(req.params.conceptId)
    .populate('topics')
    .then(concept => {
        res.render('forms/conceptForm', { title: 'Update Concept', concept: concept, topics: concept.topics, currentTopic: '', errors: null });
    });
};

// Update a concept identified by the conceptId in the request
exports.updatePost = (req, res) => {
    // Validate Request
    if(!req.body.content) {
        return res.status(400).send({
            message: "Concept content can not be empty"
        });
    }

    // Find concept and update it with the request body
    Concept.findByIdAndUpdate(req.params.conceptId, {
        title: req.body.title || "Untitled Concept",
        topics: req.body.topics,
        summary: req.body.summary,
        content: req.body.content
    }, {new: true})
    .then(concept => {
        if(!concept) {
            return res.status(404).send({
                message: "Concept not found with id " + req.params.conceptId
            });
        }
        res.redirect(concept.url);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Concept not found with id " + req.params.conceptId
            });                
        }
        return res.status(500).send({
            message: "Error updating concept with id " + req.params.conceptId
        });
    });
};

// Delete a concept with the specified conceptId in the request
exports.delete = (req, res) => {
    Concept.findByIdAndRemove(req.params.conceptId)
    .then(concept => {
        if(!concept) {
            return res.status(404).send({
                message: "Concept not found with id " + req.params.conceptId
            });
        }
        res.send({message: "Concept deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Concept not found with id " + req.params.conceptId
            });                
        }
        return res.status(500).send({
            message: "Could not delete concept with id " + req.params.conceptId
        });
    });
};

// send an sms to cheese to remind me of a concept given an id
exports.sms = (req, res) => {
    Concept.findById(req.params.conceptId)
    .then(concept => {
        if(!concept) {
            return res.status(404).send({
                message: "Concept not found with id " + req.params.conceptId
            });            
        }
        client.messages
        .create({
            body: 'STUDY REMINDER ' + concept.title + ': ' + concept.summary,
            from: '+61488807427',
            to: '+61452367553'
            //to: '+61468721634'
        })
        .then(res.redirect('/concepts/' + req.params.conceptId));
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Concept not found with id " + req.params.conceptId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving concept with id " + req.params.conceptId
        });
    });
};