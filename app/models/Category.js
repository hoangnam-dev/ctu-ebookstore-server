const db = require('../../config/db');
const moment = require('moment');

// Constructor
const Category = function(category) {
    this.categoryid = category.categoryID;
    this.categoryname = category.categoryName;
    this.categorydescription = category.categoryDescription;
    this.directoryid = category.directoryID;
};

// index
Category.index = function index(result) {
    db.query("SELECT categoryid, categoryname FROM category WHERE (categorydeletedat IS NULL OR categorydeletedat = 0)", function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Get all category
Category.getAll = function getAllCategory(result) {
    db.query("SELECT * FROM category WHERE (categorydeletedat IS NULL OR categorydeletedat = 0)", function(err, res) {
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
    "SELECT * FROM category WHERE REPLACE(categoryname, 'Đ', 'D') LIKE '%" + categoryName + "%' AND (categorydeletedat IS NULL OR categorydeletedat = 0)";
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
    db.query("SELECT * FROM category WHERE categoryid = ? AND (categorydeletedat IS NULL OR categorydeletedat = 0)", categoryID, function(err, res) {
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
    const sqlDetail = `DELETE FROM categoryofebook WHERE categoryid = ${categoryID}`;
    const sql = `DELETE FROM category WHERE categoryid = ${categoryID}`;
    db.query(sqlDetail, function(errDetail, resDetail) {
        if(errDetail) {
            result(errDetail, null);
        }
        else{
            db.query(sql, function(err, res) {
                if(err) {
                    result(err, null);
                }
                else{
                    result(null, res);
                }
            });
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
