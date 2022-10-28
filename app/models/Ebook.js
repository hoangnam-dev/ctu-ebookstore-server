const db = require('../../config/db');

// Constructor
const Ebook = function(ebook) {
    this.ebookid = ebook.ebookID;
    this.ebookname = ebook.ebookName;
    this.ebookdescription = ebook.ebookDescription;
    this.ebookprice = ebook.ebookPrice;
    this.ebookcreateat = ebook.ebookCreateAt;
    this.ebookaddat = ebook.ebookAddAt;
    this.ebookstatus = ebook.ebookStatus;
};

// Get all ebook
Ebook.getAll = function getAllEbook(result) {
    db.query("SELECT * FROM ebook", function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Get ebook by ID
Ebook.getEbookByID = function getEbookByID(ebookID, result) {
    db.query("SELECT * FROM ebook WHERE ebookid = ?", ebookID, function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Store ebook
Ebook.store = function storeEbook(newEbook, result) {
    db.query("INSERT INTO ebook set ?", newEbook, function (err, res) {

        if(err) {
            result(err, null);
        }
        else{
            result(null, res.insertId);
        }
    });
};

// Update ebook
Ebook.update = function updateEbook(ebookID, ebook, result) {
    console.log(ebookID);
    db.query("UPDATE ebook SET ebookname = ?, ebookdescription = ?, ebookprice = ?, ebookcreateat = ?, ebookaddat = ?, ebookstatus = ?, WHERE ebookid = ?",
    [ebook.ebookname, ebook.ebookdescription, ebook.ebookprice, ebook.ebookcreateat, ebook.ebookaddat, ebook.status ,ebookID],
    function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    });
};

// Delete ebook
Ebook.delete = function deleteEbook(ebookID, result) {
    db.query("DELETE FROM ebook WHERE ebookid = ?", ebookID, function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    })
};

module.exports = Ebook;
