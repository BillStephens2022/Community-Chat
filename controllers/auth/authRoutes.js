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

module.exports = router;