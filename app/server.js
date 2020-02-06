import { ApolloServer } from 'apollo-server';
import connect from '../connect';
import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';

import eventApi from './events/event-queries';
import charityApi from './charities/charity-queries';
import userApi from './users/user-queries';
import addressApi from './address/address-service';

const dataSources = () => ({
    eventApi,
    charityApi,
    userApi,
    addressApi,
});

const start = async () => {
    /* eslint no-console: ["error", { allow: ["log", "error"] }] */
    // The ApolloServer constructor requires two parameters: your schema
    // definition and your set of resolvers.
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        dataSources,
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
