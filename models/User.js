/*
DDL:

create table users (
  id integer not null primary key auto_increment,
  auth_type integer,
  name varchar(255),
  photo_path varchar(255),
  account varchar(255),
  mail_address varchar(255),
  password varchar(255),
  sex integer,
  birthday varchar(255),
  self_introduction varchar(255),
  company integer,
  reason integer,
  area integer,
  position integer,
  twitter varchar(255),
  facebook varchar(255),
  facebook_id varchar(255),
  linkedin varchar(255),
  skype varchar(255),
  slack varchar(255),
  chatwork varchar(255),
  github varchar(255),
  japanese_proficiency varchar(255),
  birthplace integer,
  bloodtype integer,
  welfare varchar(255),
  work_place integer,
  wp_detail varchar(255),
  apeal varchar(1023)
);
*/

User = {
  id: 0,
  auth_type: 0,
  name: '',
  photo_path: '',
  account: '',
  mail_address: '',
  password: '',
  sex: 0,
  birthday: '',
  self_introduction: '',
  company: 0,
  reason: 0,
  area: 0,
  position: 0,
  twitter: '',
  facebook: '',
  facebook_id: '',
  linkedin: '',
  skype: '',
  slack: '',
  chatwork: '',
  github: '',
  japanese_proficiency: '',
  birthplace: 0,
  bloodtype: 0,
  welfare: '',
  work_place: 0,
  wp_detail: '',
  apeal: '',
  type: 0,
  created_at: '',
  updated_at: ''
}

const db = require('./db');
const table = 'users';

module.exports = {
  getOne: (id) => {
    return db.ExecuteQuery(`select * from ${table} where id = ${id}`);
  },
  getAll: () => {
    return db.ExecuteQuery(`select * from ${table}`);
  },
  getByFBId: (id) => {
    return db.ExecuteQuery(`select * from ${table} where facebook_id = ${id}`);
  },
  getByBasic: (acc, pass) => {
    return new Promise ((resolve, reject) => {
      db.ExecuteQuery(`select * from ${table} where account = '${acc}' and password = '${pass}'`)
      .then((users) => {
        if (users.length > 0) {
          resolve(users[0]);
        } else {
          reject('not exists');
        }
      })
    });
  },
  getMatchLikeUsers: () => {
    return db.ExecuteQuery(`select * from ${table} where facebook_id = ${id}`);
  },
  makeNew: (acc, mail, pass, is_mng) => {
    var auth_type = null
    if(is_mng === '1'){
      auth_type = 3
    } else {
      auth_type = 1
    }
    return new Promise ((resolve, reject) => {
      db.ExecuteQuery(`select * from ${table} where mail_address = '${mail}' or account = '${acc}'`)
      .then((users) => {
        if (users.length > 0) {
          reject('exists');
        } else {
          db.ExecuteQuery(`insert into ${table}(auth_type, mail_address, account, password) values (${auth_type}, '${mail}', '${acc}', '${pass}')`)
          db.ExecuteQuery(`select * from ${table} where account = '${acc}'`)
          .then((users) => {
            resolve(users[0]);
          }).catch((err) => {
            console.log(err);
            reject(err);
          })
        }
      })
    });
  },
  makeNewFBUser: (fbuser) => {
    return new Promise ((resolve, reject) => {
      db.ExecuteQuery(`select * from ${table} where facebook_id = '${fbuser.id}'`)
      .then((users) => {
        if (users.length > 0) {
          resolve(users[0]);
        } else {
          db.ExecuteQuery(`insert into ${table}(auth_type, name, facebook_id) values (2, '${fbuser.displayName}', '${fbuser.id}')`)
          db.ExecuteQuery(`select * from ${table} where facebook_id = '${fbuser.id}'`)
          .then((users) => {
            resolve(users[0]);
          }).catch((err) => {
            console.log(err);
            reject(err);
          })
        }
      })
    });
  },
  updateUser: (user) => {
    return new Promise ((resolve, reject) => {
      db.ExecuteQuery(`select * from ${table} where id = ${user.id}`)
      .then((users) => {
        if (users.length !== 1) {
          reject("user found more or less than 1");
        } else {
          var sql = `update ${table} set `;
          Object.keys(user).forEach((key) => {
            if(key === 'created_at' || key === 'updated_at')
              return
            if(typeof user[key] === 'string')
              sql += key + " = '" + user[key] + "', ";
            if(typeof user[key] === 'number')
              sql += key + " = " + user[key] + ", ";
          })
          sql += "updated_at = now()";
          sql += ` where id = ${user.id}`;
          db.ExecuteQuery(sql)
          .then((result) => {
            db.ExecuteQuery(`select updated_at from ${table} where id = ${user.id}`)
            .then((res) => {
              resolve(res);
            })
            .catch((err) => {
              reject(err);
            })
          })
          .catch((err) => {
            reject(err);
          })
        }
      })
    });
  },
  updatePhotoPath: (id, photo_path) => {
    return new Promise ((resolve, reject) => {
      db.ExecuteQuery(`update ${table} set photo_path = '${photo_path}' where id = ${id}`)
      .then((result) => {
        resolve("OK");
      })
      .catch((err) => {
        reject(err);
      })
    })
  }
}