const { AsyncRouter } = require("express-async-router");
const { check, validationResult } = require("express-validator");

const jwtMiddleware = require("../helpers/jwt-middleware");
const User = require("../models/User");
const Book = require("../models/Book");


const router = AsyncRouter();
const createValidators = [
  check("username").exists(),
  
];
const updateValidators = [
  check("username").exists(),
  check("password").exists()
];

// List
router.get("/all", jwtMiddleware,  async (req, res) => {
  if(!req.user.admin) return res.sendStatus(404)
  
  const user = await User.find()
  res.send(user);
});

// Read
router.get("/", jwtMiddleware, async (req, res) => {
  const user = await User.findOne({_id: req.user._id}).populate("Book");
  res.send(user);
});

// Update 
router.patch("/:_id", [...updateValidators, jwtMiddleware], async (req, res) => {
  const { _id } = req.params;
  const user = await User.findOne({ _id });
  
  if(!req.user.admin || !user) return res.sendStatus(404);  
 
  user.username = req.body.username;
  user.password = req.body.password;
  await user.save();

  res.send(user);
});

// Delete
router.delete("/:_id", jwtMiddleware, async (req, res) => {
  const { _id } = req.params;
  const user = await User.findOne({ _id });

  if(!req.user.admin || !user) return res.sendStatus(404);

  await user.remove();

  res.send(user);
});

module.exports = router;
