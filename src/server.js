const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const authroute = require("./routes/auth.route")
const userroute = require("./routes/user.route")
const bookroute = require("./routes/book.route")

const app = express();
app.use(cors());
app.use(express.json());
if(process.env.ENV !== "test") app.use(morgan("tiny"));

app.use("/auth", authroute);
app.use("/user", userroute);
app.use("/books", bookroute);


const connectDatabase = async (databaseName) => {
  try {
    const connection = await mongoose.connect(`mongodb://localhost/${databaseName}`, {
      useNewUrlParser: true,
      useCreateIndex: true
    })

    if(process.env.ENV !== "test") console.log(`🎒 Connected to database "${databaseName}"...`);
    return connection;
  } catch(err) {
    console.error(err);
  }
}

const startServer = async (port = 8000, hostname = "localhost") => {
  if(process.env.ENV !== "test") await connectDatabase("first-test");

  app.listen(port, hostname, () => {
    console.log(`🚀 Listening at ${hostname}:${port}...`);
  });
}



module.exports = {
  connectDatabase,
  startServer,
  app,
}