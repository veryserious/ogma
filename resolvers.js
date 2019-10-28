Concept = require("./src/models/concept.model.js");

module.exports = {
    Query: {
        hi: (parent, args, context, info) => 'hi',
        allConcepts: async (parent,
            { offset = 0, limit = 5 },
            ) => Concept.find().skip(offset).limit(limit)
    },
    Mutation: {
        createConcept: (_, {title}) => {
            const concept = new Concept({title});
            return concept.save();
        }
    }
}