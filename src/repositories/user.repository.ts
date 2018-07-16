import { User, Resource } from '../models';
import { ResourceRepository } from './resource.repository';
import { inject } from '@loopback/core';
import {
  repository,
  DefaultCrudRepository,
  juggler,
  HasManyRepositoryFactory
} from '@loopback/repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id
  > {

  public resources: HasManyRepositoryFactory<typeof User.prototype.id, Resource>;

  constructor(
    @inject('repositories.user.datasource') protected datasource: juggler.DataSource,
    @repository(ResourceRepository) resourceRepository: ResourceRepository,
  ) {
    super(User, datasource);
    this.resources = this._createHasManyRepositoryFactoryFor(
      'resources',
      resourceRepository,
    );
  }
}
