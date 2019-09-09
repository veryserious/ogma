const Subject = require('../models/subject.model.js');
const Unit = require('../models/unit.model.js');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const dotenv = require('dotenv');
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Create and Save a new unit

// Display unit create form on GET.
exports.create_get = function(req, res, next) {
    Subject.find()
    .then(results => {
        res.render('forms/unitForm', { title: 'Create unit', subjects: results, errors: null })
    });
  };

  // Handle unit create on POST.
exports.create_post =  [

    // Convert the topics to an array.
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
    body('title', 'unit name required').isLength({ min: 1 }).trim(),

    // Sanitize (escape) the name field.
    sanitizeBody('title').escape(),
    sanitizeBody('topics.*').escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
  
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create a unit object with escaped and trimmed data.
      var unit = new Unit(
        { title: req.body.title,
          subjects: req.body.subjects,
          content: req.body.content,
         }
      );  
  
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.

        res.render('forms/unitForm', { title: 'Create unit', unit: unit, errors: errors.array()});
        return;
      }
      else {
        // Data from form is valid.
        // Check if unit with same name already exists.
        Unit.findOne({ 'title': req.body.title })
          .exec( function(err, found_unit) {
             if (err) { return next(err); }
  
             if (found_unit) {
               // unit exists, redirect to its detail page.
               res.redirect(found_unit.url);
             }
             else {
  
               unit.save(function (err) {
                 if (err) { return next(err); }
                 // unit saved. Redirect to unit detail page.
                 res.redirect(unit.url);
               });
  
             }
  
           });
      }
    }
  ];


// Retrieve and return all units from the database.
exports.findAll = (req, res) => {
    Unit.find()
    .then(units => {
        res.render('pages/units', { units: units });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving units."
        });
    });
};

// Find a single unit with a unitId
exports.findOne = (req, res) => {
    Unit.findById(req.params.unitId)
    .populate('topics')
    .then(unit => {
        if(!unit) {
            return res.status(404).send({
                message: "unit not found with id " + req.params.unitId
            });            
        }
        res.render('pages/unitSingle', { unit: unit, topics: unit.topics });
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "unit not found with id " + req.params.unitId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving unit with id " + req.params.unitId
        });
    });
};

exports.updateGet = (req, res) => {
    Unit.findById(req.params.unitId)
    .populate('subjects')
    .then(unit => {
        res.render('forms/unitForm', { title: 'Update unit', unit: unit, subjects: unit.subjects, errors: null });
    });
};

// Update a unit identified by the unitId in the request
exports.updatePost = (req, res) => {
    // Validate Request
    if(!req.body.content) {
        return res.status(400).send({
            message: "unit content can not be empty"
        });
    }

    // Find unit and update it with the request body
    Unit.findByIdAndUpdate(req.params.unitId, {
        title: req.body.title || "Untitled unit",
        subjects: req.body.subjects,
        summary: req.body.summary,
        content: req.body.content
    }, {new: true})
    .then(unit => {
        if(!unit) {
            return res.status(404).send({
                message: "unit not found with id " + req.params.unitId
            });
        }
        res.redirect(unit.url);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "unit not found with id " + req.params.unitId
            });                
        }
        return res.status(500).send({
            message: "Error updating unit with id " + req.params.unitId
        });
    });
};

// Delete a unit with the specified unitId in the request
exports.delete = (req, res) => {
    Unit.findByIdAndRemove(req.params.unitId)
    .then(unit => {
        if(!unit) {
            return res.status(404).send({
                message: "unit not found with id " + req.params.unitId
            });
        }
        res.send({message: "unit deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "unit not found with id " + req.params.unitId
            });                
        }
        return res.status(500).send({
            message: "Could not delete unit with id " + req.params.unitId
        });
    });
};
