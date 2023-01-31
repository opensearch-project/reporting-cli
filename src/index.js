/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

var run = require('./run.js');

exports.handler = async function (event) {
    console.log('IS_LAMBDA: '+process.env.IS_LAMBDA);
    await run(event);
    return;
}
