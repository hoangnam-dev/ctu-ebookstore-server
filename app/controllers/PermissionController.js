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
      var permissionPre = permissions.map((permission) => {
        return {
          permissionID: permission.permissionid,
          permissionCode: permission.permissioncode,
          permissionName: permission.permissionname,
          permissionDescription: permission.permissiondescription,
        };
      });
      res.json(permissionPre);
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

// Search permission
const search = function (req, res) {
  var col = req.query.type;
  var val = req.query.input;
  Permission.search(col, val, function (err, permission) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy nhà cung cấp",
      });
    } else {
      var permissionPre = permission.map((permission) => {
        return {
          permissionID: permission.permissionid,
          permissionCode: permission.permissioncode,
          permissionName: permission.permissionname,
          permissionDescription: permission.permissiondescription,
        };
      });
      res.json(permissionPre);
    }
  });
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
      var permissionPre = permission.map((permission) => {
        return {
          permissionID: permission.permissionid,
          permissionCode: permission.permissioncode,
          permissionName: permission.permissionname,
          permissionDescription: permission.permissiondescription,
        };
      });
      res.json(permissionPre);
    }
  })
}

// Store new permission
const update = function (req, res) {
  var newPermission = new Permission(req.body);
  if (!newPermission.permissioncode || !newPermission.permissionname) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin quyền không được để trống",
    });
  } else {
    Permission.update(newPermission, function (err, permission) {
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


// Delete permission
const destroy = function (req, res) {
  var permissionID = req.params.id;
  Permission.getPermissionByID(permissionID, function (err, permission) {
    if (err || Object.keys(res).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy quyền",
      });
    } else {
      Permission.delete(permissionID, function (err, permission) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Xóa quyền không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Xóa quyền thành công",
          });
        }
      });
    }
  });
};

module.exports = {
    allPermission,
    getPermissionByID,
    store,
    search,
    update,
    destroy,
}