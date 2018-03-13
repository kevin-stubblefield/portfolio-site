var bcrypt = require('bcrypt');

// var UserSchema = Schema({
//     username: { type: String, required: true, unique: true, lowercase: true, trim: true },
//     salt: { type: String, required: true },
//     hashedPassword: { type: String, required: true }
// });

// UserSchema
//     .virtual('password')
//     .set(function (value) {
//         var salt = bcrypt.genSaltSync(10);
//         var hashedPassword = bcrypt.hashSync(value, salt);

//         this.salt = salt;
//         this.hashedPassword = hashedPassword;
//     });

// var bookshelf = require('../bookshelf.js');

// var User = bookshelf.Model.extend({
//     tableName: 'users',

//     initialize: function () {
//         this.on('saving', function (model, attrs, options) {
//             var hashedPassword = bcrypt.hashSync(model.attributes.password, 12);
//             this.set('password', hashedPassword);
//         });
//     },

// });

var Model = require('../dbConfig').Model;
var _ = require('lodash');

const snakeCase = _.memoize(_.snakeCase);
const camelCase = _.memoize(_.camelCase);

class User extends Model {
    static get tableName() {
        return 'users';
    }

    static get relationMappings() {
        return {
            bills: {
                relation: Model.HasManyRelation,
                modelClass: __dirname + '/ledger/bill',
                join: {
                    from: 'users.id',
                    to: 'bills.user_id'
                }
            },

            receivedPayments: {
                relation: Model.HasManyRelation,
                modelClass: __dirname + '/ledger/payment',
                join: {
                    from: 'users.id',
                    to: 'payments.paid_to'
                }
            },

            sentPayments: {
                relation: Model.hasManyRelation,
                modelClass: __dirname + '/ledger/payment',
                join: {
                    from: 'users.id',
                    to: 'payments.paid_by'
                }
            }
        }
    }

    $beforeInsert() {
        this.password = bcrypt.hashSync(this.password, 12);
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

module.exports = User;