const cookie = require("cookie");

const webSocketHandler = (fastify) => {
  //wsdata endpoint
  fastify.register(require("fastify-websocket"));

  fastify.get(
    "/wsdata",
    { websocket: true },
    async (connection, req, params) => {
      if (!req || !req.headers || !req.headers.cookie) {
        connection.socket.send("Not authenticated. Closing connection.");
        connection.socket.close();
        return;
      }

      try {
        const cookies = cookie.parse(req.headers.cookie);
        const result = await fastify.jwt.verify(cookies.appToken);
      } catch (err) {
        connection.send("Not authenticated. Closing connection.");
        connection.socket.close();
        return;
      }

      connection.socket.on("message", (message) => {
        connection.socket.send("hi from server");
      });
    }
  );
};

module.exports = webSocketHandler;
