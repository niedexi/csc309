const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Profile = require("../../models/Profile");
const Chat = require("../../models/Chat");
const { ObjectID } = require('mongodb')

const Validator = require("validator");
const isEmpty = require("../../validation/isempty");
const keys = require("../../config/keys");

const mongoose = require("mongoose");

const activeLog = {};

const purgeInactiveLogs = () => {
  const dateCompare = new Date();
  for (let index in activeLog) {
    for(let user in activeLog[index]) {
      if (dateCompare - activeLog[index][user][1] > 15 * 60000)
        delete activeLog[index][user];
    }
    if (Object.keys(activeLog[index]) == 0)
    delete activeLog[index];
  }
}

setInterval(purgeInactiveLogs, 30 * 60000);

router.get("/",
passport.authenticate("jwt", { session: false }),
(req, res) => {
  Profile.findOne({ user: req.user.id })
  .then(query => {
    if (!query) return res.status(404).send("Not found either");
    const paths = Array.from(Array(query.chats.length)).map((e,i)=>`chats.${i}.prof`);
    const returned = Profile.findOne({ user: req.user.id })
    .populate({path: paths.join(" "), model: "profile"})
    .exec(
      (err, result) => {
        if (err) res.status(500).send(err);
        else {
          res.json({ chats: result.chats, uRef: req.user.id});
        }
      })
    })
    .catch(e => res.sendStatus(400));
  }
);

// router.get("/query/:uid",
// passport.authenticate("jwt", { session: false }),
// (req, res) => {
//   const uid = req.params.uid;
//   const id = req.user.id;
//   if (!ObjectID.isValid(uid)) return res.status(400).send("Invalid ID");
//   Chat.find({$or: [{$and: [{userA: uid}, {userB: id}]}, {$and: [{userA: id}, {userB: uid}]}]})
//   .then(chat => {
//     if (!chat) return res.status(404).send("No pre-exisiting chat");
//     res.json(chat)
//   })
//   .catch(() => res.status(500).send("Database Error"))
// })

router.get("/:chat_id",
passport.authenticate("jwt", { session: false }),
(req, res) => {
  if (!ObjectID.isValid(req.params.chat_id)) return res.status(400).send("Invalid ID");
  Chat.findById(req.params.chat_id)
  .then(log => {
    if (!log) res.status(404).send("No such chat exists");
    else res.json(log);
  })
  .catch(() => res.status(500).send("Server Error"));
});

router.post("/",
passport.authenticate("jwt", { session: false }),
(req, res) => {
  const a = req.user.id;
  if (!ObjectID.isValid(a)) return res.status(400).send("Invalid ID");
  if (!req.body || !req.body.target) return res.status(400).send("Request missing information");
  const b = req.body.target;
  if (!ObjectID.isValid(b) || a === b) return res.status(400).send("Invalid IDs or identicals")
  const newChatInit = { userA: a, userB: b, log: [] };

  Profile.find({user: {$in: [a, b]}})
  .then(profs => {
    if (profs.length !== 2) return res.status(400).send("Not found");
    Chat.create(newChatInit)
    .then(chat => {
      const chatObjs = [{id: chat._id, prof: profs[1]._id},
      {id: chat._id, prof: profs[0]._id}]
      const aPush = Profile.findOneAndUpdate({user: a}, {$push: {chats: chatObjs[0]}},
        { new: true,  useFindAndModify: false });
        const bPush = Profile.findOneAndUpdate({user: b}, {$push: {chats: chatObjs[1]}},
          { new: true,  useFindAndModify: false });
          aPush.then((argA) => {
            bPush.then((argB) => {
              res.json(chat);
            })
          })
        })
        .catch(() => res.status(500).send("Could not write to database"))
      });
    });

    router.get("/:chat_id/getActive",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const specificChat = activeLog[req.params.chat_id];
      if (!specificChat || !specificChat[req.user.id] || !specificChat[req.user.id][0]) return res.status(205).json();
      if (specificChat[req.user.id][0].length === 0)
        return res.status(204).json();
      const returning = specificChat[req.user.id][0];
      activeLog[req.params.chat_id][req.user.id][0] = [];
      res.json(returning);
    });

    router.post("/:chat_id/closeActive",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const chat_id = req.params.chat_id;
      if (!activeLog[chat_id] || !activeLog[chat_id][req.user.id])
      return res.sendStatus(204);
      delete activeLog[chat_id][req.user.id];
      if (Object.keys(activeLog[chat_id]) === 0) {
        delete activeLog[chat_id];
      }
      res.sendStatus(205);
    });

    router.post("/:chat_id/openActive",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      if (!ObjectID.isValid(req.params.chat_id)) return res.status(400).send("Invalid ID");
      const chat_id = req.params.chat_id;
      if (activeLog[chat_id]) {
        activeLog[chat_id][req.user.id] = [[], new Date()];
        return res.sendStatus(204);
      } else {
        activeLog[chat_id] = {};
        activeLog[chat_id][req.user.id] = [[], new Date()];
        return res.sendStatus(201);
      }
    });

    router.post("/:chat_id/send",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      if (!ObjectID.isValid(req.params.chat_id)) return res.status(400).send("Invalid ID");
      if (!req.body || !messageIsValid(req.body.message))
      return res.status(404).send("Request missing data or invalid message");
      const chat_id = req.params.chat_id;
      const message = req.body.message;
      const signedMessage = {
        sender: req.user.id,
        text: message,
        date: new Date()
      }
      Chat.findOneAndUpdate({ _id: chat_id }, { $push: { log: signedMessage} },
        {new: true, useFindAndModify: false})
        .then(result => {
          if (!result) return res.status(404).send("No chat with given chat ID");
          const returnedMessage = result.log.pop();
          const activeListener = result.userA === req.user.id ? result.userB : result.userA;
          if (activeLog[chat_id] && activeLog[chat_id][activeListener]) {
            activeLog[chat_id][req.user.id][1] = new Date();
            activeLog[chat_id][activeListener][0].push(returnedMessage);
          }
          res.json(returnedMessage);
        })
        .catch(e => res.status(500).json(message));
      });
      //.catch(() => res.status(400).send("Could not get chat with given ID"));
      //});

      const messageIsValid = (message) => {
        //Null block.
        if (!message || typeof message !== "string" || message === "")
        return 0;
        else return 1;
      }

      module.exports = router;
