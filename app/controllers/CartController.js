const moment = require('moment');
// Search authors
const index = function (req, res) {
  var now = moment();
  res.json({
    error: true,
    statusCode: 0,
    message: now,
  });
};

// Search authors
const search = function (req, res) {
  res.json({
    error: true,
    statusCode: 0,
    message: "Card controller",
  });
};


module.exports = {
  index,
  search
}