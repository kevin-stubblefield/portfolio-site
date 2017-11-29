var express = require('express');
var router = express.Router();
var Post = require('../models/post.js');
var Message = require('../models/message.js');
var _ = require('lodash');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var db = require('../db');

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
                return res.status(403).render('error', {
                    title: '403',
                    errorCode: 403,
                    errorMessage: 'Access Denied'
                });
            } else {
                req.user = decoded;
                next();
            }
        });
    } else {
        return res.status(403).render('error', {
            title: '403',
            errorCode: 403,
            errorMessage: 'Access Denied'
        });
    }
};

router.get('/', async function (req, res) {
    var posts = await db.getPosts();
    res.render('blog', {
        title: 'My Blog',
        posts: posts
    });
});

router.get('/createPost', requireAuth, function (req, res) {
    res.render('createPost', {
        title: 'Write New Post'
    });
});

router.get('/:id', async function (req, res) {
    var id = req.params.id;
    var post = await db.getPostById(id);

    if (!post) {
        return res.status(404).render('error', {
            title: '404',
            errorCode: 404,
            errorMessage: 'Post not found'
        });
    }

    res.render('blogPost', {
        title: post.title,
        post: post
    });
});

router.post('/', requireAuth, async function (req, res) {
    var body = _.pick(req.body, 'title', 'markdownContent', 'fromBrowser');

    if (body.markdownContent.trim() === '') {
        return res.status(400).send();
    }

    var fromBrowser = body.fromBrowser;

    var newPost = _.pick(body, 'title', 'markdownContent');

    await db.createPost(newPost);

    if (fromBrowser === 'true') {
        res.redirect('/blog');
    } else {
        res.sendStatus(200);
    }
});

router.post('/:id', async function (req, res) {
    var body = _.pick(req.body, 'name', 'content', 'postId');

    if (body.content.trim() === '') {
        return res.redirect('/blog/' + body.postId);
    }

    await db.createMessage(body);

    res.redirect('/blog/' + body.postId);
});

module.exports = router;