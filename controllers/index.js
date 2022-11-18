const router = require("express").Router();

const apiRoutes = require("./api/");

router.use("/", homeRoutes);

module.exports = router;
