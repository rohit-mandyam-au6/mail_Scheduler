const mailer = require("../models/mailer");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const { encrypt, decrypt } = require("../crypto");
const { info } = require("console");

module.exports = {
  create: async (req, res, next) => {
    try {
      const { from, fromPass, to, subject, text, scheduler_interval } =
        req.body;
      let hash = encrypt(fromPass);
      let data = await mailer.create({
        from: from,
        to: to,
        fromPass: hash.content,
        subject: subject,
        text: text,
        scheduler_interval: scheduler_interval,
      });
      const dec = decrypt(hash);
      //console.log("dec", dec);
      // e-mail message options
      let mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: text,
      };
      // e-mail transport configuration
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: from.toString(),
          pass: dec.toString(),
        },
      });
      cron.schedule("*/5 * * * *", () => {
        // Send e-mail
        transporter.sendMail(mailOptions, async function (errorMailer, info) {
          if (errorMailer) {
            console.log("errorMailer", errorMailer);
            await mailer.updateOne(
              {
                _id: data._id,
              },
              {
                $set: {
                  success: 0,
                },
              }
            );
            return res.status(503).json({ success: false, error: errorMailer.message });
          } else {
            console.log("Email sent: " + info.response);
            await mailer.updateOne(
              {
                _id: data._id,
              },
              {
                $set: {
                  success: 1,
                },
              }
            );
            return res.status(200).json({
              success: true,
              message: "Email sent successfully",
              data: data,
            });
          }
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(503).json({ success: false, error: error.message });
    }
  },
  getAll: async (req, res) => {
    try {
      let data = await mailer.find();
      return res.status(200).json({
        success: true,
        message: "Data fetched successfully",
        data: data,
      });
    } catch (error) {
      console.log(error);
      return res.status(503).json({ success: false, error: error.message });
    }
  },
  failedResponses: async (req, res) => {
    try {
      let data = await mailer.find({
        success: 0,
      });
      return res.status(200).json({
        success: true,
        message: "Data fetched successfully",
        data: data,
      });
    } catch (error) {
      console.log(error);
      return res.status(503).json({ success: false, error: error.message });
    }
  },
  updateScheduler: async (req, res) => {
    try {
      let data = await mailer.updateOne(
        { _id: req.body.id },
        {
          $set: {
            scheduler_interval: req.body.scheduler_interval,
          },
        }
      );
      if (!data.n && !data.nModified) {
        return res.status(404).json({
          success: false,
          message: "data does not exist",
        });
      } else if (!data.nModified) {
        return res.status(404).json({
          success: false,
          message: "data not updated",
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "data update successfully",
          data: data,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(503).json({ success: false, error: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      let data = await mailer.remove({ _id: req.body.id });
      if (!data.n && !data.deletedCount) {
        return res.status(404).json({
          success: false,
          message: "data does not exist",
        });
      } else if (!data.deletedCount) {
        return res.status(404).json({
          success: false,
          message: "data not deleted",
        });
      }
      return res.status(200).json({
        success: true,
        message: "data deleted successfully",
        data: data,
      });
    } catch (error) {
      console.log(error);
      return res.status(503).json({ success: false, error: error.message });
    }
  },
};
