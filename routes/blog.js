var express = require('express');
var router = express.Router();
var Post = require('../models/post.js');
var _ = require('underscore');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

router.use(bodyParser.json());

router.get('/', function (req, res) {
    Post.find(function (error, posts) {
        if (error) {
            console.error('Could not find posts', error);
        } else {
            res.render('blog', {
                title: 'My Blog',
                posts: posts
            });
        }
    });
});


router.get('/:id', function (req, res) {

});

router.use(function (req, res, next) {
    var body = _.pick(req.body, 'token');

    var token = body.token;

    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, function (error, decoded) {
            if (error) {
                return res.status(400).json({ success: false, message: 'Could not authenticate token' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else{
        return res.status(403).send();
    }
});

router.post('/', function (req, res) {
    var body = _.pick(req.body, 'title', 'markdownContent');

    if (body.markdownContent.trim() === '') {
        return res.status(400).send();
    }

    body.markdownContent = JSON.stringify(body.markdownContent);

    var newPost = new Post(body);
    newPost.save(function (error) {
        if (error) {
            console.error('Could not save new post', error);
        }
    });

    res.sendStatus(200);
});

module.exports = router;