const express = require('express');
const router = express.Router();

// Import Controller
const {allSale, getSaleByID, store, update, destroy, search} = require('../app/controllers/SaleController');

// Middlewares
const jwtMiddlewares = require('../app/middlewares/jwt');

router.get('/search', search);
router.get('/:id', getSaleByID);
router.get('/', allSale);
router.post('/', jwtMiddlewares.managerSale, store);
router.put('/:id', jwtMiddlewares.managerSale, update);
router.delete('/:id', jwtMiddlewares.managerSale, destroy);

module.exports = router;
