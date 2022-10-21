const Role = require('../models/Role');

const allRole = (req, res, next) => {
    Role.findAll()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving roles."
      });
    });

};

const getRoleByID = (req, res, next) => {
    let roleID = req.params.id;

    Role.findOne({
        where: {
            ROLEID : roleID
        }
    })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving role."
      });
    });
};

const store = (req, res, next) => {
    let role = req.body;

    Role.create({
        ROLENAME: role.roleName,
        ROLECODE: role.roleCode,
        ROLEDESCRIPTION: role.roleDescription,
    })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving role."
      });
    });
};

const update = (req, res, next) => {
    let role = req.body;
    let roleID = req.params.id;
    console.log(roleID);
    console.log(role);

    Role.update({
        ROLENAME: role.roleName,
        ROLECODE: role.roleCode,
        ROLEDESCRIPTION: role.roleDescription,
    }, {
        where: {
            ROLEID: roleID
        }
    })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving role."
      });
    });
};

const destroy = (req, res, next) => {
    let roleID = req.params.id;

    Role.destroy({
        where: {
            ROLEID : roleID
        }
    })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while destroy role."
      });
    });
};



module.exports = {
    allRole,
    getRoleByID,
    store,
    update,
    destroy,
}