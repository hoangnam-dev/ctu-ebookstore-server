const express = require('express');
const router = express.Router();

// Import Controller
const {allUser, getUserByID, store, update, destroy} = require('../app/controllers/UserController');

router.get('/', allUser);
router.post('/', store);
router.get('/:id', getUserByID);
router.put('/:id', update);
router.delete('/:id', destroy);

module.exports = router;
