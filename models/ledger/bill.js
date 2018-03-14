var Model = require('../../dbConfig').Model;
var _ = require('lodash');

const snakeCase = _.memoize(_.snakeCase);
const camelCase = _.memoize(_.camelCase);

class Bill extends Model {
    static get tableName() {
        return 'bills';
    }

    static get relationMappings() {
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/../user',
                join: {
                    from: 'bills.user_id',
                    to: 'users.id'
                }
            },

            payments: {
                relation: Model.HasManyRelation,
                modelClass: __dirname + '/payment',
                join: {
                    from: 'bills.id',
                    to: 'payments.bill_id'
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

module.exports = Bill;