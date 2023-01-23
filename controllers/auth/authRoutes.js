const router = require('express').Router();
const passport = require('passport');
const { logRouteInfo } = require('../../utils/auth');

console.log(logRouteInfo);
// Endpoint /auth

router.post('/register',
    logRouteInfo,
    passport.authenticate("local-signup", {
        successRedirect: "/profile",        
    })
);

router.post(
    "/login",
    logRouteInfo,
    passport.authenticate("local-signin", {
      successRedirect: "/dashboard",
      failureRedirect: "/login",      
      failureMessage: true
    }),
    passport.authenticate('local', { failureFlash: 'Invalid username or password.' })
  );

module.exports = router;