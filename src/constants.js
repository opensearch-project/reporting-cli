/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const CLI_COMMAND_NAME = 'opensearch-reporting-cli'
const DEFAULT_AUTH = 'none';
const DEFAULT_TENANT = 'private';
const DEFAULT_FORMAT = 'pdf';
const DEFAULT_WIDTH = '1680';
const DEFAULT_MIN_HEIGHT = '600';
const DEFAULT_FILENAME = 'opensearch-report';
const DEFAULT_EMAIL_SUBJECT = 'This is an email containing your opensearch dashboard report';
const DEFAULT_EMAIL_NOTE = 'Hi,\nHere is the latest report!';

const REPORT_TYPE = {
  DASHBOARD: 'Dashboard',
  VISUALIZATION: 'Visualization',
  NOTEBOOK: 'Notebook',
  DISCOVER: 'Saved search',
  OTHER: 'Other',
}

const SELECTOR = {
  DASHBOARD: '#dashboardViewport',
  VISUALIZATION: '.visEditor__content',
  NOTEBOOK: '.euiPageBody',
  DISCOVER: 'button[id="downloadReport"]'
}

const FORMAT = {
  PDF: 'pdf',
  PNG: 'png',
  CSV: 'csv'
}

const AUTH = {
  BASIC: 'basic',
  COGNITO: 'cognito',
  SAML: 'saml',
  NONE: 'none',
}

const URL_SOURCE = {
  DASHBOARDS: "/app/dashboards#",
  VISUALIZE: "/app/visualize#",
  DISCOVER: "/app/discover#",
  NOTEBOOKS: "notebooks",
}

const ENV_VAR = {
  URL: 'OPENSEARCH_URL',
  USERNAME: 'OPENSEARCH_USERNAME',
  PASSWORD: 'OPENSEARCH_PASSWORD',
  FILENAME: 'OPENSEARCH_FILENAME',
  TRANSPORT: 'OPENSEARCH_TRANSPORT',
  FROM: 'OPENSEARCH_FROM',
  TO: 'OPENSEARCH_TO',
  SMTP_HOST: 'OPENSEARCH_SMTP_HOST',
  SMTP_PORT: 'OPENSEARCH_SMTP_PORT',
  SMTP_SECURE: 'OPENSEARCH_SMTP_SECURE',
  SMTP_USERNAME: 'OPENSEARCH_SMTP_USERNAME',
  SMTP_PASSWORD: 'OPENSEARCH_SMTP_PASSWORD',
  EMAIL_SUBJECT: 'OPENSEARCH_EMAIL_SUBJECT',
  EMAIL_NOTE: 'OPENSEARCH_EMAIL_NOTE',
}

const TRANSPORT_TYPE = {
  SES: 'ses',
  SMTP: 'smtp'
}

module.exports = {
  CLI_COMMAND_NAME, DEFAULT_AUTH, DEFAULT_TENANT, DEFAULT_FORMAT, DEFAULT_WIDTH, DEFAULT_MIN_HEIGHT, DEFAULT_FILENAME, DEFAULT_EMAIL_SUBJECT,
  DEFAULT_EMAIL_NOTE, REPORT_TYPE, SELECTOR, FORMAT, AUTH, URL_SOURCE, ENV_VAR, TRANSPORT_TYPE
};