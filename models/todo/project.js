var Model = require('../../dbConfig').Model;
var _ = require('lodash');

const snakeCase = _.memoize(_.snakeCase);
const camelCase = _.memoize(_.camelCase);

class Project extends Model {
    static get tableName() {
        return 'projects';
    }

    static get relationMappings() {
        return {
            tasks: {
                relation: Model.HasManyRelation,
                modelClass: __dirname + '/task',
                join: {
                    from: 'projects.id',
                    to: 'tasks.project_id'
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

module.exports = Project;