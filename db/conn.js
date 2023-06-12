const mongoose = require("mongoose");

const dbconnect = (url) => {
  mongoose.connect(url);
};

module.exports = dbconnect;
