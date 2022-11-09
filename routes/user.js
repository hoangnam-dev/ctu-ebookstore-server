const express = require('express');
const router = express.Router();

// Import Controller
const {allUser, checkUserNameIsset, getUserByID, search, store, update, destroy, restore} = require('../app/controllers/UserController');

router.get('/checkUsername/:userUsername', checkUserNameIsset);
router.get('/search', search);
router.get('/:id', getUserByID);
router.post('/', store);
router.put('/:id', update);
router.delete('/:id', destroy);
router.put('/restore/:id', restore);
router.get('/', allUser);

module.exports = router;
