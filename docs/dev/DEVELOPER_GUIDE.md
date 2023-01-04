## Developer Guide

### Prerequisites

The node version "^12.20.0 || >=14" is required.

### SOP for installing and running reporting-cli

1. Checkout this package from version control
    ```
    git clone git@github.com:opensearch-project/reporting-cli.git
    cd reporting-cli
    git checkout main
    ```
2. Run `yarn` inside `src`
3. You can run the below commands inside `src`
    ```
    node index.js --url <url>
    ```
    For additional command line parameter options
    ```
    node index.js -h
    ```
4. Alternatively, you can use npm install to run this command from any directory.
    ```
    cd reporting-cli/
    npm install -g .
    ```
    Once the installation is complete, you can use
    ```
    reporting --url <url> 
    ```

    To uninstall, use  
    ```
    npm uninstall -g reporting
    ```
    