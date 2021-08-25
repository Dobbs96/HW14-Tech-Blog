const withAuth = require("../utils/loggedin");

const router = require("express").Router();

router.get("/", async (req, res) => {
  res.render("home");
});

router.get("/comment", (req, res) => {
  res.render("comment");
});

module.exports = router;
