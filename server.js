const http = require("node:http");

const server = http.createServer((request, response) => {
    response.setHeader("Content-Type", "text/plain; charset=utf-8");
    response.end("Hello world\n");
});

server.listen(3000);
console.log("Server listening on port 3000");