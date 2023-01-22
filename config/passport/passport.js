const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
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

module.exports = passport;