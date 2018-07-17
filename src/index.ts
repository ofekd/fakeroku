import { FakerokuApplication } from './application';
import { ApplicationConfig } from '@loopback/core';

export { FakerokuApplication };

export async function main(options?: ApplicationConfig) {
  const app = new FakerokuApplication(options);
  await app.boot();
  await app.start();
  return app;
}
