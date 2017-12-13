var Model = require('../../dbConfig').Model;
var _ = require('lodash');

const snakeCase = _.memoize(_.snakeCase);
const camelCase = _.memoize(_.camelCase);

class Task extends Model {
    static get tableName() {
        return 'tasks';
    }

    static get relationMappings() {
        return {
            project: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/project',
                join: {
                    from: 'tasks.project_id',
                    to: 'projects.id'
                }
            }
        }
    }

    static get namedFilters() {
        return {
            orderByCreatedAt: function(builder) {
                builder.orderBy('created_at');
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

module.exports = Task;