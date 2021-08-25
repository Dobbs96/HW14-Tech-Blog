const withAuth = require("../utils/loggedin");
const { Post, User, Comment } = require("../models");

const router = require("express").Router();

router.get("/", async (req, res) => {
  res.render("home");
});

router.get("/comment", (req, res) => {
  res.render("comment");
});

module.exports = router;
