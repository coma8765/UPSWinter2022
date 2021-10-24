import pkg from 'pg';

const { Pool } = pkg;

/**
 * Database class of Bouquet
 * */
export class Bouquet{
    constructor(pool) {
        this.db = pool;
        !this.db && (
            this.db = new Pool({
                user: 'server',
                password: '12345678',
                host: 'localhost',
                database: 'ups2022',
                port: 5432
            })
        )
    }

    /**
     * Function for get list of Bouquet
     *
     * @param {number} id Bouquet's ID, need for get method
     * @param {string} title Bouquet's title, TODO: some time add Elasticsearch or other hypertext search engine
     * @param {number} cost Bouquet's cost
     * @param {number} sellerId Bouquet's seller
     * @param {number} limit Limit for list of bouquets
     * @param {number} page Page number.
     * @return {Promise<{id: number, title: string, cost: number, image_url: string, seller_id: number}[]>}
     *      List of bouquets
     * */
    async list(id, title, cost, sellerId, limit, page) {
        let rq = sqlTemplate(
            "SELECT * FROM bouquet",
            {id, title, cost, sellerId},
            limit, page);
        return (await this.db.query(rq)).rows;
    }

    /**
     * Function for create bouquet
     *
     * @param {string} title Bouquet's title
     * @param {number} cost Bouquet's cost
     * @param {string} imageUrl Bouquet's image
     * @param {number} sellerId, Bouquet's seller
     * @return {Promise<number>} Promise with created bouquet's id
     * */
    async create(title, cost, imageURL, sellerId) {
        // console.log(imageUrl);
        return {
            id:
            (await this.db.query('INSERT INTO bouquet (title, cost, image_url, seller_id) ' +
                'VALUES ($1, $2, $3, $4) RETURNING id;', [title, cost, imageURL, sellerId])).rows[0].id,
            title, cost, imageURL, seller_id: sellerId
        }
    }

    /**
     * */
    async buy(bouquetId, customerId){
        let id = (await this.db.query(
            'INSERT INTO purchase (bouquet_id, customer_id, cost) VALUES ($1, $2, $3) RETURNING id;',
            [bouquetId, customerId, (await this.get(bouquetId)).cost]
        )).rows[0].id;
        let a =  (await this.db.query(
            'SELECT * FROM purchase WHERE id = $1;',
            [
                id
            ]
        )).rows
        return a[0]
    }

    /**
     * Function for get bouquet by ID
     *
     * @param {number} id Bouquet's ID
     * @return {Promise<({id: number, title: string, cost: number, image_url: string, seller_id: number} | undefined)>}
     */
    async get(id) {
        return id ? (await this.list(id))[0] : undefined;
    }

    /**
     * Function for delete bouquet by id
     * @param {number} id Bouquet's ID
     * @return {Promise}
     */
    async delete(id){
        let rq = sqlTemplate('DELETE FROM bouquet', {id});
        await this.db.query(rq);
        return true;
    }

    /**
     * Function for update bouquet's fields by id
     *
     * @param {number} id Bouquet's id
     * @param {string} title Bouquet's title
     * @param {number} cost Bouquet's cost
     * @param {string} imageUrl Bouquet's image's URL
     * @param {number} sellerId Bouquet's seller
     * @return Promise */
    async update(id, title, cost, imageUrl, sellerId){
        let rs = (await this.db.query(sqlTemplate('UPDATE bouquet', {id},
            null, null, {title, cost, imageUrl, sellerId},
            "RETURNING id, title, cost, image_url, seller_id"))).rows[0];
        return rs
    }
}

/**
 * */
export class Customer {
    constructor(pool) {
        this.db = pool;
        !this.db && (
            this.db = new Pool({
                user: 'server',
                password: '12345678',
                host: 'localhost',
                database: 'ups2022',
                port: 5432
            })
        )
    }

