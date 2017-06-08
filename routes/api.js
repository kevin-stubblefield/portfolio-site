var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var User = require('../models/user.js');
var _ = require('underscore');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

router.post('/authenticate', function (req, res) {
    var body = _.pick(req.body, 'username', 'password', 'fromBrowser');

    new User({ 'username': body.username })
        .fetch()
        .then(function (user) {
            user = user.toJSON();
            if (!user || !bcrypt.compareSync(body.password, user.password)) {
                return res.status(400).render('400', { title: '400 Bad Request' });
            }

            var token = jwt.sign(user, process.env.TOKEN_SECRET, {
                expiresIn: "7d"
            });

            if (body.fromBrowser === "true") {
                res.cookie('token', token, {
                    expire: new Date() + 86400000
                }).redirect('/blog/createPost');
                //res.redirect('/blog/createPost?token=' + token);
            } else {
                res.json({
                    success: true,
                    token: token
                });
            }
        })
        .catch(function (error) {
            console.error('Unable to find user', error);
        });
});

router.post('/signup', function (req, res) {
    var body = _.pick(req.body, 'username', 'password');

    if (body.hasOwnProperty('password') && (body.password.length < 8 || body.password.length > 99)) {
        return res.status(400).render('400', { title: '400 Bad Request' });
    }

    var newUser = new User(body);

    newUser
        .save()
        .then(function (user) {
            return res.redirect('/');
        })
        .catch(function (error) {
            console.error('Could not sign up user', error);
            return res.status(500).send();
        });

    return res.status(404).render('404', { title: '404 File Not Found' });
});

router.get('/login', function (req, res) {
    res.render('login', {
        title: 'Log In'
    });
});

module.exports = router;