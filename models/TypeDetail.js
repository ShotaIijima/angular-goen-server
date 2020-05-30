/*
DDL:

create table type_details (
  id integer primary key,
  name varchar(255),
  type integer
);

*/

const db = require('./db');
const table = 'type_details';

module.exports = {
  getByType: (type_id) => {
    return db.ExecuteQuery(`select * from ${table} where type = ${type_id}`);
  },
}