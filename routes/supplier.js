const express = require('express');
const router = express.Router();

// Import Controller
const {allSupplier, getSupplierByID, store, search,update, destroy, restore} = require('../app/controllers/SupplierController');

// Middlewares
const jwtMiddlewares = require('../app/middlewares/jwt');

router.get('/search', search);
router.post('/', jwtMiddlewares.managerSupplier, store);
router.get('/:id', getSupplierByID);
router.put('/:id', jwtMiddlewares.managerSupplier, update);
router.delete('/:id', jwtMiddlewares.managerSupplier, destroy);
router.put('/restore/:id', jwtMiddlewares.managerSupplier, restore);
router.get('/', allSupplier);

module.exports = router;
