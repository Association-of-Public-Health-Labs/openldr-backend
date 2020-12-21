require("dotenv/config");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const ViralLoadRoutes = require("./app/viralload/routes");
const DictRoutes = require("./app/dictionary/routes");
const AuthRoutes = require("./app/auth/routes");
const Covid19Routes = require("./app/covid19/routes");

const app = express();
app.use(cors());

// app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extented: true }));

app.use(ViralLoadRoutes);
app.use(DictRoutes);
app.use(AuthRoutes);
app.use(Covid19Routes);
app.listen(process.env.PORT || 4444, () => {
  console.log(
    "Server running on localhost:4444"
  );
});
