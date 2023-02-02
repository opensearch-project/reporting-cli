/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const { cli } = require('./cli.js');

describe('help option', () => {

    test('help', async () => {
        const expectedHelpInformation =
            `Usage: opensearch-reporting-cli [options]

Reporting CLI to download and email reports

Options:
  -u, --url <url>                        url for the report (env: OPENSEARCH_URL)
  -a, --auth <type>                      authentication type for the report. (choices: "basic", "cognito", "saml", default: "none")
  -c, --credentials <username:password>  login credentials (env: OPENSEARCH_USERNAME and OPENSEARCH_PASSWORD)
  -t, --tenant <tenant>                  tenants in opensearch dashboards (default: "private")
  -f, --format <type>                    file format for the report (choices: "pdf", "png", "csv", default: "pdf")
  -w, --width <psize>                    window width in pixels for the report (default: "1680")
  -l, --height <size>                    minimum window height in pixels for the report (default: "600")
  -n, --filename <name>                  file name of the report (default: "opensearch-report", env: OPENSEARCH_FILENAME)
  -e, --transport <method>               transport for sending the email (choices: "ses", "smtp", env: OPENSEARCH_TRANSPORT)
  -s, --from <sender>                    email address of the sender (env: OPENSEARCH_FROM)
  -r, --to <recipient>                   email address of the recipient (env: OPENSEARCH_TO)
  --smtphost <host>                      hostname of the smtp server (env: OPENSEARCH_SMTP_HOST)
  --smtpport <port>                      port for connection (env: OPENSEARCH_SMTP_PORT)
  --smtpsecure <flag>                    use TLS when connecting to server (env: OPENSEARCH_SMTP_SECURE)
  --smtpusername <username>              smtp username (env: OPENSEARCH_SMTP_USERNAME)
  --smtppassword <password>              smtp password (env: OPENSEARCH_SMTP_PASSWORD)
  --subject <subject>                    email subject (default: "This is an email containing your opensearch dashboard report", env: OPENSEARCH_EMAIL_SUBJECT)
  --note <note>                          email body (string or path to text file) (default: "Hi,\\nHere is the latest report!", env: OPENSEARCH_EMAIL_NOTE)
  -h, --help                             display help for command

Note: The tenant in the url has the higher priority than tenant value provided as command option.
`;
        let result = await cli(['-h'], '.');
        expect(result.code).toBe(0);
        expect(result.stdout).toBe(expectedHelpInformation);
    });
});
