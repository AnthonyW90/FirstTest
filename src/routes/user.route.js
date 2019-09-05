const { AsyncRouter } = require("express-async-router");
const { check, validationResult } = require("express-validator");

const jwtMiddleware = require("../helpers/jwt-middleware");
const User = require("../models/User");

const router = AsyncRouter();
const createValidators = [
  check("username").exists(),
  
];
const updateValidators = [
  check("username").exists(),
 
];

// List
router.get("/", jwtMiddleware,  async (req, res) => {
  const user = await User.findone({_id: req.user._id}).populate("Book");

  res.send(user);
});

// Create
router.post("/", [...createValidators, jwtMiddleware], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const user = new Post(req.body);
  await user.save();

  res.status(201).send(user);
});

// Read
router.get("/:_id", async (req, res) => {
  const { _id } = req.params;
  const user = await Post.findOne({ _id }).populate(["user", "user"]);

  if(!user) return res.sendStatus(404);

  res.send(user);
});

// Update 
router.patch("/:_id", [...updateValidators, jwtMiddleware], async (req, res) => {
  const { _id } = req.params;
  const user = await User.findOne({ _id });

  if(!user) return res.sendStatus(404);
  if(req.user._id !== user.user._id) return res.sendStatus(401);  

  user.username = req.body.username;
  user.body = req.body.username;
  await post.save();

  res.send(user);
});

// Delete
router.delete("/:_id", jwtMiddleware, async (req, res) => {
  const { _id } = req.params;
  const user = await User.findOne({ _id });

  if(!post) return res.sendStatus(404);
  if(req.user._id !== user.user._id) return res.sendStatus(401);

  await user.remove();

  res.send(user);
});

module.exports = router;
