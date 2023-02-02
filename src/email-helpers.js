/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const fs = require('fs');
const AWS = require('aws-sdk');
const path = require('path');
const { exit } = require('process');
const ora = require('ora');
const spinner = ora('');
let ses;

try {
  process.env.AWS_SDK_LOAD_CONFIG = true;
  ses = new AWS.SES();
} catch (err) {
  // Do not set AWS_SDK_LOAD_CONFIG if aws config file is missing.
}

module.exports = async function sendEmail(filename, url, sender, recipient, transport, smtphost, smtpport, smtpsecure, smtpusername, smtppassword, subject, note, emailbody) {
  if (transport !== undefined && (transport === 'smtp' || ses !== undefined) && sender !== undefined && recipient !== undefined) {
    spinner.start('Sending email...');
  } else {
    if (transport === undefined && sender === undefined && recipient === undefined) {
      deleteTemporaryImage(emailbody);
      return;
    } else if (transport === undefined) {
      spinner.warn('Transport value is missing');
    } else if (transport === 'ses' && ses === undefined) {
      spinner.warn('aws config not found');
    } else if (sender === undefined || recipient === undefined) {
      spinner.warn('Sender/Recipient value is missing');
    }
    spinner.fail('Skipped sending email');
    deleteTemporaryImage(emailbody);
    return;
  }

  let mailOptions = getmailOptions(url, sender, recipient, filename, subject, note, emailbody);

  let transporter = getTransporter(transport, smtphost, smtpport, smtpsecure, smtpusername, smtppassword);

  transporter.use("compile", hbs({
    viewEngine: {
      partialsDir: path.join(__dirname, './views/'),
      defaultLayout: ""
    },
    viewPath: path.join(__dirname, './views/'),
    extName: ".hbs"
  }));

  // send email
  return new Promise((success, fail) => {
      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          spinner.fail('Error sending email' + err);
          fail(err);
          exit(1);
        } else {
          spinner.succeed('Email sent successfully');
          deleteTemporaryImage(emailbody);
          success(info);
        }
      });
    });
}

const getTransporter = (transport, smtphost, smtpport, smtpsecure, smtpusername, smtppassword, transporter) => {
  if (transport === 'ses') {
    transporter = nodemailer.createTransport({
      SES: ses
    });
  } else if (transport === 'smtp') {
    transporter = nodemailer.createTransport({
      host: smtphost,
      port: smtpport,
      secure: smtpsecure,
      auth: {
        user: smtpusername,
        pass: smtppassword,
      }
    });
  }
  return transporter;
}

const getmailOptions = (url, sender, recipient, file, emailSubject, note, emailbody, mailOptions = {}) => {
  mailOptions = {
    from: sender,
    subject: emailSubject,
    to: recipient,
    attachments: [
      {
        filename: emailbody,
        path: emailbody,
        cid: 'email_body'
      },
      {
        filename: 'opensearch_logo_darkmode.png',
        path: path.join(__dirname, './views/opensearch_logo_darkmode.png'),
        cid: 'opensearch_logo_darkmode'
      },
      {
        filename: file,
        path: file
      }],
    template: 'index',
    context: {
      REPORT_TITLE: file,
      DASHBOARD_URL: url,
      NOTE: note
    }
  };
  return mailOptions;
}

// Delete temporary image created for email body
function deleteTemporaryImage(emailbody) {
  if (fs.existsSync(emailbody)) {
    fs.unlinkSync(emailbody);
  }
}