const db = require("../../config/db");
const moment = require("moment");

// Constructor
const Directory = function (directory) {
  this.directoryid = directory.directoryID;
  this.directoryname = directory.directoryName;
  this.directorydescription = directory.directoryDescription;
};

// Get list category of directory
async function hasCategory(directoryID) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM category WHERE category.directoryid = ? AND category.categorydeletedat IS NULL",
      [directoryID],
      async function (err, resCategory) {
        if (err) {
          reject(err);
        } else {
          resolve(resCategory);
        }
      }
    );
  });
}

// Category result,
async function resultDirectory(res) {
  let listInfo = res.map(async (res) => {
    var categories = [];

    await hasCategory(res.directoryid)
      .then(function (resCategory) {
        categories = resCategory;
      })
      .catch(function (errCategory) {
        result(errCategory, null);
      });

    var directory = {
      ...res,
      categoryList: categories,
    };
    return directory;
  });

  const resultData = await Promise.all(listInfo);
  return resultData;
}

// Get all directory
Directory.getAll = function getAllDirectory(result) {
  db.query(
    "SELECT * FROM directory WHERE directorydeletedat IS NULL",
    async function (err, res) {
      if (err) {
        result(err, null);
      } else {
        const data = await resultDirectory(res);
        result(null, data);
      }
    }
  );
};

// index
Directory.index = function index(result) {
  db.query(
    "SELECT directoryid, directoryname FROM directory WHERE directorydeletedat IS NULL",
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
          result(null, res);
      }
    }
  );
};

// Get directory by ID
Directory.search = function search(directoryName, result) {
  const sql = `SELECT * FROM directory WHERE REPLACE(directoryname, 'Đ', 'D') LIKE '%${directoryName}%' AND directorydeletedat IS NULL`;
  db.query(sql, async function (err, res) {
    if (err) {
      result(err, null);
    } else {
        const data = await resultDirectory(res);
        result(null, data);
    }
  });
};

// Get directory by ID
Directory.getDirectoryByID = function getDirectoryByID(directoryID, result) {
  db.query(
    "SELECT * FROM directory WHERE directoryid = ?",
    directoryID,
    async function (err, res) {
      if (err) {
        result(err, null);
      } else {
        const data = await resultDirectory(res);
        result(null, data);
      }
    }
  );
};

// Store directory
Directory.store = function storeDirectory(newDirectory, result) {
  db.query("INSERT INTO directory set ?", newDirectory, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res.insertId);
    }
  });
};

// Update directory
Directory.update = function updateDirectory(directoryID, directory, result) {
  db.query(
    "UPDATE directory SET directoryname = ?, directorydescription = ? WHERE directoryid = ?",
    [directory.directoryname, directory.directorydescription, directoryID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Delete directory
Directory.delete = function deleteDirectory(directoryID, result) {
  let now = moment().format("YYYY-MM-DD");
  db.query(
    "UPDATE directory SET directorydeletedat = ? WHERE directoryid = ?",
    [now, directoryID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

// Restore directory
Directory.restore = function restoreDirectory(directoryID, result) {
  db.query(
    "UPDATE directory SET directorydeletedat = NULL WHERE directoryid = ?",
    [directoryID],
    function (err, res) {
      if (err) {
        result(err, null);
      } else {
        result(null, res);
      }
    }
  );
};

module.exports = Directory;
