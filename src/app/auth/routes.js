const express = require("express");
const checkAuth = require("../../config/check-auth");
const routes = express.Router();

const UserController = require("./controllers/UserController");

// User routes
routes.post("/signup", UserController.store);
routes.get("/user/:id", UserController.show);
routes.put("/user", UserController.update);
routes.delete("/user", UserController.delete);
routes.post("/login", UserController.login);

module.exports = routes;
