const Role = require("../models/Role");
const _ = require("lodash");

// Handle result
function handleResult(arrData) {
  var resData = arrData.map((data) => {
    // Handle permission list of the role
    var permList = data.permissionList.map((perm) => {
      return {
        permissionID: perm.permissionid,
        permissionCode: perm.permissioncode,
        permissionName: perm.permissionname,
        permissionDescription: perm.permissiondescription,
      };
    });
    
    // return role
    return {
      roleID: data.roleid,
      roleCode: data.rolecode,
      roleName: data.rolename,
      roleDescription: data.roledescription,
      permssionList: permList,
    };
  });
  return resData;
}

// Show all role
const allRole = function (req, res) {
  Role.getAll(function (err, roles) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không truy xuất được dữ liệu",
      });
    } else {
      var listRole = handleResult(roles);
      res.json(listRole);
    }
  });
};

// Store new role
const store = function (req, res) {
  var newRole = new Role(req.body);
  if (!newRole.rolecode || !newRole.rolename) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin vai trò không được để trống",
    });
  } else {
    Role.store(newRole, function (err, role) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Thêm vai trò không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Thêm vai trò thành công",
        });
      }
    });
  }
};

// Search role
const search = function (req, res) {
  var col = req.query.type;
  var val = req.query.input;
  Role.search(col, val, function (err, role) {
    if (err || Object.keys(role).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy vai trò",
      });
    } else {
      var listRole = handleResult(role);
      res.json(listRole);
    }
  });
};

// Get role by ID
const hasPermission = function (req, res) {
  var roleID = req.body.roleID;
  Role.hasPermission(roleID, function (err, permission) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy quyền của vai trò",
      });
    } else {
      var permissionPre = permission.map((permission) => {
        return {
          permissionID: permission.permissionid,
          permissionCode: permission.permissioncode,
          permissionName: permission.permissionname,
          permissionDescription: permission.roledescription,
        };
      });
      res.json(permissionPre);
    }
  });
};

// Get role by ID
const getRoleByID = function (req, res) {
  var roleID = req.params.id;
  Role.getRoleByID(roleID, function (err, role) {
    if (err || Object.keys(role).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy vai trò",
      });
    } else {
      var listRole = handleResult(role);
      res.json(listRole);
    }
  });
};

// Store new role
const update = function (req, res) {
  var newRole = new Role(req.body);
  if (!newRole.roleid || !newRole.rolecode || !newRole.rolename) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin vai trò không được để trống",
    });
  } else {
    Role.update(newRole, function (err, role) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Cập nhật vai trò không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Cập nhật vai trò thành công",
        });
      }
    });
  }
};

// Give permission to the role
const givePermissionTo = function (req, res) {
  var roleID = req.body.roleID;
  var permisisonID = req.body.permisisonID;
  Role.givePermissionTo(roleID, permisisonID, function (err, result) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không thể gán quyền cho vai trò",
      });
    } else {
      res.json({
        error: false,
        statusCode: 1,
        message: "Gán quyền cho vai trò thành công",
      });
    }
  });
};

// Revoke permission to the role
const revokePermissionTo = function (req, res) {
  var roleID = req.body.roleID;
  var permisisonID = req.body.permisisonID;
  Role.revokePermissionTo(roleID, permisisonID, function (err, result) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không thể xóa quyền của vai trò",
      });
    } else {
      res.json({
        error: false,
        statusCode: 1,
        message: "Xóa quyền của vai trò thành công",
      });
    }
  });
};

// Soft destroy role
const destroy = function (req, res) {
  var roleID = req.params.id;
  Role.getRoleByID(roleID, function (err, role) {
    if (err || Object.keys(role).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy vai trò",
      });
    } else {
      Role.delete(roleID, function (err, role) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Xóa vai trò không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Xóa vai trò thành công",
          });
        }
      });
    }
  });
};

// Restore role
const restore = function (req, res) {
  var roleID = req.params.id;
  Role.getRoleByID(roleID, function (err, role) {
    if (err || Object.keys(role).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy vai trò",
      });
    } else {
      Role.restore(roleID, function (err, role) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Khôi phục vai trò không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Khôi phục vai trò thành công",
          });
        }
      });
    }
  });
};

module.exports = {
  allRole,
  getRoleByID,
  hasPermission,
  search,
  store,
  update,
  givePermissionTo,
  revokePermissionTo,
  destroy,
  restore,
};
