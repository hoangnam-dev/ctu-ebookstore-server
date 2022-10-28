const express = require('express');
const router = express.Router();

// Import Controller
const {allComment, getCommentByID, store, update} = require('../app/controllers/CommentController');

router.get('/', allComment);
router.post('/', store);
router.get('/:id', getCommentByID);
router.put('/:id', update);
// router.delete('/:id', destroy);

module.exports = router;
