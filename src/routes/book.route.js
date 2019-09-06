const { AsyncRouter } = require("express-async-router");
const { check, validationResult } = require("express-validator");

const jwtMiddleware = require("../helpers/jwt-middleware");
const Book = require("../models/Book");
const User = require("../models/User")

const router = AsyncRouter();


// List just the / lists unchecked books
router.get("/", async (req, res) => {
  const books = await Book.find();
  const available = []

  for (book in books) {
    if (!books[book].checkedout) {
      available.push(books[book])
    }
  }

  res.send(available);
});

// List all books 
router.get("/all", async (req, res) => {
  const book = await Book.find();

  res.send(book);
});

// Create
router.post("/", jwtMiddleware, async (req, res) => {
  const errors = validationResult(req);

  if (!req.user.admin) return res.sendStatus(401);

  const { booktitle, author, checkedout } = req.body;

  const book = new Book({ booktitle, author, checkedout });
  await book.save();

  res.status(200).send(book);
});

// read
router.get("/:_id", async (req, res) => {
  const { _id } = req.params;
  const book = await Book.findOne({ _id }).populate(["username"]);

  if (!book) return res.sendStatus(404);

  res.send(book);
});

// update 
router.patch("/:_id", jwtMiddleware, async (req, res) => {
  const { _id } = req.params;
  const book = await Book.findOne({ _id });

  if (!book) return res.sendStatus(404);
  if (!req.user.admin) return res.sendStatus(401);


  book.booktitle = req.body.booktitle;
  book.author = req.body.author
  book.checkedout = req.body.checkedout
  await book.save();

  res.send(book);
});


// update user checks out book 
router.patch("/checkout/:_id", jwtMiddleware, async (req, res) => {
  const { _id } = req.params;
  const book = await Book.findOne({ _id });
  if (!book) return res.sendStatus(404);

  const user = await User.findOne({_id: req.user._id}).populate("books")

  if(user.books.length >= 2) return res.sendStatus(404)
  console.log(user.books.length)

  book.booktitle = req.body.booktitle;
  book.author = req.body.author
  if (!book.checkedout) {
    book.user = req.user
    book.checkedout = !book.checkedout
  } else {
    book.user = undefined
    book.checkedout = !book.checkedout
  }

  await book.save();

  res.send(book);
});

// delete
router.delete("/:_id", jwtMiddleware, async (req, res) => {
  const { _id } = req.params;
  const book = await Book.findOne({ _id });

  if (!book) return res.sendStatus(404);
  if (!req.user.admin) return res.sendStatus(401);

  await book.remove();

  res.send(book);
});

module.exports = router;
