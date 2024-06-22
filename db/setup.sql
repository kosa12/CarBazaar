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
    fuel_type VARCHAR(255) NOT NULL,
    transmission VARCHAR(255) NOT NULL,
    car_condition VARCHAR(255) NOT NULL,
    body_type VARCHAR(255) NOT NULL,
    color VARCHAR(255) NOT NULL,
    kilometers INT NOT NULL,
    date DATE NOT NULL,
    user_id INT,
    likes INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES felhasznalo(id)
);

CREATE TABLE IF NOT EXISTS fenykep (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    advertisement_id VARCHAR(255),
    FOREIGN KEY (advertisement_id) REFERENCES hirdetes(id)
);

CREATE TABLE IF NOT EXISTS liked_ads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    advertisement_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_like (user_id, advertisement_id),
    FOREIGN KEY (user_id) REFERENCES felhasznalo(id),
    FOREIGN KEY (advertisement_id) REFERENCES hirdetes(id)
);

CREATE TABLE messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message_content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES felhasznalo(id),
    FOREIGN KEY (receiver_id) REFERENCES felhasznalo(id)
);

CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    advertisement_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES felhasznalo(id),
    FOREIGN KEY (advertisement_id) REFERENCES hirdetes(id)
);

CREATE TABLE IF NOT EXISTS offers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    advertisement_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    price INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES felhasznalo(id),
    FOREIGN KEY (advertisement_id) REFERENCES hirdetes(id)
);