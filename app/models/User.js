const db = require('../../config/db');

// Constructor
const User = function(user) {
    this.userid = user.userID;
    this.username = user.userName;
    this.userusername = user.userUserName;
    this.userpassword = user.userPassword;
    this.usercic = user.userCIC;
    this.useravatar = user.userAvatar;
    this.usergender = user.userGender;
    this.useraddress = user.userAddress;
    this.useremail = user.userEmail;
    this.userphone = user.userPhone;
    this.userbanknumber = user.userBankNumber;
    this.userstatus = user.userStatus;
    this.roleid = user.roleID;
    this.wardid = user.wardID;
};

// Get all user
User.getAll = function getAllUser(result) {
    db.query("SELECT * FROM user", function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Get user by ID
User.getUserByID = function getUserByID(userID, result) {
    db.query("SELECT * FROM user WHERE userid = ?", userID, function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Store user
User.store = function storeUser(newUser, result) {
    db.query("INSERT INTO user set ?", newUser, function (err, res) {

        if(err) {
            result(err, null);
        }
        else{
            result(null, res.insertId);
        }
    });
};

// Update user
User.update = function updateUser(userID, user, result) {
    console.log(userID);
    db.query("UPDATE user SET username = ?, userusername = ?, userpassword = ?, usergender = ?, useravatar = ?, useraddress = ?, usercic = ?, useremail = ?, userphone = ?, userbanknumber = ?, userstatus = ?,roleid = ?, wardid = ?, WHERE userid = ?",
    [user.username, user.userusername, user.userpassword, user.usergender, user.useravatar, user.useraddress, user.usercic, user.useremail, user.userphone, user.userbanknumber, user.userstatus, user.roleid, user.wardid ,userID],
    function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    });
};

// Delete user
User.delete = function deleteUser(userID, result) {
    db.query("DELETE FROM user WHERE userid = ?", userID, function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    })
};

module.exports = User;
