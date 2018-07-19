import { Filter, Where, repository } from '@loopback/repository';
import {
  post,
  param,
  get,
  patch,
  del,
  requestBody,
  HttpErrors
} from '@loopback/rest';
import { Resource, User } from '../models';
import { ResourceRepository } from '../repositories';
import {
  AuthenticationBindings,
  authenticate,
} from '@loopback/authentication';
import { inject, Getter } from '@loopback/context'

export class ResourceController {
  constructor(
    @repository(ResourceRepository)
    public resourceRepository: ResourceRepository,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    private getCurrentUser: Getter<User>,
  ) { }

  @authenticate('JwtStrategy')
  @get('/resources/count')
  async count(@param.query.string('where') where?: Where): Promise<number> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser.isAdmin) {
      throw new HttpErrors.Forbidden('Access denied')
    }

    return await this.resourceRepository.count(where);
  }

  @authenticate('JwtStrategy')
  @get('/resources')
  async find(@param.query.string('filter') filter?: Filter)
    : Promise<Resource[]> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser.isAdmin) {
      throw new HttpErrors.Forbidden('Access denied')
    }

    return await this.resourceRepository.find(filter);
  }

  @authenticate('JwtStrategy')
  @del('/resources')
  async deleteAll(@param.query.string('where') where?: Where): Promise<number> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser.isAdmin) {
      throw new HttpErrors.Forbidden('Access denied')
    }

    return await this.resourceRepository.deleteAll(where);
  }

  @authenticate('JwtStrategy')
  @get('/resources/{id}')
  async findById(@param.path.number('id') id: number): Promise<Resource> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser.isAdmin) {
      throw new HttpErrors.Forbidden('Access denied')
    }

    return await this.resourceRepository.findById(id);
  }

  @authenticate('JwtStrategy')
  @del('/resources/{id}')
  async deleteById(@param.path.number('id') id: number): Promise<boolean> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser.isAdmin) {
      throw new HttpErrors.Forbidden('Access denied')
    }

    return await this.resourceRepository.deleteById(id);
  }
}
