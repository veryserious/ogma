module.exports =
`
type Query {
    hi: String
    allConcepts: [Concept]!
}

type Concept {
    title: String,
    summary: String,
    content: String,
}

type Mutation {
    createConcept(title: String!): Concept!
}
`;
