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
import { User } from '../models';
import { UserRepository } from '../repositories';
import { Utils } from '../services';
import { inject, Getter } from '@loopback/context';
import {
  AuthenticationBindings,
  authenticate,
} from '@loopback/authentication';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    private getCurrentUser: Getter<User>,
  ) { }

  @post('/users')
  async create(@requestBody() obj: User)
    : Promise<User> {
    obj.password = await Utils.hashString(obj.password);
    return await this.userRepository.create(obj);
  }

  @authenticate('JwtStrategy')
  @get('/users/count')
  async count(@param.query.string('where') where?: Where): Promise<number> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser.isAdmin) {
      throw new HttpErrors.Forbidden('Access denied')
    }

    return await this.userRepository.count(where);
  }

  @authenticate('JwtStrategy')
  @get('/users')
  async find(@param.query.string('filter') filter?: Filter)
    : Promise<User[]> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser.isAdmin) {
      throw new HttpErrors.Forbidden('Access denied')
    }

    return await this.userRepository.find(filter);
  }

  @authenticate('JwtStrategy')
  @patch('/users')
  async updateAll(
    @requestBody() obj: User,
    @param.query.string('where') where?: Where,
  ): Promise<number> {
    return await this.userRepository.updateAll(obj, where);
  }

  @authenticate('JwtStrategy')
  @del('/users')
  async deleteAll(@param.query.string('where') where?: Where): Promise<number> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser.isAdmin) {
      throw new HttpErrors.Forbidden('Access denied')
    }


    return await this.userRepository.deleteAll(where);
  }

  @authenticate('JwtStrategy')
  @get('/users/{id}')
  async findById(@param.path.number('id') id: number): Promise<User> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser.isAdmin) {
      throw new HttpErrors.Forbidden('Access denied')
    }

    return await this.userRepository.findById(id);
  }

  @authenticate('JwtStrategy')
  @patch('/users/{id}')
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() obj: User
  ): Promise<boolean> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser.isAdmin) {
      throw new HttpErrors.Forbidden('Access denied')
    }

    return await this.userRepository.updateById(id, obj);
  }


  @authenticate('JwtStrategy')
  @del('/users/{id}')
  async deleteById(@param.path.number('id') id: number): Promise<boolean> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser.isAdmin) {
      throw new HttpErrors.Forbidden('Access denied')
    }


    return await this.userRepository.deleteById(id);
  }
}
