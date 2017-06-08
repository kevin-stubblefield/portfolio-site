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

var bookshelf = require('../bookshelf.js');

var User = bookshelf.Model.extend({
    tableName: 'users',

    initialize: function () {
        this.on('saving', function (model, attrs, options) {
            var hashedPassword = bcrypt.hashSync(model.attributes.password, 12);
            this.set('password', hashedPassword);
        });
    },

});

module.exports = User;