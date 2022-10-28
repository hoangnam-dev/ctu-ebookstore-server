const db = require('../../config/db');

// Constructor
const Sale = function(sale) {
    this.saleid = sale.saleID;
    this.salecode = sale.saleCode;
    this.salevalue = sale.saleValue;
    this.salestartat = sale.saleStartAt;
    this.saleendat = sale.saleEndAt;
};

// Get all sale
Sale.getAll = function getAllSale(result) {
    db.query("SELECT * FROM sale", function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Get sale by ID
Sale.getSaleByID = function getSaleByID(saleID, result) {
    db.query("SELECT * FROM sale WHERE saleid = ?", saleID, function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Store sale
Sale.store = function storeSale(newSale, result) {
    db.query("INSERT INTO sale set ?", newSale, function (err, res) {

        if(err) {
            result(err, null);
        }
        else{
            result(null, res.insertId);
        }
    });
};

// Update sale
Sale.update = function updateSale(saleID, sale, result) {
    console.log(saleID);
    db.query("UPDATE sale SET salecode = ?, salevalue = ?, salestartat = ?, saleendat = ? WHERE saleid = ?",
    [sale.salecode, sale.salevalue, sale.salestartat, sale.saleendat, saleID],
    function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    });
};

// Delete sale
Sale.delete = function deleteSale(saleID, result) {
    db.query("DELETE FROM sale WHERE saleid = ?", saleID, function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    })
};

module.exports = Sale;
