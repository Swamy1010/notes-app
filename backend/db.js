const { Sequelize } = require("sequelize");

// Initialize Sequelize with a SQLite database for simplicity
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

// Import models
const User = require("./models/User")(sequelize, Sequelize);
const Note = require("./models/Note")(sequelize, Sequelize);

// Define associations
User.hasMany(Note, { foreignKey: "userId" });
Note.belongsTo(User, { foreignKey: "userId" });

// Export the sequelize instance and models
module.exports = { sequelize, User, Note };
