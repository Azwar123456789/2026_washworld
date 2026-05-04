CREATE DATABASE IF NOT EXISTS 2026_1_washworld;
USE 2026_1_washworld;

DROP TABLE IF EXISTS wash_history;
DROP TABLE IF EXISTS password_reset_tokens;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS wash_locations;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_pk VARCHAR(32) PRIMARY KEY,
    user_first_name VARCHAR(50) NOT NULL,
    user_email VARCHAR(100) NOT NULL UNIQUE,
    user_password_hash VARCHAR(255) NOT NULL,
    user_license_plate VARCHAR(20) NOT NULL,
    user_verified_at INT DEFAULT 0,
    user_verification_key VARCHAR(32) NOT NULL,
    user_reset_password_key VARCHAR(64) NOT NULL,
    user_created_at INT NOT NULL
);

CREATE TABLE subscriptions (
    subscription_pk VARCHAR(32) PRIMARY KEY,
    user_fk VARCHAR(32) NOT NULL,
    subscription_name VARCHAR(100) NOT NULL,
    subscription_price DECIMAL(10,2) NOT NULL,
    subscription_started_at INT NOT NULL,
    subscription_active TINYINT DEFAULT 1,
    FOREIGN KEY (user_fk) REFERENCES users(user_pk)
);

CREATE TABLE wash_locations (
    location_pk VARCHAR(32) PRIMARY KEY,
    location_name VARCHAR(100) NOT NULL,
    location_city VARCHAR(100) NOT NULL,
    location_address VARCHAR(255) NOT NULL,
    location_opening_hours VARCHAR(100) NOT NULL
);

CREATE TABLE wash_history (
    wash_pk VARCHAR(32) PRIMARY KEY,
    user_fk VARCHAR(32) NOT NULL,
    location_fk VARCHAR(32) NOT NULL,
    wash_type VARCHAR(100) NOT NULL,
    normal_price DECIMAL(10,2) NOT NULL,
    subscription_price DECIMAL(10,2) NOT NULL,
    washed_at INT NOT NULL,
    FOREIGN KEY (user_fk) REFERENCES users(user_pk),
    FOREIGN KEY (location_fk) REFERENCES wash_locations(location_pk)
);

CREATE TABLE password_reset_tokens (
    reset_pk VARCHAR(32) PRIMARY KEY,
    user_fk VARCHAR(32) NOT NULL,
    reset_key VARCHAR(64) NOT NULL,
    used_at INT DEFAULT 0,
    created_at INT NOT NULL,
    FOREIGN KEY (user_fk) REFERENCES users(user_pk)
);

INSERT INTO wash_locations VALUES
('loc001', 'Wash World Køge', 'Køge', 'Køge Centrum 1', '06:00 - 22:00'),
('loc002', 'Wash World Ishøj', 'Ishøj', 'Ishøj Bycenter 10', '06:00 - 22:00'),
('loc003', 'Wash World Roskilde', 'Roskilde', 'Roskildevej 55', '07:00 - 21:00'),
('loc004', 'Wash World Greve', 'Greve', 'Greve Main Street 20', '06:00 - 22:00');