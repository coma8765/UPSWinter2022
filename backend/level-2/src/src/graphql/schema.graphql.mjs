import {gql} from "apollo-server-express";
export default gql`
scalar Date

type Bouquet {
    Id: ID!
    title: String!
    cost: Float!
    imageURL: String
    seller: Seller!
}
type Seller {
    Id: ID!
    shop: String!
    imageURL: String!
    dateCreate: Date!
    bouquets: [Bouquet]
    countSold: Int!
}
type Customer{
    Id: ID!
    name: String!
    email: String!
    purchases: [Purchase]
}
type Purchase{
    Id: ID!
    bouquet: Bouquet!
    customer: Customer!
    cost: Float!
    serviceRevenue: Float!
}

type Query{
    bouquets(Id: ID, title: String, cost: Float,
        sellerId: ID
    ): [Bouquet]
    sellers(
        Id: ID, shop: String, dateCreate: Date
    ): [Seller]
    customers(Id: ID, name: String, email: String): [Customer]
    purchases(customerId: ID!): [Purchase]
}

type Mutation{
    createBouquet(
        title: String!
        cost: Float!
        imageURL: String
        sellerId: ID!
    ): Bouquet!
    createSeller(
        shop: String!
        imageURL: String!
    ): Seller!
    createCustomer(
        name: String!
        email: String!
    ): Customer!
    updateBouquet(
        Id: ID!
        title: String
        cost: Float
        imageURL: String
        sellerId: ID
    ): Bouquet
    """Update seller by ID"""
    updateSeller(
        Id: ID!
        shop: String
        imageURL: String
    ): Seller
    updateCustomer(
        Id: ID!
        name: String
        email: String
    ): Customer
    deleteBouquet(Id: ID!): Boolean
    deleteSeller(Id: ID!): Boolean
    deleteCustomer(Id: ID!): Boolean
    purchaseBouquet(bouquetId: ID!, customerId: ID!): Purchase
}
`