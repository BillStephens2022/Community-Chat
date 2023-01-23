// helper function to ensure user is logged in before allowing them to do certain tasks
module.exports = {

withAuth: (req, res, next) => {
    // If the user is not logged in, redirect the request to the login route
    console.log('withAuth executed');
    if (!req.user) {
      res.redirect('/login');
    } else {
      next();
    }
  },

// Routing middleware function
logRouteInfo: (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
}
  
}
