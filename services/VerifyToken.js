const jwt = require('jsonwebtoken');
const conf = require('../conf');

function verifyToken(req, res, next) {
  // header か　url parameters か post parametersからトークンを取得する
  var token = req.headers['x-access-token'];
  if (token) {
    // jwtの認証をする
    jwt.verify(token, conf['session']['key'], function(error, decoded) {
      if (error) {
        res.json({ code: 401, message: 'cant auth token' });
      } else {
        // 認証に成功したらdecodeされた情報をrequestに保存する
        req.account = decoded;
        next();
      }
    });
  } else {
    // トークンがなければエラーを返す
    return res.status(403).send({
        code: 401,
        message: 'cant get token',
    });
  }
}

function verifyFBSession(req, res, next) {
    if (req.session.token) {
        next();
    } else {
        return res.json({ code: 401, message: 'cant auth fb token' });
    }
}

module.exports = {
    verifyToken,
    verifyFBSession
};