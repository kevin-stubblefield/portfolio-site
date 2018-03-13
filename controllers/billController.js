let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let db = require('../db');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/', requireAuth(0), async function(req, res) {
    let bills = await db.getBills(req.user.id);
    res.json(bills);
});