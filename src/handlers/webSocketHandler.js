import * as cookie from "cookie";
import fastifyWebSocket from "fastify-websocket";

const handler = (fastify) => {
  //wsdata endpoint
  fastify.register(fastifyWebSocket);

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

export const webSocketHandler = handler;
