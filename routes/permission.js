const express = require('express');
const router = express.Router();

// Import Controller
const {allPermission, getPermissionByID, store, search, update, destroy} = require('../app/controllers/PermissionController');

router.get('/search', search);
router.post('/', store);
router.get('/:id', getPermissionByID);
router.put('/:id', update);
router.delete('/:id', destroy);
router.get('/', allPermission);

module.exports = router;
