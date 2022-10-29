const db = require('../../config/db');

// Constructor
const Author = function(author) {
    this.authorid = author.authorID;
    this.authorname = author.authorName;
    this.authorstory = author.authorStory;
    this.authorbirthdate = author.authorBirthdate;
    this.authorgender = author.authorGender;
};

// Get all author
Author.getAll = function getAllAuthor(result) {
    db.query("SELECT * FROM author", function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Get author by ID
Author.getAuthorByID = function getAuthorByID(authorID, result) {
    db.query("SELECT * FROM author WHERE authorid = ?", authorID, function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Store author
Author.store = function storeAuthor(newAuthor, result) {
    db.query("INSERT INTO author set ?", newAuthor, function (err, res) {

        if(err) {
            result(err, null);
        }
        else{
            result(null, res.insertId);
        }
    });
};

// Update author
Author.update = function updateAuthor(author, result) {
    console.log(authorID);
    db.query("UPDATE author SET authorname = ?, authorstory = ?, authorbirthdate = ?, authorgender = ? WHERE authorid = ?",
    [author.authorname, author.authorstory, author.authorbirthdate, author.authorgender, author.authorid],
    function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    });
};

// Search author
Author.search = function searchAuthor(authorName, result) {
    const sql = "SELECT * FROM author WHERE authorname LIKE '%" + authorName + "%'";
    db.query(sql, function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Delete author
Author.delete = function deleteAuthor(authorID, result) {
    db.query("DELETE FROM author WHERE authorid = ?", authorID, function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    })
};

module.exports = Author;
