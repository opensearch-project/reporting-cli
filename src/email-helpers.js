/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import ora from 'ora';
import fs from 'fs';
import AWS from "aws-sdk";
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const spinner = ora();
let ses;

try {
  process.env.AWS_SDK_LOAD_CONFIG = true;
  ses = new AWS.SES();
} catch (err) {
  // Do not set AWS_SDK_LOAD_CONFIG if aws config file is missing.
}

export async function sendEmail(filename, url, sender, recipient, transport, smtphost, smtpport, smtpsecure, smtpusername, smtppassword, subject, note) {
  if (transport !== undefined && (transport === 'smtp' || ses !== undefined) && sender !== undefined && recipient !== undefined) {
    spinner.start('Sending email...');
  } else {
    if (transport === undefined && sender === undefined && recipient === undefined) {
      deleteTemporaryImage();
      return;
    } else if (transport === undefined) {
      spinner.warn('Transport value is missing');
    } else if (transport === 'ses' && ses === undefined) {
      spinner.warn('aws config not found');
    } else if (sender === undefined || recipient === undefined) {
      spinner.warn('Sender/Recipient value is missing');
    }
    spinner.fail('Skipped sending email');
    deleteTemporaryImage();
    return;
  }

  let mailOptions = getmailOptions(url, sender, recipient, filename, subject, note);

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
  await transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      spinner.fail('Error sending email' + err);
    } else {
      spinner.succeed('Email sent successfully');
    }
    deleteTemporaryImage();
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

const getmailOptions = (url, sender, recipient, file, emailSubject, note, mailOptions = {}) => {
  mailOptions = {
    from: sender,
    subject: emailSubject,
    to: recipient,
    attachments: [
      {
        filename: 'email_body.png',
        path: 'email_body.png',
        cid: 'email_body'
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

function deleteTemporaryImage() {
  // Delete temporary image created for email body
  if (fs.existsSync('email_body.png')) {
    fs.unlinkSync('email_body.png');
  }
}