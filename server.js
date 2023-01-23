const express = require('express');
const sequelize = require('./config/connection');
const path = require('path');
const session = require('express-session');
const exphbs = require('express-handlebars');
const helpers = require('./utils/helpers');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('./config/passport/passport');
const routes = require('./controllers');
//socket.io dependencies
const http = require('http');
const { Server } = require("socket.io");
const { User } = require('./models');
// set up express server and socket.io
const app = express();
const server = http.createServer(app);
const io = new Server(server)
const PORT = process.env.PORT || 3001;

// sets up session for logged in user.  session will expire after 30 minutes
const sess = {
  secret: 'Super secret secret',
  cookie: {
    // cookie/session expires after 1 day
    maxAge: 24 * 60 * 60 * 1000,
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

//setup static content folder
app.use(express.static(path.join(__dirname, 'public')));

// For Passport
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


hbs.handlebars.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

// turn on routes
app.use(routes);

// socket.io connection to listen on server
io.on('connection', (socket) => {
  
  console.log(`user connected ${socket.id}`);
  
  io.emit(`chat`,`user " ${socket.id} "connected`);
  
  // socket.on('chat', msg => {    
   
  //   console.log(msg);

  //   io.emit('chat', msg);
  // });
});


io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
  console.log('message: ' + msg)
  io.emit('chat', msg);
  });
});

 
io.on('disconnect', () => { 
  console.log('user disconnected');
  io.emit(`chat`,`user" ${socket.id} "disconnected`);
});


// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  server.listen(PORT, () => console.log(`Now listening on http://localhost:${PORT}`));
});