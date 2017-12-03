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

// var bookshelf = require('../bookshelf.js');
// var Message = require('./message.js');

// var Post = bookshelf.Model.extend({
//     tableName: 'posts',
//     messages: function () {
//         return this.hasMany(Message);
//     },

//     initialize: function() {
//         this.on('saving', function(model, attrs, options) {
//             this.set('htmlContent', converter.makeHtml(this.get('markdownContent')));
//         });
//     },
// });

var Model = require('../dbConfig').Model;
var _ = require('lodash');

const snakeCase = _.memoize(_.snakeCase);
const camelCase = _.memoize(_.camelCase);

class Post extends Model {
    static get tableName() {
        return 'posts';
    }

    static get relationMappings() {
        return {
            messages: {
                relation: Model.HasManyRelation,
                modelClass: __dirname + '/message',
                join: {
                    from: 'posts.id',
                    to: 'messages.post_id'
                }
            }
        }
    }

    $beforeInsert() {
        this.htmlContent = converter.makeHtml(this.markdownContent);
        this.url = this.title.replace(/\s+/g, '-').toLowerCase();
    }

    $beforeUpdate() {
        this.htmlContent = converter.makeHtml(this.markdownContent);
    }
    
    $formatDatabaseJson(json) {
        json = super.$formatDatabaseJson(json);

        return _.mapKeys(json, (value, key) => {
            return snakeCase(key);
        });
    }

    $parseDatabaseJson(json) {
        json = _.mapKeys(json, (value, key) => {
            return camelCase(key);
        });

        return super.$parseDatabaseJson(json);
    }
}

module.exports = Post;