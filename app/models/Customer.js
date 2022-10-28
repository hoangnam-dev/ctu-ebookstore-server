const db = require('../../config/db');

// Constructor
const Customer = function(customer) {
    this.customerid = customer.customerID;
    this.customername = customer.customerName;
    this.customeremail = customer.customerEmail;
    this.customerpassword = customer.customerPassword;
    this.customeravatar = customer.customerAvatar;
    this.customercreateat = customer.customerCreateAt;
    this.customerstatus = customer.customerStatus;
};

// Get all customer
Customer.getAll = function getAllCustomer(result) {
    db.query("SELECT * FROM customer", function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Get customer by ID
Customer.getCustomerByID = function getCustomerByID(customerID, result) {
    db.query("SELECT * FROM customer WHERE customerid = ?", customerID, function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Store customer
Customer.store = function storeCustomer(newCustomer, result) {
    db.query("INSERT INTO customer set ?", newCustomer, function (err, res) {

        if(err) {
            result(err, null);
        }
        else{
            result(null, res.insertId);
        }
    });
};

// Update customer
Customer.update = function updateCustomer(customerID, customer, result) {
    console.log(customerID);
    db.query("UPDATE customer SET customername = ?, customeravatar = ?, customeremail = ?, customerpassword = ?, customerstatus = ?, WHERE customerid = ?",
    [customer.customername, customer.customeravatar, customer.customeremail, customer.customerpassword, customer.status ,customerID],
    function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    });
};

// Delete customer
Customer.delete = function deleteCustomer(customerID, result) {
    db.query("DELETE FROM customer WHERE customerid = ?", customerID, function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    })
};

module.exports = Customer;
