const express = require('express');
const router = express.Router();

// Import Controller
const {allAuthor, getAuthorByID, store, update, destroy} = require('../app/controllers/AuthorController');

router.get('/', allAuthor);
router.post('/', store);
router.get('/:id', getAuthorByID);
router.put('/:id', update);
router.delete('/:id', destroy);

module.exports = router;
