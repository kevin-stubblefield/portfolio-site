var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('index', {
        title: "Kevin Stubblefield"
    });
});

router.get('/about', function (req, res) {
    res.render('about', {
        title: "About Me!"
    });
});

module.exports = router;