const Permission = require('../models/Permission');

const allPermission = (req, res, next) => {
    Permission.findAll()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving permissions."
      });
    });

};

const getPermissionByID = (req, res, next) => {
    let permissionID = req.params.id;

    Permission.findOne({
        where: {
            PERMISSIONID : permissionID
        }
    })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving permission."
      });
    });
};

const store = (req, res, next) => {
    let permission = req.body;

    Permission.create({
        PERMISSIONNAME: permission.permissionName,
        PERMISSIONCODE: permission.permissionCode,
        PERMISSIONDESCRIPTION: permission.permissionDescription,
    })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving permission."
      });
    });
};

const update = (req, res, next) => {
    let permission = req.body;
    let permissionID = req.params.id;

    Permission.update({
        PERMISSIONNAME: permission.permissionName,
        PERMISSIONCODE: permission.permissionCode,
        PERMISSIONDESCRIPTION: permission.permissionDescription,
    }, {
        where: {
            PERMISSIONID: permissionID
        }
    })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving permission."
      });
    });
};

const destroy = (req, res, next) => {
    let permissionID = req.params.id;

    Permission.destroy({
        where: {
            PERMISSIONID : permissionID
        }
    })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while destroy permission."
      });
    });
};



module.exports = {
    allPermission,
    getPermissionByID,
    store,
    update,
    destroy,
}