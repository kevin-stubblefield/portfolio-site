var express = require('express');
var router = express.Router();
var Post = require('../models/post.js');
var _ = require('underscore');
var bodyParser = require('body-parser');

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

router.post('/', function (req, res) {
    var body = _.pick(req.body, 'title', 'markdownContent');
    console.log(body);

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

    res.status(200).send();
});

router.get('/:id', function (req, res) {

});

module.exports = router;