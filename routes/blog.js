var express = require('express');
var router = express.Router();
var Post = require('../models/post.js');
var _ = require('underscore');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

requireAuth = function (req, res, next) {
    var body = _.pick(req.body, 'token');

    var token = body.token || req.query.token || req.cookies.token;

    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, function (error, decoded) {
            if (error) {
                return res.status(403).render('403', { title: '403 Access Denied' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).render('403', { title: '403 Access Denied' });
    }
};

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

router.get('/createPost', requireAuth, function (req, res) {
    res.render('createPost', {
        title: 'Write New Post'
    });
});

router.get('/:id', function (req, res) {
    var id = req.params.id;

    Post.findById(id, function (error, post) {
        if (error) {
            console.error('Could not find specified post', error);
        } else {
            res.render('blogPost', {
                title: post.title,
                post: post
            });
        }
    });
});

router.post('/', requireAuth, function (req, res) {
    var body = _.pick(req.body, 'title', 'markdownContent', 'fromBrowser');

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

    if (body.fromBrowser === 'true') {
        res.redirect('/blog');
    } else {
        res.sendStatus(200);
    }
});

module.exports = router;