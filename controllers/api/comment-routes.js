const router = require("express").Router();
const { Comment } = require("../../models");
const withAuth = require("../../utils/loggedin");

// GET /api/comments
router.get("/", async (req, res) => {
  const dbCommentData = await Comment.findAll({}).catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
  if (!dbCommentData[0]) {
    return res.json({ message: "There is no Comment Data" });
  }
  res.json(dbCommentData);
});

// POST /api/comments

router.post("/", async (req, res) => {
  if (req.session) {
    const dbCommentData = await Comment.create({
      comment: req.body.comment,
      post_id: req.body.post_id,
      user_id: req.session.user_id,
    }).catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
    res.json(dbCommentData);
  }
});

// DELETE /api/comments

router.delete("/:id", async (req, res) => {
  const dbCommentData = await Comment.destroy({
    where: {
      id: req.params.id,
    },
  }).catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
  if (!dbCommentData) {
    res
      .status(404)
      .json({ message: `No comment found with ID ${req.params.id}` });
    return;
  }
  res.json(dbCommentData);
});

module.exports = router;
