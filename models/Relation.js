
const db = require('./db');
const table = 'relations';

module.exports = {
  create: (data) => {
    return
  },
  getByWorkerId: (worker_id) => {
    return db.ExecuteQuery(
      'select u.*, r.worker, r.mng, r.type as rel_type, r.com_url, r.worker_grade as grade, r.worker_memo as memo, false as visible ' +
      `from ${table} r, users u ` +
      `where r.worker = ${worker_id} ` +
      'and r.type = 1 ' +
      'and r.mng = u.id'
    );
  },
  getByMngId: (mng_id) => {
    return db.ExecuteQuery(
      'select u.*, r.worker, r.mng, r.type as rel_type, r.com_url, r.mng_grade as grade, r.mng_memo as memo, false as visible ' +
      `from ${table} r, users u ` +
      `where r.mng = ${mng_id} ` +
      'and r.worker = u.id'
    );
  },
  updateWorkerRelation: (data, auth_id) => {
    return db.ExecuteQuery(
      `update ${table} set ` +
      `worker_grade = ${data.grade}, ` +
      `worker_memo = '${data.memo}', ` +
      `type = ${data.rel_type}, ` +
      `com_url = '${data.com_url}' ` +
      `where mng = ${data.mng} ` +
      `and worker = ${auth_id}`
    );
  },
  updateMngRelation: (data, auth_id) => {
    return db.ExecuteQuery(
      `update ${table} set ` +
      `mng_grade = ${data.grade}, ` +
      `mng_memo = '${data.memo}', ` +
      `type = ${data.rel_type}, ` +
      `com_url = '${data.com_url}' ` +
      `where worker = ${data.worker} ` +
      `and mng = ${auth_id}`
    );
  },
}
