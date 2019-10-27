Concept = require("./src/models/concept.model.js");

module.exports = {
    Query: {
        hi: (parent, args, context, info) => 'hi',
        allConcepts: () => Concept.find()
    },
    Mutation: {
        createConcept: (_, {title}) => {
            const concept = new Concept({title});
            return concept.save();
        }
    }
}