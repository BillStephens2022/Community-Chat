const Sequelize = require('sequelize');
require('dotenv').config();

const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

cloudinary.config({ 
  cloud_name: 'drmapjksn', 
  api_key: '778152731239316', 
  api_secret: '8AOpytmYPCeDM4Qxf9I9k8Kl_04' 
});



let sequelize;

if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: 'localhost',
      dialect: 'mysql',
      port: 3306
    }
  );
}

module.exports = sequelize;
