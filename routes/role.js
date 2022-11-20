const express = require('express');
const router = express.Router();

// Import Controller
const {allRole, getRoleByID, hasPermission, search, store, update, givePermissionTo, revokePermissionTo, destroy, restore} = require('../app/controllers/RoleController');

// Middlewares
const jwtMiddlewares = require('../app/middlewares/jwt');

router.get('/search', search);
router.get('/:id', getRoleByID);
router.post('/', jwtMiddlewares.managerRolePermission, store);
router.put('/:id', jwtMiddlewares.managerRolePermission, update);
router.post('/hasPermission', jwtMiddlewares.managerRolePermission, hasPermission);
router.post('/givePermission', jwtMiddlewares.managerRolePermission, givePermissionTo);
router.post('/revokePermission', jwtMiddlewares.managerRolePermission, revokePermissionTo);
router.delete('/:id', jwtMiddlewares.managerRolePermission, destroy);
router.put('/restore/:id', jwtMiddlewares.managerRolePermission, restore);
router.get('/', allRole);

module.exports = router;
