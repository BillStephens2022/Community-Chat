const authController = require("../authController/authController.js");
const withAuth = require('../utils/auth');

module.exports = function (app, passport) {
  console.log("*************************");
  console.log(`passport`);
  console.log("*************************");

  function routingLog(req, res, next) {
    console.log(`From authRoutes code: ${req.method} endpoint ${req.url}`);
    next();
  }

  app.get("/register", routingLog, authController.register);
  app.get("/login", routingLog, authController.login);
  app.post(
    "/register",
    routingLog,
    // (req, res, next) => {
    //   console.log(`${req.method} /registration middleware`);
    //   next();
    // },
    passport.authenticate("local-signup", {
      successRedirect: "/profile",
      failureRedirect: "/login",
    })
  );
  app.get("/dashboard", routingLog, withAuth, authController.dashboard);
  app.get("/logout", routingLog, authController.logout);
  app.post(
    "/login",
    routingLog,
    // (req, res, next) => {
    //   console.log(`${req.method} /login middleware`);
    //   next();
    // },
    passport.authenticate("local-signin", {
      successRedirect: "/dashboard",
      failureRedirect: "/login",
    })
  );
  // function isLoggedIn(req, res, next) {
  //   if (req.isAuthenticated()) return next();
  //   res.redirect("/login");
  // }
};