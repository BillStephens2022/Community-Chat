// helper function to ensure user is logged in before allowing them to do certain tasks

const withAuth = (req, res, next) => {
    // If the user is not logged in, redirect the request to the login route
    if (!req.session.logged_in) {
      res.redirect('/login');
    } else {
      next();
    }
  };

// Routing middleware function
const logRouteInfo = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};
  
module.exports = withAuth;