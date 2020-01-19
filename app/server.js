const { ApolloServer } = require('apollo-server');
const connect = require('../connect');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const eventApi = require('./events/event-queries');
const charityApi = require('./charities/charity-queries');
const userApi = require('./users/user-queries');

const start = async () => {
    /* eslint no-console: ["error", { allow: ["log", "error"] }] */
    // The ApolloServer constructor requires two parameters: your schema
    // definition and your set of resolvers.
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context() {
            return {
                eventApi,
                charityApi,
                userApi,
            };
        },
    });

    try {
        await connect('mongodb://localhost:27017/soulFoodDB');
        console.log('connected to the db');
    } catch (error) {
        console.error(`Server error ${error}`);
    }

    try {
        const { url } = await server.listen({ port: 4040 });
        console.log(`🚀 GQL server ready at ${url}`);
    } catch (error) {
        console.error(`Server error ${error}`);
    }
};

export { start as default };
