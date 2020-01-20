const { gql } = require('apollo-server');

//   # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

const typeDefs = gql`
    type Event {
        _id: ID!
        dateOfEvent: Int!
        eventContact: String!
        address: String!
        eventEmail: String!
        eventDetails: String!
        charity: ID!
    }
    type Charity {
        _id: ID!
        charityName: String!
        address: String!
        email: String!
        events: [ID]
    }
    type User {
        _id: ID!
        firstName: String!
        lastName: String!
        email: String!
    }
    input NewEventInput {
        dateOfEvent: String!
        eventContact: String!
        address: String!
        eventEmail: String!
        eventDetails: String!
        charity: ID!
    }
    input UpdateEventInput {
        dateOfEvent: String
        eventContact: String
        address: String
        eventEmail: String
        eventDetails: String
        charity: ID
    }
    input NewUserInput {
        firstName: String!
        lastName: String!
        email: String!
    }
    input UpdateUserInput {
        firstName: String
        lastName: String
        email: String
    }
    input NewCharityInput {
        charityName: String!
        address: String!
        email: String!
        events: [ID]
    }
    input UpdateCharityInput {
        charityName: String
        address: String
        email: String
        events: [ID]
    }
    type Query {
        events: [Event]!
        event(id: ID!): Event
        users: [User]!
        user(id: ID!): User
        charities: [Charity]!
        charity(id: ID!): Charity
    }
    type Mutation {
        createEvent(input: NewEventInput!): Event
        updateEvent(id: ID!, input: UpdateEventInput!): Event
        deleteEvent(id: ID!): Event
        createUser(input: NewUserInput!): User
        updateUser(id: ID!, input: UpdateUserInput!): User
        deleteUser(id: ID!): User
        createCharity(input: NewCharityInput!): Charity
        updateCharity(id: ID!, input: UpdateCharityInput!): Charity
        deleteCharity(id: ID!): Charity
    }
`;

module.exports = typeDefs;
