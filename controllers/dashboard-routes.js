const withAuth = require("../utils/loggedin");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("dashboard");
});

router.get("/post", (req, res) => {
  res.render("post");
});

router.get("/updatePost", (req, res) => {
  res.render("updatePost");
});

module.exports = router;
