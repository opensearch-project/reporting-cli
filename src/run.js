/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const sendEmail = require('./email-helpers.js');
const downloadReport = require('./download-helpers.js');
const { getCommandArguments, getEventArguments } = require('./arguments.js');

module.exports = async function run(args) {
    var options = args !== undefined ? await getEventArguments(args) : await getCommandArguments();
    if (args !== undefined) {
        options.filename = '/tmp/' + options.filename;
        options.emailbody = '/tmp/' + options.emailbody;
    }

    await downloadReport(
        options.url,
        options.format,
        options.width,
        options.height,
        options.filename,
        options.auth,
        options.username,
        options.password,
        options.tenant,
        options.multitenancy,
        options.time,
        options.transport,
        options.emailbody,
        options.timeout
    );

    await sendEmail(
        options.filename,
        options.url,
        options.sender,
        options.recipient,
        options.transport,
        options.smtphost,
        options.smtpport,
        options.smtpsecure,
        options.smtpusername,
        options.smtppassword,
        options.subject,
        options.note,
        options.emailbody,
        options.selfsignedcerts
    );
}
