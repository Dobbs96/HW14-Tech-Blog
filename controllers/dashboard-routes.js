const withAuth = require("../utils/loggedin");
const { Post, User, Comment } = require("../models");
const router = require("express").Router();

router.get("/", (req, res) => {
  Post.findAll({
    // where: {
    //   // use the ID from the session
    //   user_id: req.session.user_id,
    // },
    attributes: ["id", "title", "created_at", "post"],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      const posts = dbPostData.map((post) => post.get({ plain: true }));
      res.render("dashboard", { posts, loggedIn: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/post", (req, res) => {
  Post.findAll({
    where: {
      // use the ID from the session
      user_id: req.session.user_id,
    },
    attributes: ["id", "title", "created_at", "post"],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      const posts = dbPostData.map((post) => post.get({ plain: true }));
      res.render("post", { posts, loggedIn: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/updatePost", (req, res) => {
  Post.findOne({
    where: {
      id: req.session.id,
    },
    attributes: ["id", "title", "created_at", "post"],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }

      const post = dbPostData.get({ plain: true });

      res.render("updatePost", {
        post,
        loggedIn: true,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
