const router = require('express').Router();

const authRoutes = require('./auth');
const apiRoutes = require('./api');
const htmlRoutes = require('./html');

router.use('/auth', authRoutes);
router.use('/api', apiRoutes);
router.use('/', htmlRoutes);

module.exports = router;
