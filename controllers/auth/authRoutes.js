const router = require('express').Router();
const passport = require('passport');
const { logRouteInfo } = require('../../utils/auth');

// Endpoint /auth

// Routing middleware function
function logRouteInfo(req, res, next) {
    console.log(`${req.method} ${req.url}`);
    next();
};

router.post('/register',
    logRouteInfo,
    passport.authenticate("local-signup", {
        successRedirect: "/profile",
        failureRedirect: "/login",
    })
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