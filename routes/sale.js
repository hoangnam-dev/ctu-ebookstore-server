const express = require('express');
const router = express.Router();

// Import Controller
const {allSale, getSaleByID, store, update} = require('../app/controllers/SaleController');

router.get('/', allSale);
router.post('/', store);
router.get('/:id', getSaleByID);
router.put('/:id', update);
// router.delete('/:id', destroy);

module.exports = router;
