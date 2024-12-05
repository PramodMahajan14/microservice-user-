# Use Ubuntu as the base image
FROM ubuntu:latest

# Set environment variables to avoid interactive installation problems
# ENV DEBIAN_FRONTEND=noninteractive

# Change to a different mirror for faster package download
# RUN sed -i 's|http://archive.ubuntu.com/ubuntu/|http://us.archive.ubuntu.com/ubuntu/|g' /etc/apt/sources.list

# Update package lists and install necessary packages in one layer
RUN apt-get update && \
    apt-get install -y curl gnupg build-essential && \
    curl -fsSL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get install -y nodejs && \
    apt-get upgrade -y && \
    rm -rf /var/lib/apt/lists/*

# FROM node
# WORKDIR /var/app
# COPY package.json package.json
# COPY . .
# RUN npm install
# COPY --from=hostmachine /home/ubuntu /var
# EXPOSE 4002
# ENTRYPOINT [ "node","index.js"]