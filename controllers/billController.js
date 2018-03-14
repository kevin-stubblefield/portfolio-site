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

    let outstandingPayments = await db.getOutstandingPayments(req.user.id);

    for (let payment in outstandingPayments) {
        let currentPayment = outstandingPayments[payment];
        let paidBy = currentPayment.paidBy;
        let paidTo = currentPayment.paidTo;
        currentPayment.paidBy = _.pick(paidBy, 'id', 'username', 'displayName', 'role');
        currentPayment.paidTo = _.pick(paidTo, 'id', 'username', 'displayName', 'role');
    }

    res.render('bills/home', {
        title: req.user.displayName + '\'s Bills',
        bills: bills,
        outstandingPayments: outstandingPayments
    });
});

module.exports = router;