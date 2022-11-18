const mongoose = require("mongoose");

// update if deployed to heroku
mongoose.connect("mongodb://127.0.0.1:27017/social-network-API", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Export connection
module.exports = mongoose.connection;
