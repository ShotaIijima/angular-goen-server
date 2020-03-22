/*
DDL:

create table positions (
  id integer not null primary key auto_increment,
  name varchar(255)
);

*/

const db = require('./db');
const table = 'positions';

module.exports = {
  getOne: (id) => {
    return db.ExecuteQuery(`select * from ${table} where id = ${id}`);
  },
  getAll: () => {
    return db.ExecuteQuery(`select * from ${table}`);
  }
}