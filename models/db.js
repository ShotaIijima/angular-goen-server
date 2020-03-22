var mysql = require('mysql');
const conf = require('../conf.js')

const pool = mysql.createPool(conf['db']);

async function ExecuteQuery(queryStr){
    return new Promise ((resolve, reject) => {
        let result = pool.query(queryStr, (err, rows, fields) => {
            if ( err ) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

exports.ExecuteQuery = ExecuteQuery;