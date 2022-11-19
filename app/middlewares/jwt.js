const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.token;
  console.log(token);
  
  if (token) {
    const accessToken = token.split(" ")[1];
    jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, function (err, data) {
      if (err) {
        return res.json({
          error: true,
          statusCode: 0,
          message: "JWT had error: " + err.message,
        });
      }

      req.user = data;
      next();
    });
  } else {
    return res.json({
        error: true,
        statusCode: 0,
        message: "You are not sing in",
      });
  }
};

module.exports = {
  verifyToken,
};
