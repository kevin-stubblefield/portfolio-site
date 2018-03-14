let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let db = require('../db');
let utils = require('../utils');
let _ = require('lodash');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/', utils.requireAuth(0), async function(req, res) {
    let bills = await db.getBills(req.user.id);

    res.render('bills/home', {
        title: _.capitalize(req.user.username) + '\'s Bills',
        bills: bills
    });
});

module.exports = router;