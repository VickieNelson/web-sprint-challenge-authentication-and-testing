const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Users = require("../users/users-model.js");
const constant = require("../config/constant");
const jwt = require("jsonwebtoken");

router.post("/register", (req, res) => {
  // implement registration

  const user = req.body;
  const rounds = process.env.BCRYPT || 8;

  const hash = bcrypt.hashSync(user.password, rounds);
  user.password = hash;

  Users.add(user)
    .then((response) => {
      res.status(201).json({ data: response });
    })
    .catch((error) => res.status(500).json({ message: error }));
});

function userToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  const option = {
    expiresIn: "1d",
  };
  return jwt.sign(payload, constant.JWT_SECRET, option);
}

router.post("/login", (req, res) => {
  // implement login

  const user = req.body;
  Users.findBy({ username: user.username })
    .then(([response]) => {
      if (response && bcrypt.compareSync(user.password, response.password))
        res.status(200).json({
          message: "You're logged in" + user.username,
          token: userToken(response),
        });
      else res.status(401).json({ message: "invalid creds" });
    })
    .catch((error) => res.status(500).json({ message: "Try again" }));
});

module.exports = router;
