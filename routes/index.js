const express = require("express");
const router = express.Router();

router.use("/mailer", require("./mailer"));

module.exports = router;