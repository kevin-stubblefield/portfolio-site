var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var User = require('../models/user.js');
var _ = require('underscore');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

router.use(bodyParser.json());

router.post('/authenticate', function (req, res) {
    var body = _.pick(req.body, 'username', 'password');

    User.findOne({
        username: req.body.username
    }, function (error, user) {
        if (error) throw error;

        if (!user || !bcrypt.compareSync(body.password, user.hashedPassword)) {
            return res.status(400).send();
        }

        var token = jwt.sign(user, process.env.TOKEN_SECRET, {
            expiresIn: "7d"
        });

        res.json({
            success: true,
            token: token
        });
    });
});

router.post('/signup', function (req, res) {
    var body = _.pick(req.body, 'username', 'password');

    if (body.hasOwnProperty('password') && (body.password.length < 8 || body.password.length > 99)) {
        return res.status(400).send();
    }

    var newUser = new User(body);
    newUser.save(function (error) {
        if (error) {
            console.error('Could not sign up user', error);
            return res.status(500).send();
        }
    });
});

module.exports = router;