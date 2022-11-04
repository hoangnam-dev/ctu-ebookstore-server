const express = require('express');
const router = express.Router();

// Import Controller
const {allCategory, store, getCategoryByID, getCategoryByDirectoryID, search, update, destroy, restore} = require('../app/controllers/CategoryController');

router.post('/', store);
router.post('/getByDirectory', getCategoryByDirectoryID);
router.get('/search', search);
router.get('/:id', getCategoryByID);
router.put('/:id', update);
router.delete('/:id', destroy);
router.put('/restore/:id', restore);
router.get('/', allCategory);

module.exports = router;
