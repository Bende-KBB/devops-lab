# Image for the hello world server.
# Open issues and history: docs/phases/phase-3-container/result.md

# Base: official Node.js 24, "slim" variant: Debian without compilers
# and build tools, which this dependency-free server doesn't need.
FROM node:24-slim

# Copy the server into the image.
COPY server.js .

# The command a container runs when it starts.
CMD ["node", "server.js"]