var express = require('express');
var router = express.Router();
var path = require('path');

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

router.get('/hot-cold', function (req, res) {
    res.sendFile(path.resolve('public/files/app-debug.apk'));
});

module.exports = router;