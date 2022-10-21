const directoryRouter = require('./directory');
const authorRouter = require('./author');
const userRouter = require('./user');
const roleRouter = require('./role');
const permissionRouter = require('./permission');

function route(app) {
    app.get('/test', function(req, res) {
        res.send('Test Route');
    });

    // Directory routes
    app.use('/directories', directoryRouter);

    // Author routes
    app.use('/authors', authorRouter);

    // User routes
    app.use('/users', userRouter);

    // Role routes
    app.use('/roles', roleRouter);

    // Permission routes
    app.use('/permissions', permissionRouter);
}
module.exports = route;
