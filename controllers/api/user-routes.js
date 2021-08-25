const router = require("express").Router();
const { User, Post, Comment } = require("../../models");

router.get("/", async (req, res) => {
  const dbUserData = User.findAll({
    attributes: { exclude: ["password"] },
  }).catch((err) => {
    res.status(500).json(err);
  });
  res.json(dbUserData);
});

module.exports = router;
