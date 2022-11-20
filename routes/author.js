const express = require('express');
const router = express.Router();

// Import Controller
const {allAuthor, getAuthorByID, search, store, update, destroy} = require('../app/controllers/AuthorController');

// Middlewares
const jwtMiddlewares = require('../app/middlewares/jwt');

router.get('/search', search);
router.get('/:id', jwtMiddlewares.managerAuthor, getAuthorByID);
router.put('/:id', jwtMiddlewares.managerAuthor, update);
router.post('/', jwtMiddlewares.managerAuthor, store);
router.delete('/:id', jwtMiddlewares.managerAuthor, destroy);
router.get('/', allAuthor);

module.exports = router;
