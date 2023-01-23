const router = require('express').Router();
const authRoutes = require('./authRoutes.js');

router.use('/', authRoutes);

module.exports = router;