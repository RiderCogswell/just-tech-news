const router = require('express').Router();

const apiRoutes = require('./api');

router.use('/api', apiRoutes);

// if we make a request to anhy endpoint that doesnt exist we get a 404
router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;