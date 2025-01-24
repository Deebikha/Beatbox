const { Sequelize, DataTypes } = require('sequelize');

// Database credentials and configuration
const DB_NAME = 'music';
const DB_USER = 'postgres';
const DB_PASS = '2523';
const DB_HOST = 'localhost';
const DB_PORT = 5432;
const DB_DIALECT = 'postgres';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DIALECT,
});

// User model
const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
});

// Favorite model
const Favorite = sequelize.define('favorite', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  trackId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  trackName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  albumImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  artists: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = { sequelize, User, Favorite };
