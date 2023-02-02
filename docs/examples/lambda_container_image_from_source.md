## Create Lambda container image from source code

1. Checkout this package from version control
    ```
    git clone git@github.com:opensearch-project/reporting-cli.git
    cd reporting-cli
    ```
2. Add the following Dockerfile inside `reporting-cli`. 
    ```dockerfile
    # Define function directory
    ARG FUNCTION_DIR="/function"

    # Base image of the docker container
    FROM node:lts-slim as build-image

    # Include global arg in this stage of the build
    ARG FUNCTION_DIR

    # AWS Lambda runtime dependencies
    RUN apt-get update && \
        apt-get install -y \
            g++ \
            make \
            unzip \
            libcurl4-openssl-dev \
            autoconf \
            automake \
            libtool \
            cmake \
            python3 \
            libkrb5-dev

    # Copy function code
    COPY package.json src/ ${FUNCTION_DIR}/
    WORKDIR ${FUNCTION_DIR}
    RUN npm install && npm install aws-lambda-ric

    # Build Stage 2: Copy Build Stage 1 files in to Stage 2. Install chromium dependencies and chromium.
    FROM node:lts-slim

    # Include global arg in this stage of the build
    ARG FUNCTION_DIR

    # Set working directory to function root directory
    WORKDIR ${FUNCTION_DIR}

    # Copy in the build image dependencies
    COPY --from=build-image ${FUNCTION_DIR} ${FUNCTION_DIR}

    # Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
    # Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer installs, work.
    RUN apt-get update \
        && apt-get install -y wget gnupg \
        && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
        && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
        && apt-get update \
        && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
        --no-install-recommends \
        && apt-get remove -y google-chrome-stable \
        && rm -rf /var/lib/apt/lists/*

    ENTRYPOINT ["/usr/local/bin/npx", "aws-lambda-ric"]

    ENV HOME="/tmp"
    CMD [ "/function/index.handler" ]

    ```
3. Run the build command.
    ```
    docker build -t opensearch-reporting-cli .
    ```