const router = require('express').Router();
const authRoutes = require('./authRoutes');

router.use('/', authRoutes);

module.exports = router;