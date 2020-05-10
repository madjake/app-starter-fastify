const request = require('request');
const net = require('net');
const supertest = require('supertest');
let applicationServer;

beforeAll( async () => {
  const config = require('./lib/config');
  const routes = require('./routes');
  const ApplicationServer = require('./ApplicationServer');
  
  const appConfig = config.getConfigFromEnvironment('local');
  
  const randomPort = 5000 + Math.floor(Math.random() * 10000);
  appConfig.port = randomPort;

  applicationServer = new ApplicationServer(appConfig);

  applicationServer.registerRoutes(routes.HTTPRoutes);
  applicationServer.registerRoutes(routes.webSocketRoutes);

  await applicationServer.start();
});

afterAll( async () => {
  applicationServer.close();
});

test('if loaded config has basic values set', async () => {
  expect(Object.keys(applicationServer.applicationConfig.cookies).length).toBeGreaterThan(5);
  expect(Object.keys(applicationServer.applicationConfig.jwt).length).toBeGreaterThan(0);
  expect(applicationServer.applicationConfig.cookies.jwtTokenName.length).toBeGreaterThan(0);
});

test('if homepage returns anything', async() => {
  const response = await supertest(applicationServer.fastify.server)
    .get('/')
    .expect(200)
    .expect('Content-Type', 'text/html; charset=utf-8')
});
