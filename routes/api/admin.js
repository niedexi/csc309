const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
 
const Validator = require("validator");
const isEmpty = require("../../validation/isempty");
const keys = require("../../config/keys");
const authenticateAdmin = require("../../config/aAuth");
 
const User = require('../../models/User')
const Chat = require('../../models/Chat')
const Profile = require('../../models/Profile')
const Message = require('../../models/Message')
const Relation = require('../../models/Relation')
const Post = require('../../models/Post')
const { ObjectID } = require('mongodb')
//const bodyParser = require('body-parser')
//router.use(bodyParser.json())
 
 
router.post("/login", (req, res) => {
  if (isEmpty(req.body) ||
  Validator.isEmpty(req.body.id) ||
  Validator.isEmpty(req.body.password)) {
    return res.status(400).send("Server received invalid input");
  }
  const {id, password} = req.body;
  //console.log(bcrypt.hashSync("admin", 10));
  if (id === "admin") {
    bcrypt.compare(
      password,
      "$2a$10$6upNL2fwPu9fM/7ivCrX7uRogwUOWitaQ.QMGhll7eZobNbX0TRbq")
      .then(matched => {
      if (!matched)
        return res.status(401).send("Login failed. Incorrect password");
      else {
        jwt.sign(
          {adminAuth: true},
          keys.aPKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              token: token
            });
          }
        );
      }
    });
  } else if (id === "fbi") {
    console.log(bcrypt.hashSync("openUp", 10));
    bcrypt.compare(
      password,
      "$2a$10$8bgFUkTVzD2N2wi8q/q3GOwj28EjaqZxBBww9/kqAHm9iY3cL2WwO")
      .then(isMatch => {
      if (!isMatch)
        return res.status(401).send("Login failed. Incorrect password");
      else {
        jwt.sign(
          {adminAuth: true},
          keys.aPKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              token: token
            });
          }
        );
      }
    });
  }else res.status(401).send("Login failed. Incorrect credentials");
});
 
router.delete("/dashboard/:id", (req, res) => {
  const user = req.params.id

  if (!ObjectID.isValid(user)) {
		res.status(404).send()
  }
  User.findByIdAndRemove(user).then((id) => {
		if (!id) {
			res.status(404).send()
		} else {
			Profile.findAndRemove({user: user})
      .then(prof => {
        const a = Post.deleteMany({user: user});
        const b = Relation.deleteMany({})
      })
		}
	})
  .catch((error) => {
		res.status(500).send() // server error, could not delete.
	})

  })
 
router.get("/users", (req, res) => {
  User.find({}).then((users) => {
		res.json(users) // can wrap in object if want to add more properties
	}, (error) => {
		res.status(500).send(error) // server error
	})
})
 
 
router.get("/authCheck", authenticateAdmin, (res, req) => res.send("Authorised"));
 
 
module.exports = router;
 