create table bouquet
(
	-- Int can not be auto increment
	id serial,
	title varchar(100) not null,
	cost float8 not null,
	image_url varchar(150),
	seller_id int not null
);

create table seller
(
    id          serial
        constraint seller_pk
            primary key,
    shop        varchar(100)       not null,
    image_url   varchar(150),
    date_create date default now() not null
);

create unique index seller_id_uindex
    on seller (id);

create unique index bouquet_id_uindex
	on bouquet (id);

create unique index bouquet_title_uindex
	on bouquet (title);

alter table bouquet
	add constraint bouquet_pk
		primary key (id);

create table customer
(
	id serial,
	name varchar(100) not null,
	email varchar(100) not null
);

create unique index customer_email_uindex
	on customer (email);

create unique index customer_id_uindex
	on customer (id);

alter table customer
	add constraint customer_pk
		primary key (id);

create table purchase
(
	id serial,
	bouquet_id int not null
		constraint purchase_bouquet_id_fk
			references bouquet,
	customer_id int
		constraint purchase_customer_id_fk
			references customer,
    cost int
);

create unique index purchase_id_uindex
	on purchase (id);

alter table purchase
	add constraint purchase_pk
		primary key (id);
