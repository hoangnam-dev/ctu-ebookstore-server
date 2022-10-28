const express = require('express');
const router = express.Router();

// Import Controller
const {allCustomer, getCustomerByID, store, update} = require('../app/controllers/CustomerController');

router.get('/', allCustomer);
router.post('/', store);
router.get('/:id', getCustomerByID);
router.put('/:id', update);
// router.delete('/:id', destroy);

module.exports = router;
