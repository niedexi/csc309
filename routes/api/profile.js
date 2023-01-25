const express = require("express");
const router = express.Router();
const passport = require("passport");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route   GET api/profile
// @desc    Get current user profile
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          return res.status(400).json({ error: "profile not found" });
        }
        res.json(profile);
      })
      .catch(() => res.status(500).send("server error"));
  }
);

// @route   GET api/profile/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get("/:user_id", (req, res) => {
  Profile.findOne({ user: req.params.user_id })
    .then(profile => {
      if (!profile) {
        return res.status(400).json({ error: "profile not found" });
      }
      res.json(profile);
    })
    .catch(() => res.status(500).send("server error"));
});

// @route   POST api/profile
// @desc    Create/Update user profile
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.name) profileFields.name = req.body.name;
    if (req.body.gender) profileFields.gender = req.body.gender;
    if (req.body.age) profileFields.age = req.body.age;
    if (req.body.nationality) profileFields.nationality = req.body.nationality;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    // teach & learn: string of languages separated by comma, split to list
    if (req.body.teach) {
      profileFields.teach = req.body.teach
        .split(",")
        .map(teach => teach.trim());
    }
    if (req.body.learn) {
      profileFields.learn = req.body.learn
        .split(",")
        .map(learn => learn.trim());
    }
    if (req.body.photo) profileFields.photo = req.body.photo;

    // Find user profile
    Profile.findOne({ user: req.user.id }).then(profile => {
      // If profile not found create a new one, else update
      if (!profile) {
        new Profile(profileFields).save().then(profile => res.json(profile));
      } else {
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      }
    });
  }
);

// @route   POST api/profile/upload
// @desc    Create/Update user photo
// @access  Private
router.post(
  "/upload",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.files === null) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const file = req.files.file;

    file.mv(`${__dirname}/uploads/${file.name}`, err => {
      // if (err) {
      //   console.error(err);
      //   return res.status(500).send(err);
      // }
      // res.json({
      //   fileName: file.name,
      //   filePath: `${__dirname}/uploads/${file.name}`
      // });
    });

    Profile.findOneAndUpdate(
      { user: req.user.id },
      { photo: `${__dirname}/uploads/${file.name}` },
      { new: true }
    ).then(profile => res.json(profile));
  }
);

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ status: "success" })
      );
    });
  }
);

module.exports = router;
