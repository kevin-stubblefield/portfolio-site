var User = require('./models/user');
var Post = require('./models/post');
var Message = require('./models/message');

module.exports = {
    createUser: function(user) {
        return User.query().insert(user);
    },

    getUsers: function() {
        return User.query();
    },

    getUserByUsername: function(username) {
        return User.query().findOne('username', username);
    },

    createPost: function(post) {
        return Post.query().insert(post);
    },

    getPosts: function() {
        return Post.query().eager('messages');
    },

    getPostById: function(postId) {
        return Post.query().findOne('id', postId).eager('messages');
    },

    createMessage: function(message) {
        return Message.query().insert(message);
    },

    getMessagesForPost: function(postId) {
        return Message.query().where('post_id', postId);
    }
}