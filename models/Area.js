/*
DDL:

create table areas (
  id integer not null primary key auto_increment,
  name varchar(255)
);

*/

const db = require('./db');
const table = 'areas';

module.exports = {
  getOne: (id) => {
    return db.ExecuteQuery(`select * from ${table} where id = ${id}`);
  },
  getAll: () => {
    return db.ExecuteQuery(`select * from ${table}`);
  }
}