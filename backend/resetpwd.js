require("dotenv").config();
require("./config/db")();
const User = require("./models/User");

async function reset() {
  const roles = ["secretaire", "etudiant", "parent", "professeur", "admin"];

  for (const role of roles) {
    const users = await User.find({ role });
    for (const user of users) {
      user.password = `${role}123`;
      await user.save();
      console.log(`✅ [${role}] Email: ${user.email} | MDP: ${role}123`);
    }
  }
  process.exit();
}
reset();
