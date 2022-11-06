const UserStatus = require("../models/UserStatus");

// Show all userstatus
const allUserStatus = function (req, res) {
  UserStatus.getAll(function (err, userstatuss) {
    if (err) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không truy xuất được dữ liệu",
      });
    } else {
      var userstatusPre = userstatuss.map((userstatus) => {
        return {
          userstatusID: userstatus.userstatusid,
          userstatusCode: userstatus.userstatuscode,
          userstatusName: userstatus.userstatusname,
          userstatusColor: userstatus.userstatuscolor,
        };
      });
      res.json(userstatusPre);
    }
  });
};

// Store new userstatus
const store = function (req, res) {
  var newUserStatus = new UserStatus(req.body);
  if (
    !newUserStatus.userstatuscode ||
    !newUserStatus.userstatusname ||
    !newUserStatus.userstatuscolor
  ) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin trạng thái user không được để trống",
    });
  } else {
    UserStatus.store(newUserStatus, function (err, userstatus) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Thêm trạng thái user không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Thêm trạng thái user thành công",
        });
      }
    });
  }
};

// Search userstatuss
const search = function (req, res) {
  var col = req.query.type;
  var val = req.query.input;
  UserStatus.search(col, val, function (err, userstatus) {
    if (err || Object.keys(userstatus).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy trạng thái user",
      });
    } else {
      var userstatusPre = userstatus.map((userstatus) => {
        return {
          userstatusID: userstatus.userstatusid,
          userstatusCode: userstatus.userstatuscode,
          userstatusName: userstatus.userstatusname,
          userstatusColor: userstatus.userstatuscolor,
        };
      });
      res.json(userstatusPre);
    }
  });
};

// Get userstatus by ID
const getUserStatusByID = function (req, res) {
  var userstatusID = req.params.id;
  UserStatus.getUserStatusByID(userstatusID, function (err, userstatus) {
    if (err || Object.keys(userstatus).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy trạng thái user",
      });
    } else {
      var userstatusPre = userstatus.map((userstatus) => {
        return {
          userstatusID: userstatus.userstatusid,
          userstatusCode: userstatus.userstatuscode,
          userstatusName: userstatus.userstatusname,
          userstatusColor: userstatus.userstatuscolor,
          userstatusDeletedAt: userstatus.userstatusdeletedat,
        };
      });
      res.json(userstatusPre);
    }
  });
};

// Store new userstatus
const update = function (req, res) {
  var newUserStatus = new UserStatus(req.body);
  if (
    !newUserStatus.userstatuscode ||
    !newUserStatus.userstatusname ||
    !newUserStatus.userstatuscolor
  ) {
    res.json({
      error: true,
      statusCode: 0,
      message: "Thông tin trạng thái user không được để trống",
    });
  } else {
    UserStatus.update(newUserStatus, function (err, userstatus) {
      if (err) {
        res.json({
          error: true,
          statusCode: 0,
          message: "Lỗi! Cập nhật trạng thái user không thành công",
        });
      } else {
        res.json({
          error: false,
          statusCode: 1,
          message: "Cập nhật trạng thái user thành công",
        });
      }
    });
  }
};

// Soft destroy userstatus
const destroy = function (req, res) {
  var userstatusID = req.params.id;
  UserStatus.getUserStatusByID(userstatusID, function (err, userstatus) {
    if (err || Object.keys(userstatus).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy trạng thái user",
      });
    } else {
      UserStatus.delete(userstatusID, function (err, userstatus) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Xóa trạng thái user không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Xóa trạng thái user thành công",
          });
        }
      });
    }
  });
};

// Restore userstatus
const restore = function (req, res) {
  var userstatusID = req.params.id;
  UserStatus.getUserStatusByID(userstatusID, function (err, userstatus) {
    if (err || Object.keys(userstatus).length === 0) {
      res.json({
        error: true,
        statusCode: 0,
        message: "Lỗi! Không tìm thấy trạng thái user",
      });
    } else {
      UserStatus.restore(userstatusID, function (err, userstatus) {
        if (err) {
          res.json({
            error: true,
            statusCode: 0,
            message: "Lỗi! Khôi phục trạng thái user không thành công",
          });
        } else {
          res.json({
            error: false,
            statusCode: 1,
            message: "Khôi phục trạng thái user thành công",
          });
        }
      });
    }
  });
};

module.exports = {
  allUserStatus,
  getUserStatusByID,
  store,
  search,
  update,
  destroy,
  restore,
};
