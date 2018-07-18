import { createClientForHandler, supertest } from '@loopback/testlab';
import { RestServer } from '@loopback/rest';
import { FakerokuApplication } from '../';

describe('PingController', () => {
  let app: FakerokuApplication;
  let server: RestServer;
  let client: supertest.SuperTest<supertest.Test>;

  before(givenAnApplication);

  before(givenARestServer);

  before(async () => {
    await app.boot();
    await app.start();
  });

  before(() => {
    client = createClientForHandler(server.requestHandler);
  });

  after(async () => {
    await app.stop();
  });

  it('invokes GET /ping', async () => {
    await client.get('/ping?msg=world').expect(200);
  });

  function givenAnApplication() {
    app = new FakerokuApplication({
      rest: {
        port: 0,
      },
    });
  }

  async function givenARestServer() {
    server = await app.getServer(RestServer);
  }
});
