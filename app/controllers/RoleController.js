const Role = require("../models/Role");

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
      res.json(roles);
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

// Get role by ID
const getRoleByID = function (req, res) {
  var roleID = req.params.id;
  Role.getRoleByID(roleID, function (err, role) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy vai trò",
      });
    } else {
      res.json(role);
    }
  })
}

// Store new role
const update = function (req, res) {
  var newRole = new Role(req.body);
  var roleID = req.params.id;
  if (!newRole.rolecode || !newRole.rolename) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin vai trò không được để trống",
    });
  } else {
    Role.update(roleID, newRole, function (err, role) {
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

module.exports = {
    allRole,
    getRoleByID,
    store,
    update,
    // destroy,
}