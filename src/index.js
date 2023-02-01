/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const run = require('./run.js');

exports.handler = async function (event) {
    await run(event);
    return;
}
