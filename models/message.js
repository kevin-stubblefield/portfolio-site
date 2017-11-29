// var bookshelf = require('../bookshelf.js');
// var Post = require('./post.js');

// var Message = bookshelf.Model.extend({
//     tableName: 'messages',
//     post: function () {
//         return this.belongsTo(Post);
//     }
// });

var Model = require('../dbConfig').Model;
var _ = require('lodash');

const snakeCase = _.memoize(_.snakeCase);
const camelCase = _.memoize(_.camelCase);

class Message extends Model {
    static get tableName() {
        return 'messages';
    }

    static get relationMappings() {
        return {
            posts: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/post',
                join: {
                    from: 'messages.post_id',
                    to: 'posts.id'
                }
            }
        }
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

module.exports = Message;