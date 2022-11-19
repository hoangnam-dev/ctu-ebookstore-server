const jwt = require("jsonwebtoken");
const UserAuth = require("../models/UserAuth");

const jwtMiddleware = {
  verifyToken: (req, res, next) => {
    const token = req.headers.token;

    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, function (err, data) {
        if (err) {
          return res.json({
            error: true,
            statusCode: 0,
            message: "JWT had error: " + err.message,
          });
        }

        req.user = data;
        next();
      });
    } else {
      return res.json({
        error: true,
        statusCode: 0,
        message: "You are not sing in",
      });
    }
  },

  // check admin permissions
  systemManagerPermissions: (req, res, next) => {
    const roles = [process.env.ADMIN_ROLE];
    if(roles.includes(req.user.roleCode) === false){
      return res.json({
        error: true,
        statusCode: 0,
        message: "You are not allowed to do this",
      });
    }
    const permisisons = [
      process.env.CREATE_PERMISSION,
      process.env.READ_PERMISSION,
      process.env.UPDATE_PERMISSION,
      process.env.DELETE_PERMISSION,
    ];
    var checkPerm = true;

    jwtMiddleware.verifyToken(req, res, () => {
      let roleCode = req.user.roleCode;
      UserAuth.getRoleAndPermission(roleCode, (err, permList) => {
        if (err) {
          return res.json({
            error: true,
            statusCode: 0,
            message: "Role is available",
          });
        }
        let arrPerm = permList[0].permissionList;
        arrPerm.forEach((perm) => {
          if (permisisons.includes(perm.permissioncode) === false) {
            checkPerm = false;
          }
        });
      });
    });

    if (checkPerm) {
      next();
    } else {
      return res.json({
        error: true,
        statusCode: 0,
        message: "You don't have permission to access this",
      });
    }
  },

  // Check manager permissions
  managerPermissions: (req, res, next) => {
    const roles = [process.env.MANAGER_ROLE];
    if(roles.includes(req.user.roleCode) === false){
      return res.json({
        error: true,
        statusCode: 0,
        message: "You are not allowed to do this",
      });
    }
    const permisisons = [
      process.env.CREATE_PERMISSION,
      process.env.READ_PERMISSION,
      process.env.UPDATE_PERMISSION,
      process.env.DELETE_PERMISSION,
    ];
    var checkPerm = true;

    jwtMiddleware.verifyToken(req, res, () => {
      let roleCode = req.user.roleCode;
      UserAuth.getRoleAndPermission(roleCode, (err, permList) => {
        if (err) {
          return res.json({
            error: true,
            statusCode: 0,
            message: "Role is available",
          });
        }
        let arrPerm = permList[0].permissionList;
        arrPerm.forEach((perm) => {
          if (permisisons.includes(perm.permissioncode) === false) {
            checkPerm = false;
          }
        });
      });
    });

    if (checkPerm) {
      next();
    } else {
      return res.json({
        error: true,
        statusCode: 0,
        message: "You don't have permission to access this",
      });
    }
  },
};

module.exports = jwtMiddleware;
