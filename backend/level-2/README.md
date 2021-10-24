# UPS IT Backend task level 2 GraphQL
## **Стенд**
Запущен на сайте heroku.com, [по адресу https://ups-backend-2022.herokuapp.com/graphql](https://ups-backend-2022.herokuapp.com/graphql).

Используется база данных PostgresSQL

## Зависимости
* NodeJS 16
* Yarn
* PostgresSQL
* Docker, необязательно

# Локальная установка, Docker
## Сборка
```shell
docker build -t ups-backend-2022 .
```
## Запуск
- DATABASE_URL - строка для подключения к PastgresSQL, ОБЯЗАТЕЛЬНО ИСПОЛЬЗУЙТЕ SSL
```shell
docker run --name ups-backend-2022-instance -p 8000:8000 -e "PORT=8000" -e "DATABASE_URL=$DATABASE_URL" ups-backend-2022
```
Интерфейс будет доступен по URL [http://localhost:8000/graphql](http://localhost:8000/graphql)

# Локальная установка, без Docker
## Подготовка
### Установка зависимостей:
```shell
yarn install
```
### Подготовка базы данных
```shell
psql $params$ -a ./src/assets/create_db.sql
```
<!-- ### Включение эксперементальных функций:
Windows, **Powershell**:
```shell
$env:NODE_OPTIONS='--experimental-specifier-resolution=node'
```
Linux
```shell

``` -->
## Запуск
```shell
yarn run prod
```
[Локально работает на http://localhost:8000/graphql](http://localhost:8000/graphql)
## Документация
### GraphQL Types:
* Bouquet: Id, title, cost, imageURL, seller
* Seller: Id, shop, imageURL, dateCreate, bouquets, countSold
* Customer: Id, name, email, purchases
* Purchase: Id, bouquet, customer, cost, serviceRevenue(cost * 0.3)
* Query: 
    - bouquets, list of bouquets by: Id, title, cost, sellerId
    - sellers, list fo sellers by: Id, shop, dateCreate
    - customers, list of customers by: Id, email
    - purchases, list of purchase by seller id
* Mutation:
    - createBouquet, need title, cost, imageURL, seller id, return object of bouquet
    - createSeller, need shop, imageURl may be null, return object of seller
    - createCustomer, need name, email, return object of customer
    - updateBouquet, by id changing: title, cost, return object of bouquet
    - updateSeller, by id changing: shop, imageURL, return object of seller
    - updateCustomer, by id changing: name, email, return object of customer 
    - deleteBouquet, by id
    - deleteSeller, by id
    - deleteBouquet, by id
    - purchaseBouquet, params: bouquet id, customer id, return instance of Purchase