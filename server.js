const express = require('express');
const sequelize = require('./config/connection');
const path = require('path');
const session = require('express-session');
const exphbs = require('express-handlebars');
const helpers = require('./utils/helpers');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('passport');
// set up express server
const app = express();
const PORT = process.env.PORT || 3001;

// sets up session for logged in user.  session will expire after 30 minutes
const sess = {
  secret: 'Super secret secret',
  cookie: {
    // cookie/session expires after 30 minutes
    maxAge: 30 * 60 * 1000,
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

// express-session
app.use(session(sess));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// For Passport
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Set up Handlebars.js engine with custom helpers
app.use(passport.initialize());
app.use(passport.session());
const hbs = exphbs.create({ helpers });

// handlebars engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

const models = require('./models');

//authRoutes for Passport authorization
const authRoute = require('./controllers/authRoutes.js')(app, passport);
require('./config/passport/passport')(passport, models.User); //User or user?

// turn on routes
const routes = require('./controllers');
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on http://localhost:${PORT}`));
});