import express from "express";
import { ApolloServer } from "apollo-server-express";
import {typeDefs, resolvers} from "./graphql/index.mjs";
import {Bouquet, Customer, Seller} from './graphql/datasource';
import pkg from 'pg';
const { Client } = pkg;

const PORT = process.env.PORT || 8000

const db = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const app = express();
let server;
let client;

db.connect()
    .then(pool => client = pool)
    .then(async () => server = new ApolloServer(
        {
            typeDefs,
            resolvers,
            dataSources: () => {
                return {
                    bouquet: new Bouquet(db),
                    customer: new Customer(db),
                    seller: new Seller(db),
                }
            }
        }
    ))
    .then(() => server.start())
    .then(() => server.applyMiddleware({app}))
    .then(() =>
        app.listen(
            {port: PORT},
            () => console.log(`Server ready at http://localhost:${PORT}/graphql`)
        ))
    .catch((e) => console.error(e))

client && process.on('exit', () => client.release());
