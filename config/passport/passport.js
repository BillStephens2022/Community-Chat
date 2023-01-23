const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const { User } = require('../../models');

passport.serializeUser(function (user, done) {
    console.log(`serialize user: `, user);
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    console.log(`deserializeUser id: `, id);
    User.findByPk(id).then(function (user) {
        if (user) {
            done(null, user.get());
        } else {
            done(user.errors, null);
        }
    });
});

//LOCAL SIGNUP
passport.use('local-signup', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function (req, email, password, done) {
        console.log(`***** Passport Local Strategy-LOCAL SIGNUP`);
        console.log(`***** req.body: `, req.body);
        console.log(`***** email: ${email}`);
        console.log(`***** password: ${password}`);
        User.findOne({
            where: {
                email: email
            }
        }).then(function (user) {
            console.log("***** db user: ", user)
            if (user) {
                console.log("***** This email already exists")
                return done(null, false, {
                    message: 'That email is already taken'
                });
            } else {
                var data =
                {
                    username: req.body.username,
                    email: email,
                    password: password,
                };
                User.create(data).then(function (newUser, created) {
                    if (!newUser) {
                        return done(null, false);
                    }
                    if (newUser) {
                        console.log("The new user ID is: ", newUser.id);
                        return done(null, newUser);
                    }
                });
            }
        });
    }
));
//LOCAL SIGNIN
passport.use('local-signin', new LocalStrategy(
    {
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function (req, email, password, done) {
        console.log('passport-local-signin');
        console.log('password: ', password);
        console.log('email: ', email);
        User.findOne({
            where: {
                email: email
            }
        }).then(function (dbUser) {
            if (!dbUser) {
                return done(null, false, {
                    message: 'Email does not exist'
                });
            }
            if (!dbUser.checkPassword(password)) {
                return done(null, false, {
                    message: 'Incorrect password'
                });
            };
            var userinfo = dbUser.get();
            return done(null, userinfo);
        }).catch(function (err) {
            console.log("passport local-signin Error:", err);
            return done(null, false, {
                message: 'Something went wrong with your Signin'
            });
        });
    }
));

//FACEBOOK LOGIN
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/oauth2/redirect/facebook',
    state: true
  }, function verify(accessToken, refreshToken, profile, done) {
    console.log('access token: ', accessToken);
    console.log('refresh token: ', refreshToken);
    console.log('profile.displayName: ', profile.displayName);
    User.findOne({ where: { id : profile.id } }).then(function(err, user) {

        if (err)
            return done(err);

        if (user) {
            return done(null, user); // user found, return that user
        } else {
            console.log('***************hello');
            console.log('username: ', profile.displayName);
            var userInfo = {
              username  : profile.displayName,
              email : "email@facebook.com", 
              password : 'kj5k3k24i3ioIIOS*Y#YYIQ@UI!',  
            };
            User.create(userInfo).then(function (newUser, created) {
                if (!newUser) {
                    return done(null, false);
                }
                if (newUser) {
                    console.log("The new user ID is: ", newUser.id);
                    return done(null, newUser);
                }
            });
       }

    });
 

}));


    // db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
    //   'https://www.facebook.com',
    //   profile.id
    // ], function(err, row) {
    //   if (err) { return cb(err); }
    //   if (!row) {
    //     db.run('INSERT INTO users (name) VALUES (?)', [
    //       profile.displayName
    //     ], function(err) {
    //       if (err) { return cb(err); }
  
    //       var id = this.lastID;
    //       db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
    //         id,
    //         'https://www.facebook.com',
    //         profile.id
    //       ], function(err) {
    //         if (err) { return cb(err); }
    //         var user = {
    //           id: id,
    //           name: profile.displayName
    //         };
    //         return cb(null, user);
    //       });
    //     });
    //   } else {
    //     db.get('SELECT * FROM users WHERE id = ?', [ row.user_id ], function(err, row) {
    //       if (err) { return cb(err); }
    //       if (!row) { return cb(null, false); }
    //       return cb(null, row);
    //     });
    //   }
    // });
//   }));

module.exports = passport;

