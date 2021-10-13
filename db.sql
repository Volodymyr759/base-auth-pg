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