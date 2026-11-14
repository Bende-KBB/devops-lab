# Image for the hello world server.
# Open issues and history: docs/phases/phase-3-container/result.md

# Base: official Node.js image, "slim" variant: Debian without compilers
# and build tools, which this dependency-free server doesn't need.
# Pinned by digest: Docker uses the sha256 and ignores the tag, so every
# build gets exactly this content. The tag only tells humans what it is.
# Update procedure: docs/cheatsheets/docker.md ("Updating the base image").
FROM node:24.22.3-slim@sha256:dc26ae92c9fb15cf6b1d63e20f0944b2efe0f115b20e00be48fb23fceb061c54

# Copy the server into the image.
COPY server.js .

# Run as the unprivileged "node" user (UID 1000) included in the official
# image, not as root. The server only reads server.js and uses port 3000
# (above 1024), so it needs no root rights.
USER node

# The command a container runs when it starts.
CMD ["node", "server.js"]
