const bCrypt = require('bcryptjs');

module.exports = function(passport, user) {
    const User = user;
    const LocalStrategy = require('passport-local').Strategy;
    //serialize 
    passport.serializeUser(function(user, done) {
        console.log(`serialize user: `, user);
    done(null, user.id);
    });
    // deserialize user 
    passport.deserializeUser(function (id, done) {
        console.log(`de-serialize id: `, id);
        User.findByPk(id).then(function (user) {
            if (user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });
    });
    // Local SIGNUP
    passport.use('local-signup', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback 
        },
        function(req, email, password, done) {
            console.log('*************************');
            console.log(`Passport Local Strategy-LOCAL SIGNUP`);
            console.log(`req.body: `, req.body);
            console.log(`email: ${email}`);
            console.log(`password: ${password}`);
            console.log('*************************');
            var generateHash = function(password) {
                return bCrypt.hashSync(password, 10);
           };
            User.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {
                console.log("did anything get into this function????")
                if (user)
                {
                    console.log("**********IF USER FAILED****")
                    return done(null, false, {
                        message: 'That email is already taken'
                    });
                } else
                {
                    console.log('**************I AM HERE*************')
                    var userPassword = generateHash(password);
                    console.log('password after hash: ', userPassword);
                    var data =
                        {
                            username: req.body.username,
                            email: email,
                            password: userPassword,
                        };
                    User.create(data).then(function(newUser, created) {
                        if (!newUser) {
                            return done(null, false);
                        }
                        if (newUser) {
                            req.session.save(() => {
                            req.session.logged_in = true;
                            req.session.sign_up = true;
                            req.session.user_id = newUser.id;
                            console.log('req.session.user_id: ',req.session.user_id);
                        });
                            console.log("The new user ID is: ", newUser.id);
                            req.session.user_id = newUser.id
                            console.log('****session user id: ******: ', req.session.user_id);
                            return done(null, newUser, req.session.user_id);
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
        function(req, email, password, done) {
            console.log('passport-local-signin');
            console.log('password: ', req.body.password);
            console.log('email: ', email);
            var User = user;
            var isValidPassword = function(userpass, password) {
                return bCrypt.compareSync(password, userpass);
            }
            User.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {
                if (!user) {
                    return done(null, false, {
                        message: 'Email does not exist'
                    });
                }
                console.log('****is valid password? **** :', isValidPassword(user.password, password));
                if (!isValidPassword(user.password, password)) {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
                var userinfo = user.get();
                if (user) {
                    req.session.save(() => {
                    req.session.logged_in = true;
                    req.session.sign_up = true;
                    req.session.user_id = user.id;
                    console.log('logged in - req.session.user_id: ',req.session.user_id);
                    })
                }
                return done(null, userinfo);
            }).catch(function(err) {
                console.log("Error:", err);
                return done(null, false, {
                    message: 'Something went wrong with your Signin'
                });
            });
        }
    ));
}