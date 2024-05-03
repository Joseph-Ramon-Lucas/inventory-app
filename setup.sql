DROP DATABASE IF EXISTS InventoryDb;

CREATE DATABASE InventoryDb;

\c inventorydb;

CREATE TABLE users (
    userId INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username TEXT NOT NULL,
    password TEXT
);



CREATE TABLE stuff (
    itemId INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    itemName TEXT NOT NULL
    -- quantity FLOAT,
    -- itemType TEXT,
    -- itemValue FLOAT,
    -- location INT,
    -- FOREIGN KEY (owner) REFERENCES owners(ownerId)
);

CREATE TABLE usersOwnStuff(
    ownerId INT NOT NULL,
    itemId INT NOT NULL,
    CONSTRAINT PK_userOwnsStuff PRIMARY KEY (
        ownerId,
        itemId
    ),
    FOREIGN KEY (ownerId) REFERENCES users(userId),
    FOREIGN KEY (itemId) REFERENCES stuff(itemId)
);

insert into users (username, password) values('joe', '1234');
insert into stuff (itemName) values('phone');
insert into stuff (itemName) values('watch');
insert into usersOwnStuff(ownerId, itemId) values(1, 1);
insert into usersOwnStuff(ownerId, itemId) values(1, 2);

-- select username,itemname from usersOwnStuff join users on users.userId = ownerid join stuff on stuff.itemId=usersOwnStuff.itemId;


