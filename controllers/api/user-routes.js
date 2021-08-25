const router = require("express").Router();
const { User, Post, Comment } = require("../../models");
const withAuth = require("../../utils/loggedin");

//GET /api/users

router.get("/", async (req, res) => {
  const dbUserData = await User.findAll({
    attributes: { exclude: ["password"] },
  }).catch((err) => {
    res.status(500).json(err);
  });
  if (!dbUserData[0]) {
    res.status(404).json({ message: "There are no users!" });
    return;
  }
  res.json(dbUserData);
});

//GET /api/users/:id

router.get("/:id", async (req, res) => {
  const dbUserData = await User.findOne({
    attributes: { exclude: ["password"] },
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Post,
        attributes: ["id", "title", "post", "created_at"],
      },
      {
        model: Comment,
        attributes: ["id", "comment", "created_at"],
        include: {
          model: Post,
          attributes: ["title"],
        },
      },
    ],
  }).catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });

  if (!dbUserData) {
    res.status(404).json({ message: `No user found by ID ${req.params.id}` });
    return;
  }
  res.json(dbUserData);
});

//POST /api/users

router.post("/", async (req, res) => {
  const dbUserData = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  req.session.save(() => {
    req.session.user_id = dbUserData.id;
    req.session.username = dbUserData.username;
    req.session.loggedIn = true;

    res.json(dbUserData);
  });
});

// PUT /api/users/:id
router.put("/:id", withAuth, async (req, res) => {
  const dbUserData = await User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id,
    },
  }).catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });

  if (!dbUserData[0]) {
    res.status(404).json({ message: `No user found by ID ${req.params.id}` });
    return;
  }
  res.json(dbUserData);
});

// DELETE /api/users/:id
router.delete("/:id", withAuth, async (req, res) => {
  const dbUserData = await User.destroy({
    where: {
      id: req.params.id,
    },
  }).catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });

  if (!dbUserData) {
    res.status(404).json({ message: `No user found by ID ${req.params.id}` });
    return;
  }
  res.json({ message: `User Deleted by ID of ${req.params.id}` });
});

//LOGIN
router.post("/login", (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((dbUserData) => {
    if (!dbUserData) {
      res.status(400).json({ message: "No user with that email address!" });
      return;
    }

    const validPassword = dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: "Incorrect password!" });
      return;
    }

    req.session.save(() => {
      // declare session variables
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;

      res.json({ user: dbUserData, message: "You are now logged in!" });
    });
  });
});

router.post("/logout", (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});
module.exports = router;
