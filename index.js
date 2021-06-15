const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const conectarDB = require('./config/db');

//Conectar a la base de datos

conectarDB();

//Servidor
const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
});

//Arrancar el Servidor
server.listen({ port: process.env.PORT || 4000 }).then( ({url}) => {
    console.log(`Servidor Listo en la URL ${url}`)
})