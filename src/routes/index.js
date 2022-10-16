const directoryRouter = require('./directory');

function route(app) {
    app.get('/test', function(req, res) {
        res.send('Test Route');
    });

    // Directory routes
    app.use('/directories', directoryRouter);
}
module.exports = route;
