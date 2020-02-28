FROM mcr.microsoft.com/vscode/devcontainers/base:ubuntu-18.04

# Avoid warnings by switching to noninteractive.
ENV DEBIAN_FRONTEND=noninteractive

# Node.js major-version to be installed.
ARG NODE_VERSION=12

# Install Node.js and other packages.
RUN curl -sL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - \
  && apt-get install -y \
  nodejs \
  build-essential \
  software-properties-common \
  # Install the latest version of Git.
  && apt-add-repository ppa:git-core/ppa \
  && apt-get install -y git \
  # Install the latest version of NPM.
  && npm install -g npm \
  # Clean up.
  && apt-get autoremove -y \
  && apt-get clean -y \
  && rm -rf /var/lib/apt/lists/*

# Use "vscode" user from Microsoft base image.
USER vscode

# https://help.github.com/en/github/authenticating-to-github/githubs-ssh-key-fingerprints
ARG GITHUB_FINGERPRINT=SHA256:nThbg6kXUpJWGl7E1IGOCspRomTxdCARLviKw6E5SY8

# Create the folder for storing vs-code extensions.
RUN mkdir -p ~/.vscode-server/extensions \
  && mkdir -p ~/.vscode-server-insiders \
  && ln -s ~/.vscode-server/extensions ~/.vscode-server-insiders/extensions \
  # Add GitHub to known hosts if it matches the fingerprint.
  && mkdir -p ~/.ssh \
  && ssh-keyscan -H github.com > /tmp/keyscan-result \
  && if ssh-keygen -lf /tmp/keyscan-result | grep -q ${GITHUB_FINGERPRINT}; then cat /tmp/keyscan-result >> ~/.ssh/known_hosts; fi \
  && rm /tmp/keyscan-result

# Switch back to dialog for any ad-hoc use of apt-get.
ENV DEBIAN_FRONTEND=dialog
