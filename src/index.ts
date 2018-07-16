import { FakerokuApplicaion } from './application';
import { ApplicationConfig } from '@loopback/core';

export { FakerokuApplicaion };

export async function main(options?: ApplicationConfig) {
  const app = new FakerokuApplicaion(options);
  await app.boot();
  await app.start();
  return app;
}
