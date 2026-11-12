# Naive on purpose (walking skeleton). Known problems are listed in
# docs/phases/phase-3-container/README.md and will be fixed one by one.

# Start from the official Node.js 24 image (Debian + Node.js).
FROM node:24

# Copy the server into the image.
COPY server.js .

# Command a container runs when it starts.
CMD ["node", "server.js"]
