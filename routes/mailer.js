const express = require("express");
const router = express.Router();
require("dotenv").config();
const mailerCtrl = require("../controllers/mailer");

router.get("/getAll", mailerCtrl.getAll);

router.get("/failed", mailerCtrl.failedResponses);

router.post(
  "/sendMail",
  mailerCtrl.create
);

router.patch("/scheduler/update", mailerCtrl.updateScheduler);

router.delete("/delete", mailerCtrl.delete);

module.exports = router;
