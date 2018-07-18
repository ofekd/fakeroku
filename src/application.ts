import { ApplicationConfig } from '@loopback/core';
import { RestApplication, RestServer, RestBindings } from '@loopback/rest';
import { MySequence } from './sequence';
import { DevdbDataSource, ProddbDataSource } from './datasources';
import { UserRepository, ResourceRepository } from './repositories'

/* tslint:disable:no-unused-variable */
// Binding and Booter imports are required to infer types for BootMixin!
import { BootMixin, Booter, Binding } from '@loopback/boot';

// juggler imports are required to infer types for RepositoryMixin!
import {
  Class,
  Repository,
  RepositoryMixin,
  juggler,
} from '@loopback/repository';
/* tslint:enable:no-unused-variable */

export class FakerokuApplication extends
  BootMixin(RepositoryMixin(RestApplication)) {
  constructor(options?: ApplicationConfig) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    this.dataSource(DevdbDataSource);
    this.dataSource(ProddbDataSource);

    this.repository(UserRepository);
    this.repository(ResourceRepository);

    if (this.options && this.options.repositories) {
      const migrate = [];

      // Add datasource reference by model name
      for (const modelName in this.options.repositories) {
        const dsName = this.options.repositories[modelName].datasource;
        const ds = <juggler.DataSource>this.getSync(`datasources.${dsName}`);

        this.bind(`options.repositories.${modelName}.datasource`).to(ds);

        // If config asks for migrate in production, add to queue
        const isMigrate = this.options.repositories[modelName].migrate;
        if (isMigrate && process.env.NODE_ENV === 'development') {
          migrate.push({ ds, modelName })
        }
      }

      // Safe, redundant check to prevent data loss
      // Migration depends on data sources so is executed separately
      if (process.env.NODE_ENV === 'development') {
        for (const { ds, modelName } of migrate) {
          this.getSync(`repositories.${modelName}Repository`);
          const automigrate = ds.automigrate(modelName);

          if (automigrate) {
            automigrate.then(() => console.log(`Migrated ${modelName}`));
          }
        }
      }
    }
  }

  async start() {
    await super.start();

    const server = await this.getServer(RestServer);
    const port = await server.get(RestBindings.PORT);
    console.log(`Server is running at http://127.0.0.1:${port}`);
  }
}
