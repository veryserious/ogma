const mongoose = require('mongoose');

const UnitSchema = mongoose.Schema({
    title: String,
    summary: String,
    content: String,
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }]
}, {
    timestamps: true
});

// Virtual for URL
UnitSchema
.virtual('url')
.get(function () {
  return '/units/' + this._id;
});

module.exports = mongoose.model('Unit', UnitSchema);