const directoryRouter = require('./directory');
const authorRouter = require('./author');

function route(app) {
    app.get('/test', function(req, res) {
        res.send('Test Route');
    });

    // Directory routes
    app.use('/directories', directoryRouter);

    // Author routes
    app.use('/authors', authorRouter);
}
module.exports = route;
