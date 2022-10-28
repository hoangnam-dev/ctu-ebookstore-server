const express = require('express');
const router = express.Router();

// Import Controller
const {allPayment, getPaymentByID, store, update} = require('../app/controllers/PaymentController');

router.get('/', allPayment);
router.post('/', store);
router.get('/:id', getPaymentByID);
router.put('/:id', update);
// router.delete('/:id', destroy);

module.exports = router;
