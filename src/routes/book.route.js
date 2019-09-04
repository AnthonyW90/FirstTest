const { AsyncRouter } = require("express-async-router");
const { check, validationResult } = require("express-validator");

const jwtMiddleware = require("../helpers/jwt-middleware");
const Board = require("../models/Book");

const router = AsyncRouter();
const createValidators = [
  check("name").exists(),
  check("user").exists()
];
const updateValidators = [
  check("name").exists(),
];


// List
router.get("/", async (req, res) => {
  const book = await book.find();

  res.send(book);
});


// Create
router.post("/", [...createValidators, jwtMiddleware], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const { name, user } = req.body;

  const book = new Book({ name, user });
  await book.save();

  res.status(201).send(book);
});