    /**
     * */
    async list(id, name, email, limit, page){
        let r = await this.db.query(
            sqlTemplate('SELECT * FROM customer', {id, name, email}, limit, page));
        return r.rows
    }

    /**
     * */
    async listPurchases(id) {
        return (await this.db.query('SELECT * FROM purchase WHERE customer_id = $1', [id])).rows
    }

    /**
     * */
    async get(id){
        return (await this.list(id))[0];
    }

    /**
     * */
    async create(name, email){
        let rq = await this.db.query(
            'INSERT INTO customer (name, email) VALUES ($1, $2) RETURNING id', [name, email]);
        return {id: rq.rows[0].id, name, email}
    }

    /**
     * */
    async update(id, name, email){
        return (await this.db.query(
            sqlTemplate('UPDATE customer', {id}, null, null, {name, email},
                'RETURNING id, name, email'))).rows[0];
    }

    /**
     * */
    async delete(id){
        console.log(`DELETE FROM customer WHERE id = ${id};`);
        console.log(await this.db.query(`DELETE FROM customer WHERE id = ${id};`));
        return true;
    }
}

/**
 * */
export class Seller {
    constructor(pool) {
        this.db = pool;
        !this.db && (
            this.db = new Pool({
                user: 'server',
                password: '12345678',
                host: 'localhost',
                database: 'ups2022',
                port: 5432
            })
        )
    }

    /**
     * */
    async list(id, shop, date_create, limit, page){
        let r = await this.db.query(
            sqlTemplate('SELECT * FROM seller', {id, shop, date_create}, limit, page));
        return r.rows
    }

    /**
     * */
    async countSold(id){
        return (await this.db.query('SELECT count(*) FROM purchase JOIN bouquet b on b.id = purchase.bouquet_id WHERE b.seller_id = $1;',
            [id])).rows[0].count
    }

    /**
     * */
    async get(id){
        return (await this.list(id))[0];
    }

    /**
     * */
    async create(shop, image_url){
        let rq = (await this.db.query(
            'INSERT INTO seller (shop, image_url) VALUES ($1, $2) RETURNING id, date_create',
            [shop, image_url])).rows[0];
        return {id: rq.id, shop, image_url, date_create: rq.date_create};
    }

    /**
     * */
    async update(id, shop, image_url) {
        let r = await this.db.query(
            sqlTemplate('UPDATE seller', {id}, null, null, {shop, image_url},
                "RETURNING id, shop, image_url"));

        return r.rows[0];
    }

    async delete(id){
        await this.db.query(`DELETE FROM seller WHERE id = ${id};`);
        return true
    }
}

/**
 * Function for create sql request
 *
 * @param {string} base SQL request without somethings params
 * @param {{whereParam: string}} where, Dictionary with where params of check on equal
 * @param {number} limit Limit results on one page
 * @param {number} page Number page
 * @param {{any: string}} set Need for update
 * @param {string} join Need for join construction
 * */
const sqlTemplate = (base, where, limit, page, set, join) => {
    let rq = base; let temp = {}; let temp2 = {};
    where && Object.keys(where).forEach((a) => where[a] && (temp[a] = where[a]));
    set && Object.keys(set).forEach((a) => set[a] && (temp2[a] = set[a]));
    where = temp; set = temp2;

    (Object.keys(set).length !== 0) && (rq += ' SET');
    Object.keys(set).forEach(
        (name) => set[name] && (rq += ` ${(Object.keys(set)[0] !== name) ? ', ' : ''}${name} = '${set[name]}'`)
    );

    (Object.keys(where).length !== 0) && (rq += ' WHERE');
    Object.keys(where).forEach(
        (name) => where[name] && (rq += ` ${(Object.keys(where)[0] !== name) ? 'AND ' : ''}${name} = '${where[name]}'`)
    );
    join && (rq += " " + join);
    limit && (rq += ` LIMIT = ${limit}`);
    page && (rq += ` OFFSET = ${page * limit}`);
    rq += ";";
    return rq;
}
