const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema for admin account
const AdminSchema = new Schema({
  admin: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

let Admin = mongoose.model("admin", AdminSchema);
module.exports = Admin;
