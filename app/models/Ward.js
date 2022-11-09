const db = require("../../config/db");

// Constructor
const Ward = function (ward) {
  this.wardid = ward.wardID;
  this.wardname = ward.wardName;
  this.wardtype = ward.wardType;
  this.districtid = ward.districtID;
};

// Get all ward
Ward.getAll = function getAllWard(result) {
  db.query("SELECT * FROM ward", function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// Get ward by ID
Ward.getWardByID = function getWardByID(wardID, result) {
  db.query("SELECT * FROM ward WHERE wardid = ?", wardID, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// Get ward by district ID
Ward.getWardByDistrictID = function getWardByDistrictID(districtID, result) {
  db.query(
    "SELECT * FROM ward WHERE districtid = ?",
    districtID,
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Store ward
Ward.store = function storeWard(newWard, result) {
  db.query("INSERT INTO ward set ?", newWard, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};

// Update ward
Ward.update = function updateWard(wardID, ward, result) {
  console.log(wardID);
  db.query(
    "UPDATE ward SET wardname = ?, wardtype = ?, districtid = ? WHERE wardid = ?",
    [ward.wardname, ward.wardtype, ward.districtID, wardID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Delete ward
Ward.delete = function deleteWard(wardID, result) {
  db.query("DELETE FROM ward WHERE wardid = ?", wardID, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

module.exports = Ward;
