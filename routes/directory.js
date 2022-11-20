const express = require('express');
const router = express.Router();

// Import Controller
const {allDirectory, index, store, getDirectoryByID, search, update, destroy, restore} = require('../app/controllers/DirectoryController');

// Middlewares
const jwtMiddlewares = require('../app/middlewares/jwt');

router.post('/', jwtMiddlewares.managerDirectoryCategory, store);
router.get('/index', index);
router.get('/search', search);
router.get('/:id', getDirectoryByID);
router.put('/:id', jwtMiddlewares.managerDirectoryCategory, update);
router.delete('/:id', jwtMiddlewares.managerDirectoryCategory, destroy);
router.put('/restore/:id', jwtMiddlewares.managerDirectoryCategory, restore);
router.get('/', jwtMiddlewares.managerDirectoryCategory, allDirectory);

module.exports = router;
