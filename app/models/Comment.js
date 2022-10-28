const db = require('../../config/db');

// Constructor
const Comment = function(comment) {
    this.commentid = comment.commentID;
    this.commentcontent = comment.commentContent;
    this.commentrate = comment.commentRate;
    this.ebookid = comment.ebookID;
    this.customerid = comment.customerID;
};

// Get all comment
Comment.getAll = function getAllComment(result) {
    db.query("SELECT * FROM comment", function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Get comment by ID
Comment.getCommentByID = function getCommentByID(commentID, result) {
    db.query("SELECT * FROM comment WHERE commentid = ?", commentID, function(err, res) {
        if(err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Store comment
Comment.store = function storeComment(newComment, result) {
    db.query("INSERT INTO comment set ?", newComment, function (err, res) {

        if(err) {
            result(err, null);
        }
        else{
            result(null, res.insertId);
        }
    });
};

// Update comment
Comment.update = function updateComment(commentID, comment, result) {
    console.log(commentID);
    db.query("UPDATE comment SET commentcontent = ?, commentrate = ?, ebookid = ?, customerid = ? WHERE commentid = ?",
    [comment.commentcontent, comment.commentrate, comment.ebookid, comment.customerid, commentID],
    function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    });
};

// Delete comment
Comment.delete = function deleteComment(commentID, result) {
    db.query("DELETE FROM comment WHERE commentid = ?", commentID, function(err, res) {
        if(err) {
            result(null, err);
        }
        else{
            result(null, res);
        }
    })
};

module.exports = Comment;
