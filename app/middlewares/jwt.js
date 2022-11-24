const jwt = require("jsonwebtoken");
const UserAuth = require("../models/UserAuth");

const author_wrong = "author_wrong";
const author_null = "author_null";
const authorization_error = "authorization_error";

const jwtMiddleware = {
  verifyToken: (req, res, next) => {
    const token = req.headers.token;

    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, function (err, data) {
        if (err) {
          return res.json({
            error: true,
            statusCode: author_wrong,
            message: "Bạn chưa đăng nhập",
          });
        }

        req.user = data;
        next();
      });
    } else {
      return res.json({
        error: true,
        statusCode: author_null,
        message: "Bạn chưa đăng nhập",
      });
    }
  },

  // Check user login permission
  authOwner: (req, res, next) => {
    jwtMiddleware.verifyToken(req, res, () => {
      if (req.user.id == req.params.id) {
        next();
      } else {
        console.log(req.user.id);
        return res.json({
          error: true,
          statusCode: authorization_error,
          message: "Bạn không có quyền thực thi",
        });
      }
    });
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
            message: "Bạn không có vai trò này",
          });
        }
        let arrPerm = permList[0].permissionList;
        let listPerm = [];
        arrPerm.forEach((perm) => {
          listPerm.push(perm.permissioncode);
        });
        if (listPerm.includes(permission)) {
          next();
        } else {
          return res.json({
            error: true,
            statusCode: 0,
            message: "Bạn không có quyền thực thi",
          });
        }
      });
    });
  },

  // Check author permissions
  managerCustomer: (req, res, next) => {
    const permission = process.env.MANAGER_CUSTOMER;

    jwtMiddleware.verifyToken(req, res, () => {
      let roleCode = req.user.roleCode;
      UserAuth.getRoleAndPermission(roleCode, (err, permList) => {
        if (err) {
          return res.json({
            error: true,
            statusCode: 0,
            message: "Bạn không có vai trò này",
          });
        }
        let arrPerm = permList[0].permissionList;
        let listPerm = [];
        arrPerm.forEach((perm) => {
          listPerm.push(perm.permissioncode);
        });
        if (listPerm.includes(permission)) {
          next();
        } else {
          return res.json({
            error: true,
            statusCode: 0,
            message: "Bạn không có quyền thực thi",
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
            message: "Bạn không có vai trò này",
          });
        }
        let arrPerm = permList[0].permissionList;
        let listPerm = [];
        arrPerm.forEach((perm) => {
          listPerm.push(perm.permissioncode);
        });
        if (listPerm.includes(permission)) {
          next();
        } else {
          return res.json({
            error: true,
            statusCode: 0,
            message: "Bạn không có quyền thực thi",
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
            message: "Bạn không có vai trò này",
          });
        }
        let arrPerm = permList[0].permissionList;
        let listPerm = [];
        arrPerm.forEach((perm) => {
          listPerm.push(perm.permissioncode);
        });
        if (listPerm.includes(permission)) {
          next();
        } else {
          return res.json({
            error: true,
            statusCode: 0,
            message: "Bạn không có quyền thực thi",
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
            message: "Bạn không có vai trò này",
          });
        }
        let arrPerm = permList[0].permissionList;
        let listPerm = [];
        arrPerm.forEach((perm) => {
          listPerm.push(perm.permissioncode);
        });
        if (listPerm.includes(permission)) {
          next();
        } else {
          return res.json({
            error: true,
            statusCode: 0,
            message: "Bạn không có quyền thực thi",
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
            message: "Bạn không có vai trò này",
          });
        }
        let arrPerm = permList[0].permissionList;
        let listPerm = [];
        arrPerm.forEach((perm) => {
          listPerm.push(perm.permissioncode);
        });
        if (listPerm.includes(permission)) {
          next();
        } else {
          return res.json({
            error: true,
            statusCode: 0,
            message: "Bạn không có quyền thực thi",
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
            message: "Bạn không có vai trò này",
          });
        }
        let arrPerm = permList[0].permissionList;
        let listPerm = [];
        arrPerm.forEach((perm) => {
          listPerm.push(perm.permissioncode);
        });
        if (listPerm.includes(permission)) {
          next();
        } else {
          return res.json({
            error: true,
            statusCode: 0,
            message: "Bạn không có quyền thực thi",
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
            message: "Bạn không có vai trò này",
          });
        }
        let arrPerm = permList[0].permissionList;
        let listPerm = [];
        arrPerm.forEach((perm) => {
          listPerm.push(perm.permissioncode);
        });
        if (listPerm.includes(permission)) {
          next();
        } else {
          return res.json({
            error: true,
            statusCode: 0,
            message: "Bạn không có quyền thực thi",
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
            message: "Bạn không có vai trò này",
          });
        }
        let arrPerm = permList[0].permissionList;
        let listPerm = [];
        arrPerm.forEach((perm) => {
          listPerm.push(perm.permissioncode);
        });
        if (listPerm.includes(permission)) {
          next();
        } else {
          return res.json({
            error: true,
            statusCode: 0,
            message: "Bạn không có quyền thực thi",
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
            message: "Bạn không có vai trò này",
          });
        }
        let arrPerm = permList[0].permissionList;
        let listPerm = [];
        arrPerm.forEach((perm) => {
          listPerm.push(perm.permissioncode);
        });
        if (listPerm.includes(permission)) {
          next();
        } else {
          return res.json({
            error: true,
            statusCode: 0,
            message: "Bạn không có quyền thực thi",
          });
        }
      });
    });
  },
};

module.exports = jwtMiddleware;
