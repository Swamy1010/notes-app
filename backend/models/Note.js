const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Note = sequelize.define("Note", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    archived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return Note;
};
