
export default {
    Bouquet: {
        seller: (parent, _, {dataSources}) => dataSources.seller.get(parent.seller_id),
        Id: (parent) => parent.id,
        imageURL: (parent) => parent.imageURL || parent.image_url,
        title: async (parent, _, {dataSources}) => parent.title ? parent.title :
            (await dataSources.bouquet.get(parent.bouquet)).title
    },
    Seller: {
        Id: (parent) => parent.Id || parent.id,
        bouquets: (parent, _, {dataSources}) => dataSources.bouquet.list(undefined, undefined, undefined, parent.Id),
        countSold: (parent, _, {dataSources}) => dataSources.seller.countSold(parent.id),
        imageURL: (parent) => parent.imageURL || parent.image_url,
        dateCreate: (parent) => parent.date_create,
    },
    Customer: {
        Id: (parent) => parent.id,
        purchases: (parent, _, {dataSources}) => dataSources.customer.listPurchases(parent.id),
    },
    Purchase: {
        Id: (parent) => parent.id,
        bouquet: (parent, _, {dataSources}) => dataSources.bouquet.get(parent.bouquet_id),
        customer: (parent, _, {dataSources}) => dataSources.customer.get(parent.customer_id),
        // cost: (parent, _, {dataSources}) => parent.bouquet.cost,
        serviceRevenue: (parent) => parent.cost * 0.3
    },
    Query: {
        bouquets: (_, {Id, title, cost, sellerID, limit, page}, {dataSources}) =>
            dataSources.bouquet.list(Id, title, cost, sellerID, limit, page),
        sellers: (_, {Id, shop, dateCreate}, {dataSources}) =>
            dataSources.seller.list(Id, shop, dateCreate),
        customers: (_, {Id, name, email}, {dataSources}) =>
            dataSources.customer.list(Id, name, email),
        purchases: (_, {customerId}, {dataSources}) =>
            dataSources.customer.listPurchases(customerId),
    },
    Mutation: {
        createBouquet: (_, {title, cost, imageURL, sellerId}, {dataSources}) =>
            dataSources.bouquet.create(title, cost, imageURL, sellerId),
        createSeller: (_, {shop, imageURL}, {dataSources}) =>
            dataSources.seller.create(shop, imageURL),
        createCustomer: (_, {name, email}, {dataSources}) =>
            dataSources.customer.create(name, email),
        updateBouquet: (_, {Id, title, cost, imageURL, sellerId}, {dataSources}) =>
            dataSources.bouquet.update(Id, title, cost, imageURL, sellerId),
        updateSeller: (_, {Id, shop, imageURL}, {dataSources}) =>
            dataSources.seller.update(Id, shop, imageURL),
        updateCustomer: (_, {Id, name, email}, {dataSources}) =>
            dataSources.customer.update(Id, name, email),
        deleteBouquet: (_, {Id}, {dataSources}) =>
            dataSources.bouquet.delete(Id),
        deleteSeller: (_, {Id}, {dataSources}) =>
            dataSources.seller.delete(Id),
        deleteCustomer: (_, {Id}, {dataSources}) =>
            dataSources.customer.delete(Id),
        purchaseBouquet: (_, {bouquetId, customerId}, {dataSources}) => dataSources.bouquet.buy(bouquetId, customerId),
    }
};
