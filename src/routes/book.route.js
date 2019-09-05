const { AsyncRouter } = require("express-async-router");
const { check, validationResult } = require("express-validator");

const jwtMiddleware = require("../helpers/jwt-middleware");
const Book = require("../models/Book");

const router = AsyncRouter();


// List just the / lists unchecked books
router.get("/", async (req, res) => {
  const book = await Book.find();

  res.send(book);
});

// List all books 
router.get("/all", async (req, res) => {
  const book = await Book.find();

  res.send(book);
});

// Create
router.post("/", jwtMiddleware, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
<<<<<<< HEAD
console.log(req.user)
console.log(req.user.admin)

=======
>>>>>>> 82e32d50c7e9d31cd481f3acd535bc80a123350e
  if(!req.user.admin ) return res.sendStatus(401);

  const { booktitle, author } = req.body;

  const book = new Book({ booktitle, author });
  await book.save();

  res.status(200).send(book);
});

// read
router.get("/", async (req, res) => {
  const { _id } = req.params;
  const book = await Book.findOne({ _id }).populate(["book", "user"]);

  if(!book) return res.sendStatus(404);

  res.send(book);
});

// update 
router.patch("/",  jwtMiddleware, async (req, res) => {
  const { _id } = req.params;
  const book = await Book.findOne({ _id });

  if(!book) return res.sendStatus(404);
  if(!req.user.admin ) return res.sendStatus(401);


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
