const express = require('express');
const router = express.Router();

// Import Controller
const {allPermission, getPermissionByID, store, update, destroy} = require('../app/controllers/PermissionController');

router.get('/', allPermission);
router.post('/', store);
router.get('/:id', getPermissionByID);
router.put('/:id', update);
router.delete('/:id', destroy);

module.exports = router;
