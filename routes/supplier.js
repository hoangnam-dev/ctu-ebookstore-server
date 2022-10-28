const express = require('express');
const router = express.Router();

// Import Controller
const {allSupplier, getSupplierByID, store, update} = require('../app/controllers/SupplierController');

router.get('/', allSupplier);
router.post('/', store);
router.get('/:id', getSupplierByID);
router.put('/:id', update);
// router.delete('/:id', destroy);

module.exports = router;
