const Supplier = require("../models/Supplier");

// Show all supplier
const allSupplier = function (req, res) {
  Supplier.getAll(function (err, suppliers) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không truy xuất được dữ liệu",
      });
    } else {
      var supplierPre = suppliers.map((supplier) => {
        return {
          supplierID: supplier.supplierid,
          supplierName: supplier.suppliername,
          supplierAddress: supplier.supplieraddress,
          supplierEmail: supplier.supplieremail,
          supplierPhone: supplier.supplierphone,
          supplierBankNumber: supplier.supplierbanknumber,
          supplierDeletedAt: supplier.supplierdeletedat,
          wardID: supplier.wardid,
        };
      });
      res.json(supplierPre);
    }
  });
};

// Store new supplier
const store = function (req, res) {
  var newSupplier = new Supplier(req.body);
  if (!newSupplier.suppliername || !newSupplier.supplieraddress || !newSupplier.supplierphone || !newSupplier.supplieremail || !newSupplier.supplierbanknumber || !newSupplier.wardid) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin nhà cung cấp không được để trống",
    });
  } else {
    Supplier.store(newSupplier, function (err, supplier) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Thêm nhà cung cấp không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Thêm nhà cung cấp thành công",
        });
      }
    });
  }
};

// Search suppliers
const search = function (req, res) {
  var col = req.query.type;
  var val = req.query.input;
  Supplier.search(col, val, function (err, supplier) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy nhà cung cấp",
      });
    } else {
      var supplierPre = supplier.map((supplier) => {
        return {
          supplierID: supplier.supplierid,
          supplierName: supplier.suppliername,
          supplierAddress: supplier.supplieraddress,
          supplierEmail: supplier.supplieremail,
          supplierPhone: supplier.supplierphone,
          supplierBankNumber: supplier.supplierbanknumber,
          supplierDeletedAt: supplier.supplierdeletedat,
          wardID: supplier.wardid,
        };
      });
      res.json(supplierPre);
    }
  });
};

// Get supplier by ID
const getSupplierByID = function (req, res) {
  var supplierID = req.params.id;
  Supplier.getSupplierByID(supplierID, function (err, supplier) {
    if (err || Object.keys(supplier).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy nhà cung cấp",
      });
    } else {
      var supplierPre = supplier.map((supplier) => {
        return {
          supplierID: supplier.supplierid,
          supplierName: supplier.suppliername,
          supplierAddress: supplier.supplieraddress,
          supplierEmail: supplier.supplieremail,
          supplierPhone: supplier.supplierphone,
          supplierBankNumber: supplier.supplierbanknumber,
          supplierDeletedAt: supplier.supplierdeletedat,
          wardID: supplier.wardid,
        };
      });
      res.json(supplierPre);
    }
  })
}

// Store new supplier
const update = function (req, res) {
  var newSupplier = new Supplier(req.body);
  if (!newSupplier.suppliername || !newSupplier.supplieraddress || !newSupplier.supplierphone || !newSupplier.supplieremail || !newSupplier.supplierbanknumber || !newSupplier.wardid) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin nhà cung cấp không được để trống",
    });
  } else {
    Supplier.update(newSupplier, function (err, supplier) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Cập nhật nhà cung cấp không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Cập nhật nhà cung cấp thành công",
        });
      }
    });
  }
};

// Soft destroy supplier
const destroy = function (req, res) {
  var supplierID = req.params.id;
  Supplier.getSupplierByID(supplierID, function (err, supplier) {
    if (err || Object.keys(supplier).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy nhà cung cấp",
      });
    } else {
      Supplier.delete(supplierID, function (err, supplier) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Xóa nhà cung cấp không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Xóa nhà cung cấp thành công",
          });
        }
      });
    }
  });
};

// Restore supplier
const restore = function (req, res) {
  var supplierID = req.params.id;
  Supplier.getSupplierByID(supplierID, function (err, supplier) {
    if (err || Object.keys(supplier).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy nhà cung cấp",
      });
    } else {
      Supplier.restore(supplierID, function (err, supplier) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Khôi phục nhà cung cấp không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Khôi phục nhà cung cấp thành công",
          });
        }
      });
    }
  });
};

module.exports = {
    allSupplier,
    getSupplierByID,
    store,
    search,
    update,
    destroy,
    restore,
}