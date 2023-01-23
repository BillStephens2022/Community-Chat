const router = require('express').Router();
const { User } = require('../../models');
const { logRouteInfo } = require('../../utils/auth');
  
  // logs the user out and destroys their log in session
  router.post('/logout', logRouteInfo, (req, res) => {
    if (req.user) {
      req.session.destroy(() => {
        req.user = null;
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
  });

  module.exports = router;