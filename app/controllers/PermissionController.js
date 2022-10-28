const Permission = require("../models/Permission");

// Show all permission
const allPermission = function (req, res) {
  Permission.getAll(function (err, permissions) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không truy xuất được dữ liệu",
      });
    } else {
      res.json(permissions);
    }
  });
};

// Store new permission
const store = function (req, res) {
  var newPermission = new Permission(req.body);
  if (!newPermission.permissioncode || !newPermission.permissionname) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin quyền không được để trống",
    });
  } else {
    Permission.store(newPermission, function (err, permission) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Thêm quyền không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Thêm quyền thành công",
        });
      }
    });
  }
};

// Get permission by ID
const getPermissionByID = function (req, res) {
  var permissionID = req.params.id;
  Permission.getPermissionByID(permissionID, function (err, permission) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy quyền",
      });
    } else {
      res.json(permission);
    }
  })
}

// Store new permission
const update = function (req, res) {
  var newPermission = new Permission(req.body);
  var permissionID = req.params.id;
  if (!newPermission.permissioncode || !newPermission.permissionname) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin quyền không được để trống",
    });
  } else {
    Permission.update(permissionID, newPermission, function (err, permission) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Cập nhật quyền không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Cập nhật quyền thành công",
        });
      }
    });
  }
};

module.exports = {
    allPermission,
    getPermissionByID,
    store,
    update,
    // destroy,
}