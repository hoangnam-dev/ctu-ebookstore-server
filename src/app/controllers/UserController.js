const User = require('../models/User');

const allUser = (req, res, next) => {
    User.findAll()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });

};

const getUserByID = (req, res, next) => {
    let userID = req.params.id;

    User.findOne({
        where: {
            USERID : userID
        }
    })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving user."
      });
    });
};

const store = (req, res, next) => {
    let user = req.body;

    User.create({
        USERNAME: user.userName,
        USERUSERNAME: user.userUsername,
        USERPASSWORD: user.userPassword,
        USERGENDER: user.userGender,
        USERCCCD: user.userCCCD,
        USERAVATAR: user.userAvatar,
        USERADDRESS: user.userAddress,
        USERPHONE: user.userPhone,
        USEREMAIL: user.userEmail,
        USERBANKNUMBER: user.userBankNumber,
        USERSTATUS: user.userStatus,
        PROVINCEID: user.provineID,
        DISTRICTID: user.districtID,
        WARDID: user.wardID,
        ROLEID: user.roleID,
    })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving user."
      });
    });
};

const update = (req, res, next) => {
    let user = req.body;
    let userID = req.params.id;

    User.update({
        USERNAME: user.userName,
        USERUSERNAME: user.userUsername,
        USERPASSWORD: user.userPassword,
        USERGENDER: user.userGender,
        USERCCCD: user.userCCCD,
        USERAVATAR: user.userAvatar,
        USERADDRESS: user.userAddress,
        USERPHONE: user.userPhone,
        USEREMAIL: user.userEmail,
        USERBANKNUMBER: user.userBankNumber,
        USERSTATUS: user.userStatus,
        PROVINCEID: user.provineID,
        DISTRICTID: user.districtID,
        WARDID: user.wardID,
        ROLEID: user.roleID,
    }, {
        where: {
            USERID: userID
        }
    })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving user."
      });
    });
};

const destroy = (req, res, next) => {
    let userID = req.params.id;

    User.destroy({
        where: {
            USERID : userID
        }
    })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while destroy user."
      });
    });
};



module.exports = {
    allUser,
    getUserByID,
    store,
    update,
    destroy,
}