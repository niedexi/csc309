const express = require("express");
const router = express.Router();
const passport = require("passport");

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

// @route   GET api/post/all
// @desc    Get all posts
// @access  Public
router.get("/all", (req, res) => {
  Post.find()
    .sort({ time: -1 })
    .then(posts => res.json(posts))
    .catch(() => res.status(404).json({ error: "posts not found" }));
});

// @route   GET api/posts/:id
// @desc    Get a post by id
// @access  Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({ error: "post not found" });
      }
    })
    .catch(() => res.status(400).json({ error: "post not found" }));
});

// @route   POST api/post
// @desc    Create a post
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newPost = new Post({
      user: req.user.id,
      text: req.body.text,
      teach: req.body.teach,
      learn: req.body.learn
    });

    newPost.save().then(post => res.json(post));
  }
);

// @route   DELETE api/post/:id
// @desc    Delete a post
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(() => {
      Post.findById(req.params.id)
        .then(post => {
          // Check for post ownership
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ error: "user not authorized" });
          }
          // Delete
          post.remove().then(() => res.json({ status: "success" }));
        })
        .catch(() => res.status(404).json({ error: "post not found" }));
    });
  }
);

module.exports = router;
