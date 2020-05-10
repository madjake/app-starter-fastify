// PAGES
const indexPage = require("./pages/index");

// Standard HTTP Routes
const HTTPRoutes = (fastify) => {
  fastify.get("/", indexPage); //home page

  fastify.addGETAuthRoute("/profile", async (request, reply) => {
    return { output: request.user };
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
      .send("You are logged in now.");
  });
};

module.exports = {
  HTTPRoutes: HTTPRoutes,
  webSocketRoutes: require("./handlers/webSocketHandler"),
};
