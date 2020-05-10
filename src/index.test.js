//const supertest = require("supertest");
//const WebSocket = require('ws');
import supertest from "supertest";
import WebSocket from "ws";

import { getConfigFromEnvironment } from "./lib/config.js";
import { httpRoutes, webSocketHandler } from "./routes.js";
import ApplicationServer from "./ApplicationServer.js";

let applicationServer;

beforeAll(async () => {
  const appConfig = getConfigFromEnvironment("local");

  const randomPort = 5000 + Math.floor(Math.random() * 10000);
  appConfig.port = randomPort;

  applicationServer = new ApplicationServer(appConfig);

  applicationServer.registerRoutes(httpRoutes);
  applicationServer.registerRoutes(webSocketHandler);

  await applicationServer.start();
});

afterAll(async () => {
  applicationServer.close();
});

test("if loaded config has basic values set", async () => {
  expect(
    Object.keys(applicationServer.applicationConfig.cookies).length
  ).toBeGreaterThan(5);
  expect(
    Object.keys(applicationServer.applicationConfig.jwt).length
  ).toBeGreaterThan(0);
  expect(
    applicationServer.applicationConfig.cookies.jwtTokenName.length
  ).toBeGreaterThan(0);
});

test("if homepage returns HTTP status code 200", async () => {
  const response = await supertest(applicationServer.fastify.server)
    .get("/")
    .expect(200)
    .expect("Content-Type", "text/html; charset=utf-8");
});

test("if /profile returns HTTP status code 401 not authorized when requested without JWT cookie", async () => {
  const response = await supertest(applicationServer.fastify.server)
    .get("/profile")
    .expect(401)
    .expect("Content-Type", "text/html; charset=utf-8");
});

test("if websocket without jwt cookie is rejected when accessing /wsdata websocket endpoint", async (done) => {
  const ws = new WebSocket(
    `ws://${applicationServer.getAddress()}:${applicationServer.getPort()}/wsdata`
  )
    .on("open", () => {
      ws.send("Test message");
    })
    .on("message", (data) => {
      expect(data).toEqual(
        expect.stringMatching("Not authenticated. Closing connection.")
      );
    })
    .on("close", () => {
      done();
    });
});
