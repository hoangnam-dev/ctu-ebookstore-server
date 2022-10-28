const express = require('express');
const router = express.Router();

// Import Controller
const {allPaymentType, getPaymentTypeByID, store, update} = require('../app/controllers/PaymentTypeController');

router.get('/', allPaymentType);
router.post('/', store);
router.get('/:id', getPaymentTypeByID);
router.put('/:id', update);
// router.delete('/:id', destroy);

module.exports = router;
