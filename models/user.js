var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = Promise;

var UserSchema = Schema({
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    salt: { type: String, required: true },
    hashedPassword: { type: String, required: true }
});

UserSchema
    .virtual('password')
    .set(function (value) {
        var salt = bcrypt.genSaltSync(10);
        var hashedPassword = bcrypt.hashSync(value, salt);

        this.salt = salt;
        this.hashedPassword = hashedPassword;
    });

module.exports = mongoose.model('User', UserSchema);