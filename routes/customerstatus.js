const express = require('express');
const router = express.Router();

// Import Controller
const {allCustomerStatus, getCustomerStatusByID, store, search,update, destroy, restore} = require('../app/controllers/CustomerStatusController');

router.get('/search', search);
router.post('/', store);
router.get('/:id', getCustomerStatusByID);
router.put('/:id', update);
router.delete('/:id', destroy);
router.put('/restore/:id', restore);
router.get('/', allCustomerStatus);

module.exports = router;
