const express = require('express');
const router = express.Router();

// Import Controller
const {index, search} = require('../app/controllers/CartController');

router.get('/search', search);
// router.delete('/:id', destroy);
router.get('/', index);

module.exports = router;
