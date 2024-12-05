const { Worker } = require("bullmq");
const connection = require("../../config/redisconfig");
const nodemailer = require("nodemailer");
const hbs = require("hbs");
const path = require("path");
const fs = require("fs");

const sendVerificationEMail = async (name, email, token) => {
  try {
    const smtpTransport = nodemailer.createTransport({
      service: "gmail",
      port: 2525,
      auth: {
        user: "codedev90@gmail.com",
        pass: "cmea bdmo nepc vqus",
      },
    });

    const templatePath = path.join(__dirname, "../../views", "mail.hbs");
    const source = fs.readFileSync(templatePath, "utf8");
    const template = hbs.compile(source);
    const html = template({ name, token });

    const mailOptions = {
      from: "ABC Pvt LTD <abcpvtltd.in>",
      to: email,
      subject: "Verification Mail",
      html: html,
    };

    const response = await smtpTransport.sendMail(mailOptions);
    return true;
  } catch (err) {
    return false;
  }
};

const sendResetPasswordEMail = async (name, email, token) => {
  try {
    const smtpTransport = nodemailer.createTransport({
      service: "gmail",
      port: 2525,
      auth: {
        user: "codedev90@gmail.com",
        pass: "cmea bdmo nepc vqus",
      },
    });

    const templatePath = path.join(__dirname, "../../views", "mail.hbs");
    const source = fs.readFileSync(templatePath, "utf8");
    const template = hbs.compile(source);
    const html = template({ name, token });

    const mailOptions = {
      from: "ABC Pvt LTD <abcpvtltd.in>",
      to: email,
      subject: "Verification Mail",
      html: html,
    };

    await smtpTransport.sendMail(mailOptions);
    return true;
  } catch (err) {
    return false;
  }
};

// emailQueue For sending mail for verify mail id
const worker = new Worker(
  "email-Queue",
  async (job) => {
    try {
      // Process the job

      // Simulate job processing
      //   await new Promise((resolve) => setTimeout(resolve, 1000));

      return await sendVerificationEMail(
        job.data.name,
        job.data.email,
        job.data.token
      );
    } catch (err) {
      return false;
    }
  },

  { connection }
);
