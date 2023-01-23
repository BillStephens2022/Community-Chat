const router = require('express').Router();
const passport = require('passport');
const { logRouteInfo } = require('../../utils/auth');
// const csrf = require('csurf');

// router.locals.pluralize = require('pluralize');

// router.use(csrf());

// router.use(function(req, res, next) {
//   var msgs = req.session.messages || [];
//   res.locals.messages = msgs;
//   res.locals.hasMessages = !! msgs.length;
//   req.session.messages = [];
//   console.log(req.session.messages);
//   next();
// });

// router.use(function(req, res, next) {
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });

// router.use(function(req, res, next) {
//   next(createError(404));
// });


// // error handler
// router.use(function(err, req, res, next) {
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//   res.status(err.status || 500);
//   res.render('login');
// })

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
    }, (err, user, options) => {
      let failureMsg = options.message;
      console.log(failureMsg);
    })
  );

  

module.exports = router;