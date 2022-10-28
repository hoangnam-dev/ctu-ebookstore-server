const authorRouter = require('./author');
const commentRouter = require('./comment');
const customerRouter = require('./customer');
const directoryRouter = require('./directory');
const districtRouter = require('./district');
const ebookRouter = require('./ebook');
const inputInfoRouter = require('./inputinfo');
const licenseRouter = require('./license');
const orderRouter = require('./order');
const outputInfoRouter = require('./outputinfo');
const paymentRouter = require('./payment');
const paymentTypeRouter = require('./paymenttype');
const permissionRouter = require('./permission');
const provinceRouter = require('./province');
const roleRouter = require('./role');
const saleRouter = require('./sale');
const supplierRouter = require('./supplier');
const userRouter = require('./user');
const wardRouter = require('./ward');

function route(app) {
    // Author routes
    app.use('/authors', authorRouter);
    
    // Comment routes
    app.use('/comments', commentRouter);
    
    // Customer routes
    app.use('/customrs', customerRouter);
    
    // Directory routes
    app.use('/directories', directoryRouter);

    // District routes
    app.use('/districts', districtRouter);
    
    // Ebook routes
    app.use('/ebooks', ebookRouter);
    
    // InputInffo routes
    app.use('/inputinfos', inputInfoRouter);
    
    // License routes
    app.use('/licenses', licenseRouter);
    
    // Order routes
    // app.use('/orders', orderRouter);
    
    // OutputInfo routes
    app.use('/outputinfos', outputInfoRouter);
    
    // Payment routes
    app.use('/payments', paymentRouter);
    
    // PaymentType routes
    app.use('/paymenttypes', paymentTypeRouter);

    // Permission routes
    app.use('/permissions', permissionRouter);

    // Province routes
    app.use('/provinces', provinceRouter);

    // Role routes
    app.use('/roles', roleRouter);

    // Sale routes
    app.use('/sales', saleRouter);

    // Supplier routes
    app.use('/suppliers', supplierRouter);

    // User routes
    app.use('/users', userRouter);

    // Ward routes
    app.use('/wards', wardRouter);
}
module.exports = route;
