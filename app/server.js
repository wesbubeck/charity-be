const { ApolloServer, gql } = require('apollo-server');
const connect = require('../connect');

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;

const books = [
    {
        title: 'Harry Potter and the Chamber of Secrets',
        author: 'J.K. Rowling',
    },
    {
        title: 'Jurassic Park',
        author: 'Michael Crichton',
    },
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        books: () => books,
    },
};


const start = async () => {
    /* eslint no-console: ["error", { allow: ["log", "error"] }] */
    // The ApolloServer constructor requires two parameters: your schema
    // definition and your set of resolvers.
    const server = new ApolloServer({ typeDefs, resolvers });

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
