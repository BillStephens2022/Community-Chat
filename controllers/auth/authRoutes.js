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
      failureFlash: true,
      failureMessage:true,
      failureMessage: 'Invalid username or password.1',
      failureFlash: 'Invalid username or password.2',
    }),
    passport.authenticate('local', { failureFlash: 'Invalid username or  password.3' })
  );

module.exports = router;