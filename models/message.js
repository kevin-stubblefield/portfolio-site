var bookshelf = require('../bookshelf.js');
var Post = require('./post.js');

var Message = bookshelf.Model.extend({
    tableName: 'messages',
    post: function () {
        return this.belongsTo(Post);
    }
});

module.exports = Message;