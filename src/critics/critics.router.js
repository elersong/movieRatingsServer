const router = require("express").Router();
const controller = require("./critics.controller");

router.route("/").get(controller.list);
router.route("/:critic_id").get(controller.read);

module.exports = router;