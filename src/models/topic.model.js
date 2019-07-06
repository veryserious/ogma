const mongoose = require('mongoose');

const TopicSchema = mongoose.Schema({
    title: String,
    description: String,
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
}, {
    timestamps: true
});

// Virtual for URL
TopicSchema
.virtual('url')
.get(function () {
  return '/topics/' + this._id;
});

module.exports = mongoose.model('Topic', TopicSchema);