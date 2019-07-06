const mongoose = require('mongoose');

const ConceptSchema = mongoose.Schema({
    title: String,
    content: String,
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }]
}, {
    timestamps: true
});

// Virtual for URL
ConceptSchema
.virtual('url')
.get(function () {
  return '/concepts/' + this._id;
});

module.exports = mongoose.model('Concept', ConceptSchema);