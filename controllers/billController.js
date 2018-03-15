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

    let otherBills = await db.getOtherUsersBills(req.user.id);

    let outstandingPayments = [];
    for (let i = 0; i < otherBills.length; i++) {
        let currentBill = otherBills[i];
        let amountPaid = 0;

        currentBill.user = _.pick(currentBill.user, 'id', 'username', 'displayName', 'role');

        for (let j = 0; j < currentBill.payments.length; j++) {
            let currentPayment = currentBill.payments[j];
            if (currentPayment.paidBy === req.user.id) {
                amountPaid += parseFloat(currentPayment.amount);
            }
        }

        let amountOwed = parseFloat(currentBill.amount) / 4 - amountPaid;
        if (amountOwed <= 0) continue;
        outstandingPayments.push({
            id: currentBill.payments.length + 1,
            billId: currentBill.id,
            paidTo: currentBill.user,
            paidBy: req.user.id,
            status: 'Unpaid',
            amount: amountOwed
        });
    }

    res.render('bills/home', {
        title: req.user.displayName + '\'s Bills',
        bills: bills,
        outstandingPayments: outstandingPayments
    });
});

router.post('/payments', utils.requireAuth(0), async function(req, res) {
    let body = req.body;
    let payment = await db.createPayment(body);
    res.json(payment);
});

router.patch('/payments/:paymentId', utils.requireAuth(0), async function(req, res) {
    let body = req.body;
    let updated = await db.patchPayment(req.params.paymentId, body);
    res.json(updated);
});

module.exports = router;