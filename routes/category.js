const express = require('express');
const router = express.Router();

// Import Controller
const {allCategory, index, store, getCategoryByID, getCategoryByDirectoryID, search, update, destroy, restore} = require('../app/controllers/CategoryController');

// Middlewares
const jwtMiddlewares = require('../app/middlewares/jwt');

router.post('/', jwtMiddlewares.managerDirectoryCategory, store);
router.post('/getByDirectory', getCategoryByDirectoryID);
router.get('/index', index);
router.get('/search', search);
router.get('/:id', getCategoryByID);
router.put('/:id', jwtMiddlewares.managerDirectoryCategory, update);
router.delete('/:id', jwtMiddlewares.managerDirectoryCategory, destroy);
router.put('/restore/:id', jwtMiddlewares.managerDirectoryCategory, restore);
router.get('/', allCategory);

module.exports = router;
