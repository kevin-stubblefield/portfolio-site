var Model = require('../dbConfig').Model;
var _ = require('lodash');

const snakeCase = _.memoize(_.snakeCase);
const camelCase = _.memoize(_.camelCase);

class Payment extends Model {
    static get tableName() {
        return 'payments';
    }

    static get relationMappings() {
        return {
            paidBy: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/../user',
                join: {
                    from: 'payments.paid_by',
                    to: 'users.id'
                }
            },

            paidTo: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/../user',
                join: {
                    from: 'payments.paid_to',
                    to: 'users.id'
                }
            },

            bill: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/bill',
                join: {
                    from: 'payments.bill_id',
                    to: 'bills.id'
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

module.exports = Payment;