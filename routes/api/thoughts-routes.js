const router = require("express").Router();
const {
  getAllThoughts,
  getThoughtById,
  addThought,
  updateThought,
  removeThought,
  addReaction,
  removeReaction,
} = require("../../controllers/api/thoughts-controller");

// /api/thoughts
router.route("/").get(getAllThoughts);

// /api/thoughts/<thoughtId> or <userId>
// get, put <thoughtId>
// post <userId>
router.route("/:id").get(getThoughtById).post(addThought).put(updateThought);

// /api/thoughts/<userId>/<thoughtId>
router.route("/:userId/:thoughtId").put(addReaction).delete(removeThought);

router.route("/:userId/:thoughtId/:reactionId").delete(removeReaction);

module.exports = router;
