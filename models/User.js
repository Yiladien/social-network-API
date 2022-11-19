const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  thoughts: {
    type: Date,
    default: Date.now,
  },
  // comments: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "Comment",
  //   },
  // ],
});

// create the User model using the UserSchema
const User = model("User", UserSchema);

// export the User model
module.exports = User;
