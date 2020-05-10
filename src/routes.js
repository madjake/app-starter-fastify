// PAGES
import indexPage from "./pages/index.js";
import { inspect } from "util";

export { webSocketHandler } from "./handlers/webSocketHandler.js";

// Standard HTTP Routes
export const httpRoutes = (fastify) => {
  fastify.get("/", indexPage); //home page

  fastify.addGETAuthRoute("/profile", async (request, reply) => {
    if (!request.user) {
      return reply
        .code(401)
        .type("text/html; charset=utf-8")
        .send("This should not happen.");
    }

    return reply.send(`Your session: ${inspect(request.user)}`);
  });

  fastify.get("/logout", async (request, reply) => {});

  fastify.get("/login", async (request, reply) => {
    const token = await reply.jwtSign({
      name: "guest",
      roles: ["guest"],
      expiresIn: request.config.jwt.expiresIn,
    });

    await reply
      .setCookie(request.config.cookies.jwtTokenName, token, {
        domain: request.config.cookies.domain,
        path: request.config.cookies.path,
        secure: request.config.cookies.secure,
        httpOnly: request.config.cookies.httpOnly,
        sameSite: request.config.cookies.sameSite,
      })
      .send("You are now logged in with a guest session.");
  });
};
