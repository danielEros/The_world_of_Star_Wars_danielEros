--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.6
-- Dumped by pg_dump version 9.5.6

ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS pk_users_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.planet_votes DROP CONSTRAINT IF EXISTS pk_planet_votes_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.planet_votes DROP CONSTRAINT IF EXISTS fk_users_id CASCADE;


DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.users_id_seq;
CREATE TABLE users (
    id serial NOT NULL,
    username varchar(30) UNIQUE,
    password varchar(120)
);

DROP TABLE IF EXISTS public.planet_votes;
DROP SEQUENCE IF EXISTS public.planet_votes_id_seq;
CREATE TABLE planet_votes (
    id serial NOT NULL,
    planet_id integer,
    users_id integer,
    submission_time timestamp without time zone,
    planet_name varchar(30)
);


ALTER TABLE ONLY users
    ADD CONSTRAINT pk_users_id PRIMARY KEY (id);

ALTER TABLE ONLY planet_votes
    ADD CONSTRAINT pk_planet_votes_id PRIMARY KEY (id);

ALTER TABLE ONLY planet_votes
    ADD CONSTRAINT fk_users_id FOREIGN KEY (users_id) REFERENCES users(id);


INSERT INTO users VALUES (1, 'Kata', 'pbkdf2:sha256:50000$k8ozXFeh$c3cdf6863b5a2243afd85d13a6bdd22d82a0905fc043073f9bfeadb3a246118c');
INSERT INTO users VALUES (2, 'Daniel', 'pbkdf2:sha256:50000$D16YPd4i$033443d86e789ac31aba8581b9e568a6de1f82f8879d3d8c2a1ea2e1ae4ef6e9');
INSERT INTO users VALUES (3, 'Béci', 'pbkdf2:sha256:50000$vQUz23E0$6c8d838d29f7876292bd51d78aa71030502a4950afd3970c4ab9d66f96f88562');
SELECT pg_catalog.setval('users_id_seq', 3, true);

INSERT INTO planet_votes VALUES (1, 1, 3, '2017-04-28 08:29:00', 'Tatooine');
INSERT INTO planet_votes VALUES (2, 2, 1, '2017-04-29 09:19:00', 'Alderaan');
INSERT INTO planet_votes VALUES (3, 5, 2, '2017-05-01 10:41:00', 'Dagobah');
SELECT pg_catalog.setval('planet_votes_id_seq', 3, true);