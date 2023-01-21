/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export const CLI_COMMAND_NAME = 'opensearch-reporting-cli'
export const DEFAULT_AUTH = 'none';
export const DEFAULT_TENANT = 'private';
export const DEFAULT_FORMAT = 'pdf';
export const DEFAULT_WIDTH = '1680';
export const DEFAULT_MIN_HEIGHT = '600';
export const DEFAULT_FILENAME = 'opensearch-report';
export const DEFAULT_EMAIL_SUBJECT = 'This is an email containing your opensearch dashboard report';

export const REPORT_TYPE = {
  DASHBOARD: 'Dashboard',
  VISUALIZATION: 'Visualization',
  NOTEBOOK: 'Notebook',
  DISCOVER: 'Saved search',
  OTHER: 'Other',
}

export const SELECTOR = {
  DASHBOARD: '#dashboardViewport',
  VISUALIZATION: '.visEditor__content',
  NOTEBOOK: '.euiPageBody',
  DISCOVER: 'button[id="downloadReport"]'
}

export const FORMAT = {
  PDF: 'pdf',
  PNG: 'png',
  CSV: 'csv'
}

export const AUTH = {
  BASIC: 'basic',
  COGNITO: 'cognito',
  SAML: 'saml',
  NONE: 'none',
}

export const URL_SOURCE = {
  DASHBOARDS: "/app/dashboards#",
  VISUALIZE: "/app/visualize#",
  DISCOVER: "/app/discover#",
  NOTEBOOKS: "notebooks",
}

export const ENV_VAR = {
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
  EMAIL_SUBJECT: 'OPENSEARCH_EMAIL_SUBJECT'
}

export const TRANSPORT_TYPE = {
  SES: 'ses',
  SMTP: 'smtp'
}
