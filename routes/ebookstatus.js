const express = require('express');
const router = express.Router();

// Import Controller
const {allEbookStatus, getEbookStatusByID, store, search,update, destroy, restore} = require('../app/controllers/EbookStatusController');

router.get('/search', search);
router.post('/', store);
router.get('/:id', getEbookStatusByID);
router.put('/:id', update);
router.delete('/:id', destroy);
router.put('/restore/:id', restore);
router.get('/', allEbookStatus);

module.exports = router;
