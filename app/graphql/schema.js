const { gql } = require('apollo-server');

//   # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

const typeDefs = gql`
    type Event {
        eventContact: String!
        address: String!
        eventEmail: String!
        eventDetails: String!
        charity: ID!
    }
    type Query {
        events: [Event]!
    }
`;

module.exports = typeDefs;
