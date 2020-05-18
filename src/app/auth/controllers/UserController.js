const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = UserController = {
  async store(req, res, next) {
    const usr = await User.findAll({ where: { email: req.body.email } });
    if (usr.length > 0) {
      return res.json({
        message: "The email exists...",
      });
    }

    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      } else {
        try {
          const user = await User.create({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: hash,
          });
          return res.json(user);
        } catch (error) {
          console.log(error);
        }
      }
    });
  },

  async show(req, res) {
    const user = await User.findAll({ where: { id: req.params.id } });
    return res.json(user);
  },

  async update(req, res) {
    const user = await User.update(req.body, {
      where: { id: req.body.id },
    });
    return res.json(user);
  },

  async delete(req, res) {
    const user = await User.destroy({
      where: { id: req.body.id },
    });
    return res.json(user);
  },

  async login(req, res) {
    const user = await User.findAll({
      where: { email: req.body.email },
    });

    if (user.length < 1) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }
    bcrypt.compare(req.body.password, user[0].password, (err, result) => {
      if (err) {
        return res.json({
          message: "Auth failed",
        });
      }
      if (result) {
        const token = jwt.sign(
          {
            email: user[0].email,
            id: user[0].id,
          },
          process.env.JWT_KEY
          //   {
          //     expiresIn: "1h",
          //   }
        );

        return res.status(200).json({
          message: "Auth successful",
          token: token,
        });
      }
      res.json({
        message: "Auth failed",
      });
    });
  },
};
