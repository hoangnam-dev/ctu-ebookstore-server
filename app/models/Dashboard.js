const db = require("../../config/db");
const moment = require("moment");
const util = require("util");

const DashBoard = {
    getNewEbook: (result) => {
        const sql = "SELECT ebookid, ebookname, ebookcreatedat FROM ebook ORDER BY ebookcreatedat DESC LIMIT 20";
        db.query(sql, (err, res) => {
            if (err) {
                result(err, null);
            } else {
                result(null, res)
            }
        });
    },
    getBestsellerEbook: (result) => {
        const sql = `SELECT ebook.ebookid, ebook.ebookname, week(order_tbl.ordercreatedat) as week , 
                        sum(detailorder.detailorderquantity) as totalsale
                    FROM order_tbl
                    INNER JOIN detailorder ON order_tbl.orderid = detailorder.orderid
                    INNER JOIN ebook ON detailorder.ebookid = ebook.ebookid
                    WHERE week(order_tbl.ordercreatedat) = week(curdate())
                        GROUP BY detailorder.ebookid
                        ORDER BY totalsale DESC
                        LIMIT 10 `;
        db.query(sql, (err, res) => {
            if (err) {
                result(err, null);
            } else {
                result(null, res)
            }
        });
    },
};


module.exports = DashBoard;
