const express = require('express');
const router = express.Router();

// Import Controller
const {allUserStatus, getUserStatusByID, store, search,update, destroy, restore} = require('../app/controllers/UserStatusController');

router.get('/search', search);
router.post('/', store);
router.get('/:id', getUserStatusByID);
router.put('/:id', update);
router.delete('/:id', destroy);
router.put('/restore/:id', restore);
router.get('/', allUserStatus);

module.exports = router;
