const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/comment", (req, res) => {
  res.render("comment");
});

router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

router.get("/post", (req, res) => {
  res.render("post");
});

router.get("/updatePost", (req, res) => {
  res.render("updatePost");
});

router.get("/login", (req, res) => {
  res.render("login");
});

module.exports = router;
