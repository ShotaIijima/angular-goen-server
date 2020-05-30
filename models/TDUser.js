/*
DDL:

create table td_users (
  id integer auto_increment primary key,
  user integer,
  type_detail integer
);

*/

const db = require('./db');
const table = 'td_users';

module.exports = {
  getByUser: (user_id) => {
    return db.ExecuteQuery(`select * from ${table} where user = ${user_id}`);
  },
  updateUser: (user) => {
    return new Promise ((resolve, reject) => {
      db.ExecuteQuery(`delete from ${table} where user = ${user.id}`)
      for(var i=0; i<user.tdusers.length; i++) {
        db.ExecuteQuery(`insert into ${table}(user, type_detail) values (${user.id}, ${user.tdusers[i]})`)
      }
      resolve("OK");
    });
  },
}