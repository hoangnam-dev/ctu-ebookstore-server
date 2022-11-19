const express = require('express');
const router = express.Router();

// Import Controller
const {allDirectory, index, store, getDirectoryByID, search, update, destroy, restore} = require('../app/controllers/DirectoryController');

router.post('/', store);
router.get('/index', index);
router.get('/search', search);
router.get('/:id', getDirectoryByID);
router.put('/:id', update);
router.delete('/:id', destroy);
router.put('/restore/:id', restore);
router.get('/', allDirectory);

module.exports = router;
