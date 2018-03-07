var express = require('express');
var router = express.Router();
var _ = require('lodash');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var db = require('../db');
var utils = require('../utils');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/', utils.getUser, async function (req, res) {
    var posts = await db.getPosts();

    posts.forEach((post) => {
        moment.locale();
        var formattedDate = moment(post.createdAt).format('MMM Do YYYY')
        post.formattedDate = formattedDate;
    });

    res.render('blog', {
        title: 'My Blog',
        posts: posts,
        user: req.user
    });
});

router.get('/createPost', utils.requireAuth(1), function (req, res) {
    res.render('createPost', {
        title: 'Write New Post'
    });
});

router.get('/editPost/:id', utils.requireAuth(1), async function(req, res) {
    var postId = req.params.id;
    var post = await db.getPostById(postId);

    res.render('editPost', {
        title: 'Edit Post',
        post: post
    });
});

router.get('/:url', utils.getUser, async function (req, res) {
    var url = req.params.url;
    var post = await db.getPostByUrl(url);

    post.messages.forEach((message) => {
        var formattedDate = moment(message.createdAt).format('MMM Do YYYY');
        message.formattedDate = formattedDate;
    });

    if (!post) {
        return res.status(404).render('error', {
            title: '404',
            errorCode: 404,
            errorMessage: 'Post not found'
        });
    }

    res.render('blogPost', {
        title: post.title,
        post: post,
        user: req.user
    });
});

router.post('/', utils.requireAuth(1), async function (req, res) {
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

router.post('/:id', utils.requireAuth(1), async function(req, res) {
    var body = _.pick(req.body, 'title', 'markdownContent');
    var postId = req.params.id;
    var post = await db.patchPost(postId, body);

    res.redirect('/blog/' + post.url);
});

router.post('/:id/messages', async function (req, res) {
    var body = _.pick(req.body, 'name', 'content', 'postId');

    if (body.content.trim() === '') {
        return res.redirect('/blog/' + req.body.url);
    }

    await db.createMessage(body);

    res.redirect('/blog/' + req.body.url);
});

module.exports = router;