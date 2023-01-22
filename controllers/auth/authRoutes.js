const router = require('express').Router();
const passport = require('passport');
const { logRouteInfo } = require('../../utils/auth');

console.log(logRouteInfo);
// Endpoint /auth

router.post('/register',
    logRouteInfo,
    passport.authenticate("local-signup", {
        successRedirect: "/profile",
        failureRedirect: "/login",
    }),  
);

router.post(
    "/login",
    logRouteInfo,
    passport.authenticate("local-signin", {
      successRedirect: "/dashboard",
      failureRedirect: "/login",
    })
  );

router.get('/facebook', logRouteInfo,
  passport.authenticate('facebook'));

router.get('/facebook/callback', logRouteInfo,
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log('login successful')
    res.redirect('/dashboard');
  });

module.exports = router;