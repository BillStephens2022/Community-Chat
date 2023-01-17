const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const path = require('path');
const session = require('express-session');
const exphbs = require('express-handlebars');
const helpers = require('./utils/helpers');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
// set up express server
const app = express();
const PORT = process.env.PORT || 3001;
// for express handlebars setup
const hbs = exphbs.create({ helpers });
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

// handlebars engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on http://localhost:${PORT}`));
});
