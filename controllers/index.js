const router = require('express').Router();
const passport = require('passport');
const { logRouteInfo } = require('../utils/auth');

const authRoutes = require('./auth');
const apiRoutes = require('./api');
const htmlRoutes = require('./html');

router.use('/auth', authRoutes);
router.use('/api', apiRoutes);
router.use('/', htmlRoutes);

router.get('/oauth2/redirect/facebook', logRouteInfo, passport.authenticate('facebook', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  }));

module.exports = router;
