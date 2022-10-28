const express = require('express');
const router = express.Router();

// Import Controller
const {allEbook, getEbookByID, store, update} = require('../app/controllers/EbookController');

router.get('/', allEbook);
router.post('/', store);
router.get('/:id', getEbookByID);
router.put('/:id', update);
// router.delete('/:id', destroy);

module.exports = router;
