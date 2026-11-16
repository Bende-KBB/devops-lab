const http = require("node:http");

const server = http.createServer((request, response) => {
    response.setHeader("Content-Type", "text/plain; charset=utf-8");
    response.end("Hello world\n");
});


// Simulated initialization: real services take seconds to start
// (loading configuration, connecting to databases, warming caches).
// This app models one; the delay is deliberate, not real work.
const STARTUP_DELAY_MS = 5000;

console.log(`Initializing (simulated, ${STARTUP_DELAY_MS / 1000} s)...`);
setTimeout(() => {
  server.listen(3000);
  console.log("Listening on port 3000");
}, STARTUP_DELAY_MS);



// Graceful shutdown: on a stop signal, stop accepting new connections,
// let open requests finish, then exit. Platforms (Docker, Kubernetes)
// send SIGTERM; Ctrl+C in a terminal sends SIGINT.
const SHUTDOWN_TIMEOUT_MS = 5000; // exit anyway if requests don't finish in time

function shutDown(signal) {
  console.log(`Received ${signal}, shutting down`);

  server.close(() => {
    console.log("All connections closed, exiting");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Shutdown timed out, exiting");
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS).unref();
}

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);
