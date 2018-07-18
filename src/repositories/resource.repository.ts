import { DefaultCrudRepository, juggler } from '@loopback/repository';
import { Resource } from '../models';
import { inject } from '@loopback/core';

export class ResourceRepository extends DefaultCrudRepository<
  Resource,
  typeof Resource.prototype.id
  > {
  constructor(
    @inject('options.repositories.Resource.datasource')
    protected datasource: juggler.DataSource,
  ) {
    super(Resource, datasource);
  }
}
