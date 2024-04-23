DROP DATABASE IF EXISTS InventoryDb;

CREATE DATABASE InventoryDb;

\c inventorydb;

CREATE TABLE users (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username TEXT NOT NULL,
    password TEXT
);



CREATE TABLE stuff (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    itemName TEXT NOT NULL,
    -- quantity FLOAT,
    -- itemType TEXT,
    -- itemValue FLOAT,
    -- location INT,
    -- FOREIGN KEY (owner) REFERENCES owners(ownerId)
);

CREATE TABLE owners(
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    ownerId INT REFERENCES users(id),
    itemId INT,
    FOREIGN KEY (itemId) REFERENCES stuff(id) 
);

insert into users (username, password) values('joe', '1234');

