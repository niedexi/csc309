const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Profile = require("../../models/Profile");
const Chat = require("../../models/Chat");
const Relation = require("../../models/Relation");
const { ObjectID } = require('mongodb')

const Validator = require("validator");
const isEmpty = require("../../validation/isempty");
const keys = require("../../config/keys");

const mongoose = require("mongoose");

router.get("/followers",
passport.authenticate("jwt", { session: false }),
(req, res) => {
  Profile.findOne({user: req.user.id})
  .then(prof => {
    if (!prof) return res.status(400).send("No profile has been set up, yet.")
    Relation.find({ following: prof._id})
    .populate({path: "follower", model: "profile"})
    .exec((err, followers) => {
      if (err) return res.status(400).send();
      else return res.json(followers);
    });
  })
  .catch(() => res.status(500).send("Server error"))
});

router.get("/following",
passport.authenticate("jwt", { session: false }),
(req, res) => {
  Profile.findOne({user: req.user.id})
  .then((prof) => {
    if (!prof) return res.status(400).send("No profile has been set up, yet.")
    Relation.find({follower: prof._id})
    .populate({path: "following", model: "profile"})
    .exec((err, following) => {
      if (err) return res.status(400).send("Something went wrong with the request");
      else return res.json(following);
    })
  })
  .catch((e) => {
    res.status(500).send(e)
  })
});

router.post("/follow/:p_id",
passport.authenticate("jwt", { session: false }),
(req, res) => {
  const id = req.params.p_id;
  if (!ObjectID.isValid(id)) return res.status(400).send("Invalid ID");
  Profile.findOne({user: req.user.id}, "_id")
  .then(prof_id => {
    if (!prof_id) res.staus(404).send("Could not get user's profile id");
    else {
      const relationToken = {follower: prof_id, following: id};
      Relation.findOneAndUpdate(relationToken, relationToken, {upsert: true, useFindAndModify: false, runValidators: true, new: true})
      .then(rel => {
        if (!rel) res.status(400).send("Something went wrong during update");
        else res.status(204).send();
      })
      .catch(() => res.status(500).send("Database Error"));
    }
  })
  .catch(() => res.status(500).send("Could not reach database"));
});

router.get("/isFollowing/:p_id",
passport.authenticate("jwt", { session: false }),
(req, res) => {
  const id = req.params.p_id;
  if (!ObjectID.isValid(id)) return res.status(400).send("Invalid ID");
  Profile.findOne({user: req.user.id}, "_id")
  .then(prof_id => {
    if (!prof_id) return res.status(400).send("Missing Profile");
  Relation.findOne({follower: req.user.id, following: id})
  .then(rel => {
    if (!rel) return res.status(404).send("User is not following the provided ID");
    res.send(rel);
  })
  .catch(() => res.status(500).send("Database could not be reached"))
})
.catch(() => res.status(500).send("Could not get user's profile id from database"));
});

router.delete("/following/:p_id",
passport.authenticate("jwt", { session: false }),
(req, res) => {
  const id = req.params.p_id;
  if (!ObjectID.isValid(id)) return res.status(400).send("Invalid ID");
  Profile.findOne({user: req.user.id}, "_id")
  .then(prof_id => {
    if (!prof_id) return res.status(400).send("Missing Profile");
  Relation.deleteOne({following: id, follower: prof_id})
  .then(rel => {
    console.log(rel);
    if (!rel) return res.status(404).send("User is not following the provided ID");
    res.sendStatus(204);
  })
  .catch(() => res.status(500).send("Database could not be reached"));
})
.catch(() => res.status(500).send("Could not get user's profile id from database"));
});

module.exports = router;
