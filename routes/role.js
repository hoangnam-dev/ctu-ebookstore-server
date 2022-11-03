const express = require('express');
const router = express.Router();

// Import Controller
const {allRole, getRoleByID, hasPermission, search, store, update, givePermissionTo, revokePermissionTo, destroy, restore} = require('../app/controllers/RoleController');

router.get('/search', search);
router.post('/', store);
router.put('/:id', update);
router.get('/:id', getRoleByID);
router.post('/hasPermission', hasPermission);
router.post('/givePermission', givePermissionTo);
router.post('/revokePermission', revokePermissionTo);
router.delete('/:id', destroy);
router.put('/restore/:id', restore);
router.get('/', allRole);

module.exports = router;
