const express = require('express');
const router = express.Router();

// Import Controller
const {allOrder, getOrderByID, store, update} = require('../app/controllers/OrderController');

router.get('/', allOrder);
router.post('/', store);
router.get('/:id', getOrderByID);
router.put('/:id', update);
// router.delete('/:id', destroy);

module.exports = router;
