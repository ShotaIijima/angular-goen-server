const logger = require("./libs/log/logger").application;
const systemLogger = require("./libs/log/systemLogger");
const accessLogger = require("./libs/log/accessLogger");
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FBStrategy = require('passport-facebook').Strategy;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const conf = require('./conf');
const userController = require('./controllers/User');
const positionController = require('./controllers/Position');
const authController = require('./controllers/Auth');
const { verifyToken, verifyFBSession } = require('./services/VerifyToken');
const jwt = require('jsonwebtoken');
//const MySQLStore = require('express-mysql-session')(session);

const app = express();

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

app.use(session({
  secret: conf.session.key,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 2 * 60 * 1000
  }
}));

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "localhost:4200");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new FBStrategy({
  clientID: conf['oauth_key']['fb']['id'],
  clientSecret: conf['oauth_key']['fb']['secret'],
  callbackURL: "http://localhost:3000/api/auth/facebook/callback",
  //profileFields: ['address', 'birthday', 'displayName', 'email', 'gender', 'name', 'profile_pic']
  profileFields: ['address', 'birthday', 'displayName', 'email', 'profileUrl']
},
  function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

app.post(conf['app']['url_pref'] + '/login/local', authController.login);
app.get(conf['app']['url_pref'] + '/auth/facebook', passport.authenticate('facebook', {
  scope: ['public_profile']
}));
app.get(conf['app']['url_pref'] + '/auth/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: 'http://localhost:4200/login'
  }), authController.fbAuthCallback);
app.post(conf['app']['url_pref'] + '/signin/local', authController.signin);
app.get(conf['app']['url_pref'] + '/logout', verifyToken, (req, res, next) => {req.session.user = null;});
app.get(conf['app']['url_pref'] + '/user/info', verifyToken, (req, res, next) => {res.json({code: 200, account: req.account})});
app.get(conf['app']['url_pref'] + '/fbuser', verifyFBSession, (req, res, next) => {
  const token = req.session.token;
  req.session.destroy();
  res.json({code: 200, res: {token: token}});
});
app.get(conf['app']['url_pref'] + '/user/:id', verifyToken, userController.doGetOne);
app.post(conf['app']['url_pref'] + '/user', verifyToken, userController.doUpdate);
app.get(conf['app']['url_pref'] + '/position/:id', verifyToken, positionController.doGetOne);
app.get(conf['app']['url_pref'] + '/position/all', verifyToken, positionController.doGetAll);

app.use(systemLogger());
app.use(accessLogger());

app.listen(conf['app']['port'], () => {
  console.log('listen on port ' + conf['app']['port']);
});
