--Tables
CREATE TABLE roles
(
    id SERIAL PRIMARY KEY,
    name varchar(10)
);
CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    email varchar(50),
    passwordhash varchar(255),
    refreshtoken varchar(255),
    isactivated boolean not null default=false,
    activationcode varchar(255),
    roleid integer not null,
    FOREIGN KEY (roleid) REFERENCES roles (Id)
);

--Views
CREATE VIEW alluserswithrolenames AS 
    select u.id, u.email, u.refreshtoken, u.isactivated, u.activationcode, r.name as role 
    from users as u 
    left join roles as r on u.roleid=r.id;

--Functions
create or replace function getroleidbyrolename(rolename varchar)
  returns integer
    as
    $body$
        select id from roles where name=rolename
    $body$
    language sql;

--Procedures
CREATE PROCEDURE insert_user(
    _email varchar, _passwordhash varchar, _refreshtoken varchar, _roleid integer, 
    _isactivated boolean, _activationcode varchar) 
    LANGUAGE SQL 
    AS $$
    insert into users(email, passwordhash, refreshtoken, roleid, isactivated, activationcode) 
    values(_email, _passwordhash, _refreshtoken, _roleid, _isactivated, _activationcode);
    $$;

CREATE PROCEDURE update_user_email(
    _id integer, _email varchar) 
    LANGUAGE SQL 
    AS $$
    update users set email=_email where id=_id;
    $$;
CREATE PROCEDURE update_user_passwordhash(
    _id integer, _passwordhash varchar) 
    LANGUAGE SQL 
    AS $$
    update users set passwordhash=_passwordhash where id=_id;
    $$;