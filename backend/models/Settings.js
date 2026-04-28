const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  schoolName:   { type: String, default: "Language School" },
  city:         { type: String, default: "" },
  address:      { type: String, default: "" },
  email:        { type: String, default: "" },
  phone:        { type: String, default: "" },
  maxStudents:  { type: Number, default: 1000 },
}, { timestamps: true });

module.exports = mongoose.model("Settings", settingsSchema);