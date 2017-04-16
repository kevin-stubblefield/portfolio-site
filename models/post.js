var moment = require('moment');
var showdown = require('showdown');
var converter = new showdown.Converter({ noHeaderId: true });
var mongoose = require('mongoose');
mongoose.Promise = Promise;

var Schema = mongoose.Schema;

var PostSchema = Schema({
        title: { type: String, required: true },
        markdownContent: { type: String, required: true },
        htmlContent: { type: String, required: true }
    }, {
        timestamps: true
    });

PostSchema
    .virtual('url')
    .get(function () {
        return '/blog/' + this._id;
    });

PostSchema
    .virtual('createdAtString')
    .get(function () {
        return moment(this.createdAt).format('dddd, MMM Do, YYYY');
    });

PostSchema.pre('validate', function (next) {
    this.htmlContent = converter.makeHtml(JSON.parse(this.markdownContent));
    console.log(this.htmlContent);
    next();
});

module.exports = mongoose.model('Post', PostSchema);