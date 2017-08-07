var express = require('express');
var router = express.Router();
var Post = require('../models/post.js');
var Message = require('../models/message.js');
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

router.get('/', function (req, res) {
    Post
        .forge()
        .orderBy('created_at', 'DESC')
        .fetchAll()
        .then(function (posts) {
            posts = posts.toJSON();
            res.render('blog', {
                title: 'My Blog',
                posts: posts
            });
        }).catch(function (error) {
            console.error('Unable to connect to db', error);
            res.sendStatus(500);
        });
});

router.get('/createPost', requireAuth, function (req, res) {
    res.render('createPost', {
        title: 'Write New Post'
    });
});

router.get('/:id', function (req, res) {
    var id = req.params.id;

    Post
        .forge({ 'id': id })
        .fetch({ withRelated: ['messages'] })
        .then(function (post) {
            post = post.toJSON();
            post.messages.reverse();
                    
            res.render('blogPost', {
                title: post.title,
                post: post
            });

        }).catch(function (error) {
            console.error('Unable to fetch post', error);
            res.render('error', {
                title: '404',
                errorCode: 404,
                errorMessage: 'Post not found'
            });
        });
});

router.post('/', requireAuth, function (req, res) {
    var body = _.pick(req.body, 'title', 'markdownContent', 'fromBrowser');

    if (body.markdownContent.trim() === '') {
        return res.status(400).send();
    }

    var fromBrowser = body.fromBrowser;

    var newPost = new Post(_.pick(body, 'title', 'markdownContent'));

    newPost
        .save()
        .then(function (model) {
        }).catch(function (error) {
            console.error('Could not save new post', error);
        });

    if (fromBrowser === 'true') {
        res.redirect('/blog');
    } else {
        res.sendStatus(200);
    }
});

router.post('/:id', function (req, res) {
    var body = _.pick(req.body, 'name', 'content', 'postId');

    if (body.content.trim() === '') {
        return res.redirect('/blog/' + body.postId);
    }

    var newMessage = new Message(body);

    console.log(newMessage);

    newMessage.save();

    res.redirect('/blog/' + body.postId);
});

module.exports = router;