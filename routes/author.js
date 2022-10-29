const express = require('express');
const router = express.Router();

// Import Controller
const {allAuthor, getAuthorByID, search, store, update} = require('../app/controllers/AuthorController');

router.get('/search', search);
router.get('/:id', getAuthorByID);
router.put('/:id', update);
router.post('/', store);
router.get('/', allAuthor);
// router.delete('/:id', destroy);

module.exports = router;
