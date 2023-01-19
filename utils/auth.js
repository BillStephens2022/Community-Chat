// helper function to ensure user is logged in before allowing them to do certain tasks

const withAuth = (req, res, next) => {
    // If the user is not logged in, redirect the request to the login route
    if (!req.isAuthenticated()) {
      res.redirect('/login');
    } else {
      next();
    }
  };
  
  module.exports = withAuth;