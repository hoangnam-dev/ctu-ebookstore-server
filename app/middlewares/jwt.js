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

  // Check author permissions
  managerAuthor: (req, res, next) => {
    const permission = process.env.MANAGER_AUTHOR;

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
        let listPerm = [];
        arrPerm.forEach(perm => {
          listPerm.push(perm.permissioncode);
        });
        if (listPerm.includes(permission)) {
          next();
        } else {
          return res.json({
            error: true,
            statusCode: 0,
            message: "You don't have permission",
          });
        }
      });
    });
  },

  // Check directory and category permissions
  managerDirectoryCategory: (req, res, next) => {
    const permission = process.env.MANAGER_DIRECTORY_CATEGORY;

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
        let listPerm = [];
        arrPerm.forEach(perm => {
          listPerm.push(perm.permissioncode);
        });
        if (listPerm.includes(permission)) {
          next();
        } else {
          return res.json({
            error: true,
            statusCode: 0,
            message: "You don't have permission",
          });
        }
      });
    });
  },

  // Check ebook permissions
  managerEbook: (req, res, next) => {
    const permission = process.env.MANAGER_EBOOK;

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
        let listPerm = [];
        arrPerm.forEach(perm => {
          listPerm.push(perm.permissioncode);
        });
        if (listPerm.includes(permission)) {
          next();
        } else {
          return res.json({
            error: true,
            statusCode: 0,
            message: "You don't have permission",
          });
        }
      });
    });
  },

  // Check inputinfo permissions
  managerInputinfo: (req, res, next) => {
    const permission = process.env.MANAGER_INPUTINFO;

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
        let listPerm = [];
        arrPerm.forEach(perm => {
          listPerm.push(perm.permissioncode);
        });
        if (listPerm.includes(permission)) {
          next();
        } else {
          return res.json({
            error: true,
            statusCode: 0,
            message: "You don't have permission",
          });
        }
      });
    });
  },

  // Check outputinfo permissions
  managerOutputinfo: (req, res, next) => {
    const permission = process.env.MANAGER_OUTPUTINFO;

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
        let listPerm = [];
        arrPerm.forEach(perm => {
          listPerm.push(perm.permissioncode);
        });
        if (listPerm.includes(permission)) {
          next();
        } else {
          return res.json({
            error: true,
            statusCode: 0,
            message: "You don't have permission",
          });
        }
      });
    });
  },

  // Check role and permission permissions
  managerRolePermission: (req, res, next) => {
    const permission = process.env.MANAGER_ROLE_PERMISISON;

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
        let listPerm = [];
        arrPerm.forEach(perm => {
          listPerm.push(perm.permissioncode);
        });
        if (listPerm.includes(permission)) {
          next();
        } else {
          return res.json({
            error: true,
            statusCode: 0,
            message: "You don't have permission",
          });
        }
      });
    });
  },

  // Check sale permissions
  managerSale: (req, res, next) => {
    const permission = process.env.MANAGER_SALE;

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
        let listPerm = [];
        arrPerm.forEach(perm => {
          listPerm.push(perm.permissioncode);
        });
        if (listPerm.includes(permission)) {
          next();
        } else {
          return res.json({
            error: true,
            statusCode: 0,
            message: "You don't have permission",
          });
        }
      });
    });
  },

  // Check supplier permissions
  managerSupplier: (req, res, next) => {
    const permission = process.env.MANAGER_SUPPLIER;

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
        let listPerm = [];
        arrPerm.forEach(perm => {
          listPerm.push(perm.permissioncode);
        });
        if (listPerm.includes(permission)) {
          next();
        } else {
          return res.json({
            error: true,
            statusCode: 0,
            message: "You don't have permission",
          });
        }
      });
    });
  },

  // Check user permissions
  managerUser: (req, res, next) => {
    const permission = process.env.MANAGER_USER;

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
        let listPerm = [];
        arrPerm.forEach(perm => {
          listPerm.push(perm.permissioncode);
        });
        if (listPerm.includes(permission)) {
          next();
        } else {
          return res.json({
            error: true,
            statusCode: 0,
            message: "You don't have permission",
          });
        }
      });
    });
  },

};

module.exports = jwtMiddleware;
