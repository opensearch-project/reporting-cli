# OpenSearch Reporting CLI

Reporting CLI is a quick out-of-box options to be able to download reports without using Dashboards.

## Features

- Reporting CLI supports following authentication types for OpenSearch Dashboards connection.
    - Basic authentication
    - Cognito authentication
    - SAML authentication
    - No auth
- Reporting CLI supports downloading reports in below file formats.
    - PDF
    - PNG
    - CSV
- Reporting CLI can be used to send email with report as an attachment.   

## Command-line Options

Reporting CLI supports following configurable options.

Option | Default Value | Valid Options |  Environment Variable | Description
-- | --- | --- | --- | --- |
-u, --url | - | - | OPENSEARCH_URL | url for the report
-f, --format | pdf | pdf, png, csv | - | file format for the report
-w, --width | 1680 | - | - | window width in pixels for the report
-l, --height | 600 | - | - | minimum window height in pixels for the report
-n, --filename | opensearch-report-timestamp | - | OPENSEARCH_FILENAME | file name of the report
-a, --auth | none | basic, saml, cognito | - | authentication type for the report
-t, --tenant | private | - | - | tenants in opensearch dashboards
--multitenancy | true | true, false | - | enable or disable multi-tenancy
-c, --credentials | - | - | OPENSEARCH_USERNAME and OPENSEARCH_PASSWORD | login credentials in the format of username:password for connecting to url
-s, --from | - | - | OPENSEARCH_FROM | email address of the sender
-r, --to | - | - | OPENSEARCH_TO | email address of the recipient
-e, --transport | - | ses, smtp | OPENSEARCH_TRANSPORT | transport for sending the email
--smtphost | - | - | OPENSEARCH_SMTP_HOST | the hostname of the smtp server
--smtpport | - | - | OPENSEARCH_SMTP_PORT | the port for connection
--smtpusername | - | - | OPENSEARCH_SMTP_USERNAME | smtp username
--smtppassword | - | - | OPENSEARCH_SMTP_PASSWORD | smtp password
--smtpsecure | - | - | OPENSEARCH_SMTP_SECURE | if true the connection will use TLS when connecting to server.
--subject | This is an email containing your dashboard report | - | OPENSEARCH_SUBJECT | subject for the email
--note | Hi,\nHere is the latest report! | string or path to text file | OPENSEARCH_EMAIL_NOTE | The email body
--selfsignedcerts | false | true, false | - | enable or disable self-signed certicates for smtp transport
--timeout | 300000 | - | OPENSEARCH_TIMEOUT | timeout for generating report in ms
| - | - | - | CHROMIUM_PATH | path to chromium directory

You can also find this information using help command.
```
opensearch-reporting-cli --help
```

NOTE: The tenant in the url has the higher priority than tenant value provided as command option. For example, if the command is `opensearch-reporting-cli -u http://localhost:5601/goto/069af6d6f3294421ec163b07fef91e5d?security_tenant=private -t global` then tenant value *private* will be used for generating report because url contains *security_tenant=private*.

## Environment Variable File

Reporting CLI also reads environment variables from .env file in the current directory.

- Each line should have format NAME=VALUE
- Lines starting with # are considered as comments.
- There is no special handling of quotation marks.

NOTE: Values from the command line argument has higher priority than environment variables. For example, if you add filename as *test* in *.env* file and also add `--filename report` command option, the downloded report's name will be *report*.

## Example

Sample command for downloading a dashboard report with basic authentication in png format
```
opensearch-reporting-cli --url https://localhost:5601/app/dashboards#/view/7adfa750-4c81-11e8-b3d7-01146121b73d --format png --auth basic --credentials admin:< Admin password >
```
Report will be downloaded in the current directory.

### Sending an Email with report attachment using Amazon SES

Prerequisites:
- The sender's email address must be verified on [Amazon SES](https://aws.amazon.com/ses/).
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html) is required to interact with Amazon SES. 
- [Configure](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html#cli-configure-quickstart-config) basic settings used by AWS CLI.
-  SES transport requires ses:SendRawEmail role.
```
{
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "ses:SendRawEmail",
      "Resource": "*"
    }
  ]
}
```

Sample command to send email with report as an attachment:
```
opensearch-reporting-cli --url https://localhost:5601/app/dashboards#/view/7adfa750-4c81-11e8-b3d7-01146121b73d --transport ses --from <sender_email_id> --to <recipient_email_id>
```
This example uses default values for all other options.

You can also set *OPENSEARCH_FROM*, *OPENSEARCH_TO*, *OPENSEARCH_TRANSPORT* as environment variables and use following command.
```
opensearch-reporting-cli --url https://localhost:5601/app/dashboards#/view/7adfa750-4c81-11e8-b3d7-01146121b73d
```

### Sending an Email with report attachment using SMTP

For sending email using SMTP transport, the options **OPENSEARCH_SMTP_HOST**, **OPENSEARCH_SMTP_PORT**, **OPENSEARCH_SMTP_USERNAME**, **OPENSEARCH_SMTP_PASSWORD**, **OPENSEARCH_SMTP_SECURE** need to be set in environment variables.

Once above options are set, you can send the email using below sample command.
```
opensearch-reporting-cli --url https://localhost:5601/app/dashboards#/view/7adfa750-4c81-11e8-b3d7-01146121b73d --transport smtp --from <sender_email_id> --to <recipient_email_id>
```

You can choose to set options using *.env* file or the command line argument values in any combination. Make sure to specify all required values to avoid getting errors.

## Limitations
- Supported platforms are Windows x86, Windows x64, Mac Intel, Mac ARM, Linux x86, Linux x64.
  
  For any other platform, users can take advantage of *CHROMIUM_PATH* environment variable to use custom chromium.

- If a URL contains `!`, history expansion needs to be disable temporarily.

  bash: `set +H`

  zsh: `setopt nobanghist`


  Alternate option would be adding URL value in envirnoment variable as URL="<url-with-!>" 

- All command option currently accept only lower-case letters.

## Troubleshooting

- To resolve **MessageRejected: Email address is not verified**, [check](https://aws.amazon.com/premiumsupport/knowledge-center/ses-554-400-message-rejected-error/) this arcticle.
