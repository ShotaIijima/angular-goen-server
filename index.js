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
const tdController = require('./controllers/TypeDetail');
const positionController = require('./controllers/Position');
const masterDataController = require('./controllers/MasterDatas');
const relationController = require('./controllers/Relation');
const authController = require('./controllers/Auth');
const { verifyToken, verifyFBSession } = require('./services/VerifyToken');
const multer  = require('multer');
//const MySQLStore = require('express-mysql-session')(session);

const app = express();

app.use(cors());

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({
  extended: false,
  type: 'application/x-www-form-urlencoded'
}));
var upload = multer({ dest: 'uploads/' });

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

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new FBStrategy({
  clientID: conf['oauth_key']['fb']['id'],
  clientSecret: conf['oauth_key']['fb']['secret'],
  callbackURL: conf['app']['server_url'] + "/api/auth/facebook/callback",
  //profileFields: ['address', 'birthday', 'displayName', 'email', 'gender', 'name', 'profile_pic']
  profileFields: ['address', 'birthday', 'displayName', 'email', 'profileUrl']
},
  function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

app.use(express.static(__dirname + '/dist'));

app.post(conf['app']['url_pref'] + '/login/local', authController.login);
app.get(conf['app']['url_pref'] + '/auth/facebook', passport.authenticate('facebook', {
  scope: ['public_profile']
}));
app.get(conf['app']['url_pref'] + '/auth/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: 'https://34.71.76.92/login'
  }), authController.fbAuthCallback);
app.post(conf['app']['url_pref'] + '/signin/local', authController.signin);
app.get(conf['app']['url_pref'] + '/logout', verifyToken, (req, res, next) => {req.session.user = null;});
app.get(conf['app']['url_pref'] + '/user/info', verifyToken, (req, res, next) => {res.json({code: 200, account: req.account})});
app.get(conf['app']['url_pref'] + '/fbuser', verifyFBSession, (req, res, next) => {
  const token = req.session.token;
  req.session.destroy();
  res.json({code: 200, res: {token: token}});
});
app.post(conf['app']['url_pref'] + '/user', verifyToken, userController.doUpdate);
app.get(conf['app']['url_pref'] + '/relations', verifyToken, relationController.doGetAll);
app.post(conf['app']['url_pref'] + '/relations', verifyToken, relationController.update);
app.get(conf['app']['url_pref'] + '/master/all', masterDataController.doGetAllMaster);
app.post(conf['app']['url_pref'] + '/typedetails', tdController.doGetByType);
app.post(conf['app']['url_pref'] + '/photo/save', upload.any(), verifyToken, userController.savePhoto);

app.use(systemLogger());
app.use(accessLogger());

app.listen(conf['app']['port'], () => {
  console.log('listen on port ' + conf['app']['port']);
});
