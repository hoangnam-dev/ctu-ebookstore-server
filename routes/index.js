const authorRouter = require('./author');
const categoryRouter = require('./category');
const cartRouter = require('./cart');
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
    app.use('/api/authors', authorRouter);

    // Author routes
    app.use('/api/categories', categoryRouter);
    
    // Carts routes
    app.use('/api/carts', cartRouter);
    
    // Comment routes
    app.use('/api/comments', commentRouter);
    
    // Customer routes
    app.use('/api/customrs', customerRouter);
    
    // Directory routes
    app.use('/api/directories', directoryRouter);

    // District routes
    app.use('/api/districts', districtRouter);
    
    // Ebook routes
    app.use('/api/ebooks', ebookRouter);
    
    // InputInffo routes
    app.use('/api/inputinfos', inputInfoRouter);
    
    // License routes
    app.use('/api/licenses', licenseRouter);
    
    // Order routes
    // app.use('/api/orders', orderRouter);
    
    // OutputInfo routes
    app.use('/api/outputinfos', outputInfoRouter);
    
    // Payment routes
    app.use('/api/payments', paymentRouter);
    
    // PaymentType routes
    app.use('/api/paymenttypes', paymentTypeRouter);

    // Permission routes
    app.use('/api/permissions', permissionRouter);

    // Province routes
    app.use('/api/provinces', provinceRouter);

    // Role routes
    app.use('/api/roles', roleRouter);

    // Sale routes
    app.use('/api/sales', saleRouter);

    // Supplier routes
    app.use('/api/suppliers', supplierRouter);

    // User routes
    app.use('/api/users', userRouter);

    // Ward routes
    app.use('/api/wards', wardRouter);
}
module.exports = route;
