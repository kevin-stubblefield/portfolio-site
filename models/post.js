var moment = require('moment');
var showdown = require('showdown');
var converter = new showdown.Converter({ noHeaderId: true });

// var PostSchema = Schema({
//         title: { type: String, required: true },
//         markdownContent: { type: String, required: true },
//         htmlContent: { type: String, required: true }
//     }, {
//         timestamps: true
//     });

// PostSchema
//     .virtual('url')
//     .get(function () {
//         return 'blog/' + this._id;
//     });

// PostSchema
//     .virtual('createdAtString')
//     .get(function () {
//         return moment(this.createdAt).utcOffset('-0600').format('dddd, MMM Do, YYYY');
//     });

// PostSchema.pre('validate', function (next) {
//     this.htmlContent = converter.makeHtml(JSON.parse(this.markdownContent));
//     next();
// });

var bookshelf = require('../bookshelf.js');

var Post = bookshelf.Model.extend({
    tableName: 'posts',

    initialize: function() {
        this.on('saving', function(model, attrs, options) {
            this.set('htmlContent', converter.makeHtml(this.get('markdownContent')));
        });
    },
});

module.exports = Post;