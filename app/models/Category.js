const db = require('../../config/db');
const moment = require('moment');

// Constructor
const Category = function(category) {
    this.categoryid = category.categoryID;
    this.categoryname = category.categoryName;
    this.categorydescription = category.categoryDescription;
    this.directoryid = category.directoryID;
};

// Get all category
Category.getAll = function getAllCategory(result) {
    db.query("SELECT * FROM category WHERE categorydeletedat IS NULL", function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Get category by ID
Category.search = function search(categoryName, result) {
    const sql =
    "SELECT * FROM category WHERE categoryname LIKE '%" + categoryName + "%' AND categorydeletedat IS NULL";
  db.query(sql, function (err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

// Get category by ID
Category.getCategoryByID = function getCategoryByID(categoryID, result) {
    db.query("SELECT * FROM category WHERE categoryid = ?", categoryID, function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Get category by directoryID
Category.getCategoryByDirectoryID = function getCategoryByDirectoryID(directoryID, result) {
    db.query("SELECT * FROM category WHERE directoryid = ?", [directoryID], function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
            console.log(res);
        }
    });
};

// Store category
Category.store = function storeCategory(newCategory, result) {
    db.query("INSERT INTO category set ?", newCategory, function (err, res) {

        if(err) {
            result(err, null);
        }
        else{
            result(null, res.insertId);
        }
    });
};

// Update category
Category.update = function updateCategory(categoryID, category, result) {
    db.query("UPDATE category SET categoryname = ?, categorydescription = ? , directoryid = ? WHERE categoryid = ?",
    [category.categoryname, category.categorydescription, category.directoryid, categoryID],
    function(err, res) {
        if(err) {
            result(err, null);
        }
        else{
            result(null, res);
            console.log(res);
        }
    });
};

// Delete category
Category.delete = function deleteCategory(categoryID, result) {
    let now = moment().format('YYYY-MM-DD');
    db.query("UPDATE category SET categorydeletedat = ? WHERE categoryid = ?",
    [now, categoryID],
    function(err, res) {
        if(err) {
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
};

// Restore category
Category.restore = function restoreCategory(categoryID, result) {
    db.query("UPDATE category SET categorydeletedat = NULL WHERE categoryid = ?",
    [categoryID],
    function(err, res) {
        if(err) {
            result(err, null);
        }
        else{
            result(null, res);
        }
    });
};

module.exports = Category;
