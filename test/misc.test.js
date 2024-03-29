/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const fs = require('fs');
const { url, credentials, cli } = require('./cli.js');

jest.useRealTimers();

describe('download report errors', () => {

    test('dashboard report with basic auth and default tenant', async () => {
        let result = await cli(['-u', `${url}/app/dashboards#/view/722b74f0-b882-11e8-a6d9-e546fe2bba5f`, '-a', 'basic', '-c', credentials,
            '-n', 'basicauthdashboard'], '.');
        expect(result.code).toBe(0);
        const expectedFile = './basicauthdashboard.pdf';
        const stats = fs.statSync(expectedFile);
        expect(stats.size >= 0).toBeTruthy();
        fs.unlinkSync(expectedFile);
    }, 150000);
});
