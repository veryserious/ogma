const mongoose = require('mongoose');

const SubjectSchema = mongoose.Schema({
    title: String,
    description: String,
}, {
    timestamps: true
});

// Virtual for URL
SubjectSchema
.virtual('url')
.get(function () {
  return '/subjects/' + this._id;
});

module.exports = mongoose.model('Subject', SubjectSchema);