/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const { url, credentials, cli } = require('./cli.js');
const fs = require('fs');
jest.useRealTimers();

describe('download report errors', () => {

  test('missing url error', async () => {
    let result = await cli(['', ''], '.');
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Please specify URL');
  });

  test('missing credentials error', async () => {
    let result = await cli(['-u', 'https://opensearch.org/', '-a', 'basic'], '.');
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Please specify a valid username or password');
  });

  test('missing password error', async () => {
    let result = await cli(['-u', 'https://opensearch.org/', '-a', 'basic', '-c', 'name:'], '.');
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Please specify a valid username or password');
  });

  test('invalid report format error', async () => {
    let result = await cli(['-f', 'txt'], '.');
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('error: option \'-f, --format <type>\' argument \'txt\' is invalid. Allowed choices are pdf, png, csv.');
  });

  test('invalid tenant', async () => {
    let result = await cli(['-u', `${url}/app/dashboards#/view/edf84fe0-e1a0-11e7-b6d5-4dc382ef7f5b`, '-a', 'basic', '-c', credentials,
      '-t', 'custom'], '.');
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Invalid tenant');
  }, 150000);

  test('saved search error', async () => {
    let result = await cli(['-u', `${url}/app/discover#/`, '-a', 'basic', '-c', credentials, '-f', 'csv'], '.');
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Please save search and retry');
  }, 150000);

  test('missing transport value', async () => {
    let result = await cli(['-u', 'https://opensearch.org/', '-n', 'testtransporterror', '-s', 'sender', '-r', 'recipient'], '.');
    const expectedFile = './testtransporterror.pdf';
    const stats = fs.statSync(expectedFile);
    expect(stats.size >= 0).toBeTruthy();
    fs.unlinkSync(expectedFile);
    expect(result.stderr).toContain('Transport value is missing');
  }, 150000);

  test('missing aws config', async () => {
    let result = await cli(['-u', 'https://opensearch.org/', '-n', 'testawsconfigerror', '-e', 'ses', '-r', 'recipient'], '.');
    const expectedFile = './testawsconfigerror.pdf';
    const stats = fs.statSync(expectedFile);
    expect(stats.size >= 0).toBeTruthy();
    fs.unlinkSync(expectedFile);
    expect(result.stderr).toContain('aws config not found');
  }, 150000);

  test('missing sender/recipient', async () => {
    let result = await cli(['-u', 'https://opensearch.org/', '-n', 'testemailerror', '-e', 'smtp', '-r', 'recipient'], '.');
    const expectedFile = './testemailerror.pdf';
    const stats = fs.statSync(expectedFile);
    expect(stats.size >= 0).toBeTruthy();
    fs.unlinkSync(expectedFile);
    expect(result.stderr).toContain('Sender/Recipient value is missing');
  }, 150000);

  test('file already exists', async () => {
    let result = await cli(['-u', 'https://opensearch.org/', '-n', 'report'], '.');
    result = await cli(['-u', 'https://opensearch.org/', '-n', 'report'], '.');
    const expectedFile = './report.pdf';
    const stats = fs.statSync(expectedFile);
    expect(stats.size >= 0).toBeTruthy();
    fs.unlinkSync(expectedFile);
    expect(result.stderr).toContain('File with same name already exists.');
  }, 150000);
});
