import dateFormat, { masks } from "dateformat";

const { Schema, model } = require("mongoose");

const ReactionSchema = new Schema(
  {
    // set custom id to avoid confusion with parent comment _id
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 280,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const ThoughtsSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) =>
        dateFormat(createdAtVal, "dddd, mmmm dS, yyyy, h:MM:ss TT"),
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    // use ReplySchema to validate data for a reply
    reactions: [ReactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// get total count of friends
ThoughtsSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

// create the Thoughts model using the ThoughtsSchema
const Thoughts = model("Thoughts", ThoughtsSchema);

// export the Thoughts model
module.exports = Thoughts;
