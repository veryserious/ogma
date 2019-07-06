module.exports = (app) => {
    const topics = require('../controllers/topic.controller.js');

    // Retrieve topic creation form
    app.get('/topics/create', topics.createGet);

    // Create a new topic
    app.post('/topics/create', topics.createPost);

    // Retrieve all topics
    app.get('/topics', topics.findAll)

    // Retrieve a single topic with topicId
    app.get('/topics/:topicId', topics.findOne);

    // Update a topic with topicId
    app.put('/topics/:topicId', topics.update);

    // Delete a topic with topicId
    app.delete('/topics/:topicId', topics.delete);
}