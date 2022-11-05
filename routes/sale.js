const express = require('express');
const router = express.Router();

// Import Controller
const {allSale, getSaleByID, store, update, destroy, search} = require('../app/controllers/SaleController');

router.get('/search', search);
router.get('/:id', getSaleByID);
router.get('/', allSale);
router.put('/:id', update);
router.post('/', store);
router.delete('/:id', destroy);

module.exports = router;
