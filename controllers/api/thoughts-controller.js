const { Thoughts, User } = require("../../models");

const thoughtsController = {
  // get all users
  getAllThoughts(req, res) {
    Thoughts.find({})
      // .populate({
      //   path: "thoughts",
      //   select: "-__v",
      // })
      //   .select("-__v")
      //   .sort({ _id: -1 })
      .then((dbThoughtsData) => res.json(dbThoughtsData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  //   get one thought by id
  getThoughtById({ params }, res) {
    Thoughts.findOne({ _id: params.id })
      // .populate({
      //   path: "comments",
      //   select: "-__v",
      // })
      // .select("-__v")
      .then((dbThoughtsData) => {
        // If no thought is found, send 404
        if (!dbThoughtsData) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(dbThoughtsData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // add thought to user
  addThought({ params, body }, res) {
    console.log(body);
    Thoughts.create(body)
      .then(({ _id }) => {
        console.log(_id);
        return User.findOneAndUpdate(
          { _id: params.id },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  // update thought by id
  updateThought(req, res) {
    Thoughts.findOne({ _id: req.params.id })
      .then((originalData) => {
        if (!originalData) {
          return res.status(404).json({ message: "No thought with this id!" });
        }
        console.log(originalData.username);
        if (originalData.username != req.body.username) {
          return User.findOne({ username: req.body.username })
            .then((newUser) => {
              if (!newUser) {
                return res.status(404).json({
                  message: `Username ${req.body.username} not found. Create or update the username`,
                });
              }
              return User.findOneAndUpdate(
                { username: req.body.username },
                { $push: { thoughts: req.params.id } },
                { new: true }
              );
            })
            .then((oldUser) => {
              if (oldUser) {
                console.log(
                  `thought ${req.params.id} add to username: ${oldUser.username}`
                );
              }
              return User.findOneAndUpdate(
                { username: originalData.username },
                { $pull: { thoughts: req.params.id } },
                { new: true }
              );
            })

            .then((updatedUser) => {
              if (updatedUser) {
                console.log(
                  `thought ${req.params.id} removed from username: ${updatedUser.username}`
                );
              }
              return updatedUser;
            });
        }
      })
      .then((updatedThought) => {
        return Thoughts.findOneAndUpdate({ _id: req.params.id }, req.body, {
          new: true,
          runValidators: true,
        });
      })
      .then((dbThoughtsData) => {
        res.json(dbThoughtsData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // remove thought
  removeThought({ params }, res) {
    Thoughts.findOneAndDelete({ _id: params.thoughtId })
      .then((deletedThought) => {
        if (!deletedThought) {
          res.status(404).json({ message: "No thought with this id!" });
        }
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { thoughts: params.thoughtId } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!" });
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  addReaction({ params, body }, res) {
    Thoughts.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  // remove reaction
  removeReaction({ params }, res) {
    Thoughts.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtsController;
