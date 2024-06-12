CREATE DATABASE IF NOT EXISTS auto_kereskedes;

-- Futtatás konzolról (UNIX rendszeren):
--     mysql -u root -p <db/setup.sql

USE auto_kereskedes;
GRANT ALL PRIVILEGES ON *.* TO 'webprog'@'localhost' IDENTIFIED BY 'asd';

CREATE TABLE IF NOT EXISTS felhasznalo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS hirdetes (
    id VARCHAR(255) PRIMARY KEY,
    brand VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES felhasznalo(id)
);

CREATE TABLE IF NOT EXISTS fenykep (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    advertisement_id VARCHAR(255),
    FOREIGN KEY (advertisement_id) REFERENCES hirdetes(id)
);