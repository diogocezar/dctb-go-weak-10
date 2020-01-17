const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes");

const app = express();

mongoose.connect(
  "mongodb+srv://diogo:123qwe@cluster0-ojprl.mongodb.net/developers?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(3333);
