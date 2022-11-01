const express = require('express');
const router = express.Router();

// Import Controller
const {allSupplier, getSupplierByID, store, search,update, destroy, restore} = require('../app/controllers/SupplierController');

router.get('/search', search);
router.post('/', store);
router.get('/:id', getSupplierByID);
router.put('/:id', update);
router.delete('/:id', destroy);
router.put('/restore/:id', restore);
router.get('/', allSupplier);

module.exports = router;
