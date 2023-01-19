const authController = require("../authController/authController.js");
const withAuth = require('../utils/auth');

module.exports = function (app, passport) {
  console.log("*************************");
  console.log(`passport`);
  console.log("*************************");
  app.get("/register", authController.register);
  app.get("/login", authController.login);
  app.post(
    "/register",
    (req, res, next) => {
      console.log(`${req.method} /registration middleware`);
      next();
    },
    passport.authenticate("local-signup", {
      successRedirect: "/profile",
      failureRedirect: "/login",
    })
  );
  app.get("/dashboard", withAuth, authController.dashboard);
  app.get("/logout", authController.logout);
  app.post(
    "/login",
    (req, res, next) => {
      console.log(`${req.method} /login middleware`);
      next();
    },
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