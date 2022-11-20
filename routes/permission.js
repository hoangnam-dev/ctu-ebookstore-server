const express = require('express');
const router = express.Router();

// Import Controller
const {allPermission, getPermissionByID, store, search, update, destroy} = require('../app/controllers/PermissionController');

// Middlewares
const jwtMiddlewares = require('../app/middlewares/jwt');

router.get('/search', search);
router.get('/:id', getPermissionByID);
router.post('/', jwtMiddlewares.managerRolePermission, store);
router.put('/:id', jwtMiddlewares.managerRolePermission, update);
router.delete('/:id', jwtMiddlewares.managerRolePermission, destroy);
router.get('/', allPermission);

module.exports = router;
