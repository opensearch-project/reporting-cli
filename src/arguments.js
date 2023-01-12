#!/usr/bin/env node
/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { program, Option } from 'commander';
import { exit } from 'process';
import ora from 'ora';
import { AUTH, CLI_COMMAND_NAME, DEFAULT_AUTH, DEFAULT_FILENAME, DEFAULT_FORMAT, DEFAULT_MIN_HEIGHT, DEFAULT_TENANT, DEFAULT_WIDTH, ENV_VAR, FORMAT, TRANSPORT_TYPE, DEFAULT_EMAIL_SUBJECT } from './constants.js';
import dotenv from "dotenv";
dotenv.config();

const spinner = ora();

export async function getCommandArguments() {

    program
        .name(CLI_COMMAND_NAME)
        .description('Reporting CLI to download and email reports');

    program
        .addOption(new Option('-u, --url <url>', 'url for the report')
            .env(ENV_VAR.URL))
        .addOption(new Option('-a, --auth <type>', 'authentication type for the report.')
            .default(DEFAULT_AUTH)
            .choices([AUTH.BASIC, AUTH.COGNITO, AUTH.SAML]))
        .addOption(new Option('-c, --credentials <username:password>', 'login credentials')
            .env(ENV_VAR.USERNAME + ' and ' + ENV_VAR.PASSWORD))
        .addOption(new Option('-t, --tenant <tenant>', 'tenants in opensearch dashboards')
            .default(DEFAULT_TENANT))
        .addOption(new Option('-f, --format <type>', 'file format for the report')
            .default(DEFAULT_FORMAT)
            .choices([FORMAT.PDF, FORMAT.PNG, FORMAT.CSV]))
        .addOption(new Option('-w, --width <psize>', 'window width in pixels for the report')
            .default(DEFAULT_WIDTH))
        .addOption(new Option('-l, --height <size>', 'minimum window height in pixels for the report')
            .default(DEFAULT_MIN_HEIGHT))
        .addOption(new Option('-n, --filename <name>', 'file name of the report')
            .default(DEFAULT_FILENAME)
            .env(ENV_VAR.FILENAME))
        .addOption(new Option('-e, --transport <method>', 'transport for sending the email')
            .choices([TRANSPORT_TYPE.SES, TRANSPORT_TYPE.SMTP])
            .env(ENV_VAR.TRANSPORT))
        .addOption(new Option('-s, --from <sender>', 'email address of the sender')
            .env(ENV_VAR.FROM))
        .addOption(new Option('-r, --to <recipient>', 'email address of the recipient')
            .env(ENV_VAR.TO))
        .addOption(new Option('--smtphost <host>', 'hostname of the smtp server')
            .env(ENV_VAR.SMTP_HOST))
        .addOption(new Option('--smtpport <port>', 'port for connection')
            .env(ENV_VAR.SMTP_PORT))
        .addOption(new Option('--smtpsecure <flag>', 'use TLS when connecting to server')
            .env(ENV_VAR.SMTP_SECURE))
        .addOption(new Option('--smtpusername <username>', 'smtp username')
            .env(ENV_VAR.SMTP_USERNAME))
        .addOption(new Option('--smtppassword <password>', 'smtp password')
            .env(ENV_VAR.SMTP_PASSWORD))
        .addOption(new Option('--subject <subject>', 'email Subject')
            .default(DEFAULT_EMAIL_SUBJECT)
            .env(ENV_VAR.EMAIL_SUBJECT))

    program.parse(process.argv);
    const options = program.opts();
    spinner.start('Fetching the arguments values');
    return getOptions(options);
}

function getOptions(options) {
    var commandOptions = {
        url: null,
        auth: null,
        username: null,
        password: null,
        tenant: null,
        format: null,
        width: null,
        height: null,
        filename: null,
        transport: null,
        sender: null,
        recipient: null,
        smtphost: null,
        smtpport: null,
        smtpsecure: null,
        smtpusername: null,
        smtppassword: null,
        subject: null,
    }

    // Set url.
    commandOptions.url = options.url || process.env.OPENSEARCH_URL;
    if (commandOptions.url === undefined || commandOptions.url.length <= 0) {
        spinner.fail('Please specify URL');
        exit(1);
    }

    // Remove double quotes if present.
    if (commandOptions.url.length >= 2 && commandOptions.url.charAt(0) == '"' && commandOptions.url.charAt(commandOptions.url.length - 1) == '"') {
        commandOptions.url = commandOptions.url.substring(1, commandOptions.url.length - 1)
    }

    // Get credentials from command line arguments.
    if (options.credentials !== undefined) {
        commandOptions.username = options.credentials.split(":")[0];
        commandOptions.password = options.credentials.split(":")[1];
    }

    // Get credentials from .env file
    if (commandOptions.username === null || commandOptions.username.length <= 0) {
        commandOptions.username = process.env.OPENSEARCH_USERNAME;
    }
    if (commandOptions.password === null || commandOptions.password.length <= 0) {
        commandOptions.password = process.env.OPENSEARCH_PASSWORD;
    }

    // If auth type is not none & credentials are missing, exit with error.
    commandOptions.auth = options.auth;
    if ((commandOptions.auth !== undefined && commandOptions.auth !== 'none') &&
        ((commandOptions.username == undefined || commandOptions.username.length <= 0) ||
            (commandOptions.password == undefined || commandOptions.password.length <= 0))) {
        spinner.fail('Please specify a valid username or password');
        exit(1);
    }

    // Set tenant
    commandOptions.tenant = options.tenant;

    // Set report format.
    commandOptions.format = options.format;

    // Set default filename is not specified.
    commandOptions.filename = options.filename || process.env.OPENSEARCH_FILENAME;

    // Set width and height of the window
    commandOptions.width = Number(options.width);
    commandOptions.height = Number(options.height);

    // Set transport for the email.
    commandOptions.transport = options.transport || process.env.OPENSEARCH_TRANSPORT;

    // Set email addresse if specified.
    commandOptions.sender = options.from || process.env.OPENSEARCH_FROM;
    commandOptions.recipient = options.to || process.env.OPENSEARCH_TO;

    // Set SMTP options.
    commandOptions.smtphost = options.smtphost || process.env.OPENSEARCH_SMTP_HOST;
    commandOptions.smtpport = options.smtpport || process.env.OPENSEARCH_SMTP_PORT;
    commandOptions.smtpsecure = options.smtpsecure || process.env.OPENSEARCH_SMTP_SECURE;
    commandOptions.smtpusername = options.smtpusername || process.env.OPENSEARCH_SMTP_USERNAME;
    commandOptions.smtppassword = options.smtppassword || process.env.OPENSEARCH_SMTP_PASSWORD;

    // Set email subject.
    commandOptions.subject = options.subject || process.env.OPENSEARCH_EMAIL_SUBJECT;

    spinner.succeed('Fetched argument values')
    return commandOptions;
}