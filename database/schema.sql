DROP DATABASE IF EXISTS usersdb;
CREATE DATABASE usersdb;

\c usersdb;

DROP TABLE IF EXISTS usertable;
CREATE TABLE usertable (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  password VARCHAR(150) NOT NULL
);

INSERT INTO usertable (name, password)
  VALUES ('Jorge', 'masburritos'),
  ('notthemomma', 'dino'),
  ('poopedmypants', 'poop'),
  ('things', 'stuff')