const router = require('express').Router();
const passport = require('passport');
const { logRouteInfo } = require('../../utils/auth');

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
      failureMessage: true
    }, (err, user, options) => {
      let failureMsg = options.message;
      console.log("*****failure message: ", failureMsg);
    })
  );

module.exports = router;