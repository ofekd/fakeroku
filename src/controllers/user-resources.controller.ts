import { inject, Getter } from '@loopback/context';
import { Filter, Where, repository } from '@loopback/repository';
import { post, param, requestBody, del, HttpErrors } from '@loopback/rest';
import { UserRepository, ResourceRepository } from '../repositories/';
import { User, Resource } from '../models/';
import { AuthenticationBindings, authenticate } from '@loopback/authentication';

export class UserResourcesController {
  constructor(
    @repository(UserRepository)
    protected userRepository: UserRepository,
    @repository(ResourceRepository)
    protected resourceRepository: ResourceRepository,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    private getCurrentUser: Getter<User>,
  ) { }

  @authenticate('JwtStrategy')
  @post('/users/{id}/resources')
  async create(
    @param.path.number('id') userId: typeof User.prototype.id,
    @requestBody() resource: Resource,
  ): Promise<Resource> {
    const currentUser = await this.getCurrentUser();
    if (currentUser.id !== userId && !currentUser.isAdmin) {
      throw new HttpErrors.Forbidden('Access denied')
    }

    const resourcesCount = await this.resourceRepository.count({
      ownerId: userId
    });
    if (resourcesCount >= currentUser.quota) {
      throw new HttpErrors.Forbidden('Quota reached');
    }

    const isExists = await this.resourceRepository.findOne({
      where: {
        name: resource.name
      }
    });
    if (isExists) {
      throw new HttpErrors.Conflict('Resource name already in use');
    }

    return await this.userRepository.resources(userId).create(resource);
  }

  @authenticate('JwtStrategy')
  @post('/users/{id}/resources')
  async find(
    @param.path.number('id') userId: typeof User.prototype.id,
    @param.query.string('filter') filter?: Filter,
  ): Promise<Resource[]> {
    const currentUser = await this.getCurrentUser();
    if (currentUser.id !== userId && !currentUser.isAdmin) {
      throw new HttpErrors.Forbidden('Access denied')
    }

    return await this.userRepository.resources(userId).find(filter);
  }

  @authenticate('JwtStrategy')
  @del('/users/{userId}/resources')
  async deleteAll(
    @param.path.number('userId') userId: typeof User.prototype.id,
    @param.query.string('where') where?: Where
  ): Promise<number> {
    const currentUser = await this.getCurrentUser();
    if (currentUser.id !== userId && !currentUser.isAdmin) {
      throw new HttpErrors.Forbidden('Access denied')
    }

    return await this.userRepository.deleteAll(where);
  }

  @authenticate('JwtStrategy')
  @del('/users/{userId}/resources/{resourceId}')
  async delete(
    @param.path.number('userId') userId: typeof User.prototype.id,
    @param.path.number('resourceId') resourceId: typeof Resource.prototype.id,
  ): Promise<Number> {
    const currentUser = await this.getCurrentUser();
    if (currentUser.id !== userId && !currentUser.isAdmin) {
      throw new HttpErrors.Forbidden('Access denied')
    }

    return await this.userRepository.resources(userId).delete({
      id: resourceId
    });
  }
}
