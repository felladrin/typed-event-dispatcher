FROM node:12-buster-slim

# Avoid warnings by switching to noninteractive
ENV DEBIAN_FRONTEND=noninteractive

# Set data for non-root user creation
ARG USERNAME=node
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Update packages lists
RUN apt-get update \
  # Install utils
  && apt-get -y install --no-install-recommends apt-utils dialog 2>&1 \ 
  #
  # Verify git and needed tools are installed
  && apt-get -y install git iproute2 procps \
  #
  # Update a non-root user to UID/GID if needed.
  && if [ "$USER_GID" != "1000" ] || [ "$USER_UID" != "1000" ]; then \
  groupmod --gid $USER_GID $USERNAME \
  && usermod --uid $USER_UID --gid $USER_GID $USERNAME \
  && chown -R $USER_UID:$USER_GID /home/$USERNAME; \
  fi \
  #
  # Add add sudo support for non-root user
  && apt-get install -y sudo \
  && echo node ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
  && chmod 0440 /etc/sudoers.d/$USERNAME \
  #
  # Add known RSA host keys
  && ssh-keyscan -t rsa github.com >> /etc/ssh/ssh_known_hosts \
  #
  # Clean up
  && apt-get autoremove -y \
  && apt-get clean -y \
  && rm -rf /var/lib/apt/lists/*

# Switch back to dialog for any ad-hoc use of apt-get
ENV DEBIAN_FRONTEND=dialog
