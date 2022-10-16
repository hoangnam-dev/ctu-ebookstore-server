function route(app) {
    app.get('/test', function(req, res) {
        res.send('Test Route');
    });
}
module.exports = route;
