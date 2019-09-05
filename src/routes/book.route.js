const { AsyncRouter } = require("express-async-router");
const { check, validationResult } = require("express-validator");

const jwtMiddleware = require("../helpers/jwt-middleware");
const Book = require("../models/Book");

const router = AsyncRouter();
const createValidators = [
  check("book").exists(),
  check("user").exists()
];
const updateValidators = [
  check("name").exists(),
];


// List
router.get("/", async (req, res) => {
  const book = await Book.find();

  res.send(book);
});

// Create
router.post("/", [...createValidators, jwtMiddleware], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const { booktitle, author } = req.body;

  const book = new Book({ booktitle, author });
  await book.save();

  res.status(201).send(book);
});

// read
router.get("/", async (req, res) => {
  const { _id } = req.params;
  const book = await Book.findOne({ _id }).populate(["book", "user"]);

  if(!book) return res.sendStatus(404);

  res.send(book);
});

// update 
router.patch("/", [...updateValidators, jwtMiddleware], async (req, res) => {
  const { _id } = req.params;
  const book = await Book.findOne({ _id });

  if(!book) return res.sendStatus(404);
  if(!req.user._id.equals(book.user._id)) return res.sendStatus(401);

  book.name = req.body.name;
  await book.save();

  res.send(book);
});

// delete
router.delete("/", jwtMiddleware, async (req, res) => {
  const { _id } = req.params;
  const book= await Book.findOne({ _id });
  
  if(!book) return res.sendStatus(404);
  if(!req.user._id.equals(book.user._id)) return res.sendStatus(401);

  await book.remove();

  res.send(book);
});

module.exports = router;
