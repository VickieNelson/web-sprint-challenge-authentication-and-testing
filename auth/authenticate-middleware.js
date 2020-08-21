/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const jwt = require("jsonwebtoken");
const constant = require("../config/constant.js");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, constant.JWT_SECRET, (error, decodedToken) => {
      if (error)
        return res.status(401).json({ message: "no access try again" });
      req.decodedToken = decodedToken;
      next();
    });
  } else res.status(401).json({ you: "shall not pass!" });
};
